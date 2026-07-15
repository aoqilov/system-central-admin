import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { useCreateKassa } from "../hooks/useApiKassa";
import type { CreateCashboxPayload } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  name: string;
  place: string;
  description: string;
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Произошла ошибка. Попробуйте снова.";
}

export function ModalAddKassa({ open, onClose }: Props) {
  const createMut = useCreateKassa();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: { name: "", place: "", description: "" },
  });

  useEffect(() => {
    if (open) {
      reset({ name: "", place: "", description: "" });
      createMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  function onSubmit(data: FormValues) {
    const payload: CreateCashboxPayload = {
      name: data.name.trim(),
      place: data.place.trim(),
      ...(data.description.trim() ? { description: data.description.trim() } : {}),
    };
    createMut.mutate(payload, { onSuccess: onClose });
  }

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Добавить кассу"
      size="md"
      placement="end"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <CusButton
            variant="outline"
            size="sm"
            isDisabled={createMut.isPending}
            onClick={onClose}
          >
            Отмена
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            isLoading={createMut.isPending}
            loadingText="Сохранение..."
            onClick={handleSubmit(onSubmit)}
          >
            Сохранить
          </CusButton>
        </div>
      }
    >
      <div className="flex flex-col gap-5">
        {createMut.error && (
          <div
            className="flex items-center gap-2 px-3 py-2.5 rounded-lg"
            style={{
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.25)",
            }}
          >
            <LuCircleAlert size={15} style={{ color: "#ef4444", flexShrink: 0 }} />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(createMut.error)}
            </span>
          </div>
        )}

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
