"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import ClaimAdministrationPage from "@/features/claimAdministration/ClaimAdministrationPage";

export default function Dashboard() {
  return (
    <>
      <DashboardLayout>
        <ClaimAdministrationPage />
      </DashboardLayout>
    </>
  );
}
