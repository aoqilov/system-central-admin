import { useState, useMemo } from "react";
import dayjs from "dayjs";
import { CalendarDate } from "@internationalized/date";
import type { DateValue } from "@ark-ui/react/date-picker";
import { useQuery } from "@tanstack/react-query";
import { getAccountingAttractionReports } from "@/api/attraction-reports/attraction-reports.api";
import { exportToExcel } from "../for-print";
import type { AttractionRow, CardCounts } from "../types";

const today = dayjs();
const todayCalendar = new CalendarDate(today.year(), today.month() + 1, today.date());

function calToStr(v: DateValue): string {
  return `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`;
}

function calToDisplay(v: DateValue): string {
  return `${String(v.day).padStart(2, "0")}.${String(v.month).padStart(2, "0")}.${v.year}`;
}

export function useApiRoleOpeMainExport() {
  const [tab, setTab]               = useState("daily");
  const [selectedDay, setSelectedDay] = useState(today);
  const [dateFrom, setDateFrom]     = useState<DateValue[]>([todayCalendar]);
  const [dateTo, setDateTo]         = useState<DateValue[]>([todayCalendar]);

  const params = useMemo(() => {
    if (tab === "daily") return { date: selectedDay.format("YYYY-MM-DD") };
    if (!dateFrom[0] || !dateTo[0]) return null;
    return { start_date: calToStr(dateFrom[0]), end_date: calToStr(dateTo[0]) };
  }, [tab, selectedDay, dateFrom, dateTo]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ["ope-main-export", params],
    queryFn:  () => getAccountingAttractionReports(params!),
    enabled:  !!params,
  });

  const rows: AttractionRow[] = useMemo(() => {
    if (!data) return [];
    return data.attractions.map(({ attraction, zreport }) => ({
      id:         attraction.id,
      name:       attraction.name,
      price:      attraction.price,
      roundCount: zreport.total_rounds,
      cards: {
        jami:         zreport.total_people,
        asosiy:       zreport.total_offline,
        online:       zreport.total_online,
        vip:          zreport.total_vip,
        organization: zreport.total_organization,
      } satisfies CardCounts,
      paid:  zreport.paid_amount,
      total: zreport.total_amount,
    }));
  }, [data]);

  const totalRounds  = data?.totals.total_rounds  ?? 0;
  const totalRevenue = data?.totals.total_amount  ?? 0;
  const totalCards: CardCounts = {
    jami:         data?.totals.total_people       ?? 0,
    asosiy:       data?.totals.total_offline      ?? 0,
    online:       data?.totals.total_online       ?? 0,
    vip:          data?.totals.total_vip          ?? 0,
    organization: data?.totals.total_organization ?? 0,
  };

  const subtitle = tab === "daily"
    ? `${selectedDay.format("DD.MM.YYYY")} — все привлечения`
    : dateFrom[0] && dateTo[0]
      ? `${calToDisplay(dateFrom[0])} — ${calToDisplay(dateTo[0])}`
      : "Выберите период";

  function handleFromChange({ value }: { value: DateValue[] }) {
    setDateFrom(value);
    if (value[0] && dateTo[0] && value[0].compare(dateTo[0]) > 0) setDateTo(value);
  }

  function handleToChange({ value }: { value: DateValue[] }) {
    setDateTo(value);
    if (value[0] && dateFrom[0] && value[0].compare(dateFrom[0]) < 0) setDateFrom(value);
  }

  function handleExport() {
    const filename = tab === "daily"
      ? `operator-export-${selectedDay.format("YYYY-MM-DD")}.xlsx`
      : `operator-export-${params && "start_date" in params ? params.start_date : ""}_${params && "end_date" in params ? params.end_date : ""}.xlsx`;
    exportToExcel({ rows, filename });
  }

  return {
    today,
    tab,
    setTab,
    selectedDay,
    setSelectedDay,
    dateFrom,
    dateTo,
    subtitle,
    rows,
    isLoading,
    isError,
    totalRounds,
    totalRevenue,
    totalCards,
    handleFromChange,
    handleToChange,
    handleExport,
  };
}
