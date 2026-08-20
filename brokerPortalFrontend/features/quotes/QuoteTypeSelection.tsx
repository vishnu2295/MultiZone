"use client";

import { Suspense, useState, useEffect, useCallback } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import BoltIcon from "@mui/icons-material/FlashOn";
import ListIcon from "@mui/icons-material/FormatListBulleted";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import DashboardCard from "@/components/ui/DashboardCard";
import CircularProgress from "@mui/material/CircularProgress";
import { getLead } from "@/lib/api/leads";

const cardStyle = {
  width: "271px",
  height: "225px",
  minHeight: "225px",
  borderRadius: "16px",
  borderWidth: "0.63px",
  backgroundColor: "var(--quote-card-bg)",
};

const iconWrapperStyle = {
  height: "48px",
  width: "48px",
  minWidth: "48px",
  maxWidth: "48px",
  minHeight: "48px",
  maxHeight: "48px",
  boxSizing: "border-box" as const,
  borderRadius: "16px",
  backgroundColor: "var(--quote-icon-bg)",
  color: "var(--quote-icon-fill)",
  marginBottom: "30px",
};

function QuoteTypeSelectionContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const leadId = searchParams.get("leadId") ?? "";
  const companyName = searchParams.get("company") ?? "";
  const ref = searchParams.get("ref") ?? "";
  const mode = searchParams.get("mode") ?? "";
  const from = searchParams.get("from") ?? "";
  const leadEmployeeCount = searchParams.get("leadEmployeeCount") ?? "";

  const [hasActiveFullQuote, setHasActiveFullQuote] = useState(false);
  const [loading, setLoading] = useState(true);

  const loadLead = useCallback(async () => {
    if (!leadId) {
      setLoading(false);
      return;
    }

    try {
      const lead = await getLead(leadId);

      const active = lead.quotes.some(
        (quote) =>
          quote.quoteType === "Full Quote" &&
          ["Draft", "Generated"].includes(quote.status)
      );

      setHasActiveFullQuote(active);
    } catch (error) {
      console.error("Failed to load lead:", error);
    } finally {
      setLoading(false);
    }
  }, [leadId]);

  useEffect(() => {
    loadLead();
  }, [loadLead]);

  const buildQuoteUrl = (type: "quick" | "full") => {
    const params = new URLSearchParams({
      ref,
      company: companyName,
      type,
    });

    if (mode) params.set("mode", mode);
    if (from) params.set("from", from);

    if (type === "full" && leadEmployeeCount) {
      params.set("leadEmployeeCount", leadEmployeeCount);
    }

    return `/lead/${leadId}/quote?${params.toString()}`;
  };

  const handleQuickQuote = () => {
    router.push(buildQuoteUrl("quick"));
  };

  const handleFullQuote = () => {
    router.push(buildQuoteUrl("full"));
  };

  return (
    <Box
      component="main"
      sx={{
        position: "relative",
        flex: 1,
        overflow: "hidden",
        p: "20px",
        bgcolor: "var(--background)",
      }}
    >
      <Box
        sx={{
          position: "absolute",
          pointerEvents: "none",
          width: "608px",
          height: "608px",
          right: "-200px",
          bottom: "-200px",
          background: "var(--primary)",
          opacity: 0.05,
          filter: "blur(172px)",
          borderRadius: "50%",
        }}
      />

      <Box
        component="section"
        sx={{ position: "relative", mx: "auto", maxWidth: "1280px" }}
      >
        <Box sx={{ px: "4px", py: "16px" }}>
          <Typography
            variant="h1"
            sx={{
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: 1.25,
              color: "var(--text-primary)",
            }}
          >
            Quote Generation
          </Typography>
        </Box>

        <Box sx={{ pt: "12px" }}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
              <CircularProgress sx={{ color: "var(--primary)" }} />
            </Box>
          ) : (
            <>
              <Stack
                direction="row"
                spacing={2}
                useFlexGap
                sx={{ mb: 2, flexWrap: "wrap" }}
              >
                <DashboardCard
                  title="Quick Cost Estimate"
                  description="Simple and Fast! In 30 sec or less"
                  icon={BoltIcon}
                  onClick={handleQuickQuote}
                  style={cardStyle}
                  iconWrapperStyle={iconWrapperStyle}
                />

                <DashboardCard
                  title="Full Quote"
                  description={
                    hasActiveFullQuote
                      ? "Lead already has an active full quote."
                      : "Complete pricing using real names, the income, birthdate, and salary of each employee."
                  }
                  icon={ListIcon}
                  onClick={hasActiveFullQuote ? undefined : handleFullQuote}
                  disabled={hasActiveFullQuote}
                  style={{
                    ...cardStyle,
                    opacity: hasActiveFullQuote ? 0.5 : 1,
                  }}
                  iconWrapperStyle={iconWrapperStyle}
                />
              </Stack>

              <Box
                component="ul"
                sx={{
                  mt: "16px",
                  pl: "20px",
                  color: "var(--quick-action-desc-color)",
                  fontSize: "14px",
                  lineHeight: "20px",
                  listStyleType: "disc",
                }}
              >
                <Box component="li">18 to 64 years old.</Box>
                <Box component="li">
                  Permanently employed or on 6+ month contract.
                </Box>
                <Box component="li">
                  Legally employed & actively working 20+ hours a week in SA.
                </Box>
              </Box>
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
}

export default function QuoteTypeSelection() {
  return (
    <Suspense
      fallback={
        <Box sx={{ px: "24px", pt: "24px", color: "var(--text-primary)" }}>
          Loading...
        </Box>
      }
    >
      <QuoteTypeSelectionContent />
    </Suspense>
  );
}
