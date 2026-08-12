import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RMA Client Portal",
  description:
    "Secure portal for RMA members to manage claims, policies, documents, and benefits.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
