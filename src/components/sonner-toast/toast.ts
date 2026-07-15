export { toast } from "sonner";
import axios from "axios";

export function getApiError(error: unknown): string {
  if (axios.isAxiosError(error)) {
    return error.response?.data?.message ?? error.message;
  }
  if (error instanceof Error) {
    return error.message;
  }
  return "Неизвестная ошибка";
}

const API_MESSAGES_RU: Record<string, string> = {
  "VIP cards cannot be topped up!": "VIP карту нельзя пополнять",
  "Organization card balance must be less than 12,000 to allow top-up.":
    "Баланс организационной карты должен быть меньше 12 000 для пополнения",
  "Card not found!": "Карта не найдена",
};

export function translateApiError(error: unknown, fallback: string): string {
  const msg = getApiError(error);
  return API_MESSAGES_RU[msg] ?? fallback;
}
