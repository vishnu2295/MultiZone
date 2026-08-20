"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CircularProgress from "@mui/material/CircularProgress";

import QuickQuoteInputs from "./quick-quote-journey/QuickQuoteInputs";
import AdjustCoverageStep from "./quick-quote-journey/AdjustCoverageStep";
import Toast from "@/components/ui/Toast";
import FullQuoteCapture from "./full-quote-journey/FullQuoteCapture";
import {
  createFullQuote,
  normaliseQuote,
  getQuotesByLead,
  type Quote,
} from "@/lib/api/quotes";
import { getLead } from "@/lib/api/leads";

interface QuoteJourneyPageProps {
  leadId: string;
  leadReference: string;
  companyName: string;
  initialType?: "quick" | "full";
  initialStep?: number;
  initialMode?: string;
  from?: string;
}

type Step = "LOADING" | "QUICK_QUOTE" | "ADJUST_COVERAGE" | "FULL_QUOTE";

interface FormData {
  employees: string;
  genderSplit: string;
  averageAge: string;
  averageIncome: string;
  province: string;
  industry: string;
  cellphone: string;
}

interface QuickQuotePassData {
  employees: string;
  genderSplit: string;
  averageAge: string;
  averageIncome: string;
  province: string;
  industry: string;
}

export default function QuoteJourneyPage({
  leadId,
  leadReference,
  companyName,
  initialType,
  initialStep,
  initialMode,
  from,
}: QuoteJourneyPageProps) {
  const getInitialStep = (): Step => {
    if (initialType === "quick") return "QUICK_QUOTE";
    if (initialType === "full") return "FULL_QUOTE";
    return "LOADING";
  };

  const router = useRouter();
  const [step, setStep] = useState<Step>(getInitialStep());
  const [generatedQuote, setGeneratedQuote] = useState<Quote | null>(null);
  const [hasActiveFullQuote, setHasActiveFullQuote] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  function showToast(msg: string) {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  }
  const [quoteError, setQuoteError] = useState<string | null>(null);
  const [, setQuickQuoteData] = useState<QuickQuotePassData | null>(null);
  const [forceFullQuoteStep, setForceFullQuoteStep] = useState<number | null>(
    null
  );
  const [formData, setFormData] = useState<FormData>({
    employees: "",
    genderSplit: "",
    averageAge: "",
    averageIncome: "",
    province: "",
    industry: "",
    cellphone: "",
  });
  const [leadEmployeeCount, setLeadEmployeeCount] = useState<string>("");

  const hasAutoNavigated = useRef(false);
  const stepRef = useRef(step);

  useEffect(() => {
    stepRef.current = step;
  }, [step]);

  const handleSaveQuickQuoteData = async (
    coverageData: any,
    targetType: string,
    targetStatus: string
  ) => {
    let res;
    const payload = {
      quote_status: targetStatus,
      quote_type: targetType,
      workforce_count: parseInt(formData.employees, 10),
      average_age: parseInt(formData.averageAge, 10),
      average_salary: parseFloat(formData.averageIncome),
      province: formData.province,
      industry: formData.industry,
      gender_split: formData.genderSplit,
      total_premium: coverageData?.totalMonthlyPremium || 0,
      benefits: [
        {
          benefit_type: "Life Cover",
          cover_amount: coverageData?.lifeCover || 0,
          premium_amount:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "LIFE" ||
                b.benefit_name?.toUpperCase() === "LIFE COVER" ||
                b.benefit_name === "Life Cover"
            )?.premium_amount || 0,
          premium_rate:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "LIFE" ||
                b.benefit_name?.toUpperCase() === "LIFE COVER" ||
                b.benefit_name === "Life Cover"
            )?.premium_rate || 0,
        },
        {
          benefit_type: "Funeral Cover",
          cover_amount: coverageData?.funeralCover || 0,
          premium_amount:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "FUNERAL" ||
                b.benefit_name?.toUpperCase() === "FUNERAL COVER" ||
                b.benefit_name === "Funeral Cover"
            )?.premium_amount || 0,
          premium_rate:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "FUNERAL" ||
                b.benefit_name?.toUpperCase() === "FUNERAL COVER" ||
                b.benefit_name === "Funeral Cover"
            )?.premium_rate || 0,
        },
        {
          benefit_type: "Occupational Disability",
          cover_amount: coverageData?.occupationalDisability || 0,
          premium_amount:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "OCCUPATIONAL DISABILITY" ||
                b.benefit_name?.toUpperCase() === "OCCUPATIONAL DISABILITY" ||
                b.benefit_name === "Occupational Disability"
            )?.premium_amount || 0,
          premium_rate:
            coverageData?.benefitBreakdown?.find(
              (b: any) =>
                b.benefit_type?.toUpperCase() === "OCCUPATIONAL DISABILITY" ||
                b.benefit_name?.toUpperCase() === "OCCUPATIONAL DISABILITY" ||
                b.benefit_name === "Occupational Disability"
            )?.premium_rate || 0,
        },
      ],
    };

    if (generatedQuote?.quoteId) {
      const { updateQuote } = await import("@/lib/api/quotes");
      res = await updateQuote(generatedQuote.quoteId, payload);
    } else {
      const { createQuickQuote } = await import("@/lib/api/quotes");
      res = await createQuickQuote({ lead_id: leadId, ...payload });
    }
    return res;
  };

  useEffect(() => {
    if (leadId) {
      getLead(leadId)
        .then((lead) => {
          if (lead.numberOfEmployees) {
            setLeadEmployeeCount(lead.numberOfEmployees.toString());
          }
        })
        .catch((err) => console.error("Failed to fetch lead", err));

      getQuotesByLead(leadId)
        .then((res) => {
          if (res.success && res.data.quotes.length > 0) {
            const draftQuote = res.data.quotes.find(
              (q) => q.status === "Draft"
            );
            const generatedQuickQuote = res.data.quotes.find(
              (q) => q.status === "Generated" && q.quoteType === "Quick Quote"
            );

            const activeFullQuoteExists = res.data.quotes.some(
              (q) =>
                q.quoteType === "Full Quote" &&
                (q.status === "Draft" ||
                  q.status === "Generated" ||
                  q.status === "Revised" ||
                  q.status === "Accepted")
            );
            setHasActiveFullQuote(activeFullQuoteExists);

            if (initialMode === "new") {
              return;
            }

            let targetQuote = draftQuote;

            if (initialMode === "reprice") {
              const activeFullQuote = res.data.quotes.find(
                (q) =>
                  (q.status === "Generated" ||
                    q.status === "Accepted" ||
                    q.status === "Revised") &&
                  q.quoteType === "Full Quote"
              );
              if (activeFullQuote) {
                targetQuote = activeFullQuote;
              }
            }

            const currentStep = stepRef.current;

            if (targetQuote && targetQuote.quoteType === "Full Quote") {
              setGeneratedQuote(targetQuote);
              if (generatedQuickQuote) {
                setQuickQuoteData({
                  employees:
                    generatedQuickQuote.numberOfEmployees?.toString() || "",
                  genderSplit: generatedQuickQuote.genderSplit || "",
                  averageAge: generatedQuickQuote.averageAge?.toString() || "",
                  averageIncome:
                    generatedQuickQuote.averageMonthlyIncome?.toString() || "",
                  province: generatedQuickQuote.province || "",
                  industry: generatedQuickQuote.industry || "",
                });
              }
              if (!hasAutoNavigated.current && currentStep === "LOADING") {
                setStep("FULL_QUOTE");
                hasAutoNavigated.current = true;
              }
            } else if (
              targetQuote &&
              targetQuote.quoteType === "Quick Quote" &&
              currentStep !== "FULL_QUOTE"
            ) {
              setGeneratedQuote(targetQuote);
              setFormData({
                employees: targetQuote.numberOfEmployees?.toString() || "",
                genderSplit: targetQuote.genderSplit || "",
                averageAge: targetQuote.averageAge?.toString() || "",
                averageIncome:
                  targetQuote.averageMonthlyIncome?.toString() || "",
                province: targetQuote.province || "",
                industry: targetQuote.industry || "",
                cellphone: "",
              });

              // Start at ADJUST_COVERAGE since it's an existing draft
              if (
                !hasAutoNavigated.current &&
                (currentStep === "LOADING" || currentStep === "QUICK_QUOTE")
              ) {
                setStep("ADJUST_COVERAGE");
                hasAutoNavigated.current = true;
              }
            } else if (generatedQuickQuote && currentStep === "FULL_QUOTE") {
              // Pre-fill quick quote data so the Full Quote step has it
              setQuickQuoteData({
                employees:
                  generatedQuickQuote.numberOfEmployees?.toString() || "",
                genderSplit: generatedQuickQuote.genderSplit || "",
                averageAge: generatedQuickQuote.averageAge?.toString() || "",
                averageIncome:
                  generatedQuickQuote.averageMonthlyIncome?.toString() || "",
                province: generatedQuickQuote.province || "",
                industry: generatedQuickQuote.industry || "",
              });
            }
          }
        })
        .catch((err) => console.error("Failed to fetch quotes for lead", err));
    }
  }, [leadId, initialMode]);

  if (step === "QUICK_QUOTE") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ px: "24px", pt: "24px" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "var(--text-primary)",
              mb: "24px",
            }}
          >
            Quick Cost Estimate
          </Typography>
        </Box>
        <Box sx={{ px: "24px", pb: "24px" }}>
          <QuickQuoteInputs
            formData={formData}
            onFormChange={setFormData}
            onBack={() => {
              if (initialMode === "new") {
                router.push(
                  `/quotes/new?leadId=${leadId}&ref=${leadReference}&company=${encodeURIComponent(companyName)}&mode=new${from ? `&from=${from}` : ""}&leadEmployeeCount=${leadEmployeeCount || ""}`
                );
              } else {
                router.push("/lead/view");
              }
            }}
            onGenerateQuote={(quoteData) => {
              if (quoteData) {
                setGeneratedQuote(normaliseQuote(quoteData));
              }
              setStep("ADJUST_COVERAGE");
            }}
            leadId={leadId}
            quoteId={generatedQuote?.quoteId}
            onDraftSaved={() => {
              showToast("Draft saved successfully");
              setTimeout(() => {
                router.push("/lead/view");
              }, 1200);
            }}
          />
        </Box>
        {toast && <Toast message={toast} />}
      </Box>
    );
  }

  if (step === "ADJUST_COVERAGE") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ px: "24px", pt: "24px" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "var(--text-primary)",
              mb: "24px",
            }}
          >
            Quick Cost Estimate
          </Typography>
        </Box>
        <Box sx={{ px: "24px", pb: "24px" }}>
          {quoteError && (
            <Typography
              sx={{
                color: "var(--destructive)",
                fontSize: "0.875rem",
                mb: "12px",
              }}
            >
              {quoteError}
            </Typography>
          )}
          <AdjustCoverageStep
            onBack={() => setStep("QUICK_QUOTE")}
            employeeCount={parseInt(formData.employees, 10) || 0}
            averageAge={parseInt(formData.averageAge, 10) || 35}
            averageIncome={parseFloat(formData.averageIncome) || 0}
            province={formData.province}
            industry={formData.industry}
            companyName={companyName}
            genderMix={formData.genderSplit}
            quoteReference={generatedQuote?.quoteReference || ""}
            disableFullQuote={hasActiveFullQuote}
            onGenerateQuote={async (coverageData) => {
              setQuoteError(null);
              try {
                const res = await handleSaveQuickQuoteData(
                  coverageData,
                  "Quick",
                  "Generated"
                );
                setGeneratedQuote(normaliseQuote(res.data));
                setQuickQuoteData({
                  employees: formData.employees,
                  genderSplit: formData.genderSplit,
                  averageAge: formData.averageAge,
                  averageIncome: formData.averageIncome,
                  province: formData.province,
                  industry: formData.industry,
                });
                showToast("Quote generated successfully");
              } catch (err: any) {
                setQuoteError(
                  err.message ?? "Failed to generate quote. Please try again."
                );
              }
            }}
            onContinueToFull={async (coverageData: any) => {
              try {
                const res = await handleSaveQuickQuoteData(
                  coverageData,
                  "Full",
                  "Draft"
                );
                setGeneratedQuote(normaliseQuote(res.data));
              } catch (err) {
                console.error("Failed to patch api on continue:", err);
              }

              setQuickQuoteData({
                employees: formData.employees,
                genderSplit: formData.genderSplit,
                averageAge: formData.averageAge,
                averageIncome: formData.averageIncome,
                province: formData.province,
                industry: formData.industry,
              });

              const params = new URLSearchParams(window.location.search);
              params.set("type", "full");
              params.set("leadEmployeeCount", leadEmployeeCount || "");
              window.history.pushState({}, "", `?${params.toString()}`);
              setForceFullQuoteStep(0);
              setStep("FULL_QUOTE");
            }}
          />
        </Box>
        {toast && <Toast message={toast} />}
      </Box>
    );
  }

  if (step === "FULL_QUOTE") {
    return (
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Box sx={{ px: "24px", pt: "24px" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.2,
              color: "var(--text-primary)",
              mb: "24px",
            }}
          >
            Full Quote
          </Typography>
        </Box>
        <Box sx={{ px: "24px", pb: "24px" }}>
          {quoteError && (
            <Typography
              sx={{
                color: "var(--destructive)",
                fontSize: "0.875rem",
                mb: "12px",
              }}
            >
              {quoteError}
            </Typography>
          )}
          <FullQuoteCapture
            companyName={companyName}
            leadReference={leadReference}
            draftQuoteData={generatedQuote}
            quoteReference={generatedQuote?.quoteReference || ""}
            leadId={leadId}
            initialStep={
              forceFullQuoteStep !== null
                ? forceFullQuoteStep
                : generatedQuote?.quoteType === "Quick Quote"
                  ? 0
                  : initialStep
            }
            isRepriceMode={initialMode === "reprice"}
            initialMode={initialMode}
            onBack={() => {
              if (initialMode === "new") {
                router.push(
                  `/quotes/new?leadId=${leadId}&ref=${leadReference}&company=${encodeURIComponent(companyName)}&mode=new${from ? `&from=${from}` : ""}&leadEmployeeCount=${leadEmployeeCount || ""}`
                );
              } else {
                router.push("/lead/view");
              }
            }}
            onDraftSaved={() => {
              showToast("Draft saved successfully");
              setTimeout(() => router.push("/lead/view"), 1200);
            }}
            onGenerate={async (data) => {
              setQuoteError(null);
              try {
                if (data.quote_status === "Draft" && data.step !== undefined) {
                  const { updateLead } = await import("@/lib/api/leads");
                  await updateLead(leadId, { lastSavedStep: data.step });
                }

                const buildUpdatePayload = (extraFields: any = {}) => ({
                  product_id: data.product_id,
                  rma_member_number: data.rma_member_number,
                  is_permanent_employees: data.is_permanent_employees,
                  is_actively_at_work: data.is_actively_at_work,
                  is_replacing_policy: data.is_replacing_policy,
                  replaced_policy_includes_disability:
                    data.replaced_policy_includes_disability,
                  is_policy_older_than_6_months:
                    data.is_policy_older_than_6_months,
                  replaced_policy_start_date: data.replaced_policy_start_date,
                  generate_options: data.generate_options,
                  total_premium: data.total_premium,
                  quote_status: data.quote_status,
                  ...extraFields,
                });

                let res;
                if (initialMode === "reprice" && generatedQuote?.quoteId) {
                  const { repriceQuote, updateQuote } =
                    await import("@/lib/api/quotes");

                  if (data.quote_status !== "Draft") {
                    // First reprice with the new benefits
                    res = await repriceQuote(generatedQuote.quoteId, {
                      benefits: data.benefits,
                    });

                    // Then update the quote with any new details (e.g. status)
                    await updateQuote(
                      generatedQuote.quoteId,
                      buildUpdatePayload()
                    );

                    const quote = normaliseQuote(res.data);
                    // Ensure quoteId is preserved even if the API response omits it
                    quote.quoteId = generatedQuote.quoteId;
                    setGeneratedQuote(quote);
                    showToast("Quote repriced successfully");
                    setTimeout(
                      () =>
                        router.push(
                          `/quotes/${generatedQuote.quoteId}/preview`
                        ),
                      1500
                    );
                    return quote;
                  } else {
                    // Just save the draft via patch api, do not reprice or navigate yet
                    res = await updateQuote(
                      generatedQuote.quoteId,
                      buildUpdatePayload({
                        benefits: data.benefits,
                      })
                    );
                    return normaliseQuote(res.data);
                  }
                } else if (generatedQuote?.quoteId) {
                  const { updateQuote } = await import("@/lib/api/quotes");
                  res = await updateQuote(
                    generatedQuote.quoteId,
                    buildUpdatePayload({
                      benefits: data.benefits,
                      quote_type: "Full",
                    })
                  );
                } else {
                  res = await createFullQuote({
                    lead_id: leadId,
                    ...buildUpdatePayload({
                      province: data.province,
                      industry: data.industry,
                      benefits: data.benefits,
                      employees: data.employees,
                      step: data.step,
                    }),
                  });
                }
                const quote = normaliseQuote(res.data);
                setGeneratedQuote(quote);
                if (data.quote_status === "Generated") {
                  showToast("Quote generated successfully");
                }
                return quote;
              } catch (err: any) {
                setQuoteError(err.message ?? "Failed to generate quote.");
                throw err;
              }
            }}
          />
        </Box>
        {toast && <Toast message={toast} />}
      </Box>
    );
  }

  if (step === "LOADING") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
          minHeight: "400px",
        }}
      >
        <CircularProgress sx={{ color: "var(--primary)" }} />
      </Box>
    );
  }

  return null;
}
