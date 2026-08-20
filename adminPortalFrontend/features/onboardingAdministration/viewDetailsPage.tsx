"use client";

import React, { useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Chip,
  IconButton,
  Avatar,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { StatusChip } from "@/components/ui/StatusChip";
import { CustomTabs } from "@/components/ui/CustomTabs";
import { useGetQuoteDetails } from "./reviewAndOnboard/hooks/useGetQuoteDetails";
import OverviewTab from "./viewDetailsTabs/overviewTab";
import EmployeeValidationTab from "./viewDetailsTabs/employeeValidationTab";

export default function ViewDetailsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const quoteReference = searchParams.get("quoteReference");

  React.useEffect(() => {
    if (!quoteReference) {
      router.push("/onboardingAdministration");
    }
  }, [quoteReference, router]);

  const { data } = useGetQuoteDetails(quoteReference || "");

  const [activeTab, setActiveTab] = useState("overview");

  if (!quoteReference) return null;

  const selectedRow = {
    companyName: data.employer.companyName,
    quoteReference: quoteReference,
    brokerage: data.employer.brokerage,
  };

  const TABS = [
    { label: "Overview", value: "overview" },
    { label: "Employee Validation", value: "employee-validation" },
  ];

  return (
    <>
      <BackButton
        onClickHandler={() =>
          router.push("/onboardingAdministration?tab=onboarding-queue")
        }
      />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: "24px",
            p: { xs: 3, lg: 4 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          {/* Header */}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center" }}
          >
            <Typography variant="h5" sx={{ fontWeight: 700, fontSize: 20 }}>
              Quote Details
            </Typography>
          </Stack>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 2,
              p: 4,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              boxShadow: "none",
            }}
          >
            {/* Header Info */}
            <Stack
              direction="row"
              sx={{ justifyContent: "space-between", alignItems: "flex-start" }}
            >
              <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
                <Avatar
                  sx={{
                    width: 48,
                    height: 48,
                    fontWeight: 700,
                    borderRadius: 2,
                    bgcolor: "primary.light",
                    color: "primary.main",
                  }}
                >
                  {selectedRow.companyName.substring(0, 2).toUpperCase()}
                </Avatar>
                <Box>
                  <Typography
                    sx={{
                      fontWeight: 700,
                      fontSize: 16,
                      color: "text.heading",
                    }}
                  >
                    {selectedRow.companyName}
                  </Typography>
                  <Typography
                    sx={{ fontSize: 13, color: "text.heading", mt: 0.5 }}
                  >
                    Quote Reference : {selectedRow.quoteReference} &nbsp;|&nbsp;
                    Brokerage :{" "}
                    <Box
                      component="span"
                      sx={{ fontWeight: 700, color: "text.primary" }}
                    >
                      {selectedRow.brokerage || "Kenn Brokerage"}
                    </Box>
                  </Typography>
                </Box>
              </Stack>

              <StatusChip status="Rejected" sx={{ borderRadius: 1 }} />
            </Stack>

            {/* Rejection Alert */}
            <Box
              sx={{
                bgcolor: "status.rejectionAlertBg",
                p: 2,
                borderRadius: 1,
                border: "1px solid",
                borderColor: "status.rejectionAlertBorder",
              }}
            >
              <Typography sx={{ color: "status.rejectedText", fontSize: 14 }}>
                Rejected as the there is price variation and need a confirmation
                check with the employer
              </Typography>
            </Box>

            {/* Tabs */}
            <CustomTabs
              tabs={TABS}
              activeTab={activeTab}
              onChange={setActiveTab}
            />

            {/* Tab Content */}
            <Box sx={{ mt: 2 }}>
              {activeTab === "overview" && (
                <OverviewTab employer={data.employer} />
              )}
              {activeTab === "employee-validation" && (
                <EmployeeValidationTab employees={data.employees} />
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
