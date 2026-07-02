import { createRoot } from "react-dom/client";
import { ChakraProvider } from "@chakra-ui/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { system } from "./chakra-system";
import { ThemeProvider } from "./context/ThemeContext";
import queryClient from "./api-config/queryClient";
import "./api-config/interceptors";
import "./index.css";
import App from "./App";

const APP_VERSION = "version: test 0.1.4";

const root = document.getElementById("root")!;
createRoot(root).render(
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <ChakraProvider value={system}>
        <App />
        <span
          style={{
            position: "fixed",
            bottom: 8,
            left: 12,
            fontSize: 16,
            color: "var(--text-dim)",
            opacity: 0.3,
            pointerEvents: "none",
            userSelect: "none",
            zIndex: 9999,
            fontFamily: "JetBrains Mono, monospace",
          }}
        >
          {APP_VERSION}
        </span>
      </ChakraProvider>
    </ThemeProvider>
  </QueryClientProvider>,
);
