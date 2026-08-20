import { Box, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { CustomTabs } from "@/components/ui/CustomTabs";
import DashboardTab from "./onboardingAdministrationTabs/DashboardTab";
import OnboardingQueueTab from "./onboardingAdministrationTabs/OnboardingQueueTab";

export default function OnboardingAdministrationPage() {
  const [activeTab, setActiveTab] = useState<string>("dashboard");
  const searchParams = useSearchParams();

  const tabOptions = [
    { label: "Dashboard", value: "dashboard" },
    { label: "Onboarding Queue", value: "onboarding-queue" },
    { label: "Reports", value: "reports" },
  ];

  const initialTab = searchParams.get("tab") || "dashboard";

  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

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
          minWidth: 0,
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
            overflowY: "auto",
          }}
        >
          <>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 1, mt: 1 }}>
              Onboarding Administration
            </Typography>

            <Box sx={{ mb: 2 }}>
              <CustomTabs
                tabs={tabOptions}
                activeTab={activeTab}
                onChange={handleTabChange}
                containerSx={{ borderBottom: 0 }}
              />
            </Box>
          </>

          {activeTab === "dashboard" && <DashboardTab />}
          {activeTab === "onboarding-queue" && <OnboardingQueueTab />}
          {activeTab === "reports" && <Box sx={{ p: 2 }}>Reports Content</Box>}
        </Box>
      </Box>
    </Box>
  );
}
