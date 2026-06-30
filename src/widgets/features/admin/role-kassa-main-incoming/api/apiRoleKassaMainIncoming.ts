import dayjs from "dayjs";
import api from "@/api-config/axiosInstance";
import type {
  ApiResponse,
  GetZReportsData,
  GetZReportsParams,
  ConfirmZReportsPayload,
} from "../types";

export const getZReports = async (params?: GetZReportsParams) => {
  const { data } = await api.get<ApiResponse<GetZReportsData>>("/zreports", {
    params: {
      date: dayjs().format("YYYY-MM-DD"),
      limit: 100,
      ...params,
    },
  });
  return data;
};

export const confirmZReports = async (payload: ConfirmZReportsPayload) => {
  const { data } = await api.post<ApiResponse<{ success: true }>>(
    "/zreports/confirmation",
    { data: payload },
  );
  return data;
};
