import { Navigate, useLocation } from "react-router-dom";
import {
  getStoredToken,
  getStoredRole,
  type UserRole,
} from "@/widgets/features/login/api/authApi";
import { isLocked } from "@/utils/pinLock";

export type { UserRole };

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: UserRole[];
}

export function AuthGuard({ children }: AuthGuardProps) {
  // TODO: re-enable auth checks
  return <>{children}</>;
}
