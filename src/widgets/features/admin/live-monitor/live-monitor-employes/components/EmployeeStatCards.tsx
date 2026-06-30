import React from "react";
import {
  LuUsers,
  LuUserCheck,
  LuUserX,
  LuUmbrellaOff,
  LuFerrisWheel,
  LuTrendingUp,
} from "react-icons/lu";
import { CusCard } from "../../../../../../components/shared/card/CusCard";
import {
  employees,
  EmployeeRole,
  EmployeeStatus,
} from "../../../../../../data/employees";

function StatCard({
  label,
  value,
  sub,
  color,
  icon: Icon,
}: {
  label: string;
  value: string;
  sub?: string;
  color: string;
  icon: React.ElementType;
}) {
  return (
    <CusCard className="p-4 flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span
          className="text-xs font-medium"
          style={{ color: "var(--text-muted)" }}
        >
          {label}
        </span>
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={15} style={{ color }} />
        </div>
      </div>
      <div>
        <p
          className="text-xl font-bold"
          style={{ color: "var(--text-default)" }}
        >
          {value}
        </p>
        {sub && (
          <p className="text-xs mt-0.5" style={{ color: "var(--text-muted)" }}>
            {sub}
          </p>
        )}
      </div>
    </CusCard>
  );
}

const activeCount = employees.filter(
  (e) => e.status === EmployeeStatus.ACTIVE,
).length;
const vacationCount = employees.filter(
  (e) => e.status === EmployeeStatus.VACATION,
).length;
const inactiveCount = employees.filter(
  (e) => e.status === EmployeeStatus.INACTIVE,
).length;
const operatorCount = employees.filter(
  (e) => e.role === EmployeeRole.OPERATOR,
).length;
const avgEfficiency = Math.round(
  employees
    .filter((e) => (e.statsUser?.core.efficiency ?? 0) > 0)
    .reduce((s, e) => s + (e.statsUser?.core.efficiency ?? 0), 0) /
    employees.filter((e) => (e.statsUser?.core.efficiency ?? 0) > 0).length,
);

export function EmployeeStatCards() {
  return (
    <div className="grid grid-cols-2 tablet:grid-cols-3 desktop:grid-cols-6 gap-4">
      <StatCard
        label="Всего сотрудников"
        value={String(employees.length)}
        sub="в списке"
        color="var(--color-blue)"
        icon={LuUsers}
      />
      <StatCard
        label="Активные"
        value={String(activeCount)}
        sub="сегодня на работе"
        color="var(--color-green)"
        icon={LuUserCheck}
      />
      <StatCard
        label="В отпуске"
        value={String(vacationCount)}
        sub="сотрудник"
        color="var(--color-yellow)"
        icon={LuUmbrellaOff}
      />
      <StatCard
        label="Неактивные"
        value={String(inactiveCount)}
        sub="сотрудник"
        color="var(--color-gray)"
        icon={LuUserX}
      />
      <StatCard
        label="Операторы"
        value={String(operatorCount)}
        sub="аттракцион"
        color="var(--color-cyan)"
        icon={LuFerrisWheel}
      />

      <CusCard className="p-4 flex flex-col gap-3">
        <div className="flex items-center justify-between">
          <span
            className="text-xs font-medium"
            style={{ color: "var(--text-muted)" }}
          >
            Эффективность
          </span>
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: "var(--color-purple)18" }}
          >
            <LuTrendingUp size={15} style={{ color: "var(--color-purple)" }} />
          </div>
        </div>
        <div>
          <p
            className="text-xl font-bold"
            style={{ color: "var(--text-default)" }}
          >
            {avgEfficiency}%
          </p>
          <div
            className="mt-1.5 h-1.5 rounded-full overflow-hidden"
            style={{ background: "var(--bg-hover)" }}
          >
            <div
              className="h-full rounded-full"
              style={{
                width: `${avgEfficiency}%`,
                background: "var(--color-purple)",
                transition: "width 0.6s ease",
              }}
            />
          </div>
        </div>
      </CusCard>
    </div>
  );
}
