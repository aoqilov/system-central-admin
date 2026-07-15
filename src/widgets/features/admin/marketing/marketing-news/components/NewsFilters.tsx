import { LuSearch } from "react-icons/lu";
import { CusInput } from "@/components/ui/inputs/CusInput";
import CusSelect from "@/components/ui/select/CusSelect";

export type NewsSortKey = "newest" | "oldest" | "likes" | "views";

interface Props {
  search: string;
  sort: NewsSortKey;
  onSearchChange: (v: string) => void;
  onSortChange: (v: NewsSortKey) => void;
}

const SORT_OPTIONS = [
  { value: "newest", label: "Новые сначала" },
  { value: "oldest", label: "Старые сначала" },
  { value: "likes",  label: "По лайкам" },
  { value: "views",  label: "По просмотрам" },
];

export function NewsFilters({ search, sort, onSearchChange, onSortChange }: Props) {
  return (
    <div className="flex flex-wrap gap-3">
      <div className="flex-1" style={{ minWidth: 200 }}>
        <CusInput
          placeholder="Поиск по заголовку..."
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          leftElement={<LuSearch size={14} style={{ color: "var(--text-muted)" }} />}
        />
      </div>
      <div style={{ width: 200 }}>
        <CusSelect
          value={sort}
          onChange={(v: string) => onSortChange(v as NewsSortKey)}
          options={SORT_OPTIONS}
        />
      </div>
    </div>
  );
}
