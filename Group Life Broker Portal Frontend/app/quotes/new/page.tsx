import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import QuoteTypeSelection from "@/features/quotes/QuoteTypeSelection";

export default function NewQuote() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div>Loading...</div>}>
        <QuoteTypeSelection />
      </Suspense>
    </DashboardLayout>
  );
}
