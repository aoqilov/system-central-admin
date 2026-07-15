import { CusBadge } from "@/components/ui/badge/CusBadge";
import { NFC_TYPE_META } from "../nfc-all.types";
import type { CardType } from "@/types/card.types";

export function NfcTypeBadge({ type }: { type: CardType | undefined }) {
  if (!type) return null;
  const meta = NFC_TYPE_META[type];
  return (
    <CusBadge colorPalette={meta.colorPalette} variant="subtle" size="sm">
      {meta.label}
    </CusBadge>
  );
}
