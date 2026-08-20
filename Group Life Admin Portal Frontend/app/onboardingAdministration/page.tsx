"use client";

import DashboardLayout from "../../components/layout/DashboardLayout";
import OnboardingAdministrationPage from "../../features/onboardingAdministration/onboardingAdministrationPage";

export default function Dashboard() {
  return (
    <DashboardLayout>
      <OnboardingAdministrationPage />
    </DashboardLayout>
  );
}
