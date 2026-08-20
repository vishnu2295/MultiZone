import React from "react";
import { Box, Card, Typography } from "@mui/material";
import { SvgIconComponent } from "@mui/icons-material";

interface MetricCardProps {
  value: string;
  label: React.ReactNode;
  icon?: SvgIconComponent;
}

export default function MetricCard({ value, label, icon: Icon }: MetricCardProps) {
  return (
    <Card
      sx={{
        p: "24px",
        pb: "16px",
        borderRadius: "12px",
        border: "1px solid var(--border)",
        background: "var(--metric-card-bg)",
        boxShadow: "none",
        height: "100%",
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "space-between",
      }}
    >
      <Box>
        <Typography
          sx={{
            mb: "4px",
            fontSize: "1.25rem",
            fontWeight: 700,
            lineHeight: 1,
            color: "var(--text-heading)",
          }}
        >
          {value}
        </Typography>
        <Typography
          sx={{
            fontSize: "0.75rem",
            color: "var(--metric-label-color)",
          }}
        >
          {label}
        </Typography>
      </Box>
      {Icon && <Icon sx={{ fontSize: "18px", color: "var(--icon-color)", mt: "6px" }} />}
    </Card>
  );
}

