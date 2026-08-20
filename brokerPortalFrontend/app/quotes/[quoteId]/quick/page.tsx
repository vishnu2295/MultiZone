import DashboardLayout from "@/components/layout/DashboardLayout";
import QuickQuotePreviewPage from "@/features/lead/quote/QuickQuotePreviewPage";

interface QuickQuoteRouteProps {
  params: Promise<{ quoteId: string }>;
}

export default async function QuickQuoteRoute({
  params,
}: QuickQuoteRouteProps) {
  const { quoteId } = await params;

  return (
    <DashboardLayout>
      <QuickQuotePreviewPage quoteId={quoteId} />
    </DashboardLayout>
  );
}
