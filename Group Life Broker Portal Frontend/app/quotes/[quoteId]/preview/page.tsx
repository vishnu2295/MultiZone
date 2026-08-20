import DashboardLayout from "@/components/layout/DashboardLayout";
import FullQuotePreviewPage from "@/features/lead/quote/FullQuotePreviewPage";

interface QuotePreviewRouteProps {
  params: Promise<{ quoteId: string }>;
}

export default async function QuotePreviewRoute({
  params,
}: QuotePreviewRouteProps) {
  const { quoteId } = await params;

  return (
    <DashboardLayout>
      <FullQuotePreviewPage quoteId={quoteId} />
    </DashboardLayout>
  );
}
