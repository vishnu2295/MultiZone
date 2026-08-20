"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import ClaimDetailsPage from "../../../features/claimAdministration/ClaimDetailsPage";

export default function ClaimDetails() {
  return (
    <DashboardLayout showBackButton>
      <ClaimDetailsPage />
    </DashboardLayout>
  );
}
