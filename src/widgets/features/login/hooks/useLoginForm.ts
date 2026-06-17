import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import {
  decodeToken,
  saveAuth,
  getRoleDefaultPath,
} from "@/widgets/features/login/api/authApi";
import { loginRequest, fetchRoleName } from "../api/loginApi";
import { disablePinLock } from "@/utils/pinLock";

type LocationState = { from?: { pathname: string } };

export function formatPhoneNumber(local: string): string {
  let r = "+998";
  if (local.length > 0) r += " " + local.slice(0, 2);
  if (local.length > 2) r += " " + local.slice(2, 5);
  if (local.length > 5) r += " " + local.slice(5, 7);
  if (local.length > 7) r += " " + local.slice(7, 9);
  return r;
}

export function useLoginForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname;

  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: loginRequest,
    onSuccess: async ({ data }) => {
      const token = data.auth.accessToken;
      const decoded = decodeToken(token);
      const roleId = decoded?.role_id ?? "1";

      saveAuth(token, ""); // token avval saqlansin, fetchRoleName ham Authorization headerdan foydalanishi uchun
      const roleName = await fetchRoleName(roleId);
      saveAuth(token, roleName); // role aniqlanganidan keyin qayta yoziladi
      disablePinLock(); // yangi login — PIN lock qayta tiklanadi

      const defaultPath = getRoleDefaultPath(roleName);
      const blocked = ["/login", "/unauthorized"];
      const safePath =
        from && !blocked.includes(from) && from.startsWith(defaultPath)
          ? from
          : defaultPath;
      navigate(safePath, { replace: true });
    },
  });

  const errorMsg =
    error instanceof Error
      ? ((error as { response?: { data?: { message?: string } } }).response
          ?.data?.message ?? "Telefon yoki parol noto'g'ri")
      : null;

  function handlePhoneChange(e: React.ChangeEvent<HTMLInputElement>) {
    const digits = e.target.value.replace(/\D/g, "");
    const local = (digits.startsWith("998") ? digits.slice(3) : digits).slice(
      0,
      9,
    );
    setPhone(formatPhoneNumber(local));
  }

  function handleSubmit() {
    const raw = phone.replace(/\s/g, "");
    if (raw.length < 13 || !password) return;
    mutate({ phone_number: raw, password });
  }

  function handleKeyDown(e: React.KeyboardEvent) {
    if (e.key === "Enter") handleSubmit();
  }

  return {
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
  };
}
