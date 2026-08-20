"use client";

import PolicyLifeCyclePage from "@/features/policyLifeCycle/PolicyLifeCyclePage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

export default function Dashboard() {
  return (
    <>
      <ProtectedRoute moduleName="Lifecycle">
        <DashboardLayout>
          <PolicyLifeCyclePage />
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
