import { useQuery } from "@tanstack/react-query";
import { getTodayRounds, getTodayReports } from "../api/apiOperatorHome";
import type { AttractionRound } from "../types";
import type { AttractionReport } from "../../smena/types";

export const HOME_ROUNDS_KEY   = (id: number) => ["operator-home-rounds",   id];
export const HOME_REPORTS_KEY  = (id: number) => ["operator-home-reports",  id];

export function useOperatorHome(attractionID: number | undefined) {
  const enabled = !!attractionID;

  const roundsQ = useQuery({
    queryKey: HOME_ROUNDS_KEY(attractionID ?? 0),
    queryFn:  () => getTodayRounds(attractionID!),
    enabled,
  });

  const reportsQ = useQuery({
    queryKey: HOME_REPORTS_KEY(attractionID ?? 0),
    queryFn:  () => getTodayReports(attractionID!),
    enabled,
  });

  const rounds: AttractionRound[] = roundsQ.data?.data["attraction-rounds"] ?? [];

  const xreports: AttractionReport[] =
    reportsQ.data?.data["attraction-reports"]?.xreports ?? [];

  const activeXreport: AttractionReport | null =
    xreports.find((x) => x.status === "open" || x.status === "stopped") ?? null;

  const totals = rounds.reduce(
    (acc, r) => ({
      people:    acc.people    + r.people_count,
      offline:   acc.offline   + r.offline_count,
      online:    acc.online    + r.online_count,
      vip:       acc.vip       + r.vip_count,
      guest:     acc.guest     + r.guest_count,
      parkStaff: acc.parkStaff + r.park_staff_count,
      paid:      acc.paid      + r.paid_amount,
      total:     acc.total     + r.total_amount,
    }),
    { people: 0, offline: 0, online: 0, vip: 0, guest: 0, parkStaff: 0, paid: 0, total: 0 },
  );

  return {
    rounds,
    totals,
    activeXreport,
    isLoading: roundsQ.isLoading || reportsQ.isLoading,
    isError:   roundsQ.isError   || reportsQ.isError,
  };
}
