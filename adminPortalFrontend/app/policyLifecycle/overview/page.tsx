"use client";
import DashboardLayout from "@/components/layout/DashboardLayout";
import PolicyDetails from "@/features/policyLifeCycle/PolicyDetails/PolicyDetails";

export default function PolicyOverview() {
  return (
    <DashboardLayout showHeader={false}>
      <PolicyDetails />
    </DashboardLayout>
  );
}
