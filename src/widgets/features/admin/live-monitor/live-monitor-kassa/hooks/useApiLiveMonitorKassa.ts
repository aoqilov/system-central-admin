import { useQuery } from "@tanstack/react-query";
import dayjs from "dayjs";
import { toast, getApiError } from "@/components/sonner-toast/toast";
import { getCashboxZReports } from "@/api/cashbox-reports/cashbox-reports.api";
import { getTransactions } from "@/api/card-transactions/card-transactions.api";

export function useZReports(date?: string) {
  const targetDate = date ?? dayjs().format("YYYY-MM-DD");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["zreports", targetDate],
    queryFn: () => getCashboxZReports({ date: targetDate }),
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки отчётов кассы", { description: getApiError(error) });
      return false;
    },
  });

  return {
    stats: data?.stats,
    totals: data?.totals,
    cashboxes: data?.cashboxes,
    isLoading,
    isError,
    refetch,
  };
}

export function useCashboxTransactions({
  cashboxID,
  page = 1,
  limit = 10,
}: {
  cashboxID: number | null;
  page?: number;
  limit?: number;
}) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cashbox-transactions", cashboxID, page, limit],
    queryFn: () => getTransactions(cashboxID!, { page, limit }),
    enabled: !!cashboxID,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
    throwOnError: (error) => {
      toast.error("Ошибка загрузки транзакций", { description: getApiError(error) });
      return false;
    },
  });

  return {
    transactions: data?.["cashbox-transactions"] ?? [],
    pagination: data?.pagination,
    isLoading,
    isError,
    refetch,
  };
}
