import { useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { LuCreditCard } from "react-icons/lu";

interface VozvratKartaModalProps {
  open: boolean;
  onClose: () => void;
}

const REASONS = ["Сломана", "Не читается", "Другое"];

function formatCard(raw: string) {
  if (raw.length <= 3) return raw;
  if (raw.length <= 6) return raw.slice(0, 3) + " " + raw.slice(3);
  return raw.slice(0, 3) + " " + raw.slice(3, 6) + " " + raw.slice(6);
}

export function VozvratKartaModal({ open, onClose }: VozvratKartaModalProps) {
  const [cardNumber, setCardNumber] = useState("");
  const [reason, setReason] = useState("Сломана");
  const [cardError, setCardError] = useState("");

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value.replace(/\D/g, "").slice(0, 9);
    setCardNumber(raw);
    if (cardError) setCardError("");
  };

  const handleSubmit = () => {
    if (cardNumber.length !== 9) {
      setCardError("Введите 9 цифр карты");
      return;
    }
    handleClose();
  };

  const handleClose = () => {
    setCardNumber("");
    setReason("Сломана");
    setCardError("");
    onClose();
  };

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Возврат карта"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" onClick={handleClose}>
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton colorPalette="blue" onClick={handleSubmit}>
            Подтвердить
          </CusButton>
        </>
      }
    >
      <div className="flex flex-col gap-4">
        <CusInput
          label="Номер карты"
          isRequired
          placeholder="000 000 000"
          value={formatCard(cardNumber)}
          onChange={handleCardChange}
          errorText={cardError}
          inputMode="numeric"
          leftElement={<LuCreditCard size={14} />}
          helperText="9 введенных цифр карты"
        />

        <div className="flex flex-col gap-2">
          <p className="text-sm font-medium" style={{ color: "var(--text-3)" }}>
            Причина
          </p>
          <div className="grid grid-cols-4 gap-2">
            {REASONS.map((r) => {
              const selected = reason === r;
              return (
                <button
                  key={r}
                  type="button"
                  onClick={() => setReason(selected ? "" : r)}
                  className="px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all duration-100"
                  style={{
                    background: selected ? "#3b82f6" : "var(--bg-input)",
                    border: `1px solid ${selected ? "#3b82f6" : "var(--border-default)"}`,
                    color: selected ? "#fff" : "var(--text-2)",
                  }}
                >
                  {r}
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </CusDialog>
  );
}
