"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import EmployeePolicyDetails from "@/features/policyLifeCycle/PolicyDetails/overviewTabs/EmployeePolicyDetails/EmployeePolicyDetails";

export default function EmployeePolicyPage() {
  return (
    <DashboardLayout showHeader={false}>
      <EmployeePolicyDetails />
    </DashboardLayout>
  );
}
