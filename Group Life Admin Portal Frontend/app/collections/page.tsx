"use client";

import CollectionsPage from "@/features/collectionJourney/CollectionsPage";
import DashboardLayout from "../../components/layout/DashboardLayout";
import { ProtectedRoute } from "@/components/ui/ProtectedRoute";

export default function Page() {
  return (
    <>
      <ProtectedRoute moduleName="Collections Administration">
        <DashboardLayout>
          <CollectionsPage />
        </DashboardLayout>
      </ProtectedRoute>
    </>
  );
}
