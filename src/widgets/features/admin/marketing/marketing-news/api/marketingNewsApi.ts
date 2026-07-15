import type { NewsItem, CreateNewsPayload, UpdateNewsPayload } from "../marketing-news.types";

const delay = (ms = 450) => new Promise<void>((r) => setTimeout(r, ms));

let _nextId = 100;
const nextId = () => _nextId++;

let mockNews: NewsItem[] = [
  {
    id: 1,
    title: "Грандиозный летний фестиваль 2025 уже совсем скоро!",
    paragraph:
      "В этом году наш парк готовит незабываемый летний фестиваль с живой музыкой, аттракционами и специальными предложениями для всей семьи. Не пропустите грандиозное событие лета!",
    main_image: null,
    likes: 142,
    views: 3820,
    created_at: "2025-06-01T09:00:00Z",
    expired_at: "2025-08-31T23:59:59Z",
    status: "active",
  },
  {
    id: 2,
    title: "Новые скидки на групповые билеты — до 30%",
    paragraph:
      "Приходите в парк с друзьями или коллегами и получите скидку до 30% при покупке групповых билетов от 10 человек. Действует до конца июля.",
    main_image: null,
    likes: 98,
    views: 2140,
    created_at: "2025-06-15T10:30:00Z",
    expired_at: "2025-07-31T23:59:59Z",
    status: "active",
  },
  {
    id: 3,
    title: "Открытие нового аттракциона «Гравитон»",
    paragraph:
      "Рады сообщить об открытии нашего нового аттракциона «Гравитон» — самого высокого и захватывающего в регионе. Первые 100 посетителей получат бесплатный билет!",
    main_image: null,
    likes: 256,
    views: 5900,
    created_at: "2025-07-01T08:00:00Z",
    expired_at: "2025-12-31T23:59:59Z",
    status: "active",
  },
  {
    id: 4,
    title: "Детский день — бесплатный вход для детей до 5 лет",
    paragraph:
      "Каждое воскресенье в нашем парке — детский день! Дети до 5 лет проходят бесплатно в сопровождении взрослого. Акция действует весь июль.",
    main_image: null,
    likes: 310,
    views: 7200,
    created_at: "2025-07-05T09:00:00Z",
    expired_at: "2025-07-14T23:59:59Z",
    status: "active",
  },
  {
    id: 8,
    title: "Осенний фестиваль 2025 — готовимся к сезону",
    paragraph:
      "Этой осенью нас ждёт масштабный фестиваль с новыми аттракционами, мастер-классами и сюрпризами для всей семьи. Следите за обновлениями!",
    main_image: null,
    likes: 0,
    views: 0,
    created_at: "2025-07-06T12:00:00Z",
    expired_at: "2025-11-30T23:59:59Z",
    status: "planned",
  },
  {
    id: 9,
    title: "День рождения парка — специальные предложения",
    paragraph:
      "Парку исполняется 10 лет! Готовим грандиозные скидки, конкурсы и подарки для наших любимых гостей. Дата мероприятия будет объявлена позже.",
    main_image: null,
    likes: 0,
    views: 0,
    created_at: "2025-07-06T13:00:00Z",
    expired_at: "2025-09-15T23:59:59Z",
    status: "planned",
  },
  {
    id: 5,
    title: "Весенняя акция — скидки на абонементы",
    paragraph:
      "Весной мы предлагали специальные условия на покупку абонементов. Акция завершена, но следите за новыми предложениями!",
    main_image: null,
    likes: 75,
    views: 1540,
    created_at: "2025-03-01T10:00:00Z",
    expired_at: "2025-05-31T23:59:59Z",
    status: "archived",
  },
  {
    id: 6,
    title: "Новогодние праздники в парке 2024",
    paragraph:
      "Прошедший новогодний сезон подарил незабываемые воспоминания тысячам гостей. Ёлки, аниматоры и подарки от Деда Мороза — всё это было в нашем парке!",
    main_image: null,
    likes: 412,
    views: 9800,
    created_at: "2024-12-15T09:00:00Z",
    expired_at: "2025-01-10T23:59:59Z",
    status: "archived",
  },
  {
    id: 7,
    title: "День защитника отечества — специальные предложения",
    paragraph:
      "23 февраля для всех военнослужащих действовал бесплатный вход. Мы чтим тех, кто защищает нашу Родину!",
    main_image: null,
    likes: 88,
    views: 2300,
    created_at: "2025-02-20T09:00:00Z",
    expired_at: "2025-02-23T23:59:59Z",
    status: "archived",
  },
];

export const getNews = async (): Promise<{ planned: NewsItem[]; active: NewsItem[]; archived: NewsItem[] }> => {
  await delay();
  return {
    planned:  mockNews.filter((n) => n.status === "planned"),
    active:   mockNews.filter((n) => n.status === "active"),
    archived: mockNews.filter((n) => n.status === "archived"),
  };
};

export const createNews = async (payload: CreateNewsPayload): Promise<NewsItem> => {
  await delay(600);
  const now = new Date().toISOString();
  const item: NewsItem = {
    id: nextId(),
    title: payload.title,
    paragraph: payload.paragraph,
    main_image: payload.main_image ? URL.createObjectURL(payload.main_image) : null,
    likes: 0,
    views: 0,
    created_at: now,
    expired_at: payload.expired_at,
    status: payload.status,
  };
  mockNews.unshift(item);
  return item;
};

export const updateNews = async (id: number, payload: UpdateNewsPayload): Promise<NewsItem> => {
  await delay(500);
  const idx = mockNews.findIndex((n) => n.id === id);
  if (idx === -1) throw new Error("News not found");
  const updated: NewsItem = {
    ...mockNews[idx],
    ...(payload.title !== undefined && { title: payload.title }),
    ...(payload.paragraph !== undefined && { paragraph: payload.paragraph }),
    ...(payload.expired_at !== undefined && { expired_at: payload.expired_at }),
    ...(payload.status !== undefined && { status: payload.status }),
    ...(payload.main_image !== undefined && {
      main_image: payload.main_image ? URL.createObjectURL(payload.main_image) : mockNews[idx].main_image,
    }),
  };
  mockNews[idx] = updated;
  return updated;
};

export const deleteNews = async (id: number): Promise<void> => {
  await delay(400);
  mockNews = mockNews.filter((n) => n.id !== id);
};
