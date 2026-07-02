import { useState, useEffect } from "react";

export function useDeviceId(key: "dntdiKA" | "dntdiOP"): string | null {
  const [value, setValue] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(key);
    setValue(stored);
  }, [key]);

  return value;
}
