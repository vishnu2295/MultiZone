import DashboardLayout from "@/components/layout/DashboardLayout";
import ApprovalQueue from "@/features/approvalQueue/ApprovalQueuePage";

export default function Page() {
  return (
    <DashboardLayout>
      <ApprovalQueue />
    </DashboardLayout>
  );
}
