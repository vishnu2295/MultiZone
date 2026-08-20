import { Box, Tab, Tabs, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import ReportsTab from "./policyLifeCycleTabs/ReportsTab";
import DashboardTab from "./policyLifeCycleTabs/DashboardTab";
import PoliciesTab from "./policyLifeCycleTabs/PoliciesTab";
import { useSearchParams } from "next/navigation";

export default function PolicyLifeCyclePage() {
  const [activeTab, setActiveTab] = useState<
    "dashboard" | "policies" | "reports"
  >("dashboard");

  const searchParams = useSearchParams();

  const initialTab =
    searchParams.get("tab") === "policies"
      ? "policies"
      : searchParams.get("tab") === "reports"
        ? "reports"
        : "dashboard";

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  return (
    <Box
      sx={{
        display: "flex",
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          minHeight: "100vh",
          minWidth: 0, // prevents flex overflow on narrow screens
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: "73px",
            p: { xs: 3, lg: 2 },
            pl: { xs: 3, lg: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 1,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Policy Lifecycle
          </Typography>

          <Box>
            <Tabs
              value={activeTab}
              onChange={(_, v) => setActiveTab(v)}
              textColor="primary"
              indicatorColor="primary"
            >
              <Tab
                value="dashboard"
                label="Dashboard"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
              />
              <Tab
                value="policies"
                label="Policies"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
              />
              <Tab
                value="reports"
                label="Reports"
                sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
              />
            </Tabs>
          </Box>

          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "policies" && <PoliciesTab />}
          {activeTab === "reports" && <ReportsTab />}
        </Box>
      </Box>
    </Box>
  );
}
