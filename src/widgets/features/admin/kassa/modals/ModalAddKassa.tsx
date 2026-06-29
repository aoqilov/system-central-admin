import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { LuCircleAlert } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { createCashbox } from "../api/apiKassa";
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
  return (
    e?.response?.data?.message ?? "Xatolik yuz berdi. Qayta urinib ko'ring."
  );
}

export function ModalAddKassa({ open, onClose }: Props) {
  const qc = useQueryClient();

  const createMut = useMutation({
    mutationFn: (payload: CreateCashboxPayload) => createCashbox(payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["cashboxes"] });
      qc.invalidateQueries({ queryKey: ["cashbox-stats"] });
    },
  });

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
      title="Yangi kassa qo'shish"
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
            Bekor qilish
          </CusButton>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            isLoading={createMut.isPending}
            loadingText="Saqlanmoqda..."
            onClick={handleSubmit(onSubmit)}
          >
            Saqlash
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
            <LuCircleAlert
              size={15}
              style={{ color: "#ef4444", flexShrink: 0 }}
            />
            <span style={{ fontSize: 13, color: "#ef4444" }}>
              {getApiError(createMut.error)}
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
