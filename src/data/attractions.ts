export type AttractionStatus = "open" | "maintenance" | "closed";
export type AttractionCategory =
  | "thrill"
  | "family"
  | "kids"
  | "water"
  | "playground"
  | "entertainment";

export interface Attraction {
  id: number;
  name: string;
  manufacturer: string | null;
  price: number;
  note?: string;
  category: AttractionCategory;
  status: AttractionStatus;
  images: {
    imageAttractionMain?: string;
    imageAttractionSecondary?: string[];
  };
  rulesAttraction?: {
    minAge: number | null;
    minHeight?: number;
    maxHeight?: number;
    minWeight?: number;
    maxWeight?: number;
    maxWeightPerCup?: number;
    maxWeightPerBoat?: number;
    roundTime: number;
    numberOfPlaceRound: number;
  };
  relationOperator: {
    mainOperatorId?: number;
    relationDay?: string;
    helperOperatorIds?: {
      relationdate: string;
      id: number;
    }[];
    relationHistory?: {
      date: string;
      mainOperatorId: number;
    };
  };
  statsVisitors?: { date: string; count: number }[];
  statsRevenue?: { date: string; amount: number }[];
}

export interface AttractionCategoryOption {
  value: AttractionCategory | "all";
  label: string;
}

// ─── Mock stats helpers ───────────────────────────────────────────────────────

const WEEK = [
  "2026-05-27",
  "2026-05-28",
  "2026-05-29",
  "2026-05-30",
  "2026-05-31",
  "2026-06-01",
  "2026-06-02",
];
function _s(n: number) {
  return ((n * 9301 + 49297) % 233280) / 233280;
}
function _gv(base: number, id: number) {
  return WEEK.map((date, i) => ({
    date,
    count: Math.max(
      5,
      Math.round((base / 7) * (0.6 + _s(id * 31 + i * 7) * 0.9)),
    ),
  }));
}
function _gr(base: number, price: number, id: number) {
  return WEEK.map((date, i) => ({
    date,
    amount: Math.max(
      10000,
      Math.round(((base * price) / 7) * (0.6 + _s(id * 17 + i * 13) * 0.9)),
    ),
  }));
}

// ─── Data ─────────────────────────────────────────────────────────────────────

export const attractions: Attraction[] = [
  {
    id: 1,
    name: "Flying Tigers",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    note: "Рекомендуется сопровождение взрослых",
    category: "kids",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att1/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att1b/800/500",
        "https://picsum.photos/seed/att1c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 6,
      minHeight: 90,
      maxWeight: 150,
      roundTime: 5,
      numberOfPlaceRound: 16,
    },
    relationOperator: {
      helperOperatorIds: [
        { id: 10, relationdate: "2025-08-10" },
        { id: 9, relationdate: "2025-08-20" },
        { id: 11, relationdate: "2025-09-10" },
        { id: 12, relationdate: "2025-11-20" },
      ],
    },
    statsVisitors: _gv(340, 1),
    statsRevenue: _gr(340, 18000, 1),
  },
  {
    id: 2,
    name: "Galleon",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 36000,
    note: "Дети до 12 лет с сопровождением взрослых",
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att2/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att2b/800/500",
        "https://picsum.photos/seed/att2c/800/500",
        "https://picsum.photos/seed/att2d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: null,
      minHeight: 140,
      roundTime: 6,
      numberOfPlaceRound: 24,
    },
    relationOperator: {
      mainOperatorId: 2,
      relationDay: "2025-03-15",
      helperOperatorIds: [
        { id: 11, relationdate: "2025-03-15" },
        { id: 12, relationdate: "2025-07-01" },
      ],
      relationHistory: { date: "2024-11-01", mainOperatorId: 1 },
    },
    statsVisitors: _gv(520, 2),
    statsRevenue: _gr(520, 36000, 2),
  },
  {
    id: 3,
    name: "Happy Swing",
    manufacturer: "Zamperla Asia Pacific (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att3/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att3b/800/500",
        "https://picsum.photos/seed/att3c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 6,
      minHeight: 90,
      maxHeight: 140,
      roundTime: 4,
      numberOfPlaceRound: 16,
    },
    relationOperator: { mainOperatorId: 3 },
    statsVisitors: _gv(290, 3),
    statsRevenue: _gr(290, 18000, 3),
  },
  {
    id: 4,
    name: "Family Swinger",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 24000,
    note: "Дети до 12 лет обязательно с сопровождением взрослых",
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att4/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att4b/800/500",
        "https://picsum.photos/seed/att4c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 8,
      minHeight: 90,
      minWeight: 50,
      maxWeight: 75,
      roundTime: 3,
      numberOfPlaceRound: 32,
    },
    relationOperator: { mainOperatorId: 4 },
    statsVisitors: _gv(410, 4),
    statsRevenue: _gr(410, 24000, 4),
  },
  {
    id: 5,
    name: "Coaster",
    manufacturer: "Preston Barbieri S.R.L. (Италия)",
    price: 30000,
    note: "Не рекомендуется при болезнях сердца и повышенном давлении",
    category: "thrill",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att5/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att5b/800/500",
        "https://picsum.photos/seed/att5c/800/500",
        "https://picsum.photos/seed/att5d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 10,
      minHeight: 120,
      roundTime: 2,
      numberOfPlaceRound: 16,
    },
    relationOperator: {
      mainOperatorId: 5,
      relationDay: "2025-05-01",
      helperOperatorIds: [
        { id: 3, relationdate: "2025-05-01" },
        { id: 10, relationdate: "2025-08-12" },
      ],
      relationHistory: { date: "2025-01-10", mainOperatorId: 3 },
    },
    statsVisitors: _gv(680, 5),
    statsRevenue: _gr(680, 30000, 5),
  },
  {
    id: 6,
    name: "Cyclon Coaster",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 36000,
    note: "Только для здоровых. Запрещено для беременных",
    category: "thrill",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att6/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att6b/800/500",
        "https://picsum.photos/seed/att6c/800/500",
        "https://picsum.photos/seed/att6d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 14,
      minHeight: 140,
      minWeight: 50,
      maxWeight: 75,
      roundTime: 45,
      numberOfPlaceRound: 8,
    },
    relationOperator: {
      mainOperatorId: 6,
      relationDay: "2025-04-20",
      helperOperatorIds: [
        { id: 4, relationdate: "2025-04-20" },
        { id: 9, relationdate: "2025-06-15" },
      ],
      relationHistory: { date: "2024-12-15", mainOperatorId: 7 },
    },
    statsVisitors: _gv(590, 6),
    statsRevenue: _gr(590, 36000, 6),
  },
  {
    id: 7,
    name: "Swing Baroque",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att7/800/500" },
    rulesAttraction: {
      minAge: 5,
      maxHeight: 120,
      maxWeight: 50,
      roundTime: 10,
      numberOfPlaceRound: 12,
    },
    relationOperator: { mainOperatorId: 7 },
    statsVisitors: _gv(260, 7),
    statsRevenue: _gr(260, 18000, 7),
  },
  {
    id: 8,
    name: "Junior Jet",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att8/800/500" },
    rulesAttraction: {
      minAge: 5,
      maxHeight: 90,
      maxWeight: 50,
      roundTime: 7,
      numberOfPlaceRound: 8,
    },
    relationOperator: { mainOperatorId: 8 },
    statsVisitors: _gv(180, 8),
    statsRevenue: _gr(180, 18000, 8),
  },
  {
    id: 9,
    name: "3 Loops Coaster",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 30000,
    note: "На техническом обслуживании. Временно закрыто",
    category: "thrill",
    status: "maintenance",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att9/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att9b/800/500",
        "https://picsum.photos/seed/att9c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 10,
      minHeight: 120,
      maxHeight: 195,
      minWeight: 50,
      maxWeight: 75,
      roundTime: 0,
      numberOfPlaceRound: 16,
    },
    relationOperator: { mainOperatorId: 9 },
    statsVisitors: _gv(0, 9),
    statsRevenue: _gr(0, 30000, 9),
  },
  {
    id: 10,
    name: "Mini Crazy Mill",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 12000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att10/800/500" },
    rulesAttraction: {
      minAge: 3,
      minHeight: 80,
      maxWeight: 50,
      roundTime: 5,
      numberOfPlaceRound: 12,
    },
    relationOperator: { mainOperatorId: 10 },
    statsVisitors: _gv(150, 10),
    statsRevenue: _gr(150, 12000, 10),
  },
  {
    id: 11,
    name: "Swing",
    manufacturer: "Zamperla Asia Pacific (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att11/800/500" },
    rulesAttraction: {
      minAge: 5,
      maxHeight: 90,
      maxWeight: 50,
      roundTime: 6,
      numberOfPlaceRound: 12,
    },
    relationOperator: { mainOperatorId: 11 },
    statsVisitors: _gv(170, 11),
    statsRevenue: _gr(170, 18000, 11),
  },
  {
    id: 12,
    name: "Multi Track Slide",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 18000,
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att12/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att12b/800/500",
        "https://picsum.photos/seed/att12c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 10,
      minHeight: 130,
      maxWeight: 100,
      roundTime: 18,
      numberOfPlaceRound: 6,
    },
    relationOperator: { mainOperatorId: 12 },
    statsVisitors: _gv(380, 12),
    statsRevenue: _gr(380, 18000, 12),
  },
  {
    id: 13,
    name: "Air Race",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 36000,
    note: "Запрещено при болезнях сердца, давлении и эпилепсии",
    category: "thrill",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att13/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att13b/800/500",
        "https://picsum.photos/seed/att13c/800/500",
        "https://picsum.photos/seed/att13d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 14,
      minHeight: 140,
      maxWeight: 110,
      roundTime: 40,
      numberOfPlaceRound: 12,
    },
    relationOperator: {
      mainOperatorId: 13,
      relationDay: "2025-06-01",
      helperOperatorIds: [
        { id: 1, relationdate: "2025-06-01" },
        { id: 6, relationdate: "2025-09-18" },
      ],
    },
    statsVisitors: _gv(510, 13),
    statsRevenue: _gr(510, 36000, 13),
  },
  {
    id: 14,
    name: "Windstar Z",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 36000,
    note: "Запрещено для беременных и после операций (до 6 мес.)",
    category: "thrill",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att14/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att14b/800/500",
        "https://picsum.photos/seed/att14c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 10,
      minHeight: 120,
      maxWeight: 100,
      roundTime: 30,
      numberOfPlaceRound: 20,
    },
    relationOperator: {
      mainOperatorId: 14,
      relationDay: "2025-07-10",
      helperOperatorIds: [
        { id: 8, relationdate: "2025-07-10" },
        { id: 11, relationdate: "2025-10-05" },
      ],
    },
    statsVisitors: _gv(440, 14),
    statsRevenue: _gr(440, 36000, 14),
  },
  {
    id: 15,
    name: "Flying School",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att15/800/500" },
    rulesAttraction: {
      minAge: 7,
      minHeight: 90,
      maxWeight: 100,
      roundTime: 9,
      numberOfPlaceRound: 12,
    },
    relationOperator: {},
    statsVisitors: _gv(220, 15),
    statsRevenue: _gr(220, 18000, 15),
  },
  {
    id: 16,
    name: "Magic Bikes",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 24000,
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att16/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att16b/800/500",
        "https://picsum.photos/seed/att16c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: null,
      minHeight: 120,
      maxWeight: 100,
      roundTime: 14,
      numberOfPlaceRound: 20,
    },
    relationOperator: {},
    statsVisitors: _gv(310, 16),
    statsRevenue: _gr(310, 24000, 16),
  },
  {
    id: 17,
    name: "Midi Tea Cup",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    note: "Идеально для маленьких детей",
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att17/800/500" },
    rulesAttraction: {
      minAge: null,
      maxHeight: 90,
      maxWeightPerCup: 250,
      roundTime: 8,
      numberOfPlaceRound: 24,
    },
    relationOperator: {},
    statsVisitors: _gv(200, 17),
    statsRevenue: _gr(200, 18000, 17),
  },
  {
    id: 18,
    name: "Space Jet",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att18/800/500" },
    rulesAttraction: {
      minAge: 5,
      minHeight: 90,
      maxWeight: 100,
      roundTime: 11,
      numberOfPlaceRound: 12,
    },
    relationOperator: {},
    statsVisitors: _gv(245, 18),
    statsRevenue: _gr(245, 18000, 18),
  },
  {
    id: 19,
    name: "Jumping Star",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att19/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att19b/800/500",
        "https://picsum.photos/seed/att19c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 8,
      minHeight: 90,
      minWeight: 40,
      maxWeight: 75,
      roundTime: 16,
      numberOfPlaceRound: 12,
    },
    relationOperator: {},
    statsVisitors: _gv(335, 19),
    statsRevenue: _gr(335, 18000, 19),
  },
  {
    id: 20,
    name: "Central Carousel",
    manufacturer: "Manufacture de Carrousels (Франция)",
    price: 30000,
    note: "Подходит для всех возрастов. Малыши с взрослыми",
    category: "kids",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att20/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att20b/800/500",
        "https://picsum.photos/seed/att20c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: null,
      maxHeight: 120,
      maxWeight: 100,
      roundTime: 10,
      numberOfPlaceRound: 24,
    },
    relationOperator: {},
    statsVisitors: _gv(280, 20),
    statsRevenue: _gr(280, 30000, 20),
  },
  {
    id: 21,
    name: "Jump Around",
    manufacturer: "Antonio Zamperla S.p.A. (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att21/800/500" },
    rulesAttraction: {
      minAge: 5,
      minHeight: 90,
      maxWeight: 150,
      roundTime: 13,
      numberOfPlaceRound: 12,
    },
    relationOperator: {},
    statsVisitors: _gv(295, 21),
    statsRevenue: _gr(295, 18000, 21),
  },
  {
    id: 22,
    name: "Steam Car",
    manufacturer: null,
    price: 36000,
    note: "Один поезд вмещает до 20 пассажиров",
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att22/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att22b/800/500",
        "https://picsum.photos/seed/att22c/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 10,
      minHeight: 120,
      roundTime: 22,
      numberOfPlaceRound: 20,
    },
    relationOperator: {},
    statsVisitors: _gv(360, 22),
    statsRevenue: _gr(360, 36000, 22),
  },
  {
    id: 23,
    name: "Aqua Lady Birds",
    manufacturer: "Таш. Мех. завод (Узбекистан)",
    price: 24000,
    note: "Будьте готовы промокнуть. Рекомендуется взять смену одежды",
    category: "water",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att23/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att23b/800/500",
        "https://picsum.photos/seed/att23c/800/500",
        "https://picsum.photos/seed/att23d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: null,
      minHeight: 120,
      maxWeightPerBoat: 250,
      roundTime: 25,
      numberOfPlaceRound: 8,
    },
    relationOperator: { helperOperatorIds: [{ id: 7, relationdate: "2025-08-05" }, { id: 12, relationdate: "2025-10-22" }] },
    statsVisitors: _gv(420, 23),
    statsRevenue: _gr(420, 24000, 23),
  },
  {
    id: 24,
    name: "Drop N Twist",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 36000,
    note: "Строго запрещено для беременных и при болезнях сердца",
    category: "thrill",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att24/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att24b/800/500",
        "https://picsum.photos/seed/att24c/800/500",
        "https://picsum.photos/seed/att24d/800/500",
      ],
    },
    rulesAttraction: {
      minAge: 14,
      minHeight: 150,
      minWeight: 40,
      maxWeight: 75,
      roundTime: 50,
      numberOfPlaceRound: 8,
    },
    relationOperator: { helperOperatorIds: [{ id: 2, relationdate: "2025-09-01" }, { id: 5, relationdate: "2025-11-14" }] },
    statsVisitors: _gv(630, 24),
    statsRevenue: _gr(630, 36000, 24),
  },
  {
    id: 25,
    name: "Колесо обозрения GL60",
    manufacturer: "Manufacturing Factory (Китай)",
    price: 30000,
    note: "Дети до 12 лет с сопровождением",
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att25/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att25b/800/500",
        "https://picsum.photos/seed/att25c/800/500",
      ],
    },
    rulesAttraction: { minAge: null, roundTime: 20, numberOfPlaceRound: 24 },
    relationOperator: { helperOperatorIds: [{ id: 13, relationdate: "2025-06-18" }] },
    statsVisitors: _gv(750, 25),
    statsRevenue: _gr(750, 30000, 25),
  },
  {
    id: 26,
    name: "Speedway",
    manufacturer: "VISA Group (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att26/800/500" },
    rulesAttraction: {
      minAge: 5,
      minHeight: 90,
      maxWeight: 100,
      roundTime: 12,
      numberOfPlaceRound: 16,
    },
    relationOperator: {},
    statsVisitors: _gv(270, 26),
    statsRevenue: _gr(270, 18000, 26),
  },
  {
    id: 27,
    name: "Merry Go Round",
    manufacturer: "SBF-VISA Group (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att27/800/500" },
    rulesAttraction: {
      minAge: null,
      maxHeight: 120,
      maxWeight: 100,
      roundTime: 7,
      numberOfPlaceRound: 20,
    },
    relationOperator: {},
    statsVisitors: _gv(190, 27),
    statsRevenue: _gr(190, 18000, 27),
  },
  {
    id: 28,
    name: "Pirat Jet",
    manufacturer: "VISA Group (Италия)",
    price: 18000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att28/800/500" },
    rulesAttraction: {
      minAge: 5,
      minHeight: 90,
      maxWeight: 150,
      roundTime: 9,
      numberOfPlaceRound: 12,
    },
    relationOperator: {},
    statsVisitors: _gv(215, 28),
    statsRevenue: _gr(215, 18000, 28),
  },
  {
    id: 29,
    name: "Playground",
    manufacturer: null,
    price: 60000,
    note: "Для всех детей. Дневная оплата за вход",
    category: "playground",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att29/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att29b/800/500",
        "https://picsum.photos/seed/att29c/800/500",
      ],
    },
    relationOperator: { helperOperatorIds: [{ id: 1, relationdate: "2025-07-20" }, { id: 4, relationdate: "2025-12-03" }] },
    statsVisitors: _gv(480, 29),
    statsRevenue: _gr(480, 60000, 29),
  },
  {
    id: 30,
    name: "Лабиринт",
    manufacturer: null,
    price: 10000,
    category: "playground",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att30/800/500" },
    relationOperator: {},
    statsVisitors: _gv(160, 30),
    statsRevenue: _gr(160, 10000, 30),
  },
  {
    id: 31,
    name: "Payloader",
    manufacturer: null,
    price: 12000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att31/800/500" },
    rulesAttraction: { minAge: null, roundTime: 4, numberOfPlaceRound: 4 },
    relationOperator: {},
    statsVisitors: _gv(95, 31),
    statsRevenue: _gr(95, 12000, 31),
  },
  {
    id: 32,
    name: "Excavator",
    manufacturer: null,
    price: 12000,
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att32/800/500" },
    rulesAttraction: { minAge: null, roundTime: 4, numberOfPlaceRound: 4 },
    relationOperator: {},
    statsVisitors: _gv(88, 32),
    statsRevenue: _gr(88, 12000, 32),
  },
  {
    id: 33,
    name: "Паровоз",
    manufacturer: null,
    price: 24000,
    note: "Один состав вмещает 40 пассажиров",
    category: "family",
    status: "open",
    images: {
      imageAttractionMain: "https://picsum.photos/seed/att33/800/500",
      imageAttractionSecondary: [
        "https://picsum.photos/seed/att33b/800/500",
        "https://picsum.photos/seed/att33c/800/500",
      ],
    },
    rulesAttraction: { minAge: null, roundTime: 10, numberOfPlaceRound: 40 },
    relationOperator: {},
    statsVisitors: _gv(310, 33),
    statsRevenue: _gr(310, 24000, 33),
  },
  {
    id: 34,
    name: "VR 9D Cinema",
    manufacturer: null,
    price: 35000,
    note: "1 человек, 1 ролик. Новый сеанс каждые 10 минут",
    category: "entertainment",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att34/800/500" },
    rulesAttraction: { minAge: null, roundTime: 5, numberOfPlaceRound: 1 },
    relationOperator: {},
    statsVisitors: _gv(125, 34),
    statsRevenue: _gr(125, 35000, 34),
  },
  {
    id: 35,
    name: "Baby Car",
    manufacturer: null,
    price: 20000,
    note: "Один круг. Электромобиль для детей",
    category: "kids",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att35/800/500" },
    rulesAttraction: { minAge: null, roundTime: 3, numberOfPlaceRound: 8 },
    relationOperator: {},
    statsVisitors: _gv(140, 35),
    statsRevenue: _gr(140, 20000, 35),
  },
  {
    id: 36,
    name: "Ping Pong",
    manufacturer: null,
    price: 18000,
    note: "15 минут игры. Ракетки и шарик включены",
    category: "entertainment",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att36/800/500" },
    rulesAttraction: { minAge: null, roundTime: 0, numberOfPlaceRound: 2 },
    relationOperator: {},
    statsVisitors: _gv(70, 36),
    statsRevenue: _gr(70, 18000, 36),
  },
  {
    id: 37,
    name: "Тир",
    manufacturer: null,
    price: 40000,
    note: "5 патронов. Соревнуйтесь с коллегами",
    category: "entertainment",
    status: "open",
    images: { imageAttractionMain: "https://picsum.photos/seed/att37/800/500" },
    rulesAttraction: { minAge: null, roundTime: 0, numberOfPlaceRound: 5 },
    relationOperator: {},
    statsVisitors: _gv(95, 37),
    statsRevenue: _gr(95, 40000, 37),
  },
];

export const attractionCategories: AttractionCategoryOption[] = [
  { value: "all", label: "Barcha" },
  { value: "thrill", label: "Ekstremal" },
  { value: "family", label: "Oilaviy" },
  { value: "kids", label: "Bolalar" },
  { value: "water", label: "Suv" },
  { value: "playground", label: "Maydonchat" },
  { value: "entertainment", label: "Ko'ngilochar" },
];
