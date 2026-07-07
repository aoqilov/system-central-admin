import api from "@/api-config/axiosInstance";
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
} from "../nfc.types";

export const uploadCards = async (file: File, batchName: string) => {
  const form = new FormData();
  form.append("file", file);
  form.append("batch_name", batchName);
  const { data } = await api.post<ApiResponse<UploadCardsResponse>>(
    "/cards/upload",
    form,
    { headers: { "Content-Type": "multipart/form-data" } },
  );
  return data;
};

export const getCardsStats = async () => {
  const { data } =
    await api.get<ApiResponse<GetCardsStatsResponse>>("/cards/stats");
  return data;
};

export const getCards = async (params?: GetCardsQuery) => {
  const { data } = await api.get<ApiResponse<GetCardsResponse>>("/cards", {
    params,
  });
  return data;
};

export const deleteCards = async (payload: DeleteCardsPayload) => {
  const { data } = await api.delete<ApiResponse<DeleteCardsResponse>>(
    "/cards",
    { data: { data: payload } },
  );
  return data;
};

export const updateCard = async (
  cardID: number,
  payload: UpdateCardPayload,
) => {
  const { data } = await api.put<ApiResponse<UpdateCardResponse>>(
    `/cards/${cardID}`,
    { data: payload },
  );
  return data;
};
