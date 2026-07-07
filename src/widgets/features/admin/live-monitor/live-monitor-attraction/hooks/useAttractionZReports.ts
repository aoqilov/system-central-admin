import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { getAttractionZReports } from "../api/apiLiveAttraction";

export function useAttractionZReports(date?: string) {
  const targetDate = date ?? dayjs().format("YYYY-MM-DD");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["attraction-zreports", targetDate],
    queryFn: () => getAttractionZReports(targetDate),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  return {
    stats: data?.data.data.stats,
    totals: data?.data.data.totals,
    attractions: data?.data.data.attractions,
    isLoading,
    isError,
    refetch,
  };
}
