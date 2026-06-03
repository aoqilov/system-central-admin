export type QrStatus =
  | "no-active"
  | "active"
  | "user-active"
  | "user-leave-active";

export interface QrCode {
  id: string;
  token: string;
  status: QrStatus;
  batchId: string;
  batchSerial: number; // partiya tartib raqami (1, 2, 3…)
  order: number;       // partiya ichida tartib raqami (1, 2, 3…)
  partia: string;
  validFrom: string | null;
  validUntil: string | null;
  userId: number | null;
  createdAt: string;
  updatedAt: string;
}

export interface Party {
  batchId: string;
  batchSerial: number;
  partia: string;
  count: number;
  createdAt: string;
}

/** "part01000001" formatida ko'rsatish uchun helper */
export function formatQrRef(batchSerial: number, order: number): string {
  return (
    "part" +
    String(batchSerial).padStart(2, "0") +
    String(order).padStart(6, "0")
  );
}

export interface GenerateQrBatchDto {
  count: number;
  partia: string;
  validFrom?: string;
  validUntil?: string;
}

export type QrBadgeScheme = "gray" | "green" | "blue" | "yellow";

export const QR_STATUS_META: Record<
  QrStatus,
  { label: string; scheme: QrBadgeScheme }
> = {
  "no-active":         { label: "Faolsiz",       scheme: "gray"   },
  "active":            { label: "Faol",           scheme: "green"  },
  "user-active":       { label: "Ichkarida",      scheme: "blue"   },
  "user-leave-active": { label: "Chiqdi (faol)",  scheme: "yellow" },
};

export const TRANSITIONS: Record<QrStatus, QrStatus[]> = {
  "no-active":         ["active"],
  "active":            ["user-active"],
  "user-active":       ["user-leave-active"],
  "user-leave-active": ["user-active"],
};
