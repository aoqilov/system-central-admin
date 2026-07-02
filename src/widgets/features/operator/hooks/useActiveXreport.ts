import { useQuery } from "@tanstack/react-query";
import { getTodayReports } from "../smena/api/apiOperatorSmena";
import type { AttractionReport } from "../smena/types";

export function useActiveXreport(attractionID: number | undefined) {
  const { data } = useQuery({
    queryKey: ["smena-reports", attractionID ?? 0],
    queryFn: () => getTodayReports(attractionID!),
    enabled: !!attractionID,
  });

  const xreports: AttractionReport[] =
    data?.data["attraction-reports"]?.xreports ?? [];

  return xreports.some((x) => x.status === "open");
}
