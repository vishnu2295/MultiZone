import { Suspense } from "react";
import DashboardLayout from "@/components/layout/DashboardLayout";
import CheckoutPageContent from "@/features/quotes/checkout/CheckoutPage";

export default function CheckoutPage() {
  return (
    <DashboardLayout>
      <Suspense fallback={<div className="p-8 text-center text-secondary">Loading Checkout Page...</div>}>
        <CheckoutPageContent />
      </Suspense>
    </DashboardLayout>
  );
}
