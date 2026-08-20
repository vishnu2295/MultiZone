import React, { useState } from "react";
import { Box, Typography, Button } from "@mui/material";
import { MetricCards } from "@/components/ui/MetricCards";
import SearchInput from "@/components/ui/SearchInput";
import ArticleOutlinedIcon from "@mui/icons-material/ArticleOutlined";
import ShieldOutlinedIcon from "@mui/icons-material/ShieldOutlined";
import PaidOutlinedIcon from "@mui/icons-material/PaidOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";

const QUOTE_METRICS = [
  { value: "6", description: "Total Quotes Generated" },
  { value: "10", description: "Total Quotes Accepted" },
  { value: "6", description: "Total Quotes Rejected" },
  { value: "5", description: "Total Quotes Yet to Be Onboarded" },
];

const POLICY_METRICS = [
  { value: "20", description: "Total Employer Policies Onboarded" },
  { value: "20", description: "Total Employee Policies Onboarded" },
  { value: "10", description: "Total Funeral Cover Policies Onboarded" },
  { value: "6", description: "Total Life Cover Policies Onboarded" },
  { value: "20", description: "Total Occupation Disability Onboarded" },
  { value: "10", description: "Total GPA Policies Onboarded" },
  { value: "6", description: "Total GPA Plus Policies Onboarded" },
  { value: "5", description: "Total CICJP Policies Onboarded" },
];

const FINANCIAL_METRICS = [
  { value: "20", description: "Total Riot and Strike Policies Onboarded" },
  { value: "R 10,00,000.00", description: "Total Premiums Billed" },
];

const DASHBOARD_SECTIONS = [
  {
    title: "Quote Management",
    subtitle: "Track the overall status of quotes",
    icon: <ArticleOutlinedIcon color="primary" fontSize="small" />,
    metrics: QUOTE_METRICS,
  },
  {
    title: "Policy Onboarding",
    subtitle: "Overview of policies onboarded by category",
    icon: <ShieldOutlinedIcon color="primary" fontSize="small" />,
    metrics: POLICY_METRICS,
  },
  {
    title: "Financial Overview",
    subtitle: "Summary of premiums billed",
    icon: <PaidOutlinedIcon color="primary" fontSize="small" />,
    metrics: FINANCIAL_METRICS,
  },
];

const CARD_SX = {
  maxWidth: "312.5px",
  height: "84.24px",
  justifyContent: "flex-start",
};

export default function DashboardTab() {
  const [searchTerm, setSearchTerm] = useState("");

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, mt: 1 }}>
      {/* Search and Date Filter Row */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <SearchInput
          value={searchTerm}
          onChange={setSearchTerm}
          placeholder="Employer, policy, broker name."
          sx={{ maxWidth: "356px" }}
        />

        <Button
          variant="outlined"
          endIcon={<CalendarTodayOutlinedIcon />}
          sx={{
            borderColor: "divider",
            color: "text.primary",
            bgcolor: "background.paper",
            textTransform: "none",
            borderRadius: "6px",
            height: "40px",
          }}
        >
          Date range
        </Button>
      </Box>

      {DASHBOARD_SECTIONS.map((section) => (
        <Box key={section.title}>
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 1.5 }}>
            {section.icon}
            <Box>
              <Typography
                variant="subtitle2"
                sx={{ fontWeight: 700, lineHeight: 1.2 }}
              >
                {section.title}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {section.subtitle}
              </Typography>
            </Box>
          </Box>
          <MetricCards metrics={section.metrics} cardSx={CARD_SX} />
        </Box>
      ))}
    </Box>
  );
}
