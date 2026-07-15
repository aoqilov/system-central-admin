import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { useNavigate, useLocation } from "react-router-dom";
import { login } from "@/api/auth/auth.api";
import { fetchRoles } from "@/api/roles/roles.api";
import { decodeToken, saveAuth, getRoleDefaultPath } from "../hooks/authApi";
import { disablePinLock } from "@/utils/pinLock";
import { RoleTypes } from "@/const/constData";

const API_ROLE_MAP: Partial<Record<string, RoleTypes>> = {
  superadmin:      RoleTypes.SUPERADMIN,
  cashier:         RoleTypes.CASHIER,
  head_cashier:    RoleTypes.HEAD_CASHIER,
  operator:        RoleTypes.OPERATOR,
  head_operator:   RoleTypes.HEAD_OPERATOR,
  head_accountant: RoleTypes.HEAD_ACCOUNTANT,
  head_marketing:  RoleTypes.HEAD_MARKETING,
  owner:           RoleTypes.OWNER,
  director:        RoleTypes.DIRECTOR,
  admin:           RoleTypes.ADMIN,
};

type LocationState = { from?: { pathname: string } };

export function formatPhoneNumber(local: string): string {
  let r = "+998";
  if (local.length > 0) r += " " + local.slice(0, 2);
  if (local.length > 2) r += " " + local.slice(2, 5);
  if (local.length > 5) r += " " + local.slice(5, 7);
  if (local.length > 7) r += " " + local.slice(7, 9);
  return r;
}

export function useApiLogin() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as LocationState)?.from?.pathname;

  const [phone, setPhone] = useState("+998 ");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw] = useState(false);

  const { mutate, isPending, error } = useMutation({
    mutationFn: async (payload: { phone_number: string; password: string }) => {
      const token = await login(payload);
      const decoded = decodeToken(token);
      const roleId = decoded?.role_id ?? "";

      saveAuth(token, "");

      const roles = await fetchRoles();
      const match = roles.find((r) => String(r.id) === roleId);
      const raw = match?.name.toLowerCase() ?? "";
      const roleName = (API_ROLE_MAP[raw] ?? raw) as RoleTypes;

      saveAuth(token, roleName);
      return { roleName };
    },
    onSuccess: ({ roleName }) => {
      disablePinLock();
      const defaultPath = getRoleDefaultPath(roleName);
      const blocked = ["/login", "/unauthorized"];
      const safePath =
        from &&
        !blocked.includes(from) &&
        defaultPath !== "/" &&
        from.startsWith(defaultPath)
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
    const local = (digits.startsWith("998") ? digits.slice(3) : digits).slice(0, 9);
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
