import { useEffect, useRef, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuBuilding2, LuFileSpreadsheet, LuUpload, LuX } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { uploadCards } from "../api/nfcOrgApi";

interface Props {
  open: boolean;
  onClose: () => void;
}

export function GenerateNfcDialog({ open, onClose }: Props) {
  const qc = useQueryClient();
  const [label, setLabel] = useState("");
  const [amount, setAmount] = useState("");
  const [errors, setErrors] = useState<{ label?: string; amount?: string; file?: string }>({});
  const [excelFile, setExcelFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const uploadMut = useMutation({
    mutationFn: ({ file, batchName, amount }: { file: File; batchName: string; amount: number }) =>
      uploadCards(file, batchName, amount),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["nfc-org-cards"] });
      void qc.invalidateQueries({ queryKey: ["nfc-org-cards-stats"] });
      reset();
      onClose();
    },
  });

  function validate(): boolean {
    const errs: typeof errors = {};
    if (!label.trim()) errs.label = "Название партии не может быть пустым";
    const parsed = Number(amount.replace(/\s/g, ""));
    if (!amount.trim() || isNaN(parsed) || parsed <= 0) errs.amount = "Укажите корректную сумму";
    if (!excelFile) errs.file = "Файл Excel не выбран";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSubmit() {
    if (!validate() || !excelFile) return;
    const parsed = Number(amount.replace(/\s/g, ""));
    uploadMut.mutate({ file: excelFile, batchName: label.trim(), amount: parsed });
  }

  function handleFileSelect(file: File | null) {
    if (!file) return;
    const ext = file.name.split(".").pop()?.toLowerCase();
    if (ext === "xlsx" || ext === "xls") {
      setExcelFile(file);
    }
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0] ?? null;
    handleFileSelect(file);
  }

  function reset() {
    setLabel("");
    setAmount("");
    setErrors({});
    setExcelFile(null);
    if (fileRef.current) fileRef.current.value = "";
  }

  useEffect(() => {
    if (open) reset();
  }, [open]);

  function handleClose() {
    if (uploadMut.isPending) return;
    reset();
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={handleClose}
      title="Добавить организационные карты"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton
              variant="outline"
              colorPalette="gray"
              onClick={handleClose}
            >
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="blue"
            leftIcon={<LuBuilding2 size={14} />}
            isLoading={uploadMut.isPending}
            isDisabled={!label.trim() || !amount.trim() || !excelFile || uploadMut.isPending}
            onClick={handleSubmit}
          >
            Загрузить
          </CusButton>
        </>
      }
    >
      <div className="space-y-4">
        <CusInput
          label="Название партии"
          placeholder="например: Корп-2026..."
          value={label}
          onChange={(e) => {
            setLabel(e.target.value);
            if (errors.label) setErrors((p) => ({ ...p, label: undefined }));
          }}
          errorText={errors.label}
          disabled={uploadMut.isPending}
        />

        <CusInput
          label="Сумма (сўм)"
          placeholder="например: 500 000"
          value={amount}
          onChange={(e) => {
            const raw = e.target.value.replace(/[^\d]/g, "");
            const formatted = raw ? Number(raw).toLocaleString("ru-RU") : "";
            setAmount(formatted);
            if (errors.amount) setErrors((p) => ({ ...p, amount: undefined }));
          }}
          errorText={errors.amount}
          disabled={uploadMut.isPending}
        />

        <div>
          <input
            ref={fileRef}
            type="file"
            accept=".xlsx,.xls"
            className="hidden"
            onChange={(e) => handleFileSelect(e.target.files?.[0] ?? null)}
          />

          {excelFile ? (
            <div
              className="flex items-center gap-3 px-4 py-3 rounded-xl"
              style={{
                background: "var(--bg-hover)",
                border: "1px solid var(--border-default)",
              }}
            >
              <LuFileSpreadsheet
                size={20}
                style={{ color: "#22c55e", flexShrink: 0 }}
              />
              <span
                className="text-sm flex-1 truncate font-medium"
                style={{ color: "var(--text-default)" }}
              >
                {excelFile.name}
              </span>
              <button
                onClick={() => {
                  setExcelFile(null);
                  if (fileRef.current) fileRef.current.value = "";
                }}
                className="shrink-0 p-1 rounded"
                style={{ color: "var(--text-muted)" }}
              >
                <LuX size={14} />
              </button>
            </div>
          ) : (
            <div
              className="flex flex-col items-center gap-2 py-6 rounded-xl cursor-pointer transition-colors"
              style={{
                border: `1.5px dashed ${isDragging ? "var(--border-2)" : "var(--border-default)"}`,
                background: isDragging ? "var(--bg-hover)" : "transparent",
              }}
              onClick={() => fileRef.current?.click()}
              onDragOver={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragLeave={() => setIsDragging(false)}
              onDrop={handleDrop}
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ background: "var(--bg-hover)" }}
              >
                <LuUpload size={18} style={{ color: "var(--text-dim)" }} />
              </div>
              <div className="text-center">
                <p
                  className="text-sm font-medium"
                  style={{ color: "var(--text-default)" }}
                >
                  Загрузите файл Excel
                </p>
                <p
                  className="text-xs mt-0.5"
                  style={{ color: "var(--text-muted)" }}
                >
                  .xlsx или .xls — нажмите или перетащите файл
                </p>
              </div>
              <CusButton
                size="sm"
                variant="outline"
                colorPalette="gray"
                leftIcon={<LuFileSpreadsheet size={13} />}
              >
                Выбрать файл
              </CusButton>
            </div>
          )}
          {errors.file && (
            <p className="text-xs mt-1.5" style={{ color: "#ef4444" }}>
              {errors.file}
            </p>
          )}
        </div>
      </div>
    </CusDialog>
  );
}
