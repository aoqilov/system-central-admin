import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { useUpdateKassa } from "../hooks/useApiKassa";
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

const STATUS_OPTIONS = Object.values(CashboxStatusTypes)
  .filter((v) => v !== CashboxStatusTypes.ACTIVE)
  .map((v) => ({ label: CashboxStatusLabel[v], value: v }));

export function ModalEditKassa({ open, onClose, kassa }: Props) {
  const updateMut = useUpdateKassa(kassa?.id ?? 0);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: {
      name: "",
      place: "",
      status: "",
      device: "",
      description: "",
    },
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
    if (data.status !== kassa!.status)
      payload.status = data.status as UpdateCashboxPayload["status"];
    if (data.device.trim() !== String(kassa!.device ?? ""))
      payload.device = data.device.trim() || undefined;
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
      title="Редактировать кассу"
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
            Отмена
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="orange"
            isLoading={updateMut.isPending}
            loadingText="Сохранение..."
            onClick={handleSubmit(onSubmit)}
          >
            Сохранить
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        <Controller
          control={control}
          name="name"
          rules={{
            required: "Обязательное поле",
            minLength: { value: 2, message: "Минимум 2 символа" },
          }}
          render={({ field, fieldState }) => (
            <CusInput
              ref={field.ref}
              label="Название кассы"
              isRequired
              placeholder="Главная касса"
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
          rules={{ required: "Обязательное поле" }}
          render={({ field, fieldState }) => (
            <CusInput
              ref={field.ref}
              label="Расположение"
              isRequired
              placeholder="1-й этаж, вход"
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
          <Controller
            control={control}
            name="status"
            rules={{ required: "Выберите статус" }}
            render={({ field }) => (
              <CusSelect
                label="Статус"
                options={STATUS_OPTIONS.map((opt) => ({
                  label: opt.label,
                  value: opt.value,
                }))}
                placeholder="Выберите статус"
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
              label="Примечание"
              placeholder="Дополнительная информация..."
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
