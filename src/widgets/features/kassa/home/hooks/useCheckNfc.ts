import { useMutation } from "@tanstack/react-query";
import { translateApiError } from "@/components/sonner-toast/toast";
import { checkNfc } from "../api/apiKassaHomePay";
import type { NfcCard } from "../types";

export function useCheckNfc(
  onSuccess: (card: NfcCard) => void,
  onError: (message: string) => void,
) {
  return useMutation({
    mutationFn: (rawNfc: string) => checkNfc(rawNfc.replace(/^0+/, "")),
    onSuccess: (res) => onSuccess(res.data.card),
    onError: (err) => onError(translateApiError(err, "NFC карта не найдена")),
  });
}
