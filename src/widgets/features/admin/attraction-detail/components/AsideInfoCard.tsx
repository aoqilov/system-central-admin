import type { ElementType } from "react";
import {
  LuActivity,
  LuTag,
  LuClock,
  LuLayoutGrid,
  LuUser,
  LuRuler,
  LuWeight,
} from "react-icons/lu";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
  CusInfoRow as InfoRow,
} from "../../../../../components/shared/card/CusCard";
import type { Attraction } from "../../../../../data/attractions";

interface RestrictionRow {
  icon: ElementType;
  label: string;
  value: string;
}

interface Props {
  attraction: Attraction;
}

export function AsideInfoCard({ attraction }: Props) {
  const rules = attraction.rulesAttraction;
  const restrictionRows: RestrictionRow[] = [];

  if (rules) {
    if (rules.minAge !== null && rules.minAge !== undefined)
      restrictionRows.push({ icon: LuUser, label: "Minimal yosh", value: `${rules.minAge} yosh` });
    if (rules.minHeight !== undefined)
      restrictionRows.push({ icon: LuRuler, label: "Min bo'y", value: `${rules.minHeight} sm` });
    if (rules.maxHeight !== undefined)
      restrictionRows.push({ icon: LuRuler, label: "Max bo'y", value: `${rules.maxHeight} sm` });
    if (rules.minWeight !== undefined)
      restrictionRows.push({ icon: LuWeight, label: "Min vazn", value: `${rules.minWeight} kg` });
    if (rules.maxWeight !== undefined)
      restrictionRows.push({ icon: LuWeight, label: "Max vazn", value: `${rules.maxWeight} kg` });
    if (rules.maxWeightPerCup !== undefined)
      restrictionRows.push({ icon: LuWeight, label: "Max vazn (chashka)", value: `${rules.maxWeightPerCup} kg` });
    if (rules.maxWeightPerBoat !== undefined)
      restrictionRows.push({ icon: LuWeight, label: "Max vazn (qayiq)", value: `${rules.maxWeightPerBoat} kg` });
  }

  return (
    <Card>
      <CardHeader icon={LuActivity} title="Attraksion ma'lumoti" iconColor="#a78bfa" />
      <div className="px-5 pb-2">
        <InfoRow icon={LuTag} label="Narx" value={`${attraction.price.toLocaleString()} UZS`} />
        {rules && (
          <>
            <InfoRow icon={LuClock} label="Aylanish vaqti" value={`${rules.roundTime} daqiqa`} />
            <InfoRow icon={LuLayoutGrid} label="Joylar soni" value={`${rules.numberOfPlaceRound} ta`} />
            {restrictionRows.map((row, i) => (
              <InfoRow
                key={row.label}
                icon={row.icon}
                label={row.label}
                value={row.value}
                last={i === restrictionRows.length - 1}
              />
            ))}
            {restrictionRows.length === 0 && (
              <p
                className="text-sm py-3 border-t"
                style={{ color: "var(--text-muted)", borderColor: "var(--border-default)" }}
              >
                Cheklovlar yo'q
              </p>
            )}
          </>
        )}
      </div>
    </Card>
  );
}
