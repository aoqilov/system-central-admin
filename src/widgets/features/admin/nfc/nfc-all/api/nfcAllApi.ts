import type {
  UnifiedCard,
  NfcAllStats,
  NfcTypeStats,
  GetAllCardsQuery,
  GetAllCardsResponse,
  NfcType,
  CardStatus,
} from "../nfc-all.types";

// ─── Mock helpers ─────────────────────────────────────────────────────────────

const delay = (ms = 400) => new Promise<void>((r) => setTimeout(r, ms));

// ─── Mock data ────────────────────────────────────────────────────────────────

const mockCards: UnifiedCard[] = [
  // ══════════════════════════════════════════════════════════════════════════
  // CLASSIC  (batch 1 = Classic-A, batch 2 = Classic-B, batch 3 = Classic-C)
  // ══════════════════════════════════════════════════════════════════════════
  { uid: "classic-1",  id: 1,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000001", nfc: "A1B2C3D4E5F0", status: "active",   owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-01-15T10:00:00Z" },
  { uid: "classic-2",  id: 2,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000002", nfc: "B2C3D4E5F0A1", status: "active",   owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-01-16T11:00:00Z" },
  { uid: "classic-3",  id: 3,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000003", nfc: "C3D4E5F0A1B2", status: "inactive", owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: null },
  { uid: "classic-4",  id: 4,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000004", nfc: "D4E5F0A1B2C3", status: "blocked",  owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-02-01T08:00:00Z" },
  { uid: "classic-5",  id: 5,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000005", nfc: "E5F0A1B2C3D4", status: "active",   owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-02-10T09:00:00Z" },
  { uid: "classic-6",  id: 6,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000006", nfc: "F0A1B2C3D4E5", status: "inactive", owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: null },
  { uid: "classic-7",  id: 7,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000007", nfc: "A1C2D3E4F5B0", status: "frozen",   owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-03-01T09:00:00Z" },
  { uid: "classic-8",  id: 8,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000008", nfc: "B0A1C2D3E4F5", status: "active",   owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-03-15T10:00:00Z" },
  { uid: "classic-9",  id: 9,  type: "classic", batch: "1", batchName: "Classic-A", card: "500000009", nfc: "C2B0A1D3E4F5", status: "lost",     owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: "2024-04-01T08:00:00Z" },
  { uid: "classic-10", id: 10, type: "classic", batch: "1", batchName: "Classic-A", card: "500000010", nfc: "D3C2B0A1E4F5", status: "inactive", owner: undefined,            imported_at: "2024-01-10T09:00:00Z", activatedAt: null },

  { uid: "classic-11", id: 11, type: "classic", batch: "2", batchName: "Classic-B", card: "500000011", nfc: "E4D3C2B0A1F5", status: "active",   owner: undefined,            imported_at: "2024-05-01T09:00:00Z", activatedAt: "2024-05-10T10:00:00Z" },
  { uid: "classic-12", id: 12, type: "classic", batch: "2", batchName: "Classic-B", card: "500000012", nfc: "F5E4D3C2B0A1", status: "active",   owner: undefined,            imported_at: "2024-05-01T09:00:00Z", activatedAt: "2024-05-12T11:00:00Z" },
  { uid: "classic-13", id: 13, type: "classic", batch: "2", batchName: "Classic-B", card: "500000013", nfc: "A1F5E4D3C2B0", status: "blocked",  owner: undefined,            imported_at: "2024-05-01T09:00:00Z", activatedAt: "2024-06-01T09:00:00Z" },
  { uid: "classic-14", id: 14, type: "classic", batch: "2", batchName: "Classic-B", card: "500000014", nfc: "B0A1F5E4D3C2", status: "inactive", owner: undefined,            imported_at: "2024-05-01T09:00:00Z", activatedAt: null },
  { uid: "classic-15", id: 15, type: "classic", batch: "2", batchName: "Classic-B", card: "500000015", nfc: "C2B0A1F5E4D3", status: "active",   owner: undefined,            imported_at: "2024-05-01T09:00:00Z", activatedAt: "2024-06-15T10:00:00Z" },

  { uid: "classic-16", id: 16, type: "classic", batch: "3", batchName: "Classic-C", card: "500000016", nfc: "D3C2B0F5E4A1", status: "active",   owner: undefined,            imported_at: "2025-02-01T09:00:00Z", activatedAt: "2025-02-10T09:00:00Z" },
  { uid: "classic-17", id: 17, type: "classic", batch: "3", batchName: "Classic-C", card: "500000017", nfc: "E4D3C2F5B0A1", status: "inactive", owner: undefined,            imported_at: "2025-02-01T09:00:00Z", activatedAt: null },
  { uid: "classic-18", id: 18, type: "classic", batch: "3", batchName: "Classic-C", card: "500000018", nfc: "F5E4D3B0C2A1", status: "active",   owner: undefined,            imported_at: "2025-02-01T09:00:00Z", activatedAt: "2025-02-20T10:00:00Z" },
  { uid: "classic-19", id: 19, type: "classic", batch: "3", batchName: "Classic-C", card: "500000019", nfc: "A1F5E4B0D3C2", status: "frozen",   owner: undefined,            imported_at: "2025-02-01T09:00:00Z", activatedAt: "2025-03-01T09:00:00Z" },
  { uid: "classic-20", id: 20, type: "classic", batch: "3", batchName: "Classic-C", card: "500000020", nfc: "B0A1E4F5C2D3", status: "inactive", owner: undefined,            imported_at: "2025-02-01T09:00:00Z", activatedAt: null },

  // ══════════════════════════════════════════════════════════════════════════
  // VIP  (batch 1 = VIP-Premium, batch 2 = VIP-Elite, batch 3 = VIP-Diamond)
  // ══════════════════════════════════════════════════════════════════════════
  { uid: "vip-1",  id: 1,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000001", nfc: "AA1BB2CC3DD4", status: "active",   owner: "Азимов Шухрат",     imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-20T09:00:00Z" },
  { uid: "vip-2",  id: 2,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000002", nfc: "BB2CC3DD4AA1", status: "active",   owner: "Каримова Дилноза",  imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-21T10:30:00Z" },
  { uid: "vip-3",  id: 3,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000003", nfc: "CC3DD4AA1BB2", status: "inactive", owner: undefined,           imported_at: "2024-01-15T10:00:00Z", activatedAt: null },
  { uid: "vip-4",  id: 4,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000004", nfc: "DD4AA1BB2CC3", status: "blocked",  owner: "Усманов Жамшид",    imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-01T08:00:00Z" },
  { uid: "vip-5",  id: 5,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000005", nfc: "AA2BB3CC4DD1", status: "active",   owner: "Тошматова Мунира",  imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-10T11:00:00Z" },
  { uid: "vip-6",  id: 6,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000006", nfc: "BB3CC4DD1AA2", status: "frozen",   owner: "Эргашев Санжар",    imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-03-01T09:00:00Z" },
  { uid: "vip-7",  id: 7,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000007", nfc: "CC4DD1AA2BB3", status: "active",   owner: "Холиков Бобур",     imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-03-15T10:00:00Z" },
  { uid: "vip-8",  id: 8,  type: "vip", batch: "1", batchName: "VIP-Premium", card: "600000008", nfc: "DD1AA2BB3CC4", status: "lost",     owner: "Юсупова Гулнора",   imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-04-01T08:00:00Z" },

  { uid: "vip-9",  id: 9,  type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000009", nfc: "EE1FF2AA3BB4", status: "active",   owner: "Хасанов Шерзод",    imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-06-05T10:00:00Z" },
  { uid: "vip-10", id: 10, type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000010", nfc: "FF2AA3BB4EE1", status: "inactive", owner: undefined,           imported_at: "2024-06-01T09:00:00Z", activatedAt: null },
  { uid: "vip-11", id: 11, type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000011", nfc: "AA3BB4EE1FF2", status: "active",   owner: "Турсунов Дилшод",   imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-06-10T11:00:00Z" },
  { uid: "vip-12", id: 12, type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000012", nfc: "BB4EE1FF2AA3", status: "blocked",  owner: "Умаров Анвар",      imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-07-01T09:00:00Z" },
  { uid: "vip-13", id: 13, type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000013", nfc: "EE2FF3AA4BB1", status: "active",   owner: "Исмоилова Нилуфар", imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-07-15T10:00:00Z" },
  { uid: "vip-14", id: 14, type: "vip", batch: "2", batchName: "VIP-Elite", card: "600000014", nfc: "FF3AA4BB1EE2", status: "frozen",   owner: "Содиков Рустам",    imported_at: "2024-06-01T09:00:00Z", activatedAt: "2024-08-01T09:00:00Z" },

  { uid: "vip-15", id: 15, type: "vip", batch: "3", batchName: "VIP-Diamond", card: "600000015", nfc: "CC1DD2EE3FF4", status: "active",   owner: "Мирзаев Алишер",    imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-01-15T09:00:00Z" },
  { uid: "vip-16", id: 16, type: "vip", batch: "3", batchName: "VIP-Diamond", card: "600000016", nfc: "DD2EE3FF4CC1", status: "inactive", owner: undefined,           imported_at: "2025-01-10T08:00:00Z", activatedAt: null },
  { uid: "vip-17", id: 17, type: "vip", batch: "3", batchName: "VIP-Diamond", card: "600000017", nfc: "EE3FF4CC1DD2", status: "active",   owner: "Кодиров Достон",    imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-01-20T10:00:00Z" },
  { uid: "vip-18", id: 18, type: "vip", batch: "3", batchName: "VIP-Diamond", card: "600000018", nfc: "FF4CC1DD2EE3", status: "blocked",  owner: "Бахромов Лазиз",    imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-03-01T09:00:00Z" },
  { uid: "vip-19", id: 19, type: "vip", batch: "3", batchName: "VIP-Diamond", card: "600000019", nfc: "CC2DD3EE4FF1", status: "active",   owner: "Ниёзов Зафар",      imported_at: "2025-01-10T08:00:00Z", activatedAt: "2025-02-01T09:00:00Z" },

  // ══════════════════════════════════════════════════════════════════════════
  // ORG  (batch 1 = Корп-2024, batch 2 = Корп-2025, batch 3 = Партнёры)
  // ══════════════════════════════════════════════════════════════════════════
  { uid: "org-1",  id: 1,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000001", nfc: "11A22B33C44D", status: "active",   owner: "ООО Технология",   imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-20T09:00:00Z" },
  { uid: "org-2",  id: 2,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000002", nfc: "22B33C44D11A", status: "active",   owner: "АО Парк Центр",    imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-01-21T10:30:00Z" },
  { uid: "org-3",  id: 3,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000003", nfc: "33C44D11A22B", status: "inactive", owner: "МЧЖ Инновация",    imported_at: "2024-01-15T10:00:00Z", activatedAt: null },
  { uid: "org-4",  id: 4,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000004", nfc: "44D11A22B33C", status: "blocked",  owner: "ООО Глобал Трейд", imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-01T08:00:00Z" },
  { uid: "org-5",  id: 5,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000005", nfc: "11B22C33D44A", status: "active",   owner: "ИП Каримов А.",    imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-02-10T11:00:00Z" },
  { uid: "org-6",  id: 6,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000006", nfc: "22C33D44A11B", status: "active",   owner: "АО СитиБилд",      imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-03-01T09:00:00Z" },
  { uid: "org-7",  id: 7,  type: "org", batch: "1", batchName: "Корп-2024", card: "700000007", nfc: "33D44A11B22C", status: "frozen",   owner: "МЧЖ Инновация",    imported_at: "2024-01-15T10:00:00Z", activatedAt: "2024-04-01T08:00:00Z" },

  { uid: "org-8",  id: 8,  type: "org", batch: "2", batchName: "Корп-2025", card: "700000008", nfc: "55E66F77A88B", status: "active",   owner: "ООО МегаСервис",   imported_at: "2025-01-05T09:00:00Z", activatedAt: "2025-01-10T10:00:00Z" },
  { uid: "org-9",  id: 9,  type: "org", batch: "2", batchName: "Корп-2025", card: "700000009", nfc: "66F77A88B55E", status: "inactive", owner: "ЗАО Консалтинг",   imported_at: "2025-01-05T09:00:00Z", activatedAt: null },
  { uid: "org-10", id: 10, type: "org", batch: "2", batchName: "Корп-2025", card: "700000010", nfc: "77A88B55E66F", status: "active",   owner: "АО ТрансЛогист",   imported_at: "2025-01-05T09:00:00Z", activatedAt: "2025-01-15T11:00:00Z" },
  { uid: "org-11", id: 11, type: "org", batch: "2", batchName: "Корп-2025", card: "700000011", nfc: "88B55E66F77A", status: "blocked",  owner: "ИП Юсупов К.",     imported_at: "2025-01-05T09:00:00Z", activatedAt: "2025-02-01T09:00:00Z" },
  { uid: "org-12", id: 12, type: "org", batch: "2", batchName: "Корп-2025", card: "700000012", nfc: "55F66A77B88E", status: "active",   owner: "ООО МегаСервис",   imported_at: "2025-01-05T09:00:00Z", activatedAt: "2025-02-10T10:00:00Z" },

  { uid: "org-13", id: 13, type: "org", batch: "3", batchName: "Партнёры", card: "700000013", nfc: "99C00D11E22F", status: "active",   owner: "ООО ПаркФуд",      imported_at: "2025-04-01T08:00:00Z", activatedAt: "2025-04-05T09:00:00Z" },
  { uid: "org-14", id: 14, type: "org", batch: "3", batchName: "Партнёры", card: "700000014", nfc: "00D11E22F99C", status: "inactive", owner: "ИП Ахмедов С.",    imported_at: "2025-04-01T08:00:00Z", activatedAt: null },
  { uid: "org-15", id: 15, type: "org", batch: "3", batchName: "Партнёры", card: "700000015", nfc: "11E22F99C00D", status: "active",   owner: "МЧЖ ЭкоПарк",      imported_at: "2025-04-01T08:00:00Z", activatedAt: "2025-04-10T10:00:00Z" },
  { uid: "org-16", id: 16, type: "org", batch: "3", batchName: "Партнёры", card: "700000016", nfc: "22F99C00D11E", status: "blocked",  owner: "ИП Ахмедов С.",    imported_at: "2025-04-01T08:00:00Z", activatedAt: "2025-05-01T09:00:00Z" },
];

// ─── Stats helper ─────────────────────────────────────────────────────────────

function calcTypeStats(cards: UnifiedCard[]): NfcTypeStats {
  return {
    total:    cards.length,
    active:   cards.filter((c) => c.status === "active").length,
    inactive: cards.filter((c) => c.status === "inactive").length,
    blocked:  cards.filter((c) => c.status === "blocked").length,
    lost:     cards.filter((c) => c.status === "lost").length,
    frozen:   cards.filter((c) => c.status === "frozen").length,
  };
}

// ─── API ──────────────────────────────────────────────────────────────────────

export const getAllCards = async (
  params?: GetAllCardsQuery,
): Promise<GetAllCardsResponse> => {
  await delay();

  let filtered = [...mockCards];

  if (params?.type && params.type !== "all") {
    filtered = filtered.filter((c) => c.type === params.type);
  }

  if (params?.status && params.status !== "all") {
    filtered = filtered.filter((c) => c.status === (params.status as CardStatus));
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

  const page  = params?.page  ?? 1;
  const limit = params?.limit ?? 20;
  const total = filtered.length;
  const start = (page - 1) * limit;

  return {
    cards: filtered.slice(start, start + limit),
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) },
  };
};

export const getAllStats = async (): Promise<NfcAllStats> => {
  await delay();

  const types: NfcType[] = ["classic", "vip", "org"];

  const byType = Object.fromEntries(
    types.map((t) => [t, calcTypeStats(mockCards.filter((c) => c.type === t))]),
  ) as Record<NfcType, NfcTypeStats>;

  const batchMap = new Map<
    string,
    { batchId: number; batchName: string; type: NfcType; cards: UnifiedCard[] }
  >();

  for (const c of mockCards) {
    const key = `${c.type}-${c.batch}`;
    if (!batchMap.has(key)) {
      batchMap.set(key, {
        batchId:   Number(c.batch),
        batchName: c.batchName ?? `Batch ${c.batch}`,
        type:      c.type,
        cards:     [],
      });
    }
    batchMap.get(key)!.cards.push(c);
  }

  const batches = Array.from(batchMap.values()).map(({ cards, ...meta }) => ({
    ...meta,
    ...calcTypeStats(cards),
  }));

  return {
    total:  calcTypeStats(mockCards),
    byType,
    batches,
  };
};
