import { useQuery } from "@tanstack/react-query";
import { useDeviceId } from "@/hooks/useDeviceId";
import { fetchCashboxByDevice } from "../profile/api/apiKassaProfile";

export const CASHBOX_DEVICE_KEY = (deviceId: string | null) =>
  ["kassa-cashbox", deviceId] as const;

export function useCashbox() {
  const deviceId = useDeviceId("dntdiKA");

  const query = useQuery({
    queryKey: CASHBOX_DEVICE_KEY(deviceId),
    queryFn: () => fetchCashboxByDevice(deviceId!),
    enabled: !!deviceId,
    retry: false,
  });

  return {
    cashbox: query.data,
    cashboxId: query.data?.id ?? null,
    isLoading: query.isLoading,
    isError: query.isError,
  };
}
