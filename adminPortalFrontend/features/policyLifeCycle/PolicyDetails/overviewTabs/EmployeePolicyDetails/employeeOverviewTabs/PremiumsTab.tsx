import React from "react";
import { Box } from "@mui/material";
import { MetricCards } from "@/components/ui/MetricCards";

const PREMIUMS_METRICS = [
  { description: "TOTAL BILLED", value: "R 83,475.00" },
  { description: "TOTAL COLLECTED", value: "R 80,325.00" },
  { description: "OUTSTANDING", value: "R 3,150.00" },
  { description: "UNALLOCATED", value: "R 0.00" },
];

export default function PremiumsTab() {
  return (
    <Box>
      <MetricCards
        metrics={PREMIUMS_METRICS}
        cardSx={{ maxWidth: 298, height: 87.5 }}
        reverseTextOrder
      />
    </Box>
  );
}
