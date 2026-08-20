"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import ViewLeadsPage from "@/features/lead/view/ViewLeadsPage";

export default function LeadViewRoute() {
  return (
    <DashboardLayout>
      <ViewLeadsPage />
    </DashboardLayout>
  );
}
