import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useOperatorAttraction } from "../hooks/useOperatorAttraction";
import { payWithNFC, getCurrentRound, closeRound } from "./api/paymentApi";
import { getTodayRounds } from "@/widgets/features/operator/home/api/apiOperatorHome";
import { type DialogState } from "./types";
import { NfcZone } from "./components/NfcZone";
import { RoundTable } from "./components/RoundTable";
import { PaymentDialog } from "./modals/PaymentDialog";

export default function FeatureOperatorPayment() {
  const { attraction } = useOperatorAttraction();

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("loading");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAmount, setDialogAmount] = useState<number | undefined>();
  const [dialogCardBalance, setDialogCardBalance] = useState<number | undefined>();
  const [focusTrigger, setFocusTrigger] = useState(0);
  const [goLoading, setGoLoading] = useState(false);

  const orderIdRef = useRef(`ord-${Date.now()}`);
  const qc = useQueryClient();

  const ROUNDS_KEY = ["operator-rounds", attraction?.id ?? 0];
  const CURRENT_ROUND_KEY = ["operator-current-round", attraction?.id ?? 0];

  const { data: roundsData } = useQuery({
    queryKey: ROUNDS_KEY,
    queryFn: () => getTodayRounds(attraction!.id),
    enabled: !!attraction,
  });

  const { data: currentRound } = useQuery({
    queryKey: CURRENT_ROUND_KEY,
    queryFn: () => getCurrentRound(attraction!.id),
    enabled: !!attraction,
    refetchInterval: 5000,
  });

  const allRounds = roundsData?.data["attraction-rounds"] ?? [];
  const maxRoundNum =
    allRounds.length > 0
      ? Math.max(...allRounds.map((r) => r.round_number))
      : 0;
  const displayRoundNum = currentRound
    ? currentRound.round_number
    : maxRoundNum + 1;

  const transactions = currentRound?.transactions ?? [];
  const peopleCount = currentRound?.people_count ?? 0;
  const totalAmount = currentRound?.paid_amount ?? 0;
  const maxSlots = attraction?.seats ?? 8;
  const roundFull = peopleCount >= maxSlots;

  const ERROR_MESSAGES: Record<string, string> = {
    "Not enough balance!": "Balansingizda pul yetarli emas",
    "Round is full. Press GO first!": "Round to'lgan. Avval GO tugmasini bosing!",
  };

  function closeDialog() {
    setDialogOpen(false);
    setFocusTrigger((n) => n + 1);
  }

  async function handleNfc(nfcId: string) {
    if (roundFull || !attraction) return;
    setDialogState("loading");
    setDialogMessage("");
    setDialogAmount(undefined);
    setDialogCardBalance(undefined);
    setDialogOpen(true);

    try {
      const res = await payWithNFC({ nfc: nfcId, attractionID: attraction.id });
      const { paid, message, transaction } = res.data.payment;

      if (paid && transaction) {
        setDialogState("success");
        setDialogMessage(message);
        setDialogAmount(transaction.amount);
        void qc.invalidateQueries({ queryKey: CURRENT_ROUND_KEY });
        orderIdRef.current = `ord-${Date.now()}`;
        setTimeout(closeDialog, 1000);
      } else {
        setDialogState("insufficient");
        setDialogMessage(ERROR_MESSAGES[message] ?? message);
        setDialogCardBalance(transaction?.balance_after);
      }
    } catch {
      setDialogState("error");
      setDialogMessage("Server xatosi. Qayta urinib ko'ring.");
    }
  }

  async function handleGo() {
    if (transactions.length === 0 || !attraction || goLoading) return;
    setGoLoading(true);
    try {
      const round = await getCurrentRound(attraction.id);
      if (round) await closeRound(attraction.id, round.id);
      await qc.invalidateQueries({ queryKey: ROUNDS_KEY });
      await qc.invalidateQueries({ queryKey: CURRENT_ROUND_KEY });
    } finally {
      setGoLoading(false);
    }
  }

  return (
    <>
      <div className="p-4 desktop:p-6">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 items-start">
          <NfcZone
            roundFull={roundFull}
            dialogOpen={dialogOpen}
            focusTrigger={focusTrigger}
            price={attraction?.price ?? 0}
            maxSlots={maxSlots}
            onSubmit={handleNfc}
          />
          <RoundTable
            transactions={transactions}
            peopleCount={peopleCount}
            totalAmount={totalAmount}
            roundCount={displayRoundNum}
            maxSlots={maxSlots}
            goLoading={goLoading}
            onGo={handleGo}
          />
        </div>
      </div>

      <PaymentDialog
        open={dialogOpen}
        state={dialogState}
        message={dialogMessage}
        amount={dialogAmount}
        cardBalance={dialogCardBalance}
        onClose={closeDialog}
      />
    </>
  );
}
