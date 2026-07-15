import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useCashbox } from "../../hooks/useCashbox";
import { getTodayReports } from "../../otchet/api/apiKassaOtchet";
import { getTransactions } from "../api/apiKassaStats";
import { reportToPaySummary } from "../../otchet/otchet.helpers";
import { CASHBOX_REPORTS_KEY } from "../../kassa.constants";

const TX_PAGE_SIZE = 10;

export function useKassaStats() {
  const [txPage, setTxPage] = useState(1);
  const { cashboxId } = useCashbox();

  const { data: reportData } = useQuery({
    queryKey: CASHBOX_REPORTS_KEY(cashboxId ?? 0),
    queryFn: () => getTodayReports(cashboxId!),
    enabled: !!cashboxId,
  });

  const { data: txData, isLoading: txLoading } = useQuery({
    queryKey: ["cashbox-transactions", cashboxId, txPage],
    queryFn: () => getTransactions(cashboxId!, { page: txPage, limit: TX_PAGE_SIZE }),
    enabled: !!cashboxId,
  });

  const xreports = reportData?.data["cashbox-reports"].xreports ?? [];
  const activeX = xreports.find((x) => x.status === "open") ?? null;
  const s = reportToPaySummary(activeX);
  const op = activeX ? `${activeX.operator.firstname} ${activeX.operator.lastname}` : "";

  const transactions = txData?.data["cashbox-transactions"] ?? [];
  const txTotal = txData?.data.pagination.total ?? 0;

  return {
    activeX,
    s,
    op,
    transactions,
    txTotal,
    txLoading,
    txPage,
    setTxPage,
    TX_PAGE_SIZE,
  };
}
