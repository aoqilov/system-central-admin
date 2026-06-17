import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  LuLock,
  LuKeyRound,
  LuArrowLeft,
  LuEye,
  LuEyeOff,
  LuCircleCheck,
} from "react-icons/lu";
import { getPin, setPin, unlockApp } from "@/utils/pinLock";
import { getStoredToken } from "@/widgets/features/login/api/authApi";
import { loginRequest } from "@/widgets/features/login/api/loginApi";
import { formatPhoneNumber } from "@/widgets/features/login/hooks/useLoginForm";

// ─── Step types ───────────────────────────────────────────────────────────────
type Step = "pin" | "verify" | "new-pin";

// ─── Reusable 4-digit PIN row ─────────────────────────────────────────────────
function PinRow({
  digits,
  onChange,
  onKeyDown,
  refs,
  shake,
}: {
  digits: string[];
  onChange: (i: number, v: string) => void;
  onKeyDown: (i: number, e: React.KeyboardEvent<HTMLInputElement>) => void;
  refs: React.RefObject<HTMLInputElement | null>[];
  shake: boolean;
}) {
  return (
    <div
      className="flex gap-3"
      style={shake ? { animation: "lock-shake 0.45s ease-in-out" } : undefined}
    >
      {digits.map((d, i) => (
        <input
          key={i}
          ref={refs[i] as React.RefObject<HTMLInputElement>}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={d}
          onChange={(e) => onChange(i, e.target.value)}
          onKeyDown={(e) => onKeyDown(i, e)}
          className="w-14 h-14 text-center text-2xl font-bold rounded-xl outline-none transition-all"
          style={{
            background: "var(--bg-second)",
            border: `2px solid ${d ? "#3b82f6" : "var(--border-default)"}`,
            color: "var(--text-default)",
            caretColor: "transparent",
            boxShadow: d ? "0 0 0 3px #3b82f618" : "none",
          }}
        />
      ))}
    </div>
  );
}

// ─── Step 1: PIN kirish ───────────────────────────────────────────────────────
function StepPin({ onForgot }: { onForgot: () => void }) {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  function handleChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    setError("");
    if (digit && idx < 3) refs[idx + 1].current?.focus();
    if (next.every((d) => d !== "")) verify(next.join(""));
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = [...digits];
      prev[idx - 1] = "";
      setDigits(prev);
      refs[idx - 1].current?.focus();
    }
  }

  function verify(pin: string) {
    if (pin === getPin()) {
      unlockApp();
      navigate("/", { replace: true });
    } else {
      setShake(true);
      setError("PIN kod noto'g'ri");
      setTimeout(() => {
        setShake(false);
        setDigits(["", "", "", ""]);
        refs[0].current?.focus();
      }, 500);
    }
  }

  return (
    <>
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
        style={{ background: "var(--bg-second)", border: "1px solid var(--border-default)" }}
      >
        <LuLock size={28} style={{ color: "#3b82f6" }} />
      </div>

      <h1 className="text-xl font-semibold mb-1.5" style={{ color: "var(--text-default)" }}>
        Ekran bloklangan
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        4 xonali PIN kodingizni kiriting
      </p>

      <PinRow
        digits={digits}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        refs={refs}
        shake={shake}
      />

      <p
        className="text-sm h-5 mt-3 mb-8 transition-opacity duration-200"
        style={{ color: "#ef4444", opacity: error ? 1 : 0 }}
      >
        {error || " "}
      </p>

      <button
        onClick={onForgot}
        className="flex items-center gap-2 text-sm transition-opacity hover:opacity-60"
        style={{ color: "var(--text-muted)" }}
      >
        <LuKeyRound size={14} />
        PIN kodini unutdingizmi?
      </button>
    </>
  );
}

// ─── Step 2: Login parolini tekshirish ───────────────────────────────────────
function StepVerify({
  onBack,
  onSuccess,
}: {
  onBack: () => void;
  onSuccess: () => void;
}) {
  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const local = (digits.startsWith("998") ? digits.slice(3) : digits).slice(0, 9);
    setPhone(formatPhoneNumber(local));
    setError("");
  }

  async function handleSubmit() {
    const raw = phone.replace(/\s/g, "");
    if (raw.length < 13 || !password) {
      setError("Telefon va parolni to'liq kiriting");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await loginRequest({ phone_number: raw, password });
      onSuccess();
    } catch {
      setError("Telefon yoki parol noto'g'ri");
    } finally {
      setLoading(false);
    }
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return (
    <>
      {/* Back */}
      <button
        onClick={onBack}
        className="self-start flex items-center gap-1.5 text-sm mb-6 transition-opacity hover:opacity-60"
        style={{ color: "var(--text-muted)" }}
      >
        <LuArrowLeft size={14} />
        Orqaga
      </button>

      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "#3b82f618" }}
      >
        <LuKeyRound size={24} style={{ color: "#3b82f6" }} />
      </div>

      <h1 className="text-xl font-semibold mb-1.5" style={{ color: "var(--text-default)" }}>
        Parolni tasdiqlang
      </h1>
      <p className="text-sm mb-7 text-center" style={{ color: "var(--text-muted)" }}>
        Login ma'lumotlaringizni kiriting
      </p>

      {/* Phone */}
      <div className="w-full mb-3">
        <input
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          placeholder="+998 XX XXX XX XX"
          className="w-full h-11 px-4 rounded-xl outline-none text-sm transition-all"
          style={{
            background: "var(--bg-second)",
            border: "1.5px solid var(--border-default)",
            color: "var(--text-default)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "#3b82f6")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-default)")
          }
        />
      </div>

      {/* Password */}
      <div className="w-full relative mb-2">
        <input
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          onKeyDown={handleKeyDown}
          placeholder="Parol"
          className="w-full h-11 px-4 pr-11 rounded-xl outline-none text-sm transition-all"
          style={{
            background: "var(--bg-second)",
            border: "1.5px solid var(--border-default)",
            color: "var(--text-default)",
          }}
          onFocus={(e) =>
            (e.currentTarget.style.borderColor = "#3b82f6")
          }
          onBlur={(e) =>
            (e.currentTarget.style.borderColor = "var(--border-default)")
          }
        />
        <button
          type="button"
          onClick={() => setShowPw((p) => !p)}
          className="absolute right-3 top-1/2 -translate-y-1/2 transition-opacity hover:opacity-60"
          style={{ color: "var(--text-muted)" }}
        >
          {showPw ? <LuEyeOff size={16} /> : <LuEye size={16} />}
        </button>
      </div>

      <p
        className="text-xs h-4 mb-6 self-start transition-opacity"
        style={{ color: "#ef4444", opacity: error ? 1 : 0 }}
      >
        {error || " "}
      </p>

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full h-11 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-60"
        style={{ background: "#3b82f6", color: "#fff" }}
      >
        {loading ? "Tekshirilmoqda..." : "Tasdiqlash"}
      </button>
    </>
  );
}

// ─── Step 3: Yangi PIN o'rnatish ──────────────────────────────────────────────
function StepNewPin() {
  const navigate = useNavigate();
  const [digits, setDigits] = useState(["", "", "", ""]);
  const [saved, setSaved] = useState(false);
  const refs = [
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
    useRef<HTMLInputElement>(null),
  ];

  useEffect(() => {
    refs[0].current?.focus();
  }, []);

  function handleChange(idx: number, value: string) {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...digits];
    next[idx] = digit;
    setDigits(next);
    if (digit && idx < 3) refs[idx + 1].current?.focus();
  }

  function handleKeyDown(idx: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[idx] && idx > 0) {
      const prev = [...digits];
      prev[idx - 1] = "";
      setDigits(prev);
      refs[idx - 1].current?.focus();
    }
  }

  function handleSave() {
    const pin = digits.join("");
    if (pin.length < 4) return;
    setPin(pin);
    unlockApp();
    setSaved(true);
    setTimeout(() => navigate("/", { replace: true }), 900);
  }

  if (saved) {
    return (
      <>
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center mb-6"
          style={{ background: "#22c55e18" }}
        >
          <LuCircleCheck size={30} style={{ color: "#22c55e" }} />
        </div>
        <h1 className="text-xl font-semibold mb-2" style={{ color: "var(--text-default)" }}>
          PIN saqlandi!
        </h1>
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Tizimga kirilmoqda...
        </p>
      </>
    );
  }

  return (
    <>
      <div
        className="w-14 h-14 rounded-2xl flex items-center justify-center mb-5"
        style={{ background: "#3b82f618" }}
      >
        <LuLock size={22} style={{ color: "#3b82f6" }} />
      </div>

      <h1 className="text-xl font-semibold mb-1.5" style={{ color: "var(--text-default)" }}>
        Yangi PIN o'rnating
      </h1>
      <p className="text-sm mb-8" style={{ color: "var(--text-muted)" }}>
        4 xonali yangi PIN kiriting
      </p>

      <PinRow
        digits={digits}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        refs={refs}
        shake={false}
      />

      <div className="mt-8 w-full max-w-[230px]">
        <button
          onClick={handleSave}
          disabled={digits.some((d) => !d)}
          className="w-full h-11 rounded-xl text-sm font-semibold transition-opacity disabled:opacity-40"
          style={{ background: "#3b82f6", color: "#fff" }}
        >
          Saqlash
        </button>
      </div>
    </>
  );
}

// ─── Main LockScreen ──────────────────────────────────────────────────────────
export default function LockScreen() {
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("pin");

  useEffect(() => {
    if (!getStoredToken()) {
      navigate("/login", { replace: true });
      return;
    }
    window.history.pushState(null, "", "/lock");
    function onPopState() {
      window.history.pushState(null, "", "/lock");
    }
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-main)" }}
    >
      <div
        key={step}
        className="flex flex-col items-center text-center w-full max-w-xs"
        style={{ animation: "lock-fadein 0.22s ease" }}
      >
        {step === "pin" && (
          <StepPin onForgot={() => setStep("verify")} />
        )}
        {step === "verify" && (
          <StepVerify
            onBack={() => setStep("pin")}
            onSuccess={() => setStep("new-pin")}
          />
        )}
        {step === "new-pin" && <StepNewPin />}
      </div>

      <style>{`
        @keyframes lock-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-10px); }
          40%       { transform: translateX(10px); }
          60%       { transform: translateX(-7px); }
          80%       { transform: translateX(7px); }
        }
        @keyframes lock-fadein {
          from { opacity: 0; transform: translateY(8px); }
          to   { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
