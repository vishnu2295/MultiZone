"use client";

import DashboardLayout from "../../../components/layout/DashboardLayout";
import ReviewAndOnboardPage from "../../../features/onboardingAdministration/reviewAndOnboardPage";

export default function ReviewAndOnboardRoute() {
  return (
    <DashboardLayout showHeader={false}>
      <ReviewAndOnboardPage />
    </DashboardLayout>
  );
}
