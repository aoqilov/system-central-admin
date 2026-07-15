import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast, getApiError } from "@/components/sonner-toast/toast";
import { getAttractionZReports } from "@/api/attraction-reports/attraction-reports.api";

export function useApiLiveMonitorAttraction(date?: string) {
  const targetDate = date ?? dayjs().format("YYYY-MM-DD");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["attraction-zreports", targetDate],
    queryFn: () => getAttractionZReports({ date: targetDate }),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки аттракционов", {
        description: getApiError(error),
      });
      return false;
    },
  });

  return {
    stats: data?.stats,
    totals: data?.totals,
    attractions: data?.attractions,
    isLoading,
    isError,
    refetch,
  };
}
