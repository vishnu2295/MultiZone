"use client";

import React from "react";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import RefundDetailsPage from "../../../features/collectionJourney/RefundDetailsPage";
import { Box } from "@mui/material";

export default function RefundDetails() {
  return (
    <DashboardLayout>
      <Box sx={{ flex: 1, minHeight: "100vh", bgcolor: "background.default" }}>
        <RefundDetailsPage />
      </Box>
    </DashboardLayout>
  );
}
