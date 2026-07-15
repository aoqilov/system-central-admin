import api from "@/api-config/axiosInstance";
import type { AttractionsResponse } from "@/widgets/features/admin/attractions/types";
import type {
  Attraction,
  AksiyaItem,
  AksiyaStatus,
  CreateAksiyaPayload,
  UpdateAksiyaPayload,
} from "../marketing-aksiya.types";

// ── Attractions (for package builder) ────────────────────────────────────────

export async function fetchAllAttractions(): Promise<Attraction[]> {
  const { data } = await api.get<AttractionsResponse>("/attractions", {
    params: { limit: 100 },
  });
  return data.data.attractions;
}

// ── Aksiya mock store ─────────────────────────────────────────────────────────

const delay = (ms = 450) => new Promise<void>((r) => setTimeout(r, ms));

let _nextId = 100;
const nextId = () => _nextId++;

let mockAksiyalar: AksiyaItem[] = [
  {
    id: 1,
    title: "Летний пакет аттракционов",
    description:
      "Специальное предложение на лето — выберите любые 3 аттракциона и получите скидку 20%. Действует для всей семьи в выходные дни.",
    main_image: null,
    from: "2026-07-01",
    to: "2026-08-31",
    discount: 20,
    status: "active",
    created_at: "2026-06-20T10:00:00Z",
    attractions: [],
  },
  {
    id: 2,
    title: "Детский выходной",
    description:
      "Каждое воскресенье дети до 12 лет получают скидку 30% на все аттракционы при посещении с родителями.",
    main_image: null,
    from: "2026-07-06",
    to: "2026-08-31",
    discount: 30,
    status: "active",
    created_at: "2026-06-25T09:00:00Z",
    attractions: [],
  },
  {
    id: 3,
    title: "Осенний семейный пакет",
    description:
      "С 1 сентября — специальные условия для семей из 4 и более человек. Скидка 15% на весь пакет аттракционов.",
    main_image: null,
    from: "2026-09-01",
    to: "2026-10-31",
    discount: 15,
    status: "plan",
    created_at: "2026-07-01T12:00:00Z",
    attractions: [],
  },
  {
    id: 4,
    title: "Весенняя акция — пакет «Экстрим»",
    description:
      "Весной действовала акция на экстремальные аттракционы. Скидка 25% при покупке пакета из 5 аттракционов.",
    main_image: null,
    from: "2026-03-01",
    to: "2026-05-31",
    discount: 25,
    status: "archive",
    created_at: "2026-02-15T09:00:00Z",
    attractions: [],
  },
];

// ── CRUD ──────────────────────────────────────────────────────────────────────

export async function getAksiyalar(): Promise<{
  active: AksiyaItem[];
  plan: AksiyaItem[];
  archive: AksiyaItem[];
}> {
  await delay();
  const byStatus = (s: AksiyaStatus) => mockAksiyalar.filter((a) => a.status === s);
  return {
    active: byStatus("active"),
    plan: byStatus("plan"),
    archive: byStatus("archive"),
  };
}

export async function createAksiya(payload: CreateAksiyaPayload): Promise<AksiyaItem> {
  await delay(600);
  const item: AksiyaItem = {
    id: nextId(),
    title: payload.title,
    description: payload.description,
    main_image: payload.main_image ? URL.createObjectURL(payload.main_image) : null,
    from: payload.from,
    to: payload.to,
    discount: payload.discount,
    status: payload.status,
    created_at: new Date().toISOString(),
    attractions: payload.attractions,
  };
  mockAksiyalar.unshift(item);
  return item;
}

export async function updateAksiya(id: number, payload: UpdateAksiyaPayload): Promise<AksiyaItem> {
  await delay(500);
  const idx = mockAksiyalar.findIndex((a) => a.id === id);
  if (idx === -1) throw new Error("Aksiya not found");
  const { main_image, ...rest } = payload;
  const resolvedImage =
    main_image instanceof File
      ? URL.createObjectURL(main_image)
      : main_image !== undefined
        ? main_image
        : mockAksiyalar[idx].main_image;
  mockAksiyalar[idx] = { ...mockAksiyalar[idx], ...rest, main_image: resolvedImage };
  return mockAksiyalar[idx];
}

export async function deleteAksiya(id: number): Promise<void> {
  await delay(400);
  mockAksiyalar = mockAksiyalar.filter((a) => a.id !== id);
}
