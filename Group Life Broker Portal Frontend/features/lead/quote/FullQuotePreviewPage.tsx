"use client";

import React, { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Divider from "@mui/material/Divider";
import { Download, Settings2 } from "lucide-react";
import { getQuotePreview, formatRand } from "@/lib/api/quotes";

interface QuotePreviewPageProps {
  quoteId: string;
}

const labelStyle = {
  fontSize: "14px",
  color: "var(--text-secondary)",
  mb: "4px",
};

const valueStyle = {
  fontSize: "14px",
  color: "var(--text-primary)",
  fontWeight: 500,
};

const cardSx = {
  bgcolor: "background.paper",
  border: "1px solid var(--border)",
  borderRadius: "12px",
  p: "32px",
  display: "flex",
  flexDirection: "column",
  gap: "32px",
};

const outlinedButtonSx = {
  bgcolor: "transparent",
  borderColor: "var(--border)",
  color: "var(--text-primary)",
  textTransform: "none",
  borderRadius: "8px",
  height: "40px",
  px: "16px",
  fontWeight: 500,
  "&:hover": {
    bgcolor: "var(--border)",
    borderColor: "var(--border)",
  },
};

const sectionHeadingSx = {
  fontSize: "16px",
  fontWeight: 700,
  color: "var(--text-primary)",
  mb: "20px",
};

const VAPS_KEYWORDS = [
  "AUGMENTATION",
  "COMMUTING",
  "RIOT",
  "PERSONAL ACCIDENT",
  "VAPS",
];

const isVapsBenefit = (name: string) =>
  VAPS_KEYWORDS.some((keyword) => name?.toUpperCase().includes(keyword));

const getQuoteDisplayData = (preview: any) => ({
  employerName: preview?.employer_details?.employer_name ?? "",
  registrationNumber: preview?.employer_details?.registration_number ?? "",
  industry: preview?.employer_details?.industry_type ?? "",
  numberOfEmployees: preview?.employer_details?.number_of_employees ?? "",
  province: preview?.employer_details?.province ?? "",
  contactFirstName: preview?.contact_details?.contact_first_name ?? "",
  contactLastName: preview?.contact_details?.contact_last_name ?? "",
  contactEmail: preview?.contact_details?.contact_email ?? "",
  preferredCommunicationMethod:
    preview?.contact_details?.preferred_communication_method ?? "",
  contactPhone: preview?.contact_details?.contact_mobile ?? "",
});

function DetailItem({
  label,
  value,
}: {
  label: string;
  value: React.ReactNode;
}) {
  return (
    <Grid size={{ xs: 12, sm: 3 }}>
      <Typography sx={labelStyle}>{label}</Typography>
      <Typography sx={valueStyle}>{value || "—"}</Typography>
    </Grid>
  );
}

function BenefitRow({
  label,
  value,
  valueWeight = 500,
}: {
  label: string;
  value: React.ReactNode;
  valueWeight?: number;
}) {
  return (
    <Box sx={{ display: "flex", justifyContent: "space-between" }}>
      <Typography sx={{ fontSize: "14px", color: "var(--text-secondary)" }}>
        {label}
      </Typography>
      <Box sx={{ textAlign: "right" }}>
        <Typography
          sx={{
            fontSize: "14px",
            color: "var(--text-primary)",
            fontWeight: valueWeight,
          }}
        >
          {value}
        </Typography>
      </Box>
    </Box>
  );
}

export default function FullQuotePreviewPage({
  quoteId,
}: QuotePreviewPageProps) {
  const router = useRouter();
  const [preview, setPreview] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function fetchPreview() {
      try {
        const res = await getQuotePreview(quoteId);
        if (!cancelled) {
          setPreview(res.data ?? null);
        }
      } catch (error) {
        if (!cancelled) {
          console.error("Failed to fetch quote preview:", error);
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    fetchPreview();

    return () => {
      cancelled = true;
    };
  }, [quoteId]);

  const benefitBreakdown = useMemo(() => {
    return (
      preview?.benefits ||
      preview?.benefitBreakdown ||
      preview?.quote_details?.benefits ||
      preview?.quote?.benefits ||
      preview?.quote?.benefitBreakdown ||
      []
    );
  }, [preview]);

  const generatedDate = useMemo(() => {
    const d =
      preview?.quote_details?.created_at ||
      preview?.quote?.createdAt ||
      preview?.createdAt ||
      preview?.quote_created_at;
    if (d) {
      return new Date(d).toLocaleDateString("en-GB"); // DD/MM/YYYY
    }
    return new Date().toLocaleDateString("en-GB");
  }, [preview]);

  const handleAdjustBenefits = () => {
    const leadId =
      preview?.lead_details?.lead_id ||
      preview?.lead?.lead_id ||
      preview?.leadId ||
      preview?.quote?.lead_id;
    if (leadId) {
      const params = new URLSearchParams();
      params.set("type", "full");
      params.set("step", "1");
      params.set("mode", "reprice");
      router.push(`/lead/${leadId}/quote?${params.toString()}`);
    }
  };

  const handleAcceptQuote = () => {
    if (quoteId) {
      router.push(`/quotes/${quoteId}/checkout?from=preview`);
    }
  };

  if (loading) {
    return (
      <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          Loading quote preview...
        </Typography>
      </Box>
    );
  }

  if (!preview) {
    return (
      <Box sx={{ p: 6, display: "flex", justifyContent: "center" }}>
        <Typography sx={{ color: "var(--text-secondary)" }}>
          Failed to load quote details.
        </Typography>
      </Box>
    );
  }

  const displayData = getQuoteDisplayData(preview);
  const mPremium =
    preview?.quote_details?.total_premium ??
    preview?.quote?.total_premium ??
    preview?.total_premium ??
    preview?.monthlyPremium ??
    preview?.quote?.monthlyPremium ??
    0;

  const benefitsData = benefitBreakdown.map((b: any) => {
    const name = b.benefit_name || b.benefit_type || "";
    const isVaps = isVapsBenefit(name.toUpperCase());

    return {
      name,
      coverAmount: b.cover_amount
        ? b.cover_amount <= 5
          ? `${b.cover_amount}x annual salary`
          : formatRand(b.cover_amount)
        : "Included",
      premiumAmount: isVaps
        ? "included"
        : `${formatRand(b.premium_amount || 0)} pm`,
    };
  });

  const contactDetails = [
    {
      label: "Contact Person",
      value:
        `${displayData.contactFirstName ?? ""} ${displayData.contactLastName ?? ""}`.trim() ||
        "—",
    },
    {
      label: "Email",
      value: displayData.contactEmail,
    },
    {
      label: "Preferred Comm.",
      value: displayData.preferredCommunicationMethod,
    },
    {
      label: "Phone",
      value: displayData.contactPhone,
    },
  ];

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
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Typography
            sx={{
              fontSize: "20px",
              fontWeight: 600,
              color: "var(--text-primary)",
            }}
          >
            Quote Details
          </Typography>
          <Typography sx={{ fontSize: "14px", color: "var(--text-secondary)" }}>
            Generated On {generatedDate}
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: "12px" }}>
          <Button
            variant="outlined"
            startIcon={<Settings2 size={16} />}
            onClick={handleAdjustBenefits}
            sx={outlinedButtonSx}
          >
            Adjust Benefits
          </Button>
          <Button
            variant="outlined"
            startIcon={<Download size={16} />}
            sx={outlinedButtonSx}
          >
            Download PDF
          </Button>
          <Button
            variant="contained"
            onClick={handleAcceptQuote}
            sx={{
              bgcolor: "#1FC3EB",
              color: "#0A0A0A",
              textTransform: "none",
              borderRadius: "8px",
              height: "40px",
              px: "24px",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "#0DB5D8",
              },
            }}
          >
            Accept Quote
          </Button>
        </Box>
      </Box>

      {/* Details Card */}
      <Box sx={cardSx}>
        {/* Employer Details */}
        <Box>
          <Typography sx={sectionHeadingSx}>Employer Details</Typography>
          <Grid container spacing={4}>
            {[
              ["Company Name", displayData.employerName],
              ["Registration Number", displayData.registrationNumber],
              ["Industry", displayData.industry],
              ["Number of Employees", displayData.numberOfEmployees],
              ["Province", displayData.province],
            ].map(([label, value]) => (
              <DetailItem
                key={label as string}
                label={label as string}
                value={value as React.ReactNode}
              />
            ))}
          </Grid>
        </Box>

        <Divider sx={{ borderColor: "var(--border)" }} />

        {/* Contact Details */}
        <Box>
          <Typography sx={sectionHeadingSx}>Contact Details</Typography>
          <Grid container spacing={4}>
            {contactDetails.map(({ label, value }) => (
              <DetailItem key={label} label={label} value={value || "—"} />
            ))}
          </Grid>
        </Box>
      </Box>

      {/* Benefits Selected & Cover Summary Card */}
      <Box sx={cardSx}>
        <Box>
          <Typography sx={sectionHeadingSx}>Benefits Selected</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {benefitsData.map((b: any, i: number) => (
              <BenefitRow key={i} label={b.name} value={b.coverAmount} />
            ))}
            {benefitsData.length === 0 && (
              <Typography
                sx={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                No benefits data available.
              </Typography>
            )}
          </Box>
        </Box>

        <Box>
          <Typography sx={sectionHeadingSx}>Cover summary</Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: "20px" }}>
            {benefitsData.map((b: any, i: number) => (
              <BenefitRow
                key={i}
                label={b.name}
                value={b.premiumAmount}
                valueWeight={600}
              />
            ))}

            <Divider sx={{ borderColor: "var(--border)", my: "4px" }} />

            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography
                sx={{ fontSize: "14px", color: "var(--text-secondary)" }}
              >
                Total
              </Typography>
              <Typography
                sx={{
                  fontSize: "16px",
                  color: "var(--text-primary)",
                  fontWeight: 700,
                }}
              >
                {formatRand(mPremium || 0)}
              </Typography>
            </Box>

            <Typography
              sx={{
                fontSize: "13px",
                color: "var(--text-secondary)",
                textAlign: "center",
                mt: "8px",
              }}
            >
              * The premium is capped at this value for employees who have
              reached the
              <br />
              R2m max cover limit
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}
