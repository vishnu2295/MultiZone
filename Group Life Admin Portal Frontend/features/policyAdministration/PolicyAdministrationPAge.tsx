"use client";

import { useState, useEffect } from "react";
import { Box, Typography, Tabs, Tab } from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";

import DashboardTab from "./policyAdministrationTabs/DashboardTab";
import EmployerPoliciesTab from "./policyAdministrationTabs/EmployerPoliciesTab";
import EmployeePoliciesTab from "./policyAdministrationTabs/EmployeePoliciesTab";

const TABS = [
  { label: "Dashboard", value: "dashboard" },
  { label: "Employer Policies", value: "employer_policies" },
  { label: "Employee Policies", value: "employee_policies" },
];

export default function PolicyAdministration() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const tabParam = searchParams.get("tab");

  const [activeTab, setActiveTab] = useState(tabParam || "dashboard");

  useEffect(() => {
    if (tabParam && TABS.some((t) => t.value === tabParam)) {
      setActiveTab(tabParam);
    }
  }, [tabParam]);

  const handleTabChange = (tabValue: string) => {
    setActiveTab(tabValue);
    const newSearchParams = new URLSearchParams(searchParams.toString());
    newSearchParams.set("tab", tabValue);
    router.replace(`/policyAdministration?${newSearchParams.toString()}`, {
      scroll: false,
    });
  };

  return (
    <Box
      sx={{ px: 3, py: 2, display: "flex", flexDirection: "column", gap: 1 }}
    >
      <Typography variant="h5" sx={{ fontWeight: 600 }}>
        Policy Administration
      </Typography>

      <Box sx={{ mb: 1 }}>
        <Tabs
          value={activeTab}
          onChange={(_, v) => handleTabChange(v)}
          textColor="primary"
          indicatorColor="primary"
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

      {/* Render Active Tab */}
      {activeTab === "dashboard" && <DashboardTab />}
      {activeTab === "employer_policies" && <EmployerPoliciesTab />}
      {activeTab === "employee_policies" && <EmployeePoliciesTab />}
    </Box>
  );
}
