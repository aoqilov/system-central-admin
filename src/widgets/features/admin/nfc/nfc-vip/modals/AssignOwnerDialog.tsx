import { useEffect, useState } from "react";
import { Dialog } from "@chakra-ui/react";
import { LuUserCheck } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { CusInput } from "@/components/ui/inputs/CusInput";

export interface OwnerInfo {
  firstName: string;
  lastName: string;
  phone: string;
}

interface Props {
  open: boolean;
  onClose: () => void;
  onSave: (info: OwnerInfo) => void;
  initial?: OwnerInfo;
}

export function AssignOwnerDialog({ open, onClose, onSave, initial }: Props) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [errors, setErrors] = useState<Partial<OwnerInfo>>({});

  useEffect(() => {
    if (open) {
      setFirstName(initial?.firstName ?? "");
      setLastName(initial?.lastName ?? "");
      setPhone(initial?.phone ?? "");
      setErrors({});
    }
  }, [open]);

  function validate(): boolean {
    const errs: Partial<OwnerInfo> = {};
    if (!firstName.trim()) errs.firstName = "Обязательное поле";
    if (!lastName.trim()) errs.lastName = "Обязательное поле";
    if (!phone.trim()) errs.phone = "Обязательное поле";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  }

  function handleSave() {
    if (!validate()) return;
    onSave({ firstName: firstName.trim(), lastName: lastName.trim(), phone: phone.trim() });
    onClose();
  }

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Назначить владельца"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" colorPalette="gray" onClick={onClose}>
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="green"
            leftIcon={<LuUserCheck size={14} />}
            onClick={handleSave}
          >
            Сохранить
          </CusButton>
        </>
      }
    >
      <div className="space-y-3">
        <CusInput
          label="Имя"
          placeholder="например: Иван"
          value={firstName}
          onChange={(e) => { setFirstName(e.target.value); setErrors((p) => ({ ...p, firstName: undefined })); }}
          errorText={errors.firstName}
        />
        <CusInput
          label="Фамилия"
          placeholder="например: Иванов"
          value={lastName}
          onChange={(e) => { setLastName(e.target.value); setErrors((p) => ({ ...p, lastName: undefined })); }}
          errorText={errors.lastName}
        />
        <CusInput
          label="Номер телефона"
          placeholder="+998 XX XXX XX XX"
          value={phone}
          onChange={(e) => { setPhone(e.target.value); setErrors((p) => ({ ...p, phone: undefined })); }}
          errorText={errors.phone}
        />
      </div>
    </CusDialog>
  );
}
