import dayjs from "dayjs";
import PageHeader from "@/widgets/shared-ui/PageHeader";
import { IncomingStatCards } from "./components/IncomingStatCards";
import { IncomingSendBox } from "./components/IncomingSendBox";
import { IncomingTable } from "./components/IncomingTable";
import { UnconfirmedDatesBar } from "./components/UnconfirmedDatesBar";
import { SendToAccountingDialog } from "./modals/SendToAccountingDialog";
import { useApiRoleOpeMainIncoming } from "./hooks/useApiRoleOpeMainIncoming";

const TODAY = dayjs().format("YYYY-MM-DD");

export default function FeatureOpeMainIncoming() {
  const {
    selectedDate,
    setSelectedDate,
    isViewingToday,
    unconfirmedDates,
    rows,
    isLoading,
    isError,
    sendDialog,
    setSendDialog,
    sentAt,
    sendLoading,
    totalRounds,
    totalRevenue,
    totalCards,
    handleConfirm,
    handleReopen,
    handleSend,
  } = useApiRoleOpeMainIncoming();

  const displayDate = dayjs(selectedDate).format("DD.MM.YYYY");

  if (isLoading) return (
    <div className="p-4 desktop:p-6">
      <p className="text-sm" style={{ color: "var(--text-muted)" }}>Загрузка...</p>
    </div>
  );

  if (isError) return (
    <div className="p-4 desktop:p-6">
      <p className="text-sm" style={{ color: "#ef4444" }}>Ошибка загрузки данных</p>
    </div>
  );

  return (
    <>
      <div className="p-4 desktop:p-6 space-y-4 pb-8">
        <div className="flex flex-col gap-3 tablet:flex-row tablet:items-start tablet:justify-between">
          <PageHeader
            title="Ежедневный отчёт"
            highlight="операторов"
            subtitle={
              isViewingToday
                ? `${displayDate} — все привлечения`
                : `${displayDate} — просмотр прошлого отчёта`
            }
          />
        </div>

        <UnconfirmedDatesBar
          dates={unconfirmedDates}
          selectedDate={selectedDate}
          todayStr={TODAY}
          onSelect={setSelectedDate}
        />

        <IncomingStatCards
          totalRounds={totalRounds}
          totalCards={totalCards}
          totalRevenue={totalRevenue}
        />

        <IncomingSendBox
          sentAt={sentAt}
          attractionCount={rows.length}
          totalRounds={totalRounds}
          totalCards={totalCards.jami}
          totalRevenue={totalRevenue}
          onSend={() => setSendDialog(true)}
        />

        <IncomingTable rows={rows} onConfirm={handleConfirm} onReopen={handleReopen} />
      </div>

      <SendToAccountingDialog
        open={sendDialog}
        date={displayDate}
        attractionCount={rows.length}
        totalRounds={totalRounds}
        totalCards={totalCards.jami}
        totalRevenue={totalRevenue}
        onClose={() => setSendDialog(false)}
        onConfirm={handleSend}
        loading={sendLoading}
      />
    </>
  );
}
