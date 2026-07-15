import api from "@/api-config/axiosInstance";
import type {
  Card,
  CardStats,
  CardType,
  GetCardsResponse,
  GetCardsStatsResponse,
  UploadCardsResponse,
  UpdateCardResponse,
  GetCardsQuery,
  DeleteCardsPayload,
  UpdateCardPayload,
} from "@/types/card.types";
import type { ApiResponse } from "@/types/common.types";

export async function uploadCards(
  file: File,
  batchName: string,
  type: CardType,
  balance?: number,
): Promise<ApiResponse<UploadCardsResponse>> {
  const form = new FormData();
  form.append("file", file);
  form.append("batch_name", batchName);
  form.append("type", type);
  if (balance !== undefined) form.append("balance", String(balance));
  const { data } = await api.post<ApiResponse<UploadCardsResponse>>(
    "/cards/upload",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
}

export async function getCardsStats(params?: {
  type?: CardType;
  batch?: number;
}): Promise<CardStats> {
  const { data } = await api.get<ApiResponse<GetCardsStatsResponse>>(
    "/cards/stats",
    { params },
  );
  return data.data.card_stats;
}

export async function getCards(
  params: GetCardsQuery,
): Promise<GetCardsResponse> {
  const { data } = await api.get<ApiResponse<GetCardsResponse>>("/cards", {
    params,
  });
  return data.data;
}

export async function deleteCards(payload: DeleteCardsPayload): Promise<void> {
  await api.delete("/cards", { data: { data: payload } });
}

export async function updateCard(
  cardID: number,
  payload: UpdateCardPayload,
): Promise<Pick<Card, "id" | "status">> {
  const { data } = await api.put<ApiResponse<UpdateCardResponse>>(
    `/cards/${cardID}`,
    { data: payload },
  );
  return data.data.card;
}
