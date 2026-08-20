"use client";

import React from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";

interface BenefitBreakdownItem {
  benefit_id?: string;
  benefit_name: string;
  premium_amount: number;
}

interface CoverSummaryProps {
  lifeCover: number;
  funeralCover: number;
  occupationalDisability: number;
  totalCover: number;
  totalMonthlyPremium: number;
  benefitBreakdown?: BenefitBreakdownItem[];
}

const formatCurrency = (value: number | string) => {
  const num = typeof value === "string" ? parseFloat(value.toString().replace(/[^0-9.-]+/g, "")) : value;
  return `R${Number(num || 0).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
};

const rowStyle: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
};

const labelStyle: SxProps<Theme> = {
  color: "var(--text-secondary)",
  fontSize: "0.875rem",
};

const valueStyle: SxProps<Theme> = {
  color: "var(--text-primary)",
  fontWeight: 500,
  fontSize: "0.875rem",
};

export default function CoverSummary({
  lifeCover,
  funeralCover,
  occupationalDisability,
  totalCover,
  totalMonthlyPremium,
  benefitBreakdown
}: CoverSummaryProps) {
  return (
    <Box sx={{
      background: "var(--card-secondary)",
      border: "1px solid var(--border)",
      borderRadius: "8px",
      padding: "20px",
    }}>
      <Typography variant="h4" sx={{
        fontSize: "0.875rem",
        fontWeight: 600,
        color: "var(--text-primary)",
        marginBottom: "16px",
      }}>
        Cover summary
      </Typography>
      
      <Box sx={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {/* Dynamic breakdown from API if available, else static cover amounts */}
        {benefitBreakdown && benefitBreakdown.length > 0 ? (
          benefitBreakdown.map((b, i) => (
            <Box key={b.benefit_id || i} sx={rowStyle}>
              <Typography sx={labelStyle}>{b.benefit_name}</Typography>
              <Typography sx={valueStyle}>{formatCurrency(b.premium_amount)}</Typography>
            </Box>
          ))
        ) : (
          <>
            <Box sx={rowStyle}>
              <Typography sx={labelStyle}>Life</Typography>
              <Typography sx={valueStyle}>{formatCurrency(lifeCover)}</Typography>
            </Box>
            <Box sx={rowStyle}>
              <Typography sx={labelStyle}>Funeral</Typography>
              <Typography sx={valueStyle}>{formatCurrency(funeralCover)}</Typography>
            </Box>
            <Box sx={rowStyle}>
              <Typography sx={labelStyle}>Occupational Disability</Typography>
              <Typography sx={valueStyle}>{formatCurrency(occupationalDisability)}</Typography>
            </Box>
          </>
        )}

        <Box sx={{ borderTop: "1px solid var(--border)", marginTop: "4px", paddingTop: "12px" }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <Typography sx={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.875rem" }}>Total cover</Typography>
            <Typography sx={{ color: "var(--text-primary)", fontWeight: 600, fontSize: "0.875rem" }}>{formatCurrency(totalCover)}</Typography>
          </Box>
          <Box sx={{ borderTop: "1px solid var(--border)", paddingTop: "12px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <Typography sx={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "0.875rem" }}>Total monthly premium</Typography>
              <Typography sx={{ color: "var(--primary)", fontWeight: 600, fontSize: "1rem" }}>{formatCurrency(totalMonthlyPremium)}</Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
