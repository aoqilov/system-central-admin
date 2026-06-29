
function hex(len: number) {
  return Array.from({ length: len }, () =>
    Math.floor(Math.random() * 256)
      .toString(16)
      .padStart(2, "0")
      .toUpperCase(),
  ).join(":");
}

const BATCH_1 = "batch-nfc-0001";
const BATCH_2 = "batch-nfc-0002";

export const INITIAL_NFC_BATCH_COUNTER = 2;

export const mockNfcCards = [
  ...Array.from({ length: 30 }, (_, i) => ({
    id: i + 1,
    uid: hex(4),
    status: (["no-active", "active", "used"] as const)[i % 3],
    batchId: BATCH_1,
    batchSerial: 1,
    order: i + 1,
    partia: "Birinchi seriya",
    createdAt: "2026-06-01T09:00:00.000Z",
    updatedAt: "2026-06-01T09:00:00.000Z",
    userId: i % 3 === 2 ? 100 + i : null,
  })),
  ...Array.from({ length: 20 }, (_, i) => ({
    id: 30 + i + 1,
    uid: hex(4),
    status: (["no-active", "active"] as const)[i % 2],
    batchId: BATCH_2,
    batchSerial: 2,
    order: i + 1,
    partia: "Ikkinchi seriya",
    createdAt: "2026-06-15T10:00:00.000Z",
    updatedAt: "2026-06-15T10:00:00.000Z",
    userId: null,
  })),
];
