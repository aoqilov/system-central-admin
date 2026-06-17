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

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const location = useLocation();
  const token = getStoredToken();

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLocked()) {
    return <Navigate to="/lock" replace />;
  }

  if (roles && roles.length > 0) {
    const role = getStoredRole();
    if (!role || (role !== "superadmin" && !roles.includes(role))) {
      return <Navigate to="/unauthorized" replace />;
    }
  }

  return <>{children}</>;
}
