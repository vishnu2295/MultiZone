import {
  Box,
  Toolbar,
  Typography,
  IconButton,
  Badge,
  Avatar,
  Divider,
} from "@mui/material";
import { Sun, Moon, Bell, ChevronDown, ChevronLeft } from "lucide-react";
import { useThemeToggle } from "@/lib/context/ThemeToggleContext";
import { Button } from "@mui/material";
import { useRouter } from "next/navigation";

interface DashboardHeaderProps {
  showBackButton?: boolean;
}

export default function DashboardHeader({
  showBackButton = false,
}: DashboardHeaderProps) {
  const { isDarkMode, toggleTheme } = useThemeToggle();
  const router = useRouter();
  return (
    <Box
      component="header"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        bgcolor: "background.paper",
        borderBottom: "1px solid var(--border)",
        pl: "0px",
        pr: "24px",
        height: "56px",
        position: "sticky",
        top: 0,
        zIndex: 20,
        flexShrink: 0,
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", height: "100%" }}>
        <Box>
          {showBackButton ? (
            <Button
              onClick={() => router.back()}
              sx={{
                color: "text.primary",
                textTransform: "none",
                fontWeight: 600,
                pl: 2,
              }}
              startIcon={<ChevronLeft size={20} />}
            >
              Back
            </Button>
          ) : (
            <Typography variant="body2" color="text.primary" sx={{ pl: 2 }}>
              Welcome back,&nbsp;
              <Typography component="span" sx={{ fontWeight: 700 }}>
                Sarah Dlamini
              </Typography>
            </Typography>
          )}
        </Box>
      </Box>
      <Toolbar
        sx={{
          height: "100%",
          minHeight: "73px !important",
          display: "flex",
          justifyContent: "space-between",
          px: 3,
        }}
      >
        {/* Right Section */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
          }}
        >
          {/* Theme Toggle */}
          <IconButton
            onClick={toggleTheme}
            title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {isDarkMode ? (
              <Sun size={20} color="#fbbf24" />
            ) : (
              <Moon size={20} />
            )}
          </IconButton>

          {/* Notifications */}
          <IconButton title="Notifications">
            <Badge color="error" variant="dot" overlap="circular">
              <Bell size={20} />
            </Badge>
          </IconButton>

          <Divider orientation="vertical" flexItem />

          {/* Profile */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1.5,
              cursor: "pointer",
              px: 1,
              py: 0.5,
              bgcolor: "action.hover",
              borderRadius: 2,
            }}
          >
            <Avatar
              sx={{
                bgcolor: "primary.main",
                width: 36,
                height: 36,
                fontSize: 14,
                fontWeight: 700,
              }}
            >
              SD
            </Avatar>

            <Typography
              variant="body2"
              sx={{
                display: {
                  xs: "none",
                  sm: "block",
                },
                fontWeight: 700,
              }}
            >
              Sarah Dlamini
            </Typography>

            <ChevronDown size={16} />
          </Box>
        </Box>
      </Toolbar>
    </Box>
  );
}
