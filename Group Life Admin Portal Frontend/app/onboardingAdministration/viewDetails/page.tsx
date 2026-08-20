import DashboardLayout from "../../../components/layout/DashboardLayout";
import ViewDetailsPage from "../../../features/onboardingAdministration/viewDetailsPage";

export default function Page() {
  return (
    <DashboardLayout showHeader={false}>
      <ViewDetailsPage />
    </DashboardLayout>
  );
}
