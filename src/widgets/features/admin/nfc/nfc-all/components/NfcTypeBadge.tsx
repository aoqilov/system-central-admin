import { CusBadge } from "@/components/ui/badge/CusBadge";
import { NFC_TYPE_META, type NfcType } from "../nfc-all.types";

export function NfcTypeBadge({ type }: { type: NfcType }) {
  const meta = NFC_TYPE_META[type];
  return (
    <CusBadge colorPalette={meta.colorPalette} variant="subtle" size="sm">
      {meta.label}
    </CusBadge>
  );
}
