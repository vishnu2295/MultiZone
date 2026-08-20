"use client";

import { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import Tooltip from "@mui/material/Tooltip";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useUser } from "@/lib/context/UserContext";
import { useThemeToggle } from "@/app/providers";

export default function DashboardHeader() {
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const [displayName, setDisplayName] = useState("");

  let user = null;
  try {
    const context = useUser();
    user = context?.user;
  } catch {}

  useEffect(() => {
    const resolveDisplayIdentity = () => {
      const storedIdentity = localStorage.getItem("userName");
      if (storedIdentity) {
        setDisplayName(storedIdentity);
      }
    };

    resolveDisplayIdentity();
    const timer = setTimeout(resolveDisplayIdentity, 250);
    return () => clearTimeout(timer);
  }, [user]);

  const handleLogout = () => {
    const storageKeys = [
      "bp_token",
      "bp_broker_id",
      "userEmail",
      "userName",
      "bp_broker_email",
      "bp_broker_name",
    ];

    storageKeys.forEach((key) => localStorage.removeItem(key));

    const baseUrl =
      process.env.NEXT_PUBLIC_CLIENT_CONNECT_URL || "http://localhost:4200";
    window.location.href = `${baseUrl}/api/auth/logout`;
  };

  const headerStyles = {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    bgcolor: "var(--background)",
    borderBottom: "1px solid var(--border)",
    px: "24px",
    height: "64px",
    position: "sticky",
    top: 0,
    zIndex: 20,
    flexShrink: 0,
  };

  return (
    <Box component="header" sx={headerStyles}>
      <Box sx={{ flex: 1 }} />
      <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
        <Box
          sx={{
            mr: "12px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            height: "100%",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              fontSize: "1rem",
              fontWeight: 400,
              color: "var(--muted-foreground)",
            }}
          >
            Welcome Back
            {displayName && (
              <>
                !{" "}
                <Typography
                  component="span"
                  sx={{
                    color: "var(--foreground)",
                    fontWeight: 500,
                    fontSize: "inherit",
                  }}
                >
                  {displayName}
                </Typography>
              </>
            )}
          </Typography>
        </Box>

        <IconButton suppressHydrationWarning aria-label="Notifications">
          <NotificationsOutlinedIcon />
        </IconButton>

        <Tooltip title={isDarkMode ? "Light Mode" : "Dark Mode"}>
          <IconButton onClick={toggleTheme} aria-label="Toggle theme">
            {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
          </IconButton>
        </Tooltip>

        <Button
          onClick={handleLogout}
          sx={{
            color: "var(--primary)",
            fontSize: "0.875rem",
            textTransform: "uppercase",
            fontWeight: 500,
          }}
        >
          logout
        </Button>
      </Box>
    </Box>
  );
}
