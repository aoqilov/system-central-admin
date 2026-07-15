import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import { getFileUrl } from "@/api/files/files.api";
import { useUpdateAttraction } from "../hooks/useApiAttractions";
import type { Attraction } from "../types";
import type { AttractionStatus } from "@/types/attraction.types";

const STATUS_OPTIONS = [
  { label: "Неактивный", value: "inactive" },
  { label: "Техобслуживание", value: "maintenance" },
  { label: "Закрыт", value: "closed" },
];

interface Props {
  open: boolean;
  onClose: () => void;
  attraction: Attraction;
}

interface FormValues {
  name: string;
  manufacturer: string;
  price: string;
  duration: string;
  seats: string;
  age_limit: string;
  min_height: string;
  max_weight: string;
  device: string;
  description: string;
  status: AttractionStatus;
  new_main_file: File | null;
  new_dashboard_file: File | null;
  new_files: File[];
}

function toFormValues(a: Attraction): FormValues {
  return {
    name: a.name,
    manufacturer: a.manufacturer,
    price: String(a.price),
    duration: String(a.duration),
    seats: String(a.seats),
    age_limit: String(a.age_limit),
    min_height: String(a.min_height),
    max_weight: String(a.max_weight),
    device: a.device ? String(a.device) : "",
    description: a.description ?? "",
    status: a.status as AttractionStatus,
    new_main_file: null,
    new_dashboard_file: null,
    new_files: [],
  };
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Произошла ошибка. Попробуйте снова.";
}

export default function ModalEditAttraction({ open, onClose, attraction }: Props) {
  const [remainingFileIds, setRemainingFileIds] = useState<number[]>(
    attraction.files ?? []
  );

  const updateMut = useUpdateAttraction(attraction.id);

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: toFormValues(attraction),
  });

  useEffect(() => {
    if (open) {
      reset(toFormValues(attraction));
      updateMut.reset();
      setRemainingFileIds(attraction.files ?? []);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FormValues) {
    try {
      await updateMut.mutateAsync({
        fields: {
          name: data.name.trim(),
          manufacturer: data.manufacturer.trim(),
          price: Number(data.price),
          duration: Number(data.duration),
          seats: Number(data.seats),
          age_limit: Number(data.age_limit),
          min_height: Number(data.min_height),
          max_weight: Number(data.max_weight),
          device: data.device ? Number(data.device) : undefined,
          description: data.description.trim() || undefined,
          status: data.status,
        },
        existingMainFile: attraction.main_file,
        existingDashboardFile: attraction.dashboard_file,
        remainingFileIds,
        new_main_file: data.new_main_file,
        new_dashboard_file: data.new_dashboard_file,
        new_files: data.new_files,
      });
      onClose();
    } catch {
      // ошибка отображается через updateMut.error
    }
  }

  const isPending = updateMut.isPending;

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Редактировать аттракцион"
      size="xl"
      placement="end"
      footer={
        <div className="flex gap-2 justify-end w-full">
          <Drawer.ActionTrigger asChild>
            <CusButton variant="outline" size="sm" isDisabled={isPending}>
              Отмена
            </CusButton>
          </Drawer.ActionTrigger>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="orange"
            isLoading={isPending}
            loadingText="Сохранение..."
            onClick={handleSubmit(onSubmit)}
          >
            Сохранить
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

        <Section title="Фотографии">
          <Row2>
            <Controller
              control={control}
              name="new_main_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Основное фото"
                  sublabel={
                    attraction.main_file
                      ? "Новое фото заменит текущее"
                      : "Отображается на сайте и в дашборде"
                  }
                  currentImageUrl={
                    attraction.main_file ? getFileUrl(attraction.main_file) : undefined
                  }
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 10 МБ"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
            <Controller
              control={control}
              name="new_dashboard_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Фото для карта"
                  sublabel={
                    attraction.dashboard_file
                      ? "Новое фото заменит текущее"
                      : "Отображается в карта"
                  }
                  currentImageUrl={
                    attraction.dashboard_file
                      ? getFileUrl(attraction.dashboard_file)
                      : undefined
                  }
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 10 МБ"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
          </Row2>
          <Controller
            control={control}
            name="new_files"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Галерея"
                sublabel="Удалите текущие фото через ✕ или добавьте новые"
                currentImageUrls={
                  remainingFileIds.length > 0
                    ? remainingFileIds.map((id) => getFileUrl(id))
                    : undefined
                }
                onRemoveCurrentImageUrl={(i) =>
                  setRemainingFileIds((prev) => prev.filter((_, idx) => idx !== i))
                }
                accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                maxFiles={4}
                maxFileSize={10 * 1024 * 1024}
                helperText="JPG, PNG, WEBP · Max 10 МБ"
                errorText={fieldState.error?.message}
                onFileChange={(files) => field.onChange(files)}
              />
            )}
          />
        </Section>

        <Section title="Основная информация">
          <Row2>
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
                  label="Название"
                  isRequired
                  placeholder="Roller Coaster"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="manufacturer"
              rules={{ required: "Обязательное поле" }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Производитель"
                  isRequired
                  placeholder="Intamin"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
          <Row2>
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
          </Row2>
        </Section>

        <Section title="Технические данные">
          <Row2>
            <Controller
              control={control}
              name="price"
              rules={{
                required: "Обязательное поле",
                min: { value: 1, message: "Должно быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Цена (UZS)"
                  isRequired
                  placeholder="25000"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="duration"
              rules={{
                required: "Обязательное поле",
                min: { value: 1, message: "Должно быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Длительность (мин)"
                  isRequired
                  placeholder="5"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
          <Row2>
            <Controller
              control={control}
              name="seats"
              rules={{
                required: "Обязательное поле",
                min: { value: 1, message: "Должно быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Количество мест"
                  isRequired
                  placeholder="24"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
        </Section>

        <Section title="Ограничения">
          <Row2>
            <Controller
              control={control}
              name="age_limit"
              rules={{
                required: "Обязательное поле",
                min: { value: 0, message: "0 или больше" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Минимальный возраст"
                  isRequired
                  placeholder="12"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
            <Controller
              control={control}
              name="min_height"
              rules={{
                required: "Обязательное поле",
                min: { value: 1, message: "Должно быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Минимальный рост (см)"
                  isRequired
                  placeholder="120"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
          <Row2>
            <Controller
              control={control}
              name="max_weight"
              rules={{
                required: "Обязательное поле",
                min: { value: 1, message: "Должно быть больше 0" },
              }}
              render={({ field, fieldState }) => (
                <CusInput
                  ref={field.ref}
                  label="Максимальный вес (кг)"
                  isRequired
                  placeholder="100"
                  type="number"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  errorText={fieldState.error?.message}
                />
              )}
            />
          </Row2>
        </Section>

        <Section title="Дополнительно">
          <Controller
            control={control}
            name="status"
            rules={{ required: "Выберите статус" }}
            render={({ field, fieldState }) => (
              <div>
                <Label text="Статус" required />
                <CusSelect
                  options={STATUS_OPTIONS}
                  placeholder="Выберите статус"
                  value={field.value}
                  onChange={(v) => field.onChange(v)}
                />
                {fieldState.error && (
                  <ErrorText text={fieldState.error.message ?? ""} />
                )}
              </div>
            )}
          />
          <Controller
            control={control}
            name="description"
            render={({ field, fieldState }) => (
              <CusTextArea
                ref={field.ref}
                label="Описание"
                placeholder="Краткое описание аттракциона..."
                rows={3}
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                errorText={fieldState.error?.message}
              />
            )}
          />
        </Section>
      </div>
    </CusDrawer>
  );
}

// ─── Helper components ────────────────────────────────────────────────────────

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p
        style={{
          fontSize: 11,
          fontWeight: 600,
          letterSpacing: "0.06em",
          textTransform: "uppercase",
          color: "var(--text-muted)",
          marginBottom: 12,
        }}
      >
        {title}
      </p>
      <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
        {children}
      </div>
    </div>
  );
}

function Row2({ children }: { children: React.ReactNode }) {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
      {children}
    </div>
  );
}

function Label({ text, required }: { text: string; required?: boolean }) {
  return (
    <p style={{ fontSize: 13, fontWeight: 500, color: "var(--text-2)", marginBottom: 6 }}>
      {text}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </p>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{text}</p>;
}
