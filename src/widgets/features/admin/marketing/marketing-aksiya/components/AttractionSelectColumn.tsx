import { LuCheck, LuLoader } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusCheckbox } from "@/components/ui/inputs/CusCheckbox";
import { CusImagePreview } from "@/components/ui/image/CusImagePreview";
import { getFileUrl } from "@/api/files/files.api";
import type { Attraction, Draft, PackageItem } from "../marketing-aksiya.types";
import { QtyStep } from "./QtyStep";

interface Props {
  attractions: Attraction[];
  attractionsLoading: boolean;
  draft: Draft;
  packageItems: PackageItem[];
  onDraftChange: (draft: Draft) => void;
  onCommit: () => void;
}

function isDraftEqualToPackage(draft: Draft, items: PackageItem[]): boolean {
  const draftIds = Object.keys(draft).map(Number);
  if (draftIds.length !== items.length) return false;
  return items.every((item) => draft[item.id] === item.qty);
}

export function AttractionSelectColumn({
  attractions,
  attractionsLoading,
  draft,
  packageItems,
  onDraftChange,
  onCommit,
}: Props) {
  const isDirty = !isDraftEqualToPackage(draft, packageItems);
  const selectedCount = Object.keys(draft).length;

  function toggleRow(id: number) {
    if (draft[id] !== undefined) {
      const next = { ...draft };
      delete next[id];
      onDraftChange(next);
    } else {
      onDraftChange({ ...draft, [id]: 1 });
    }
  }

  function setQty(id: number, qty: number) {
    onDraftChange({ ...draft, [id]: qty });
  }

  return (
    <div
      className="rounded-2xl border flex flex-col overflow-hidden"
      style={{
        background: "var(--bg-second)",
        borderColor: "var(--border-default)",
      }}
    >
      {/* Header */}
      <div
        className="flex items-center justify-between px-4 py-3 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div>
          <p
            className="font-semibold text-sm"
            style={{ color: "var(--text-default)" }}
          >
            Аттракционы
          </p>
          <p className="text-xs" style={{ color: "var(--text-muted)" }}>
            {selectedCount > 0
              ? `${selectedCount} выбрано`
              : "Выберите аттракционы"}
          </p>
        </div>
        <CusButton
          size="sm"
          colorPalette="blue"
          variant={isDirty ? "solid" : "outline"}
          isDisabled={!isDirty}
          onClick={onCommit}
        >
          <LuCheck size={14} />
          Добавить в пакет
        </CusButton>
      </div>

      {/* List */}
      <div className="overflow-y-auto" style={{ maxHeight: 520 }}>
        {attractionsLoading && (
          <div className="flex items-center justify-center py-12">
            <LuLoader
              size={20}
              className="animate-spin"
              style={{ color: "var(--text-muted)" }}
            />
          </div>
        )}

        {!attractionsLoading && attractions.length === 0 && (
          <p
            className="text-sm text-center py-10 px-4"
            style={{ color: "var(--text-muted)" }}
          >
            Список аттракционов пуст
          </p>
        )}

        {!attractionsLoading &&
          attractions.map((a, i) => {
            const checked = draft[a.id] !== undefined;
            return (
              <div
                key={a.id}
                className="flex items-center justify-between gap-3 px-4 py-2.5 transition-colors"
                style={{
                  background: checked ? "var(--bg-hover)" : "transparent",
                  borderTop:
                    i > 0 ? "1px solid var(--border-default)" : undefined,
                }}
              >
                {/* Image */}
                <div className="flex items-center gap-3 flex-1">
                  <CusImagePreview
                    src={getFileUrl(a.main_file)}
                    alt={a.name}
                    width={36}
                    height={36}
                    objectFit="cover"
                    borderRadius={8}
                  />

                  {/* Name — takes all remaining space, truncates */}
                  <p
                    className="flex-1 text-sm font-medium "
                    style={{ color: "var(--text-default)" }}
                  >
                    {a.name}
                  </p>
                </div>

                {/* Price — fixed, never wraps */}
                <div className="flex items-center gap-3">
                  <p
                    className="shrink-0 text-sm font-semibold tabular-nums whitespace-nowrap"
                    style={{ color: "var(--text-muted)" }}
                  >
                    {a.price.toLocaleString()}
                    <span className="ml-2">uzs</span>
                  </p>

                  {/* Checkbox */}
                  <CusCheckbox
                    checked={checked}
                    onChange={() => toggleRow(a.id)}
                  />
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}
