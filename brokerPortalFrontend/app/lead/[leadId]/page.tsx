"use client";

import { useParams } from "next/navigation";
import DashboardLayout from "@/components/layout/DashboardLayout";
import LeadDetailsPage from "@/features/lead/view/LeadDetailsPage";

export default function LeadDetailRoute() {
  const params = useParams();
  const leadId = params.leadId as string;

  return (
    <DashboardLayout>
      <div style={{ padding: "24px" }}>
        <LeadDetailsPage leadId={leadId} />
      </div>
    </DashboardLayout>
  );
}
