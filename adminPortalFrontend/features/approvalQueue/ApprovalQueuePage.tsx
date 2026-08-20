"use client";

import { useState } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { MetricCards } from "@/components/ui/MetricCards";
import {
  AccessTimeOutlined,
  CheckCircleOutlineOutlined,
  InfoOutlined,
  BlockOutlined,
} from "@mui/icons-material";

import AmendmentsTab from "./ApprovalQueueTabs/AmendmentsTab";
import BrokerOnboardingTab from "./ApprovalQueueTabs/BrokerOnboardingTab";
import CancellationsTab from "./ApprovalQueueTabs/CancellationsTab";
import RefundsTab from "./ApprovalQueueTabs/RefundsTab";
import OnboardingAMLTab from "./ApprovalQueueTabs/OnboardingAMLTab";
import AmendmentsAMLTab from "./ApprovalQueueTabs/AmendmentsAMLTab";

const TABS = [
  { label: "Amendments", value: "amendments" },
  { label: "Broker Onboarding", value: "broker_onboarding" },
  { label: "Cancellations", value: "cancellations" },
  { label: "Refunds", value: "refunds" },
  { label: "Onboarding AML Checks", value: "onboarding_aml" },
  { label: "Amendments AML Checks", value: "amendments_aml" },
];

const METRICS = [
  {
    value: "20",
    description: "Awaiting Approval",
    icon: <AccessTimeOutlined />,
  },
  {
    value: "10",
    description: "Approved",
    icon: <CheckCircleOutlineOutlined sx={{ color: "success.main" }} />,
  },
  {
    value: "6",
    description: "Requested More Info",
    icon: <InfoOutlined sx={{ color: "info.main" }} />,
  },
  {
    value: "5",
    description: "Rejected",
    icon: <BlockOutlined sx={{ color: "error.main" }} />,
  },
];

export default function ApprovalQueuePage() {
  const [activeTab, setActiveTab] = useState("amendments");

  return (
    <Box
      sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Approval Queue
      </Typography>

      <Box>
        <Tabs
          value={activeTab}
          onChange={(_, v) => setActiveTab(v)}
          textColor="primary"
          indicatorColor="primary"
          variant="scrollable"
          scrollButtons="auto"
        >
          {TABS.map((tab) => (
            <Tab
              key={tab.value}
              value={tab.value}
              label={tab.label}
              sx={{ textTransform: "none", fontWeight: 600, fontSize: 14 }}
            />
          ))}
        </Tabs>
      </Box>

      <MetricCards metrics={METRICS} layout="horizontal" />

      {/* Render Active Tab */}
      {activeTab === "amendments" && <AmendmentsTab />}
      {activeTab === "broker_onboarding" && <BrokerOnboardingTab />}
      {activeTab === "cancellations" && <CancellationsTab />}
      {activeTab === "refunds" && <RefundsTab />}
      {activeTab === "onboarding_aml" && <OnboardingAMLTab />}
      {activeTab === "amendments_aml" && <AmendmentsAMLTab />}
    </Box>
  );
}
