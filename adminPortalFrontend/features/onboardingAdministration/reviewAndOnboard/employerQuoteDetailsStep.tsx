"use client";

import { Box, Typography, Divider, Paper, Grid } from "@mui/material";
const LabelValue = ({ label, value }: { label: string; value: string }) => (
  <Box sx={{ display: "flex", flexDirection: "column", gap: 0.5 }}>
    <Typography sx={{ fontSize: 13, color: "text.secondary", fontWeight: 500 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 14, color: "text.valueText", fontWeight: 500 }}>
      {value}
    </Typography>
  </Box>
);

type SectionProps = {
  title: string;
  items: { label: string; value: string }[];
};

const DetailsSection = ({ title, items }: SectionProps) => (
  <Box>
    <Typography
      sx={{
        fontWeight: 700,
        mb: 3,
        fontSize: 16,
        color: "text.heading",
      }}
    >
      {title}
    </Typography>

    <Grid container spacing={4}>
      {items.map(({ label, value }) => (
        <Grid key={label} size={{ xs: 12, sm: 6, md: 3 }}>
          <LabelValue label={label} value={value} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

export interface DetailItem {
  label: string;
  value: string;
}

export interface Employer {
  employerDetails: DetailItem[];
  contactDetails: DetailItem[];
  quoteDetails: DetailItem[];
  companyName?: string;
  brokerage?: string;
}

export default function EmployerQuoteDetailsStep({
  employer,
  embedded = false,
}: {
  employer: Employer;
  embedded?: boolean;
}) {
  return (
    <Paper
      variant={embedded ? "elevation" : "outlined"}
      elevation={0}
      sx={{
        borderRadius: embedded ? 0 : 2,
        p: embedded ? 0 : 4,
        display: "flex",
        flexDirection: "column",
        gap: 4,
        boxShadow: "none",
        bgcolor: embedded ? "transparent" : "background.paper",
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.heading" }}>
        Employer & Quote Details
      </Typography>

      {/* Employer Details */}
      <DetailsSection
        title="Employer Details"
        items={employer?.employerDetails || []}
      />

      <Divider />

      {/* Contact Details */}
      <DetailsSection
        title="Contact Details"
        items={employer?.contactDetails || []}
      />

      <Divider />

      {/* Quote Details */}
      <DetailsSection
        title="Quote Details"
        items={employer?.quoteDetails || []}
      />
    </Paper>
  );
}
