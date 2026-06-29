import { LuPhone, LuLock, LuEye, LuEyeOff } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useLoginForm } from "../hooks/useLoginForm";

export default function LoginCard() {
  const {
    phone,
    password,
    setPassword,
    showPw,
    setShowPw,
    isPending,
    errorMsg,
    handlePhoneChange,
    handleSubmit,
    handleKeyDown,
  } = useLoginForm();

  return (
    <div
      className="rounded-2xl p-6 border"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <h2 className="text-base font-semibold mb-1" style={{ color: "var(--text-default)" }}>
        Kirish
      </h2>
      <p className="text-xs mb-6" style={{ color: "var(--text-muted)" }}>
        Telefon raqam va parolni kiriting
      </p>

      <div className="space-y-4">
        <CusInput
          label="Telefon raqam"
          type="tel"
          value={phone}
          onChange={handlePhoneChange}
          onKeyDown={handleKeyDown}
          placeholder="+998 11 123 45 67"
          autoComplete="username"
          leftElement={<LuPhone size={14} style={{ color: "var(--text-muted)" }} />}
        />

        <CusInput
          label="Parol"
          type={showPw ? "text" : "password"}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="••••••"
          maxLength={6}
          autoComplete="current-password"
          leftElement={<LuLock size={14} style={{ color: "var(--text-muted)" }} />}
          rightElement={
            <button
              type="button"
              onClick={() => setShowPw((v) => !v)}
              style={{ color: "var(--text-muted)", display: "flex" }}
            >
              {showPw ? <LuEyeOff size={14} /> : <LuEye size={14} />}
            </button>
          }
          errorText={errorMsg ?? undefined}
        />

        <CusButton
          colorPalette="blue"
          variant="solid"
          isLoading={isPending}
          loadingText="Kirilmoqda..."
          className="w-full"
          onClick={handleSubmit}
        >
          Kirish
        </CusButton>
      </div>
    </div>
  );
}
