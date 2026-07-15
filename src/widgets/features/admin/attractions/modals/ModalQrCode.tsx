import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { LuDownload } from "react-icons/lu";
import { CusDialog } from "@/components/ui/dialog/CusDialog";
import { CusButton } from "@/components/ui/buttons/CusButton";
import type { Attraction } from "../types";

interface Props {
  open: boolean;
  onClose: () => void;
  attraction: Attraction | null;
}

export default function ModalQrCode({ open, onClose, attraction }: Props) {
  const [dataUrl, setDataUrl] = useState<string>("");

  useEffect(() => {
    if (!open || !attraction) return;
    QRCode.toDataURL(JSON.stringify({ type: "attraction", id: attraction.id }), {
      width: 280,
      margin: 2,
      color: { dark: "#111827", light: "#ffffff" },
    }).then(setDataUrl);
  }, [open, attraction]);

  function handleDownload() {
    if (!dataUrl || !attraction) return;
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `qr-attraction-${attraction.id}.png`;
    a.click();
  }

  return (
    <CusDialog open={open} onClose={onClose} size="sm" closeOnBackdrop>
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 16,
          padding: "8px 0",
        }}
      >
        <div>
          <p
            style={{
              fontWeight: 600,
              fontSize: 15,
              color: "var(--text-default)",
              textAlign: "center",
              marginBottom: 2,
            }}
          >
            {attraction?.name}
          </p>
          <p
            style={{
              fontSize: 12,
              color: "var(--text-muted)",
              textAlign: "center",
            }}
          >
            ID: {attraction?.id}
          </p>
        </div>

        <div
          style={{
            background: "#ffffff",
            borderRadius: 12,
            padding: 12,
            display: "inline-block",
            boxShadow: "0 2px 12px rgba(0,0,0,0.10)",
          }}
        >
          {dataUrl && (
            <img
              src={dataUrl}
              alt={`QR - ${attraction?.name}`}
              style={{ width: 280, height: 280, display: "block" }}
            />
          )}
        </div>

        <CusButton
          size="sm"
          variant="solid"
          colorPalette="blue"
          onClick={handleDownload}
        >
          <LuDownload size={14} /> PNG yuklab olish
        </CusButton>
      </div>
    </CusDialog>
  );
}
