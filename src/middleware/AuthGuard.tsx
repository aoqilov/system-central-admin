import { Navigate, useLocation } from "react-router-dom";
import { getStoredToken, getStoredRole } from "@/widgets/features/login/api/authApi";
import { RoleTypes } from "@/const/constData";
import { isLocked } from "@/utils/pinLock";

interface AuthGuardProps {
  children: React.ReactNode;
  roles?: RoleTypes[];
}

export function AuthGuard({ children, roles }: AuthGuardProps) {
  const location = useLocation();
  const token = getStoredToken();
  const role = getStoredRole();

  if (!token || !role) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (isLocked()) {
    return <Navigate to="/lock" replace />;
  }

  if (roles && !roles.includes(role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <>{children}</>;
}
