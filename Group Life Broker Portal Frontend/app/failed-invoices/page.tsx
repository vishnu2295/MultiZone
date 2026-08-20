import DashboardLayout from "@/components/layout/DashboardLayout";
import FailedInvoicesPage from "@/features/invoices/FailedInvoicesPage";

export default function Page() {
  return (
    <DashboardLayout>
      <FailedInvoicesPage />
    </DashboardLayout>
  );
}
