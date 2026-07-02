import { useQuery } from "@tanstack/react-query";
import { useDeviceId } from "@/hooks/useDeviceId";
import { fetchAttractionByDevice } from "../profile/api/apiOperatorProfile";

export function useOperatorAttraction() {
  const deviceId = useDeviceId("dntdiOP");

  const { data: attraction, isLoading, isError } = useQuery({
    queryKey: ["operator-attraction", deviceId],
    queryFn: () => fetchAttractionByDevice(deviceId!),
    enabled: !!deviceId,
    retry: false,
    staleTime: 5 * 60 * 1000,
  });

  return { attraction, deviceId, isLoading, isError };
}
