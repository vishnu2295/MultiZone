"use client";

import {
  Box,
  Paper,
  Tab,
  Tabs,
  Typography,
  Avatar,
  Stack,
  Divider,
  Button,
  Menu,
  MenuItem,
} from "@mui/material";
import { StatusChip } from "../../../components/ui/StatusChip";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState } from "react";
import BenefitsTab from "./overviewTabs/BenefitsTab";
import PremiumsTab from "./overviewTabs/PremiumsTab";
import EmployeesTab from "./overviewTabs/EmployeesTab";
import CollectionTab from "./overviewTabs/CollectionTab";
import InvoicesTab from "./overviewTabs/InvoicesTab";
import DocumentsTab from "./overviewTabs/DocumentsTab";
import CorrespondenceTab from "./overviewTabs/CorrespondenceTab";
import AuditTrailTab from "./overviewTabs/AuditTrailTab";
import OverviewTab from "./overviewTabs/OverviewTab";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      bgcolor: "#f8fafc", // very light gray/blue
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1.5,
      px: 1.5,
      py: 0.75,
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
      {label} :{" "}
      <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
        {value}
      </Box>
    </Typography>
  </Box>
);

const tabs = [
  "Overview",
  "Benefits",
  "Premiums",
  "Employees",
  "Collection",
  "Invoices",
  "Documents",
  "Correspondence",
  "Audit Trail",
];

export default function PolicyDetails() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");
  const fromParam = searchParams.get("from");

  const [activeTab, setActiveTab] = useState(() => {
    const index = tabs.findIndex(
      (t) => t.toLowerCase() === tabParam?.toLowerCase()
    );
    return index !== -1 ? index : 0;
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
    const tabName = tabs[newValue].toLowerCase();
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabName);
    router.replace(`/policyLifecycle/overview?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <>
      <BackButton
        onClickHandler={() => {
          if (fromParam === "policyAdministration") {
            router.push("/policyAdministration");
          } else {
            router.push("/policyLifecycle?tab=policies");
          }
        }}
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
            pt: "73px",
            p: { xs: 3, lg: 2 },
            pl: { xs: 3, lg: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Policy Details
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Section */}
            <Box sx={{ p: 3 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2.5}
                  sx={{ alignItems: "center" }}
                >
                  <Avatar
                    sx={{
                      bgcolor: "#e0f2fe", // light blue background
                      color: "#0ea5e9", // cyan text
                      width: 52,
                      height: 52,
                      fontWeight: 700,
                      fontSize: 16,
                    }}
                  >
                    MD
                  </Avatar>
                  <Box>
                    <Typography sx={{ fontWeight: 700, fontSize: 18 }}>
                      Meridian Logistics (Pty) Ltd
                    </Typography>
                    <Typography
                      sx={{ fontSize: 14, color: "text.secondary", mt: 0.5 }}
                    >
                      Policy No :{" "}
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        23982789329832
                      </Box>{" "}
                      | Brokerage :{" "}
                      <Box
                        component="span"
                        sx={{ fontWeight: 600, color: "text.primary" }}
                      >
                        Kenn Brokerage
                      </Box>
                    </Typography>
                  </Box>
                </Stack>
                {/* <Box> */}
                <StatusChip
                  status="Active"
                  sx={{
                    px: 0.5,
                    borderRadius: 1.5,
                  }}
                />
                {/* </Box> */}
              </Stack>

              {/* Info Row */}
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  mt: 3,
                }}
              >
                <Stack
                  direction="row"
                  spacing={1.5}
                  useFlexGap
                  sx={{ flexWrap: "wrap" }}
                >
                  <InfoBox label="Policy Inception Date" value="12-03-2024" />
                  <InfoBox label="Total Premium Paid" value="R 1200000.00" />
                  <InfoBox label="Total Emp" value="20000" />
                  <InfoBox label="Balance" value="R 00.00" />
                </Stack>

                <Button
                  variant="outlined"
                  color="inherit"
                  endIcon={<KeyboardArrowDownIcon />}
                  onClick={handleClick}
                  sx={{
                    textTransform: "none",
                    borderRadius: 2,
                    borderColor: "divider",
                    color: "text.primary",
                    fontWeight: 500,
                  }}
                >
                  Actions
                </Button>
                <Menu
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  transformOrigin={{ horizontal: "right", vertical: "top" }}
                  anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
                  sx={{ mt: 1 }}
                  slotProps={{
                    paper: {
                      elevation: 2,
                      sx: {
                        borderRadius: 2,
                        minWidth: 180,
                        border: "1px solid",
                        borderColor: "divider",
                      },
                    },
                  }}
                >
                  <MenuItem
                    onClick={handleClose}
                    sx={{ fontSize: 14, py: 1.5 }}
                  >
                    Mark as Lapse Policy
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    sx={{ fontSize: 14, py: 1.5 }}
                  >
                    Mark as NTU
                  </MenuItem>
                  <MenuItem
                    onClick={handleClose}
                    sx={{ fontSize: 14, py: 1.5, color: "#ef4444" }}
                  >
                    Cancel Policy
                  </MenuItem>
                </Menu>
              </Stack>
            </Box>

            <Divider />

            {/* Tabs */}
            <Box sx={{ px: 2 }}>
              <Tabs
                value={activeTab}
                onChange={handleTabChange}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  minHeight: 48,
                  "& .MuiTab-root": {
                    textTransform: "none",
                    minWidth: "auto",
                    px: 2,
                    fontWeight: 600,
                    fontSize: 13,
                    color: "text.secondary",
                    "&.Mui-selected": {
                      color: "text.primary",
                    },
                  },
                  "& .MuiTabs-indicator": {
                    bgcolor: "#06b6d4", // cyan-ish underline
                    height: 3,
                    borderTopLeftRadius: 3,
                    borderTopRightRadius: 3,
                  },
                }}
              >
                {tabs.map((tab, idx) => (
                  <Tab key={idx} label={tab} />
                ))}
              </Tabs>
            </Box>

            <Divider />

            {/* Tab Content */}
            <Box sx={{ p: 4 }}>
              {activeTab === 0 && (
                <Box>
                  <OverviewTab />
                </Box>
              )}
              {activeTab === 1 && (
                <Box>
                  <BenefitsTab />
                </Box>
              )}
              {activeTab === 2 && (
                <Box>
                  <PremiumsTab />
                </Box>
              )}
              {activeTab === 3 && (
                <Box>
                  <EmployeesTab />
                </Box>
              )}
              {activeTab === 4 && (
                <Box>
                  <CollectionTab />
                </Box>
              )}
              {activeTab === 5 && (
                <Box>
                  <InvoicesTab />
                </Box>
              )}
              {activeTab === 6 && (
                <Box>
                  <DocumentsTab />
                </Box>
              )}
              {activeTab === 7 && (
                <Box>
                  <CorrespondenceTab />
                </Box>
              )}
              {activeTab === 8 && (
                <Box>
                  <AuditTrailTab />
                </Box>
              )}
            </Box>
          </Paper>
        </Box>
      </Box>
    </>
  );
}
