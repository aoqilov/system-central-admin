import React from "react";
import { CusBadge } from "../../../components/ui/badge/CusBadge";
import { QR_STATUS_META, type QrStatus } from "../qr.types";

interface Props {
  status: QrStatus;
}

export const QrStatusBadge = React.memo(function QrStatusBadge({ status }: Props) {
  const meta = QR_STATUS_META[status];
  return (
    <CusBadge colorPalette={meta.scheme} variant="subtle" size="sm">
      {meta.label}
    </CusBadge>
  );
});
