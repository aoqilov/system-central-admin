import { useQuery } from "@tanstack/react-query";
import { getCashboxTransactions } from "../api/apiLiveKassa";

interface Params {
  cashboxID: number | null;
  page?: number;
  limit?: number;
}

export function useCashboxTransactions({ cashboxID, page = 1, limit = 10 }: Params) {
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["cashbox-transactions", cashboxID, page, limit],
    queryFn: () => getCashboxTransactions(cashboxID!, { page, limit }),
    enabled: !!cashboxID,
    refetchInterval: 20_000,
    refetchOnWindowFocus: true,
    refetchOnMount: true,
  });

  const raw = data?.data.data;

  return {
    transactions: raw?.["cashbox-transactions"] ?? [],
    pagination: raw?.pagination,
    isLoading,
    isError,
    refetch,
  };
}
