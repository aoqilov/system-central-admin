import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import type { UserRole } from "../middleware/AuthGuard";
import { CusInput } from "../components/ui/inputs/CusInput";
import { CusButton } from "../components/ui/buttons/CusButton";
import CusSelect from "../components/ui/select/CusSelect";

type LocationState = { from?: { pathname: string } };

interface Account {
  password: string;
  role: UserRole;
  defaultPath: string;
  label: string;
}

const ACCOUNTS: Record<string, Account> = {
  superadmin: {
    password: "superadmin",
    role: "superadmin",
    defaultPath: "/",
    label: "Super Admin",
  },
  admin: { password: "admin", role: "admin", defaultPath: "/", label: "Admin" },
  operator: {
    password: "operator",
    role: "operator",
    defaultPath: "/operator",
    label: "Operator",
  },
  kassa: {
    password: "kassa",
    role: "kassa",
    defaultPath: "/rolekassa",
    label: "Kassa",
  },
};

const ROLE_OPTIONS = Object.entries(ACCOUNTS).map(([key, acc]) => ({
  value: key,
  label: acc.label,
}));

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname;

  const [selectedRole, setSelectedRole] = useState<string>("admin");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  function handleLogin() {
    setError("");
    if (!selectedRole || !password) {
      setError("Rol va parolni to'ldiring.");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const account = ACCOUNTS[selectedRole];
      if (account && account.password === password) {
        localStorage.setItem("auth_token", `demo-${account.role}-token`);
        localStorage.setItem("user_role", account.role);
        const BLOCKED = ["/login", "/unauthorized"];
        const safePath =
          from &&
          !BLOCKED.includes(from) &&
          from.startsWith(account.defaultPath)
            ? from
            : account.defaultPath;
        navigate(safePath, { replace: true });
      } else {
        setError("Parol noto'g'ri.");
        setLoading(false);
      }
    }, 900);
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleLogin();
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "var(--bg-main)" }}
    >
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 rounded-xl bg-blue-600 flex items-center justify-center mb-4 shadow-lg">
            <span className="text-white font-bold text-xl">P</span>
          </div>
          <h1
            className="text-xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            ParkOps
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--text-muted)" }}>
            Control Center
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-6 border"
          style={{
            background: "var(--bg-second)",
            borderColor: "var(--border-default)",
          }}
        >
          <h2
            className="text-base font-semibold mb-1"
            style={{ color: "var(--text-default)" }}
          >
            Kirish
          </h2>
          <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
            Rolni tanlang va parolni kiriting
          </p>

          <div className="space-y-4">
            <CusSelect
              label="Rol"
              options={ROLE_OPTIONS}
              value={selectedRole}
              onChange={(val: string) => {
                setSelectedRole(val);
                setPassword("");
                setError("");
              }}
            />

            <CusInput
              label="Parol"
              type={showPw ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="••••••••"
              autoComplete="current-password"
              leftElement={
                <LuLock size={14} style={{ color: "var(--text-muted)" }} />
              }
              rightElement={
                <button
                  type="button"
                  onClick={() => setShowPw((v) => !v)}
                  className="transition-colors hover:text-slate-300"
                  style={{ color: "var(--text-muted)", display: "flex" }}
                >
                  {showPw ? <LuEyeOff size={14} /> : <LuEye size={14} />}
                </button>
              }
              errorText={error || undefined}
            />

            <CusButton
              colorPalette="blue"
              variant="solid"
              isLoading={loading}
              loadingText="Kirilmoqda..."
              className="w-full"
              onClick={handleLogin}
            >
              Kirish
            </CusButton>
          </div>

          {/* Test hint */}
          <div
            className="mt-5 pt-4 border-t"
            style={{ borderColor: "var(--border-default)" }}
          >
            <p
              className="text-[10px] font-medium mb-2"
              style={{ color: "var(--text-dim)" }}
            >
              Test: parol = rol nomi
            </p>
            <div className="flex flex-wrap gap-1.5">
              {ROLE_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setSelectedRole(opt.value);
                    setPassword(opt.value);
                    setError("");
                  }}
                  className="px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors hover:bg-black/5 dark:hover:bg-white/5 border"
                  style={{
                    borderColor: "var(--border-default)",
                    color:
                      selectedRole === opt.value
                        ? "var(--text-default)"
                        : "var(--text-muted)",
                    background:
                      selectedRole === opt.value
                        ? "var(--bg-hover)"
                        : "transparent",
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
