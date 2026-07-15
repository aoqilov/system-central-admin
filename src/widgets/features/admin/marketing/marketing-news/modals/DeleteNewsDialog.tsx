import { Dialog } from "@chakra-ui/react";
import { LuTrash2 } from "react-icons/lu";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import { deleteNews } from "../api/marketingNewsApi";
import type { NewsItem } from "../marketing-news.types";

interface Props {
  open: boolean;
  onClose: () => void;
  item: NewsItem | null;
}

export function DeleteNewsDialog({ open, onClose, item }: Props) {
  const qc = useQueryClient();

  const mut = useMutation({
    mutationFn: () => deleteNews(item!.id),
    onSuccess: () => {
      void qc.invalidateQueries({ queryKey: ["marketing-news"] });
      onClose();
    },
  });

  return (
    <CusDialog
      open={open}
      onClose={onClose}
      title="Удалить новость"
      size="sm"
      footer={
        <>
          <Dialog.ActionTrigger asChild>
            <CusButton variant="outline" colorPalette="gray" onClick={onClose}>
              Отмена
            </CusButton>
          </Dialog.ActionTrigger>
          <CusButton
            colorPalette="red"
            leftIcon={<LuTrash2 size={14} />}
            isLoading={mut.isPending}
            onClick={() => mut.mutate()}
          >
            Удалить
          </CusButton>
        </>
      }
    >
      <div className="space-y-2">
        <p className="text-sm" style={{ color: "var(--text-default)" }}>
          Вы уверены, что хотите удалить эту новость?
        </p>
        {item && (
          <p
            className="text-sm font-semibold px-3 py-2 rounded-lg"
            style={{
              background: "var(--bg-hover)",
              color: "var(--text-default)",
              border: "1px solid var(--border-default)",
            }}
          >
            «{item.title}»
          </p>
        )}
        <p className="text-xs" style={{ color: "var(--text-muted)" }}>
          Это действие нельзя отменить.
        </p>
      </div>
    </CusDialog>
  );
}
