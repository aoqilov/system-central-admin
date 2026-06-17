import { useTranslation } from "@/i18n/languageConfig";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import EmployeeStatCards from "./components/EmployeeStatCards";
import EmployeeTableCard from "./components/EmployeeTableCard";

export default function FeatureEmployes() {
  const { t } = useTranslation("employees.");

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <EmployeeStatCards />
      <EmployeeTableCard />
    </div>
  );
}
