import { getStoredRole } from "@/widgets/features/login/hooks/authApi";
import { RoleTypes } from "@/const/constData";

/**
 * Foydalanuvchi rolini tekshiradi.
 * Faqat `allowed` ro'yxatidagi rollar uchun `true` qaytaradi.
 *
 * @example
 * // Komponentda yashirish/ko'rsatish
 * const canView = useHasRole([RoleTypes.SUPERADMIN, RoleTypes.HEAD_CASHIER]);
 * if (!canView) return null;
 *
 * @example
 * // Tugmani disable qilish
 * const isAllowed = useHasRole([RoleTypes.HEAD_ACCOUNTANT]);
 * <CusButton isDisabled={!isAllowed}>Amaliyot</CusButton>
 *
 * @example
 * // Shartli render
 * {useHasRole([RoleTypes.SUPERADMIN]) && <AdminPanel />}
 */
export function useHasRole(allowed: RoleTypes[]): boolean {
  const role = getStoredRole();
  if (!role) return false;
  return allowed.includes(role);
}
