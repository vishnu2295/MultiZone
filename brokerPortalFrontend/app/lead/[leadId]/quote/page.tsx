import DashboardLayout from "@/components/layout/DashboardLayout";
import QuoteJourneyPage from "@/features/lead/quote/QuoteJourneyPage";

interface QuotePageProps {
  params: Promise<{ leadId: string }>;
  searchParams: Promise<{ 
    ref?: string; 
    company?: string;
    type?: string;
    step?: string;
    mode?: string;
    from?: string;
  }>;
}

export default async function QuoteRoute({ params, searchParams }: QuotePageProps) {
  const { leadId } = await params;
  const { ref, company, type, step, mode, from } = await searchParams;

  const leadReference = ref || leadId;
  const companyName = company ? decodeURIComponent(company) : "";
  const quoteType = type as "quick" | "full" | undefined;
  const initialStep = step ? parseInt(step, 10) : undefined;
  const initialMode = mode;

  return (
    <DashboardLayout>
      <QuoteJourneyPage 
        leadId={leadId}
        leadReference={leadReference} 
        companyName={companyName}
        initialType={quoteType}
        initialStep={initialStep}
        initialMode={initialMode}
        from={from}
      />
    </DashboardLayout>
  );
}