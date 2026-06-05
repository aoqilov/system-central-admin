import { useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuQrCode } from "react-icons/lu";
import { CusDialog } from "../../../components/ui/dialog/CusDialog";
import { CusButton } from "../../../components/ui/buttons/CusButton";
import { CusInput } from "../../../components/ui/inputs/CusInput";
import type { GenerateQrBatchDto } from "../qr.types";

interface Props {
  open: boolean;
  onClose: () => void;
  onGenerate: (dto: GenerateQrBatchDto) => Promise<void>;
}

const DEFAULT_COUNT = 100;

export function GenerateBatchDialog({ open, onClose, onGenerate }: Props) {
  const [partia,   setPartia]   = useState("");
  const [countStr, setCountStr] = useState(String(DEFAULT_COUNT));
  const [loading,  setLoading]  = useState(false);
  const [errors,   setErrors]   = useState<{ partia?: string; count?: string }>({});

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!partia.trim()) errs.partia = "Partiya nomi bo'sh bo'lmasin";
    const n = Number(countStr);
    if (!Number.isInteger(n) || n < 1 || n > 500)
      errs.count = "1 dan 500 gacha son kiriting";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  async function handleSubmit() {
    if (!validate()) return;
    setLoading(true);
    try {
      await onGenerate({ partia: partia.trim(), count: Number(countStr) });
      resetForm();
      onClose();
    } finally {
      setLoading(false);
    }
  }

  function resetForm() {
    setPartia("");
    setCountStr(String(DEFAULT_COUNT));
    setErrors({});
  }

  function handleClose() {
    if (loading) return;
    resetForm();
    onClose();
  }

  const isDisabled = !partia.trim() || loading;

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Yangi partiya yaratish"
      description="Kerakli soni va nom kiriting. Barcha kodlar 'Faolsiz' holatida yaratiladi."
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" colorPalette="gray" onClick={handleClose}>
              Bekor qilish
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            leftIcon={<LuQrCode size={14} />}
            isLoading={loading}
            isDisabled={isDisabled}
            onClick={handleSubmit}
          >
            Generatsiya
          </CusButton>
        </>
      }
    >
      <div className="space-y-4">
        <CusInput
          label="Partiya nomi"
          placeholder="masalan: Shanba kuni, A seriyasi..."
          value={partia}
          onChange={(e) => {
            setPartia(e.target.value);
            if (errors.partia) setErrors((p) => ({ ...p, partia: undefined }));
          }}
          errorText={errors.partia}
          disabled={loading}
        />
        <CusInput
          label="Kodlar soni (1 – 500)"
          type="number"
          placeholder="100"
          value={countStr}
          onChange={(e) => {
            setCountStr(e.target.value);
            if (errors.count) setErrors((p) => ({ ...p, count: undefined }));
          }}
          errorText={errors.count}
          disabled={loading}
        />
      </div>
    </CusDialog>
  );
}
