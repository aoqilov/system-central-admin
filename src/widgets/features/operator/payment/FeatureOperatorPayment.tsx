import { useState, useRef } from "react";
import { useRounds } from "../../../../hooks/useRounds";
import { MOCK, callPaymentApi } from "./api/paymentApi";
import { type RoundOrder, type DialogState } from "./types";
import { NfcZone } from "./components/NfcZone";
import { RoundTable } from "./components/RoundTable";
import { PaymentDialog } from "./modals/PaymentDialog";

export default function FeatureOperatorPayment() {
  const { addRound, rounds } = useRounds();

  const [roundOrders, setRoundOrders] = useState<RoundOrder[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogState, setDialogState] = useState<DialogState>("loading");
  const [dialogMessage, setDialogMessage] = useState("");
  const [dialogAmount, setDialogAmount] = useState<number | undefined>();
  const [dialogCardBalance, setDialogCardBalance] = useState<number | undefined>();
  const [focusTrigger, setFocusTrigger] = useState(0);

  const orderIdRef = useRef(`ord-${Date.now()}`);

  const usedSlots = roundOrders.length;
  const roundFull = usedSlots >= MOCK.maxSlots;

  function closeDialog() {
    setDialogOpen(false);
    setFocusTrigger((n) => n + 1);
  }

  async function handleNfc(nfcId: string) {
    if (roundFull) return;
    setDialogState("loading");
    setDialogMessage("");
    setDialogAmount(undefined);
    setDialogCardBalance(undefined);
    setDialogOpen(true);

    try {
      const res = await callPaymentApi(nfcId, MOCK.price, orderIdRef.current);
      if (res.success) {
        setDialogState("success");
        setDialogMessage(res.message);
        setDialogAmount(res.amount);
        setRoundOrders((prev) => [
          ...prev,
          {
            id: `o-${Date.now()}`,
            nfcId,
            amount: res.amount ?? MOCK.price,
            paymentMethod: res.paymentMethod ?? "karta",
          },
        ]);
      } else {
        setDialogState("insufficient");
        setDialogMessage(res.message);
        setDialogCardBalance(res.cardBalance);
      }
    } catch {
      setDialogState("error");
      setDialogMessage("Server xatosi. Qayta urinib ko'ring.");
    }
  }

  function handleGo() {
    if (roundOrders.length === 0) return;
    addRound({
      paymentType: "card",
      peopleCount: usedSlots,
      totalAmount: roundOrders.reduce((s, o) => s + o.amount, 0),
      attractionName: MOCK.attractionName,
    });
    setRoundOrders([]);
    orderIdRef.current = `ord-${Date.now()}`;
  }

  return (
    <>
      <div className="p-4 desktop:p-6">
        <div className="grid grid-cols-1 desktop:grid-cols-2 gap-4 items-start">
          <NfcZone
            roundFull={roundFull}
            dialogOpen={dialogOpen}
            focusTrigger={focusTrigger}
            onSubmit={handleNfc}
          />
          <RoundTable
            roundOrders={roundOrders}
            roundCount={rounds.length + 1}
            maxSlots={MOCK.maxSlots}
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
