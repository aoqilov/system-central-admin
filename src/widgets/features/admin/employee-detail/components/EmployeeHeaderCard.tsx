import { LuPhone, LuSend } from "react-icons/lu";
import dayjs from "dayjs";
import {
  CusBadge,
  type BadgeRole,
  type BadgeStatus,
} from "@/components/ui/badge/CusBadge";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import type { ApiEmployee } from "../types";
import { getFileUrl } from "@/api/files/files.api";

const KNOWN_ROLES: BadgeRole[] = [
  "SUPER_ADMIN",
  "OPERATOR_ATTRACTION",
  "CASHIER",
  "SECURITY",
  "CLEANER",
];

const STATUS_MAP: Record<string, BadgeStatus> = {
  active: "active",
  inactive: "inactive",
  vacation: "vacation",
  fired: "fired",
};

export default function EmployeeHeaderCard({
  employee,
  roleName,
}: {
  employee: ApiEmployee;
  roleName: string;
}) {
  const age = employee.date_of_birth
    ? dayjs().diff(dayjs(employee.date_of_birth), "year")
    : null;

  const initials =
    `${employee.firstname?.[0] ?? ""}${employee.lastname?.[0] ?? ""}`.toUpperCase();
  return (
    <div
      className="rounded-xl border overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      <div className="flex flex-col desktop:flex-row items-start gap-4 p-5 desktop:p-6">
        {/* Avatar */}
        {employee?.file ? (
          <div
            style={{
              flexShrink: 0,
              borderRadius: 12,
              overflow: "hidden",
              border: "2px solid var(--border-default)",
            }}
          >
            <CusImagePreview
              src={getFileUrl(+employee.file!)}
              alt={employee.fullname}
              width={80}
              height={80}
              objectFit="cover"
              borderRadius={12}
            />
          </div>
        ) : (
          <div
            style={{
              width: 80,
              height: 80,
              borderRadius: 12,
              background: "var(--bg-hover)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 26,
              fontWeight: 700,
              color: "var(--text-muted)",
              flexShrink: 0,
              border: "2px solid var(--border-default)",
            }}
          >
            {initials || "?"}
          </div>
        )}

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h1
            className="text-xl desktop:text-2xl font-semibold"
            style={{ color: "var(--text-default)" }}
          >
            {employee.lastname} {employee.firstname}
          </h1>

          {age !== null && (
            <p
              className="text-sm mt-0.5"
              style={{ color: "var(--text-muted)" }}
            >
              {age} лет
            </p>
          )}

          <div className="flex flex-wrap gap-2 mt-2.5">
            {roleName &&
              (KNOWN_ROLES.includes(roleName as BadgeRole) ? (
                <CusBadge role={roleName as BadgeRole} size="sm" />
              ) : (
                <CusBadge size="sm" colorPalette="cyan">
                  {roleName}
                </CusBadge>
              ))}
            <CusBadge
              status={
                (STATUS_MAP[employee.status] ?? "inactive") as BadgeStatus
              }
              size="sm"
            />
          </div>

          <div className="flex flex-wrap gap-5 mt-3">
            {employee.phone_number && (
              <span
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <LuPhone size={12} />
                {employee.phone_number}
              </span>
            )}
            {employee.telegram_username && (
              <span
                className="flex items-center gap-1.5 text-sm"
                style={{ color: "var(--text-muted)" }}
              >
                <LuSend size={12} />
                {employee.telegram_username}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
