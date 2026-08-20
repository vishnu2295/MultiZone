import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "RMA Broker Portal",
  description: "RMA Broker Portal — Caring | Compassionate | Compensation",
  icons: { icon: "/favicon.ico" },
};

import { AppRouterCacheProvider } from "@mui/material-nextjs/v16-appRouter";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
        <AppRouterCacheProvider>
          <Providers>{children}</Providers>
        </AppRouterCacheProvider>
      </body>
    </html>
  );
}
