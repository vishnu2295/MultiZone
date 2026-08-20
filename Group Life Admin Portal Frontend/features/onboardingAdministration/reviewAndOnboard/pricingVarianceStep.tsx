"use client";

import { Box, Typography, Stack, Paper } from "@mui/material";

const labelSx = {
  fontSize: 13,
  color: "text.secondary",
  mb: 1,
};

const valueSx = {
  fontWeight: 600,
  fontSize: 15,
  color: "text.valueText",
};

export interface VarianceItem {
  label: string;
  value: string;
}

export default function PricingVarianceStep({
  variance = [],
}: {
  variance?: VarianceItem[];
}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 2,
        p: 4,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        boxShadow: "none",
        flex: 1,
      }}
    >
      <Typography variant="h6" sx={{ fontWeight: 700, color: "text.heading" }}>
        Pricing Variance Validation
      </Typography>

      <Box>
        <Typography
          sx={{ fontWeight: 700, fontSize: 16, color: "text.heading", mb: 3 }}
        >
          Variance Analysis
        </Typography>

        <Stack direction="row" spacing={12}>
          {variance.map(({ label, value }) => (
            <Box key={label}>
              <Typography sx={labelSx}>{label}</Typography>

              <Typography sx={valueSx}>{value}</Typography>
            </Box>
          ))}
        </Stack>
      </Box>
    </Paper>
  );
}
