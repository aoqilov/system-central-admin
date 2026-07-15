import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusTextArea } from "@/components/ui/inputs/CusTextArea";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import { useCreateAttraction } from "../hooks/useApiAttractions";

interface Props {
  open: boolean;
  onClose: () => void;
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
  description: string;
  main_file: File | null;
  dashboard_file: File | null;
  files: File[];
}

const DEFAULT_VALUES: FormValues = {
  name: "",
  manufacturer: "",
  price: "",
  duration: "",
  seats: "",
  age_limit: "",
  min_height: "",
  max_weight: "",
  description: "",
  main_file: null,
  dashboard_file: null,
  files: [],
};

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Произошла ошибка. Попробуйте снова.";
}

export default function ModalAddAttraction({ open, onClose }: Props) {
  const createMut = useCreateAttraction();

  const { control, handleSubmit, reset } = useForm<FormValues>({
    defaultValues: DEFAULT_VALUES,
  });

  useEffect(() => {
    if (open) {
      reset(DEFAULT_VALUES);
      createMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FormValues) {
    try {
      await createMut.mutateAsync({
        fields: {
          name: data.name.trim(),
          manufacturer: data.manufacturer.trim(),
          price: Number(data.price),
          duration: Number(data.duration),
          seats: Number(data.seats),
          age_limit: Number(data.age_limit),
          min_height: Number(data.min_height),
          max_weight: Number(data.max_weight),
          description: data.description.trim() || undefined,
        },
        main_file: data.main_file,
        dashboard_file: data.dashboard_file,
        files: data.files,
      });
      onClose();
    } catch {
      // ошибка отображается через createMut.error
    }
  }

  const isPending = createMut.isPending;

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Добавить аттракцион"
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
            colorPalette="blue"
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

        <Section title="Фотографии">
          <Row2>
            <Controller
              control={control}
              name="main_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Основное фото"
                  sublabel="Отображается на сайте и в дашборде"
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 5 МБ"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
            <Controller
              control={control}
              name="dashboard_file"
              render={({ field, fieldState }) => (
                <CusFileUpload
                  label="Фото для карта"
                  sublabel="Отображается в карта"
                  accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                  maxFiles={1}
                  maxFileSize={10 * 1024 * 1024}
                  helperText="JPG, PNG, WEBP · Max 5 МБ"
                  errorText={fieldState.error?.message}
                  onFileChange={(files) => field.onChange(files[0] ?? null)}
                />
              )}
            />
          </Row2>
          <Controller
            control={control}
            name="files"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Галерея"
                sublabel="Можно добавить до 4 фотографий"
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

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
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
    <p
      style={{
        fontSize: 13,
        fontWeight: 500,
        color: "var(--text-2)",
        marginBottom: 6,
      }}
    >
      {text}
      {required && <span style={{ color: "#ef4444", marginLeft: 3 }}>*</span>}
    </p>
  );
}

function ErrorText({ text }: { text: string }) {
  return <p style={{ fontSize: 12, color: "#ef4444", marginTop: 4 }}>{text}</p>;
}
