import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { getTodayReports, openReport, updateReportStatus } from "../api/apiOperatorSmena";

const SMENA_KEY = (attractionID: number) => ["smena-reports", attractionID];

export function useSmena(attractionID: number | undefined) {
  const qc = useQueryClient();

  const { data, isLoading, isError } = useQuery({
    queryKey: SMENA_KEY(attractionID ?? 0),
    queryFn: () => getTodayReports(attractionID!),
    enabled: !!attractionID,
  });

  const reports = data?.data["attraction-reports"];
  const zreport = reports?.zreport ?? null;
  const xreports = reports?.xreports ?? [];

  const canOpenX =
    !zreport ||
    (zreport.status === "open" &&
      !xreports.some((x) => x.status === "open" || x.status === "stopped"));

  const canClose =
    !!zreport &&
    zreport.status === "open" &&
    xreports.length > 0 &&
    xreports.every((x) => x.status === "closed");

  function invalidate() {
    void qc.invalidateQueries({ queryKey: SMENA_KEY(attractionID ?? 0) });
  }

  const openXMut = useMutation({
    mutationFn: () => openReport(attractionID!),
    onSuccess: invalidate,
  });

  const stopXMut = useMutation({
    mutationFn: (reportID: number) =>
      updateReportStatus(attractionID!, reportID, { status: "stopped" }),
    onSuccess: invalidate,
  });

  const resumeXMut = useMutation({
    mutationFn: (reportID: number) =>
      updateReportStatus(attractionID!, reportID, { status: "open" }),
    onSuccess: invalidate,
  });

  const closeXMut = useMutation({
    mutationFn: (reportID: number) =>
      updateReportStatus(attractionID!, reportID, { status: "closed" }),
    onSuccess: invalidate,
  });

  const closeZMut = useMutation({
    mutationFn: () =>
      updateReportStatus(attractionID!, zreport!.id, { status: "closed" }),
    onSuccess: invalidate,
  });

  return {
    zreport,
    xreports,
    isLoading,
    isError,
    canOpenX,
    canClose,
    openXMut,
    stopXMut,
    resumeXMut,
    closeXMut,
    closeZMut,
  };
}
