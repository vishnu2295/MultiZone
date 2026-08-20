import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import StartNewLeadPage from "@/features/lead/new/page";

export default function LeadNewRoute() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <StartNewLeadPage />
      </Suspense>
    </DashboardLayout>
  );
}
