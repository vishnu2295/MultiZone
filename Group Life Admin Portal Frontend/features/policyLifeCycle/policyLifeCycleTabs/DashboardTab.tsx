import { Box, Paper, Typography, Grid, Stack, Button } from "@mui/material";
import SearchInput from "@/components/ui/SearchInput";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import CheckCircleOutlinedIcon from "@mui/icons-material/CheckCircleOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import AssignmentLateOutlinedIcon from "@mui/icons-material/AssignmentLateOutlined";
import PaymentsOutlinedIcon from "@mui/icons-material/PaymentsOutlined";
import TrendingUpOutlinedIcon from "@mui/icons-material/TrendingUpOutlined";
import ErrorOutlinedIcon from "@mui/icons-material/ErrorOutlined";
import AccessTimeOutlinedIcon from "@mui/icons-material/AccessTimeOutlined";
import { useState } from "react";

export default function DashboardTab() {
  const [searchQuery, setSearchQuery] = useState("");

  const topCards = [
    {
      title: "Total Active",
      value: "4,812",
      icon: <CheckCircleOutlinedIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Total Reinstated",
      value: "234",
      icon: <SyncIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Total Cancelled",
      value: "891",
      icon: <HighlightOffIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Total Lapsed",
      value: "1,104",
      icon: <WarningAmberIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Total NTU",
      value: "317",
      icon: <AssignmentLateOutlinedIcon sx={{ color: "primary.main" }} />,
    },
  ];

  const bottomCards = [
    {
      title: "Premiums Billed",
      value: "R 28,443,100.00",
      icon: <PaymentsOutlinedIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Premiums Collected",
      value: "R 26,912,450.00",
      icon: <TrendingUpOutlinedIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Premiums Outstanding",
      value: "R 1,530,650.00",
      icon: <ErrorOutlinedIcon sx={{ color: "primary.main" }} />,
    },
    {
      title: "Premiums Unallocated",
      value: "R 87,340.00",
      icon: <AccessTimeOutlinedIcon sx={{ color: "primary.main" }} />,
    },
  ];

  return (
    <Box sx={{ mt: 1, display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        sx={{
          justifyContent: "space-between",
          alignItems: { xs: "flex-start", sm: "center" },
        }}
        spacing={2}
      >
        <Box sx={{ width: "100%", maxWidth: 450 }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="company name, policy number, or registration number."
          />
        </Box>
        <Button
          variant="outlined"
          endIcon={<CalendarTodayOutlinedIcon />}
          sx={{
            borderColor: "divider",
            color: "text.primary",
            textTransform: "none",
            borderRadius: 2,
            px: 2,
            py: 0.75,
            fontWeight: 500,
          }}
        >
          Date range
        </Button>
      </Stack>

      {/* Top Cards Row */}
      <Grid container spacing={3}>
        {topCards.map((card, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 4, lg: 2.4 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                borderColor: "divider",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
                border: "none",
              }}
            >
              <Box
                sx={{
                  bgcolor: "status.lightCyan", // light cyan background for the icon
                  width: 40,
                  height: 40,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: 24, color: "text.primary" }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "text.secondary", mt: 0.5 }}
                >
                  {card.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Bottom Cards Row */}
      <Grid container spacing={3}>
        {bottomCards.map((card, idx) => (
          <Grid key={idx} size={{ xs: 12, sm: 6, md: 3 }}>
            <Paper
              variant="outlined"
              sx={{
                p: 2.5,
                borderRadius: 3,
                borderColor: "divider",
                display: "flex",
                alignItems: "center",
                gap: 2,
                boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
                border: "none",
              }}
            >
              <Box
                sx={{
                  bgcolor: "status.lightCyan",
                  width: 44,
                  height: 44,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  flexShrink: 0,
                }}
              >
                {card.icon}
              </Box>
              <Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: 18, color: "text.primary" }}
                >
                  {card.value}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}
                >
                  {card.title}
                </Typography>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
