import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuoteSummaryPage from "@/features/quotes/QuoteSummaryPage";

export default function Quotes() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteSummaryPage />
      </Suspense>
    </DashboardLayout>
  );
}
