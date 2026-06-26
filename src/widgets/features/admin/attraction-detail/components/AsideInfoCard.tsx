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
} from "@/components/shared/card/CusCard";
import type { AttractionDetail } from "../types";

interface Props {
  attraction: AttractionDetail;
}

export function AsideInfoCard({ attraction }: Props) {
  return (
    <Card>
      <CardHeader icon={LuActivity} title="Информация" iconColor="#a78bfa" />
      <div className="px-5 pb-2">
        <InfoRow icon={LuTag} label="Цена" value={`${attraction.price.toLocaleString()} UZS`} />
        <InfoRow icon={LuClock} label="Длительность" value={`${attraction.duration} мин`} />
        <InfoRow icon={LuLayoutGrid} label="Мест за раз" value={`${attraction.seats} шт`} />
        {attraction.age_limit > 0 && (
          <InfoRow icon={LuUser} label="Мин. возраст" value={`${attraction.age_limit} лет`} />
        )}
        {attraction.min_height > 0 && (
          <InfoRow icon={LuRuler} label="Мин. рост" value={`${attraction.min_height} см`} />
        )}
        {attraction.max_weight > 0 && (
          <InfoRow icon={LuWeight} label="Макс. вес" value={`${attraction.max_weight} кг`} last />
        )}
      </div>
    </Card>
  );
}
