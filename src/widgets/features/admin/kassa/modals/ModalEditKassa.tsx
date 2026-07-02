import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { updateCashbox } from "../api/apiKassa";
import type { Cashbox, UpdateCashboxPayload } from "../types";
import { CashboxStatusLabel, CashboxStatusTypes } from "@/const/constData";

interface Props {
  open: boolean;
  onClose: () => void;
  kassa: Cashbox | null;
}

interface FormValues {
  name: string;
  place: string;
  status: string;
  device: string;
  description: string;
}

const STATUS_OPTIONS = Object.values(CashboxStatusTypes).map((v) => ({
  label: CashboxStatusLabel[v],
  value: v,
}));

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Xatolik yuz berdi. Qayta urinib ko'ring.";
}

export function ModalEditKassa({ open, onClose, kassa }: Props) {
  const qc = useQueryClient();

  const updateMut = useMutation({
    mutationFn: (payload: UpdateCashboxPayload) =>
      updateCashbox(kassa!.id, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cashboxes"] });
      qc.invalidateQueries({ queryKey: ["cashbox-stats"] });
    },
  });

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: "", place: "", status: "", device: "", description: "" },
  });

  useEffect(() => {
    if (open && kassa) {
      reset({
        name: kassa.name,
        place: kassa.place,
        status: kassa.status,
        device: kassa.device != null ? String(kassa.device) : "",
        description: kassa.description ?? "",
      });
      updateMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, kassa?.id]);

  if (!kassa) return null;

  function onSubmit(data: FormValues) {
    const payload: UpdateCashboxPayload = {};

    if (data.name.trim() !== kassa!.name) payload.name = data.name.trim();
    if (data.place.trim() !== kassa!.place) payload.place = data.place.trim();
    if (data.status !== kassa!.status) payload.status = data.status as UpdateCashboxPayload["status"];
    if (data.device.trim() !== String(kassa!.device ?? "")) payload.device = data.device.trim() || undefined;
    const newNote = data.description.trim() || null;
    if (newNote !== (kassa!.description ?? null)) payload.description = newNote;

    if (Object.keys(payload).length === 0) {
      onClose();
      return;
    }

    updateMut.mutate(payload, { onSuccess: onClose });
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Kassani tahrirlash"
      size="md"
      placement="end"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <CusButton
            variant="outline"
            size="sm"
            isDisabled={updateMut.isPending}
            onClick={onClose}
          >
            Bekor qilish
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="orange"
            isLoading={updateMut.isPending}
            loadingText="Saqlanmoqda..."
            onClick={handleSubmit(onSubmit)}
          >
            Saqlash
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {updateMut.error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LuCircleAlert size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(updateMut.error)}
            </span>
          </div>
        )}

        <Controller
          control={control}
          name="name"
          rules={{
            required: "Majburiy maydon",
            minLength: { value: 2, message: "Minimum 2 ta belgi" },
          }}
          render={({ field, fieldState }) => (
            <CusInput
              ref={field.ref}
              label="Kassa nomi"
              isRequired
              placeholder="Bosh kassa"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="place"
          rules={{ required: "Majburiy maydon" }}
          render={({ field, fieldState }) => (
            <CusInput
              ref={field.ref}
              label="Joylashuvi"
              isRequired
              placeholder="1-qavat, kirish"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="device"
          render={({ field, fieldState }) => (
            <CusInput
              ref={field.ref}
              label="Device ID"
              placeholder="abc123"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorText={fieldState.error?.message}
            />
          )}
        />

        <div>
          <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>
            Status
          </p>
          <Controller
            control={control}
            name="status"
            rules={{ required: "Statusni tanlang" }}
            render={({ field }) => (
              <CusSelect
                options={STATUS_OPTIONS}
                placeholder="Status tanlang"
                value={field.value}
                onChange={field.onChange}
              />
            )}
          />
        </div>

        <Controller
          control={control}
          name="description"
          render={({ field, fieldState }) => (
            <CusTextArea
              ref={field.ref}
              label="Izoh"
              placeholder="Qo'shimcha ma'lumot..."
              rows={3}
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              errorText={fieldState.error?.message}
            />
          )}
        />
      </div>
    </CusDrawer>
  );
}
