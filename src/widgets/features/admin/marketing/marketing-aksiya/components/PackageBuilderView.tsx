import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { LuArrowLeft } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { fetchAllAttractions } from "../api/marketingAksiyaApi";
import { AttractionSelectColumn } from "./AttractionSelectColumn";
import { DiscountRuleColumn } from "./DiscountRuleColumn";
import { PackagePreviewColumn } from "./PackagePreviewColumn";
import type {
  Draft,
  PackageItem,
  DiscountRule,
  PreviewLine,
} from "../marketing-aksiya.types";

interface Props {
  onClose: () => void;
  onSave?: (items: PackageItem[], rule: DiscountRule | null) => void;
}

export function PackageBuilderView({ onClose, onSave }: Props) {
  const { data: attractions = [], isLoading: attractionsLoading } = useQuery({
    queryKey: ["attractions-all-pkg"],
    queryFn: fetchAllAttractions,
    staleTime: 5 * 60 * 1000,
  });

  const attractionsById = useMemo(
    () => Object.fromEntries(attractions.map((a) => [a.id, a])),
    [attractions],
  );

  const [draft, setDraft] = useState<Draft>({});
  const [packageItems, setPackageItems] = useState<PackageItem[]>([]);
  const [rule, setRule] = useState<DiscountRule | null>(null);

  const droppedIds = useMemo(
    () =>
      packageItems
        .filter((item) => !attractionsById[item.id])
        .map((item) => item.id),
    [packageItems, attractionsById],
  );

  const previewLines = useMemo<PreviewLine[]>(() => {
    const discount = rule?.discount ?? 0;
    return packageItems
      .filter((item) => attractionsById[item.id])
      .map((item) => {
        const attraction = attractionsById[item.id];
        const unitPrice = attraction.price;
        const lineOriginal = unitPrice * item.qty;
        const lineFinal = Math.round((lineOriginal * (100 - discount)) / 100);
        return { id: item.id, qty: item.qty, attraction, unitPrice, lineOriginal, lineFinal };
      });
  }, [packageItems, rule, attractionsById]);

  function commitDraft() {
    setPackageItems(
      Object.entries(draft).map(([id, qty]) => ({ id: Number(id), qty })),
    );
  }

  function handleApplyRule(r: DiscountRule) {
    setRule(r);
    onSave?.(packageItems, r);
  }

  return (
    <div className="flex flex-col" style={{ minHeight: "calc(100vh - 60px)" }}>
      {/* Top bar */}
      <div
        className="sticky top-0 z-10 flex items-center gap-3 px-4 tablet:px-6 py-3 border-b"
        style={{
          background: "var(--bg-main)",
          borderColor: "var(--border-default)",
        }}
      >
        <CusButton variant="ghost" size="sm" onClick={onClose}>
          <LuArrowLeft size={15} /> Назад
        </CusButton>
        <div className="flex items-center gap-1.5 text-sm">
          <span style={{ color: "var(--text-muted)" }}>Акции</span>
          <span style={{ color: "var(--text-dim)" }}>/</span>
          <span style={{ color: "var(--text-default)", fontWeight: 500 }}>
            Новая акция
          </span>
        </div>
      </div>

      {/* Builder grid */}
      <div className="flex-1 p-4 tablet:p-6">
        <div className="grid grid-cols-1 desktop:grid-cols-3 gap-4 items-start">
          <AttractionSelectColumn
            attractions={attractions}
            attractionsLoading={attractionsLoading}
            draft={draft}
            packageItems={packageItems}
            onDraftChange={setDraft}
            onCommit={commitDraft}
          />
          <DiscountRuleColumn
            packageItems={packageItems}
            rule={rule}
            onApply={handleApplyRule}
          />
          <PackagePreviewColumn
            lines={previewLines}
            rule={rule}
            droppedIds={droppedIds}
          />
        </div>
      </div>
    </div>
  );
}
