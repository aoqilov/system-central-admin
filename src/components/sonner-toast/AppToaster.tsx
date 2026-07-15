import { Toaster } from "sonner";
import { useTheme } from "@/context/ThemeContext";

export function AppToaster() {
  const { theme } = useTheme();

  return (
    <Toaster
      theme={theme}
      position="top-right"
      richColors
      expand={true}
      duration={4000}
    />
  );
}
