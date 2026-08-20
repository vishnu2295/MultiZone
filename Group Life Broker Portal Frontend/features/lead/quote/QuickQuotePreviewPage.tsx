"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import { getQuote, Quote } from "@/lib/api/quotes";
import { Download } from "lucide-react";
import CoverSummary from "@/components/ui/CoverSummary";
import { BackButton } from "@/components/ui/StepButtons";

const sectionHeading: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 600,
  color: "#1FC3EB",
  marginBottom: "12px",
  textTransform: "uppercase" as const,
  letterSpacing: "0.04em",
};

const fieldLabel: React.CSSProperties = {
  fontSize: "0.75rem",
  color: "var(--text-secondary)",
  marginBottom: "2px",
};

const fieldValue: React.CSSProperties = {
  fontSize: "0.875rem",
  color: "var(--text-primary)",
  fontWeight: 500,
};

const divider: React.CSSProperties = {
  borderTop: "1px solid var(--border)",
  margin: "0",
};

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p style={fieldLabel}>{label}</p>
      <p style={fieldValue}>{value}</p>
    </div>
  );
}

interface QuickQuotePreviewPageProps {
  quoteId: string;
}

export default function QuickQuotePreviewPage({
  quoteId,
}: QuickQuotePreviewPageProps) {
  const router = useRouter();
  const [quoteData, setQuoteData] = useState<Quote | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchQuote() {
      try {
        const res = await getQuote(quoteId);
        if (!cancelled) {
          setQuoteData(res.data ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch quick quote:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchQuote();

    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  if (loading) {
    return (
      <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          Loading quote details...
        </Typography>
      </Box>
    );
  }

  if (!quoteData) {
    return (
      <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          Failed to load quote details.
        </Typography>
      </Box>
    );
  }

  const empName = quoteData?.companyName || "—";
  const regNum =
    quoteData?.registrationNumber || quoteData?.leadReference || "—";
  const ind = quoteData?.industry || "—";
  const empCount = quoteData?.numberOfEmployees;
  const prov = quoteData?.province || "—";
  const cPhone = quoteData?.contactMobile || "—";
  const mPremium = quoteData?.monthlyPremium ?? 0;

  const coverageAmount = quoteData?.coverageAmount ?? 0;

  const genderSplit = quoteData?.genderSplit || "—";
  const averageAge = quoteData?.averageAge?.toString() ?? "—";
  const averageIncome = quoteData?.averageMonthlyIncome?.toString() ?? "—";

  // Life cover falls back to the total coverageAmount if not explicitly provided
  const lifeCover = Number(quoteData?.lifeCover ?? coverageAmount) || 0;
  const funeralCover = Number(quoteData?.funeralCover) || 0;
  const occupationalDisability = Number(quoteData?.occupationalDisability) || 0;
  const totalCover = lifeCover + funeralCover + occupationalDisability;
  const totalMonthlyPremium = Number(mPremium) || 0;

  return (
    <Box
      sx={{
        p: 4,
        maxWidth: "1200px",
        mx: "auto",
        display: "flex",
        flexDirection: "column",
        gap: "24px",
      }}
    >
      <h2
        style={{
          fontSize: "1.125rem",
          fontWeight: 600,
          color: "var(--text-primary)",
          marginBottom: "24px",
        }}
      >
        Quick Cost Estimate
      </h2>

      <div
        style={{
          background: "var(--card-secondary)",
          border: "0.63px solid var(--border)",
          borderRadius: "10px",
          padding: "24px",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          flex: 1,
        }}
      >
        {/* Card header row */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span
            style={{
              fontSize: "1rem",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Quote Details
          </span>
          <Button
            variant="text"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "6px",
              color: "var(--text-secondary)",
              fontSize: "0.8125rem",
              padding: "4px 8px",
              borderRadius: "6px",
              textTransform: "none",
              minWidth: "auto",
              "&:hover": {
                color: "var(--text-primary)",
                background: "transparent",
              },
            }}
          >
            <Download size={14} />
            Download
          </Button>
        </div>

        <div style={divider} />

        {/* Company Details */}
        <div>
          <p style={sectionHeading}>Company Details</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Field label="Company Name" value={empName} />
            <Field label="Registration Number" value={regNum} />
            <Field label="Phone Number" value={cPhone} />
          </div>
        </div>

        <div style={divider} />

        {/* Quote Details */}
        <div>
          <p style={sectionHeading}>Quote Details</p>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
              marginBottom: "12px",
            }}
          >
            <Field label="Employees Covered" value={String(empCount || "—")} />
            <Field label="Average Age" value={averageAge} />
            <Field
              label="Average Income"
              value={
                averageIncome !== "—"
                  ? `R ${Number(averageIncome).toLocaleString("en-ZA")}`
                  : "—"
              }
            />
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: "16px",
            }}
          >
            <Field label="Gender Split" value={genderSplit} />
            <Field label="Province" value={prov} />
            <Field label="Industry" value={ind} />
          </div>
        </div>

        <div style={divider} />

        {/* Cover Details */}
        <div>
          <p style={sectionHeading}>Cover Details</p>
          <CoverSummary
            lifeCover={lifeCover}
            funeralCover={funeralCover}
            occupationalDisability={occupationalDisability}
            totalCover={totalCover}
            totalMonthlyPremium={totalMonthlyPremium}
          />
        </div>
      </div>

      {/* Action buttons — outside card */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <BackButton onClick={() => router.back()} />
      </div>
    </Box>
  );
}
