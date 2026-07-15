import { useState, useEffect } from "react";
import { LuTag } from "react-icons/lu";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import type { DiscountRule, DiscountDraft, PackageItem } from "../marketing-aksiya.types";

interface Props {
  packageItems: PackageItem[];
  rule: DiscountRule | null;
  onApply: (rule: DiscountRule) => void;
}

const EMPTY: DiscountDraft = { from: "", to: "", discount: 0 };

function draftEqRule(d: DiscountDraft, r: DiscountRule | null): boolean {
  if (!r) return d.from === "" && d.to === "" && d.discount === 0;
  return d.from === r.from && d.to === r.to && d.discount === r.discount;
}

export function DiscountRuleColumn({ packageItems, rule, onApply }: Props) {
  const [draft, setDraft] = useState<DiscountDraft>(
    rule ? { from: rule.from, to: rule.to, discount: rule.discount } : EMPTY,
  );
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!rule) setDraft(EMPTY);
  }, [rule]);

  const isEmpty = packageItems.length === 0;
  const isDirty = !draftEqRule(draft, rule);
  const canApply = !isEmpty && isDirty;

  function patch(fields: Partial<DiscountDraft>) {
    setError(null);
    setDraft((d) => ({ ...d, ...fields }));
  }

  function handleApply() {
    if (!Number.isInteger(draft.discount) || draft.discount < 0 || draft.discount > 100) {
      setError("Скидка должна быть целым числом от 0 до 100");
      return;
    }
    if (draft.from && draft.to && draft.from > draft.to) {
      setError("Дата начала не может быть позже даты окончания");
      return;
    }
    setError(null);
    onApply({ from: draft.from, to: draft.to, discount: draft.discount });
  }

  return (
    <div
      className="rounded-2xl border flex flex-col"
      style={{ background: "var(--bg-second)", borderColor: "var(--border-default)" }}
    >
      {/* Header */}
      <div
        className="flex items-center gap-2 px-4 py-3 border-b"
        style={{ borderColor: "var(--border-default)" }}
      >
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
          style={{ background: "var(--bg-hover)" }}
        >
          <LuTag size={15} style={{ color: "var(--text-muted)" }} />
        </div>
        <p className="font-semibold text-sm" style={{ color: "var(--text-default)" }}>
          Условие скидки
        </p>
      </div>

      <div className="p-4 flex flex-col gap-4">
        {/* Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium" style={{ color: "var(--text-3)" }}>
              Скидка
            </span>
            <span
              className="text-lg font-bold tabular-nums"
              style={{ color: "var(--color-blue)" }}
            >
              {draft.discount}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={100}
            step={1}
            value={draft.discount}
            onChange={(e) => patch({ discount: Number(e.target.value) })}
            style={{ accentColor: "var(--color-blue)", width: "100%", cursor: "pointer" }}
          />
          <div
            className="flex justify-between text-xs mt-1"
            style={{ color: "var(--text-dim)" }}
          >
            <span>0%</span>
            <span>50%</span>
            <span>100%</span>
          </div>
        </div>

        {/* Numeric exact */}
        <CusInput
          label="Точное значение (%)"
          inputSize="sm"
          type="number"
          min={0}
          max={100}
          value={String(draft.discount)}
          onChange={(e) =>
            patch({
              discount: Math.max(0, Math.min(100, Math.round(Number(e.target.value)))),
            })
          }
        />

        {/* Date from */}
        <CusInput
          label="Действует с"
          inputSize="sm"
          type="date"
          value={draft.from}
          onChange={(e) => patch({ from: e.target.value })}
        />

        {/* Date to */}
        <CusInput
          label="Действует по"
          inputSize="sm"
          type="date"
          value={draft.to}
          onChange={(e) => patch({ to: e.target.value })}
        />

        {/* Inline error */}
        {error && (
          <p
            className="text-sm rounded-lg px-3 py-2"
            style={{ color: "var(--color-red)", background: "color-mix(in srgb, var(--color-red) 10%, transparent)" }}
          >
            {error}
          </p>
        )}

        {/* Apply button */}
        <CusButton
          colorPalette="blue"
          variant={canApply ? "solid" : "outline"}
          isDisabled={!canApply}
          onClick={handleApply}
        >
          <LuTag size={14} /> Применить скидку
        </CusButton>

        {isEmpty && (
          <p className="text-xs text-center" style={{ color: "var(--text-muted)" }}>
            Сначала добавьте аттракционы в пакет
          </p>
        )}
      </div>
    </div>
  );
}
