import { useMutation } from "@tanstack/react-query";
import { toast, translateApiError } from "@/components/sonner-toast/toast";
import { topupCard } from "../api/apiKassaHomePay";
import { buildActivationHtml, openPrint } from "../forCheckKassa";
import type { TopupPayload } from "../types";

interface Options {
  isNewCard: boolean;
  cardPrice: number;
  onSuccess: () => void;
  onError: (message: string) => void;
}

export function useTopupCard({ isNewCard, cardPrice, onSuccess, onError }: Options) {
  return useMutation({
    mutationFn: (payload: TopupPayload) => topupCard(payload),
    onSuccess: (res) => {
      openPrint(buildActivationHtml(res.data.transaction, isNewCard ? cardPrice : undefined));
      toast.success("Оплата прошла успешно");
      onSuccess();
    },
    onError: (err) => onError(translateApiError(err, "Ошибка при оплате. Попробуйте ещё раз.")),
  });
}
