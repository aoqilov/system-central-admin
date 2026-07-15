import { EmployeeStatCards } from "./components/EmployeeStatCards";
import { EmployeeStatusTable } from "./components/EmployeeStatusTable";
import { EmployeeCharts } from "./components/EmployeeCharts";
import PageHeader from "@/widgets/shared-ui/PageHeader";

const FeatureLiveMonitorEmployes = () => {
  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader
        title="Мониторинг "
        highlight="Cотрудников"
        subtitle="В реальном времени"
      />

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
