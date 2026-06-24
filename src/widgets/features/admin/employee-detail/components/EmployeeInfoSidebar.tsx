import { LuPhone, LuSend, LuBriefcase, LuUser } from "react-icons/lu";
import dayjs from "dayjs";
import type { ApiEmployee } from "../types";

function InfoRow({
  icon: Icon,
  label,
  value,
  last = false,
}: {
  icon: React.ElementType;
  label: string;
  value: string;
  last?: boolean;
}) {
  return (
    <div
      className="flex items-center gap-3 py-3"
      style={last ? {} : { borderBottom: "1px solid var(--border-default)" }}
    >
      <div
        className="w-7 h-7 rounded-md flex items-center justify-center shrink-0"
        style={{ background: "var(--bg-hover)" }}
      >
        <Icon size={13} style={{ color: "var(--text-muted)" }} />
      </div>
      <div>
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          {label}
        </p>
        <p className="text-sm font-medium" style={{ color: "var(--text-default)" }}>
          {value}
        </p>
      </div>
    </div>
  );
}

export default function EmployeeInfoSidebar({ employee }: { employee: ApiEmployee }) {
  const rows = [
    employee.phone_number
      ? { icon: LuPhone, label: "Телефон", value: employee.phone_number }
      : null,
    employee.telegram_username
      ? { icon: LuSend, label: "Telegram", value: employee.telegram_username }
      : null,
    employee.salary
      ? { icon: LuBriefcase, label: "Оклад", value: `${employee.salary.toLocaleString()} UZS` }
      : null,
    employee.date_of_birth
      ? {
          icon: LuUser,
          label: "Дата рождения",
          value: dayjs(employee.date_of_birth).format("DD.MM.YYYY"),
        }
      : null,
  ].filter((r): r is NonNullable<typeof r> => r !== null);

  if (rows.length === 0) return null;

  return (
    <div
      className="rounded-xl border p-5"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      <p className="text-sm font-semibold mb-1" style={{ color: "var(--text-default)" }}>
        Личные данные
      </p>
      {rows.map((row, i) => (
        <InfoRow
          key={i}
          icon={row.icon}
          label={row.label}
          value={row.value}
          last={i === rows.length - 1}
        />
      ))}
    </div>
  );
}
