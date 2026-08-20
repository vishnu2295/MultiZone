import { Box, Paper, Typography, Button } from "@mui/material";
import { CalendarTodayOutlined } from "@mui/icons-material";
import SearchInput from "@/components/ui/SearchInput";
import { useState } from "react";

const METRICS = [
  { value: "14", description: "Addition of Employees" },
  { value: "6", description: "Removal of Employees" },
  { value: "9", description: "Addition of Dependents" },
  { value: "4", description: "Banking Details" },
  { value: "3", description: "Debit Dates" },
  { value: "7", description: "Benefit Changes" },
  { value: "5", description: "Beneficiary Changes" },
  { value: "11", description: "Contact Details" },
  { value: "2", description: "Payment Method Changes" },
];

export default function DashboardTab() {
  const [searchQuery, setSearchQuery] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="company name, policy number, or registration number."
          sx={{ width: 440, maxWidth: "100%", bgcolor: "background.paper" }}
        />

        <Button
          variant="outlined"
          endIcon={
            <CalendarTodayOutlined
              sx={{ color: "text.secondary", fontSize: 20 }}
            />
          }
          sx={{
            borderColor: "divider",
            color: "text.primary",
            textTransform: "none",
            borderRadius: 1.5,
            px: 2,
            py: 1,
            bgcolor: "background.paper",
            fontWeight: 500,
            "&:hover": {
              borderColor: "divider",
              bgcolor: "background.default",
            },
          }}
        >
          Date range
        </Button>
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: { xs: "1fr", md: "repeat(3, 1fr)" },
          gap: 2,
        }}
      >
        {METRICS.map((card, index) => (
          <Paper
            key={index}
            variant="outlined"
            sx={{
              p: 2.5,
              borderRadius: 3,
              borderColor: "divider",
              display: "flex",
              flexDirection: "column",
              gap: 0.5,
              boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
              border: "none",
            }}
          >
            <Typography
              variant="h5"
              sx={{ fontWeight: 700, fontSize: "28px", color: "text.primary" }}
            >
              {card.value}
            </Typography>
            <Typography
              variant="body2"
              sx={{ color: "text.secondary", fontWeight: 500 }}
            >
              {card.description}
            </Typography>
          </Paper>
        ))}
      </Box>
    </Box>
  );
}
