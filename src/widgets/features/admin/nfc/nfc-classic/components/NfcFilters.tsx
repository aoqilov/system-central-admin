import { useEffect, useRef, useState } from "react";
import { LuSearch } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import CusSelect from "@/components/ui/select/CusSelect";
import { CARD_STATUS_META, type CardStatus } from "../nfc.types";

interface Filters {
  status: CardStatus | "all";
  search: string;
  batch: number | null;
}

interface Props {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  pageSize: number;
  onPageSizeChange: (size: number) => void;
}

const STATUS_OPTIONS = [
  { value: "all", label: "Barchasi" },
  ...Object.entries(CARD_STATUS_META).map(([key, meta]) => ({
    value: key,
    label: meta.label,
  })),
];

const PAGE_SIZE_OPTIONS = [
  { value: "10", label: "10 ta" },
  { value: "20", label: "20 ta" },
  { value: "50", label: "50 ta" },
  { value: "100", label: "100 ta" },
];

export function NfcFilters({
  filters,
  onChange,
  pageSize,
  onPageSizeChange,
}: Props) {
  const [localSearch, setLocalSearch] = useState(filters.search);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    const timer = setTimeout(() => {
      onChangeRef.current({ search: localSearch });
    }, 300);
    return () => clearTimeout(timer);
  }, [localSearch]);

  return (
    <div className="flex flex-wrap gap-2 items-end">
      <div className="flex-1 min-w-[100px]">
        <CusInput
          placeholder="Karta kodi yoki qidirish..."
          leftElement={<LuSearch size={14} />}
          value={localSearch}
          onChange={(e) => setLocalSearch(e.target.value)}
        />
      </div>
      <div className="w-44">
        <CusSelect
          value={filters.status}
          onChange={(v) => onChange({ status: v as CardStatus | "all" })}
          options={STATUS_OPTIONS}
        />
      </div>
    </div>
  );
}
