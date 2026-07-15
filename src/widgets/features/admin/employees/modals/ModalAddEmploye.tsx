import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Drawer } from "@chakra-ui/react";
import { LuCircleAlert } from "react-icons/lu";
import { parseDate } from "@internationalized/date";
import { CusCalendar } from "@/components/ui/calendar/CusCalendar";
import { CusDrawer } from "@/components/ui/dialog/CusDrawer";
import { CusInput } from "@/components/ui/inputs/CusInput";
import { CusButton } from "@/components/ui/buttons/CusButton";
import CusSelect from "@/components/ui/select/CusSelect";
import { CusFileUpload } from "@/components/ui/inputs/CusFileUpload";
import { useCreateEmployee, useRoles } from "../hooks/useApiEmployees";
import { formatPhoneNumber } from "@/widgets/features/login/hooks/useApiLogin";

interface Props {
  open: boolean;
  onClose: () => void;
}

interface FormValues {
  firstname: string;
  lastname: string;
  date_of_birth: string;
  phone: string;
  telegram_username: string;
  password: string;
  role: string;
  salary: string;
  file: File | null;
}

function getApiError(err: unknown): string {
  const e = err as { response?: { data?: { message?: string } } };
  return e?.response?.data?.message ?? "Произошла ошибка. Попробуйте снова.";
}

export default function ModalAddEmploye({ open, onClose }: Props) {
  const { data: roles = [] } = useRoles();
  const createMut = useCreateEmployee();

  const {
    register,
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      firstname: "",
      lastname: "",
      date_of_birth: "",
      phone: "+998 ",
      telegram_username: "",
      password: "",
      role: "",
      salary: "",
      file: null,
    },
  });

  useEffect(() => {
    if (open) {
      reset();
      createMut.reset();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  async function onSubmit(data: FormValues) {
    createMut.mutate(
      {
        fields: {
          firstname: data.firstname.trim(),
          lastname: data.lastname.trim(),
          date_of_birth: data.date_of_birth,
          phone_number: data.phone.replace(/\s/g, ""),
          telegram_username: data.telegram_username.trim(),
          password: data.password,
          role: Number(data.role),
          salary: data.salary ? Number(data.salary) : null,
        },
        file: data.file,
      },
      { onSuccess: onClose },
    );
  }

  const roleOptions = roles.map((r) => ({
    label: r.name,
    value: String(r.id),
  }));

  return (
    <CusDrawer
      open={open}
      onClose={onClose}
      title="Новый сотрудник"
      size="xl"
      placement="end"
      footer={
        <div
          style={{
            display: "flex",
            gap: 8,
            justifyContent: "flex-end",
            width: "100%",
          }}
        >
          <Drawer.ActionTrigger asChild>
            <CusButton
              variant="outline"
              size="sm"
              isDisabled={createMut.isPending}
            >
              Отмена
            </CusButton>
          </Drawer.ActionTrigger>
          <CusButton
            size="sm"
            variant="solid"
            colorPalette="blue"
            onClick={handleSubmit(onSubmit)}
            isLoading={createMut.isPending}
            loadingText="Сохранение..."
          >
            Сохранить
          </CusButton>
        </div>
      }
    >
      <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
        {createMut.error && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "10px 14px",
              borderRadius: 8,
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

        <Section title="Личные данные">
          <Controller
            control={control}
            name="file"
            render={({ field, fieldState }) => (
              <CusFileUpload
                label="Фото сотрудника"
                accept={{ "image/*": [".jpg", ".jpeg", ".png", ".webp"] }}
                maxFileSize={5 * 1024 * 1024}
                errorText={fieldState.error?.message}
                onFileChange={(files) => field.onChange(files[0] ?? null)}
              />
            )}
          />
          <Row2>
            <CusInput
              label="Имя"
              isRequired
              placeholder="Иван"
              errorText={errors.firstname?.message}
              {...register("firstname", {
                required: "Обязательное поле",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
            />
            <CusInput
              label="Фамилия"
              isRequired
              placeholder="Иванов"
              errorText={errors.lastname?.message}
              {...register("lastname", {
                required: "Обязательное поле",
                minLength: { value: 2, message: "Минимум 2 символа" },
              })}
            />
          </Row2>
          <Controller
            control={control}
            name="date_of_birth"
            rules={{ required: "Укажите дату рождения" }}
            render={({ field, fieldState }) => (
              <CusCalendar
                label="Дата рождения"
                isRequired
                errorText={fieldState.error?.message}
                value={field.value ? [parseDate(field.value)] : undefined}
                onValueChange={({ value }) => {
                  const v = value[0];
                  field.onChange(
                    v
                      ? `${v.year}-${String(v.month).padStart(2, "0")}-${String(v.day).padStart(2, "0")}`
                      : ""
                  );
                }}
              />
            )}
          />
        </Section>

        <Section title="Контактная информация">
          <Controller
            control={control}
            name="phone"
            rules={{
              validate: (v) =>
                v.replace(/\s/g, "").length >= 13 ||
                "Введите полный номер (+998XXXXXXXXX)",
            }}
            render={({ field, fieldState }) => (
              <CusInput
                label="Телефон"
                isRequired
                placeholder="+998 90 000 00 00"
                value={field.value}
                onChange={(e) => {
                  const digits = e.target.value.replace(/\D/g, "");
                  const local = (
                    digits.startsWith("998") ? digits.slice(3) : digits
                  ).slice(0, 9);
                  field.onChange(formatPhoneNumber(local));
                }}
                errorText={fieldState.error?.message}
              />
            )}
          />
          <CusInput
            label="Telegram"
            placeholder="@username"
            {...register("telegram_username")}
          />
        </Section>

        <Section title="Доступ">
          <CusInput
            label="Пароль"
            isRequired
            type="password"
            placeholder="6 символов"
            maxLength={6}
            errorText={errors.password?.message}
            {...register("password", {
              required: "Обязательное поле",
              minLength: { value: 6, message: "Минимум 6 символов" },
              maxLength: { value: 6, message: "Максимум 6 символов" },
            })}
          />
        </Section>

        <Section title="Рабочие данные">
          <div>
            <Label text="Роль" required />
            <Controller
              control={control}
              name="role"
              rules={{ required: "Выберите роль" }}
              render={({ field, fieldState }) => (
                <>
                  <CusSelect
                    options={roleOptions}
                    placeholder="Выберите роль"
                    value={field.value}
                    onChange={field.onChange}
                  />
                  {fieldState.error && (
                    <ErrorText text={fieldState.error.message ?? ""} />
                  )}
                </>
              )}
            />
          </div>
          <CusInput
            label="Оклад (UZS)"
            placeholder="2 500 000"
            type="number"
            {...register("salary")}
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
