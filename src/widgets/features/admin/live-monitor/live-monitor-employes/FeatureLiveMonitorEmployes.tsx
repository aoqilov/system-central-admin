import { EmployeeStatCards } from "./components/EmployeeStatCards";
import { EmployeeStatusTable } from "./components/EmployeeStatusTable";
import { EmployeeCharts } from "./components/EmployeeCharts";

const FeatureLiveMonitorEmployes = () => {
  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <div>
        <p className="text-xs mb-1" style={{ color: "var(--text-muted)" }}>
          Real-time
        </p>
        <h1
          className="text-2xl font-semibold"
          style={{ color: "var(--text-default)" }}
        >
          Live Monitor{" "}
          <span style={{ color: "var(--color-blue)" }}>Сотрудники</span>
        </h1>
      </div>

      <EmployeeStatCards />

      <div className="grid grid-cols-1 desktop:grid-cols-[3fr_2fr] gap-4 items-start">
        <EmployeeStatusTable />

        <div className="flex flex-col gap-4">
          <EmployeeCharts />
        </div>
      </div>
    </div>
  );
};

export default FeatureLiveMonitorEmployes;
