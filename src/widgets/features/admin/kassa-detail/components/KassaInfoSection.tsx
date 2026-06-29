import { LuActivity, LuHash, LuMapPin, LuInfo } from "react-icons/lu";
import {
  CusCard as Card,
  CusCardHeader as CardHeader,
  CusInfoRow as InfoRow,
} from "@/components/shared/card/CusCard";
import type { Cashbox } from "../../kassa/types";

interface Props {
  kassa: Cashbox;
}

export function KassaInfoSection({ kassa }: Props) {
  return (
    <Card>
      <CardHeader icon={LuActivity} title="Информация о кассе" iconColor="#a78bfa" />
      <div className="px-5 pb-2">
        <InfoRow icon={LuHash} label="Касса ID" value={`#${kassa.id}`} />
        <InfoRow icon={LuMapPin} label="Расположение" value={kassa.place} />
        {kassa.description && (
          <InfoRow icon={LuInfo} label="Примечание" value={kassa.description} last />
        )}
      </div>
    </Card>
  );
}
