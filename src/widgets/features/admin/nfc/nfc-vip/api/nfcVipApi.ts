import type {
  ApiResponse,
  GetCardsStatsResponse,
  GetCardsQuery,
  GetCardsResponse,
  UploadCardsResponse,
  DeleteCardsPayload,
  DeleteCardsResponse,
  UpdateCardPayload,
  UpdateCardResponse,
  Card,
  BatchStat,
} from "../nfc.types";

// ─── Mock helpers ─────────────────────────────────────────────────────────────

const delay = (ms = 450) => new Promise<void>((r) => setTimeout(r, ms));

let _nextId = 26;
const nextId = () => _nextId++;

// ─── Mock state ───────────────────────────────────────────────────────────────

interface MockBatch {
  id: number;
  name: string;
}

const mockBatches: MockBatch[] = [
  { id: 1, name: "VIP-Premium" },
  { id: 2, name: "VIP-Elite" },
  { id: 3, name: "VIP-Diamond" },
];

let mockCards: Card[] = [
  // ── Batch 1: VIP-Premium ──────────────────────────────────────────────────
  { id: 1,  batch: "1", card: "600000001", nfc: "A1B2C3D4E5F6", status: "active",   owner: "Азимов Шухрат",      createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-20T09:00:00Z"  },
  { id: 2,  batch: "1", card: "600000002", nfc: "B2C3D4E5F6A1", status: "active",   owner: "Каримова Дилноза",   createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-21T10:30:00Z" },
  { id: 3,  batch: "1", card: "600000003", nfc: "C3D4E5F6A1B2", status: "inactive", owner: undefined,            createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: null                   },
  { id: 4,  batch: "1", card: "600000004", nfc: "D4E5F6A1B2C3", status: "blocked",  owner: "Усманов Жамшид",     createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-01T08:00:00Z" },
  { id: 5,  batch: "1", card: "600000005", nfc: "E5F6A1B2C3D4", status: "active",   owner: "Тошматова Мунира",   createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-10T11:00:00Z" },
  { id: 6,  batch: "1", card: "600000006", nfc: "F6A1B2C3D4E5", status: "frozen",   owner: "Эргашев Санжар",     createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-03-01T09:00:00Z" },
  { id: 7,  batch: "1", card: "600000007", nfc: "1A2B3C4D5E6F", status: "active",   owner: "Холиков Бобур",      createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-03-15T10:00:00Z" },
  { id: 8,  batch: "1", card: "600000008", nfc: "2B3C4D5E6F1A", status: "lost",     owner: "Юсупова Гулнора",    createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-04-01T08:00:00Z" },
  { id: 9,  batch: "1", card: "600000009", nfc: "3C4D5E6F1A2B", status: "inactive", owner: undefined,            createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: null                   },
  { id: 10, batch: "1", card: "600000010", nfc: "4D5E6F1A2B3C", status: "active",   owner: "Матмусаев Акбар",    createdAt: "2024-01-15T10:00:00Z", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-04-20T12:00:00Z" },

  // ── Batch 2: VIP-Elite ────────────────────────────────────────────────────
  { id: 11, batch: "2", card: "600000011", nfc: "5E6F1A2B3C4D", status: "active",   owner: "Хасанов Шерзод",     createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-06-05T10:00:00Z" },
  { id: 12, batch: "2", card: "600000012", nfc: "6F1A2B3C4D5E", status: "inactive", owner: undefined,            createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: null                   },
  { id: 13, batch: "2", card: "600000013", nfc: "7A8B9C0D1E2F", status: "active",   owner: "Турсунов Дилшод",    createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-06-10T11:00:00Z" },
  { id: 14, batch: "2", card: "600000014", nfc: "8B9C0D1E2F7A", status: "blocked",  owner: "Умаров Анвар",       createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-07-01T09:00:00Z" },
  { id: 15, batch: "2", card: "600000015", nfc: "9C0D1E2F7A8B", status: "active",   owner: "Исмоилова Нилуфар",  createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-07-15T10:00:00Z" },
  { id: 16, batch: "2", card: "600000016", nfc: "0D1E2F7A8B9C", status: "frozen",   owner: "Содиков Рустам",     createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-08-01T09:00:00Z" },
  { id: 17, batch: "2", card: "600000017", nfc: "1E2F7A8B9C0D", status: "active",   owner: "Хайдаров Фирдавс",   createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-08-20T11:00:00Z" },
  { id: 18, batch: "2", card: "600000018", nfc: "2F7A8B9C0D1E", status: "inactive", owner: undefined,            createdAt: "2024-06-01T09:00:00Z", imported_at: "2024-06-01T09:00:00Z", activatedAt: null                   },

  // ── Batch 3: VIP-Diamond ──────────────────────────────────────────────────
  { id: 19, batch: "3", card: "600000021", nfc: "3A4B5C6D7E8F", status: "active",   owner: "Мирзаев Алишер",     createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-01-15T09:00:00Z" },
  { id: 20, batch: "3", card: "600000022", nfc: "4B5C6D7E8F3A", status: "inactive", owner: undefined,            createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: null                   },
  { id: 21, batch: "3", card: "600000023", nfc: "5C6D7E8F3A4B", status: "active",   owner: "Кодиров Достон",     createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-01-20T10:00:00Z" },
  { id: 22, batch: "3", card: "600000024", nfc: "6D7E8F3A4B5C", status: "active",   owner: "Ниёзов Зафар",       createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-02-01T09:00:00Z" },
  { id: 23, batch: "3", card: "600000025", nfc: "7E8F3A4B5C6D", status: "frozen",   owner: "Тошпулатова Ойдин",  createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-02-10T11:00:00Z" },
  { id: 24, batch: "3", card: "600000026", nfc: "8F3A4B5C6D7E", status: "blocked",  owner: "Бахромов Лазиз",     createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-03-01T09:00:00Z" },
  { id: 25, batch: "3", card: "600000027", nfc: "9A0B1C2D3E4F", status: "inactive", owner: undefined,            createdAt: "2025-01-10T08:00:00Z", imported_at: "2025-01-10T08:00:00Z", activatedAt: null                   },
];

// ─── Stats helper ─────────────────────────────────────────────────────────────

function computeStats(): BatchStat[] {
  return mockBatches
    .map((b): BatchStat => {
      const cards = mockCards.filter((c) => c.batch === String(b.id));
      return {
        batch: b.id,
        batchName: b.name,
        total: cards.length,
        active: cards.filter((c) => c.status === "active").length,
        inactive: cards.filter((c) => c.status === "inactive").length,
        blocked: cards.filter((c) => c.status === "blocked").length,
        lost: cards.filter((c) => c.status === "lost").length,
        frozen: cards.filter((c) => c.status === "frozen").length,
        tethered: 0,
      };
    })
    .filter((b) => b.total > 0);
}

// ─── API functions ────────────────────────────────────────────────────────────

export const getCardsStats = async (): Promise<
  ApiResponse<GetCardsStatsResponse>
> => {
  await delay();
  return { statusCode: 200, data: { card_stats: computeStats() } };
};

export const getCards = async (
  params?: GetCardsQuery,
): Promise<ApiResponse<GetCardsResponse>> => {
  await delay();

  let filtered = [...mockCards];

  if (params?.batch) {
    filtered = filtered.filter((c) => c.batch === String(params.batch));
  }

  if (params?.search) {
    const q = params.search.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.card.toLowerCase().includes(q) ||
        c.nfc.toLowerCase().includes(q) ||
        (c.owner ?? "").toLowerCase().includes(q),
    );
  }

  if (params?.statuses && params.statuses !== "all") {
    filtered = filtered.filter((c) => c.status === params.statuses);
  }

  const page = params?.page ?? 1;
  const limit = params?.limit ?? 20;
  const total = filtered.length;
  const start = (page - 1) * limit;
  const cards = filtered.slice(start, start + limit);

  return {
    statusCode: 200,
    data: {
      cards,
      pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
    },
  };
};

export const uploadCards = async (
  _file: File,
  batchName: string,
): Promise<ApiResponse<UploadCardsResponse>> => {
  await delay(700);

  const newBatchId = mockBatches.length + 1;
  mockBatches.push({ id: newBatchId, name: batchName });

  const slug = batchName.slice(0, 3).toUpperCase();
  const now = new Date().toISOString();
  const count = 10;

  for (let i = 1; i <= count; i++) {
    const num = String(i).padStart(3, "0");
    const hex = () =>
      Math.floor(Math.random() * 0xffffff)
        .toString(16)
        .toUpperCase()
        .padStart(6, "0");
    mockCards.push({
      id: nextId(),
      batch: String(newBatchId),
      card: `VIP-${slug}-${num}`,
      nfc: `${hex()}${hex()}`.slice(0, 12),
      status: "inactive",
      createdAt: now,
      imported_at: now,
      activatedAt: null,
    });
  }

  return { statusCode: 200, data: { inserted: count } };
};

export const deleteCards = async (
  payload: DeleteCardsPayload,
): Promise<ApiResponse<DeleteCardsResponse>> => {
  await delay();
  const ids = new Set(payload.cardIDs);
  mockCards = mockCards.filter((c) => !ids.has(c.id));
  return { statusCode: 200, data: { success: true } };
};

export const updateCard = async (
  cardID: number,
  payload: UpdateCardPayload,
): Promise<ApiResponse<UpdateCardResponse>> => {
  await delay();
  const card = mockCards.find((c) => c.id === cardID);
  if (!card) throw new Error("Card not found");
  card.status = payload.status;
  if (payload.status === "active" && !card.activatedAt) {
    card.activatedAt = new Date().toISOString();
  }
  return { statusCode: 200, data: { card: { ...card } } };
};
