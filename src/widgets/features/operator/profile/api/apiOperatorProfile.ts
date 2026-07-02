import api from "@/api-config/axiosInstance";
import type { Attraction } from "@/widgets/features/admin/attractions/types";

interface AttractionByDeviceResponse {
  statusCode: number;
  data: { attraction: Attraction };
}

export async function fetchAttractionByDevice(
  deviceID: string,
): Promise<Attraction> {
  const { data } = await api.get<AttractionByDeviceResponse>(`/attraction`, {
    params: { deviceID },
  });
  return data.data.attraction;
}
