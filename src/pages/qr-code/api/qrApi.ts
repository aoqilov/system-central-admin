import dayjs from "dayjs";
import type { GenerateQrBatchDto, Party, QrCode, QrStatus } from "../qr.types";
import { mockQrCodes, INITIAL_BATCH_COUNTER } from "../../../data/qrCodes";

// ─── In-memory store ──────────────────────────────────────────────────────────
// Mock data bilan boshlang'ich holatda, keyin fetch/axios ga almashtiriladi

let store: QrCode[] = [...mockQrCodes];
let batchCounter = INITIAL_BATCH_COUNTER;

// ─── API functions ────────────────────────────────────────────────────────────

export async function generateQrBatch(dto: GenerateQrBatchDto): Promise<QrCode[]> {
  const batchId = crypto.randomUUID();
  const serial  = ++batchCounter;
  const now     = dayjs().toISOString();

  const codes: QrCode[] = Array.from({ length: dto.count }, (_, i) => ({
    id:          crypto.randomUUID(),
    token:       crypto.randomUUID(),
    status:      "no-active" as const,
    batchId,
    batchSerial: serial,
    order:       i + 1,
    partia:      dto.partia,
    amount:      dto.amount ?? 0,
    validFrom:   dto.validFrom ?? null,
    validUntil:  dto.validUntil ?? null,
    userId:      null,
    createdAt:   now,
    updatedAt:   now,
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
        batchId:     code.batchId,
        batchSerial: code.batchSerial,
        partia:      code.partia,
        count:       1,
        createdAt:   code.createdAt,
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

export async function deleteCodes(ids: string[]): Promise<void> {
  const set = new Set(ids);
  store = store.filter((c) => !set.has(c.id));
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
