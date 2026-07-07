import { CusBadge } from "@/components/ui/badge/CusBadge";
import { CARD_STATUS_META, type CardStatus } from "../nfc-all.types";

export function NfcStatusBadge({ status }: { status: CardStatus }) {
  const meta = CARD_STATUS_META[status];
  return (
    <CusBadge colorPalette={meta.scheme} variant="subtle" size="sm">
      {meta.label}
    </CusBadge>
  );
}
