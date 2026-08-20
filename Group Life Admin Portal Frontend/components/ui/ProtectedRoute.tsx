"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { usePermissions } from "@/lib/context/PermissionsContext";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  moduleName: string;
  action?:
    | "view"
    | "create"
    | "update"
    | "delete"
    | "approve"
    | "reject"
    | "fullControl";
}

export function ProtectedRoute({
  children,
  moduleName,
  action = "view",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { hasPermission, loading } = usePermissions();
  const [isAuthorized, setIsAuthorized] = useState<boolean | null>(null);

  useEffect(() => {
    if (!loading) {
      if (hasPermission(moduleName, action)) {
        setIsAuthorized(true);
      } else {
        setIsAuthorized(false);
      }
    }
  }, [loading, moduleName, action, hasPermission]);

  if (loading || isAuthorized === null) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "400px",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthorized) {
    return (
      <Box
        sx={{
          p: 4,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "60vh",
        }}
      >
        <Paper
          elevation={0}
          variant="outlined"
          sx={{ p: 5, textAlign: "center", borderRadius: 3, maxWidth: 500 }}
        >
          <Typography
            variant="h5"
            color="error"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Access Denied
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 2 }}>
            You do not have the required permissions to {action} the{" "}
            <b>{moduleName}</b> module.
          </Typography>
          <Button
            variant="contained"
            onClick={() => router.push("/dashboard")}
            sx={{ mt: 2 }}
          >
            Return to Dashboard
          </Button>
        </Paper>
      </Box>
    );
  }

  return <>{children}</>;
}
