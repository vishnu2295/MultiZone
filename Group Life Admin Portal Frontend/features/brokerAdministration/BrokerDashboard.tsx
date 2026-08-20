"use client";

import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { CustomTabs } from "../../components/ui/CustomTabs";
import BrokerManagement from "./brokerTabs/BrokerManagement";
import BrokerCommissions from "./brokerTabs/BrokerCommissions";

export default function BrokerDashboard() {
  const [activeTab, setActiveTab] = useState<"management" | "commissions">(
    "management"
  );

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* Main wrapper — flex: 1 fills remaining space after the Drawer */}
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0, // prevents flex overflow on narrow screens
        }}
      >
        {/* Page content */}
        <Box
          component="main"
          sx={{
            flex: 1,
            p: { xs: 3, lg: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
            overflowY: "auto",
          }}
        >
          {/* Page title */}
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Broker Administration
          </Typography>

          {/* ── Tabs ── */}
          <CustomTabs
            activeTab={activeTab}
            onChange={(val: string) => setActiveTab(val as any)}
            tabs={[
              { label: "Broker Management", value: "management" },
              { label: "Broker Commisions", value: "commissions" },
            ]}
          />

          {/* ── Tab Panels ── */}
          <Box sx={{ mt: 1 }}>
            {activeTab === "management" && <BrokerManagement />}
            {activeTab === "commissions" && <BrokerCommissions />}
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
