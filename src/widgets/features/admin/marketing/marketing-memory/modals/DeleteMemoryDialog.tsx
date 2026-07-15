import { LuTrash2 } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { deleteMemory } from "../api/marketingMemoryApi";
import type { MemoryItem } from "../marketing-memory.types";

interface Props {
  open: boolean;
  onClose: () => void;
  item: MemoryItem | null;
}

export function DeleteMemoryDialog({ open, onClose, item }: Props) {
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () => deleteMemory(item!.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["marketing-memory"] });
      onClose();
    },
  });

  return (
    <CusDialog open={open} onClose={onClose} title="Удалить воспоминание" size="sm">
      <div className="space-y-4">
        <p className="text-sm" style={{ color: "var(--text-muted)" }}>
          Вы уверены, что хотите удалить{" "}
          <span className="font-semibold" style={{ color: "var(--text-default)" }}>
            «{item?.title}»
          </span>
          ? Это действие нельзя отменить.
        </p>
        <div className="flex justify-end gap-2">
          <CusButton variant="outline" colorPalette="gray" onClick={onClose} isDisabled={mut.isPending}>
            Отмена
          </CusButton>
          <CusButton
            colorPalette="red"
            leftIcon={<LuTrash2 size={13} />}
            isLoading={mut.isPending}
            isDisabled={mut.isPending}
            onClick={() => mut.mutate()}
          >
            Удалить
          </CusButton>
        </div>
      </div>
    </CusDialog>
  );
}
