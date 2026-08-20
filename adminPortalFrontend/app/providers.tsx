"use client";

import React from "react";
import { UserProvider } from "@/lib/context/UserContext";
import { SidebarProvider } from "@/lib/context/SidebarContext";
import { ThemeToggleProvider } from "@/lib/context/ThemeToggleContext";
import ThemeWrapper from "@/lib/context/ThemeWrapper";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthLoader } from "@/components/ui/AuthLoader";

import { PermissionsProvider } from "@/lib/context/PermissionsContext";

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = React.useState(
    new QueryClient({
      defaultOptions: {
        queries: {
          refetchOnWindowFocus: false,
        },
      },
    })
  );
  return (
    <ThemeToggleProvider>
      <ThemeWrapper>
        <QueryClientProvider client={queryClient}>
          <AuthLoader>
            <SidebarProvider>
              <UserProvider>
                <PermissionsProvider>{children}</PermissionsProvider>
              </UserProvider>
            </SidebarProvider>
          </AuthLoader>
        </QueryClientProvider>
      </ThemeWrapper>
    </ThemeToggleProvider>
  );
}
