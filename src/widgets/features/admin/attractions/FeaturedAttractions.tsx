import { useTranslation } from "@/i18n/languageConfig";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import AttractionStatCards from "./components/AttractionStatCards";
import AttractionTableCard from "./components/AttractionTableCard";

export default function FeaturedAttractions() {
  const { t } = useTranslation("attractions.");

  return (
    <div className="p-4 tablet:p-6 space-y-6">
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <AttractionStatCards />
      <AttractionTableCard />
    </div>
  );
}
