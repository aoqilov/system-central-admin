import { useEffect } from "react";
import { toast, getApiError } from "@/components/sonner-toast/toast";

/**
 * Query natijasiga toast bildirishnomasi qo'shadi.
 *
 * @example — faqat xato
 * const query = useQuery({ ... });
 * useQueryToast(query, "Ошибка при загрузке");
 * return query;
 *
 * @example — xato + muvaffaqiyat
 * const query = useQuery({ ... });
 * useQueryToast(query, "Ошибка при загрузке", "Данные загружены");
 * return query;
 */

interface QueryState {
  isError: boolean;
  error: unknown;
  isSuccess?: boolean;
  data?: unknown;
}

export function useQueryToast(
  query: QueryState,
  errorTitle: string,
  successTitle?: string,
) {
  useEffect(() => {
    if (query.isError) {
      toast.error(errorTitle, { description: getApiError(query.error) });
    }
  }, [query.isError, query.error]);

  useEffect(() => {
    if (query.isSuccess && successTitle) {
      toast.success(successTitle);
    }
  }, [query.data]);
}
