"use client";

import BrokerDashboard from "@/features/brokerAdministration/BrokerDashboard";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

export default function Page() {
  return (
    <>
      <ProtectedRoute moduleName="Broker">
        <DashboardLayout>
          <BrokerDashboard />
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
