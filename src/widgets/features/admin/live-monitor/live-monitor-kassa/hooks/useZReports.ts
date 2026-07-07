import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getZReports } from "../api/apiLiveKassa";

export function useZReports(date?: string) {
  const targetDate = date ?? dayjs().format("YYYY-MM-DD");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["zreports", targetDate],
    queryFn: () => getZReports(targetDate),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    stats: data?.data.data.stats,
    totals: data?.data.data.totals,
    cashboxes: data?.data.data.cashboxes,
    isLoading,
    isError,
    refetch,
  };
}
