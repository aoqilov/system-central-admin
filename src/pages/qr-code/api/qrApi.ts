import dayjs from "dayjs";
import type { GenerateQrBatchDto, Party, QrCode, QrStatus } from "../qr.types";

// In-memory store — keyin fetch/axios ga almashtiriladi
let store: QrCode[] = [];
let batchCounter = 0; // har yangi partiyada oshadi

export async function generateQrBatch(dto: GenerateQrBatchDto): Promise<QrCode[]> {
  const batchId = crypto.randomUUID();
  const serial = ++batchCounter;
  const now = dayjs().toISOString();

  const codes: QrCode[] = Array.from({ length: dto.count }, (_, i) => ({
    id: crypto.randomUUID(),
    token: crypto.randomUUID(), // TODO: serverda generatsiya
    status: "no-active" as const, // MAJBURIY — dto dan olma
    batchId,
    batchSerial: serial,
    order: i + 1,
    partia: dto.partia,
    validFrom: dto.validFrom ?? null,
    validUntil: dto.validUntil ?? null,
    userId: null,
    createdAt: now,
    updatedAt: now,
  }));

  store = [...store, ...codes];
  return codes;
}

export async function listParties(): Promise<Party[]> {
  const map = new Map<string, Party>();
  for (const code of store) {
    const existing = map.get(code.batchId);
    if (existing) {
      existing.count += 1;
    } else {
      map.set(code.batchId, {
        batchId: code.batchId,
        batchSerial: code.batchSerial,
        partia: code.partia,
        count: 1,
        createdAt: code.createdAt,
      });
    }
  }
  return Array.from(map.values()).sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );
}

export async function listCodes(batchId: string): Promise<QrCode[]> {
  return store.filter((c) => c.batchId === batchId);
}

export async function deleteCode(id: string): Promise<void> {
  store = store.filter((c) => c.id !== id);
}

export async function updateStatus(id: string, status: QrStatus): Promise<QrCode> {
  const idx = store.findIndex((c) => c.id === id);
  if (idx === -1) throw new Error(`QrCode ${id} topilmadi`);
  const updated: QrCode = {
    ...store[idx],
    status,
    updatedAt: dayjs().toISOString(),
  };
  store = [...store.slice(0, idx), updated, ...store.slice(idx + 1)];
  return updated;
}
