import { useEffect, useState } from "react";
import { LuSearch } from "react-icons/lu";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CARD_STATUS_META, NFC_TYPE_META, type NfcType, type CardStatus } from "../nfc-all.types";

const TYPE_OPTIONS = [
  { value: "all", label: "Все типы" },
  ...Object.entries(NFC_TYPE_META).map(([key, meta]) => ({
    value: key,
    label: meta.label,
  })),
];

const STATUS_OPTIONS = [
  { value: "all", label: "Все статусы" },
  ...Object.entries(CARD_STATUS_META).map(([key, meta]) => ({
    value: key,
    label: meta.label,
  })),
];

const PAGE_SIZE_OPTIONS = [
  { value: "10",  label: "10 / стр" },
  { value: "20",  label: "20 / стр" },
  { value: "50",  label: "50 / стр" },
];

interface Filters {
  search: string;
  type: NfcType | "all";
  status: CardStatus | "all";
}

interface Props {
  filters: Filters;
  onChange: (partial: Partial<Filters>) => void;
  pageSize: number;
  onPageSizeChange: (n: number) => void;
}

export function NfcAllFilters({ filters, onChange, pageSize, onPageSizeChange }: Props) {
  const [searchDraft, setSearchDraft] = useState(filters.search);

  useEffect(() => {
    const t = setTimeout(() => onChange({ search: searchDraft }), 300);
    return () => clearTimeout(t);
  }, [searchDraft]);

  useEffect(() => {
    setSearchDraft(filters.search);
  }, [filters.search]);

  return (
    <div className="flex flex-wrap gap-2">
      <div className="flex-1 min-w-[180px]">
        <CusInput
          placeholder="Поиск по коду, NFC, владельцу..."
          value={searchDraft}
          onChange={(e) => setSearchDraft(e.target.value)}
          leftElement={<LuSearch size={14} style={{ color: "var(--text-muted)" }} />}
        />
      </div>
      <div className="w-36">
        <CusSelect
          value={filters.type}
          onChange={(v) => onChange({ type: v as NfcType | "all" })}
          options={TYPE_OPTIONS}
        />
      </div>
      <div className="w-40">
        <CusSelect
          value={filters.status}
          onChange={(v) => onChange({ status: v as CardStatus | "all" })}
          options={STATUS_OPTIONS}
        />
      </div>
      <div className="w-28">
        <CusSelect
          value={String(pageSize)}
          onChange={(v) => onPageSizeChange(Number(v))}
          options={PAGE_SIZE_OPTIONS}
        />
      </div>
    </div>
  );
}
