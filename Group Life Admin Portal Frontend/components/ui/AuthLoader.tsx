"use client";

import React from "react";
import { Box, CircularProgress } from "@mui/material";
import useToken from "@/hooks/useToken";

export function AuthLoader({ children }: { children: React.ReactNode }) {
  const token: any = useToken();
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return null; // Bypass SSR for the loader entirely to prevent Emotion CSS hydration mismatch
  }

  if (token?.isLoading || !token?.accessToken) {
    return (
      <Box
        sx={{
          display: "flex",
          height: "100vh",
          width: "100vw",
          alignItems: "center",
          justifyContent: "center",
          bgcolor: "background.default",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return <>{children}</>;
}
