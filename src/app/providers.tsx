import { PropsWithChildren } from "react";
import { ThemeProvider, CssBaseline } from "@mui/material";
import { QueryClientProvider } from "@tanstack/react-query";
import { theme } from "./theme";
import { queryClient } from "./queryClient";
import { PigeonsStoreProvider } from "./pigeonsStore";

export const AppProviders = ({ children }: PropsWithChildren) => {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <PigeonsStoreProvider>{children}</PigeonsStoreProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
};
