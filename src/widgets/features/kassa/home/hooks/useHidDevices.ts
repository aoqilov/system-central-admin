import { useEffect, useState, useCallback } from "react";

export interface HidDevice {
  id: string;
  name: string;
  vendorId: number;
  productId: number;
  connected: boolean;
}

interface RawHidDevice {
  vendorId: number;
  productId: number;
  productName: string;
}

interface HidConnectionEvent {
  device: RawHidDevice;
}

interface NavigatorHid {
  getDevices(): Promise<RawHidDevice[]>;
  requestDevice(options: { filters: unknown[] }): Promise<RawHidDevice[]>;
  addEventListener(type: "connect" | "disconnect", handler: (e: HidConnectionEvent) => void): void;
  removeEventListener(type: "connect" | "disconnect", handler: (e: HidConnectionEvent) => void): void;
}

function getHid(): NavigatorHid | null {
  if (typeof navigator === "undefined") return null;
  return ("hid" in navigator ? (navigator as unknown as { hid: NavigatorHid }).hid : null);
}

function toHidDevice(d: RawHidDevice, connected = true): HidDevice {
  return {
    id: `${d.vendorId}-${d.productId}`,
    name: d.productName || "Noma'lum qurilma",
    vendorId: d.vendorId,
    productId: d.productId,
    connected,
  };
}

export function useHidDevices() {
  const supported = typeof navigator !== "undefined" && "hid" in navigator;
  const [devices, setDevices] = useState<HidDevice[]>([]);

  useEffect(() => {
    const hid = getHid();
    if (!hid) return;

    hid.getDevices().then((list) => {
      setDevices(list.map((d) => toHidDevice(d, true)));
    });

    function onConnect(e: HidConnectionEvent) {
      setDevices((prev) => {
        const id = `${e.device.vendorId}-${e.device.productId}`;
        const exists = prev.find((d) => d.id === id);
        if (exists) return prev.map((d) => d.id === id ? { ...d, connected: true } : d);
        return [...prev, toHidDevice(e.device, true)];
      });
    }

    function onDisconnect(e: HidConnectionEvent) {
      const id = `${e.device.vendorId}-${e.device.productId}`;
      setDevices((prev) => prev.map((d) => d.id === id ? { ...d, connected: false } : d));
    }

    hid.addEventListener("connect", onConnect);
    hid.addEventListener("disconnect", onDisconnect);

    return () => {
      hid.removeEventListener("connect", onConnect);
      hid.removeEventListener("disconnect", onDisconnect);
    };
  }, [supported]);

  const requestAccess = useCallback(async () => {
    const hid = getHid();
    if (!hid) return;
    try {
      const granted = await hid.requestDevice({ filters: [] });
      setDevices((prev) => {
        const next = [...prev];
        for (const d of granted) {
          const id = `${d.vendorId}-${d.productId}`;
          if (!next.find((x) => x.id === id)) {
            next.push(toHidDevice(d, true));
          }
        }
        return next;
      });
    } catch {
      // user cancelled dialog
    }
  }, [supported]);

  return { supported, devices, requestAccess };
}
