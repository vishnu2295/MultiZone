"use client";

import BrokerDetails from "@/features/brokerDetails/BrokerDetails";
import DashboardLayout from "../../../components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

export default function Page() {
  return (
    <>
      <ProtectedRoute moduleName="Broker">
        <DashboardLayout>
          <BrokerDetails />
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
