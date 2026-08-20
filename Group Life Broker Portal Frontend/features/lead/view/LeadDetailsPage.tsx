"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Card from "@mui/material/Card";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import AddIcon from "@mui/icons-material/Add";

import { getLead, LeadDetail, cancelLead } from "@/lib/api/leads";
import CustomSelect from "@/components/ui/CustomSelect";
import PreviousQuoteCard from "@/components/ui/PreviousQuoteCard";
import CustomButton from "@/components/ui/button";
import ActivitySlider from "@/components/lead/ActivitySlider";
import CancelLeadModal from "@/components/ui/CancelLeadModal";
import Toast from "@/components/ui/Toast";

interface LeadDetailsPageProps {
  leadId: string;
}

interface Quote {
  quoteId: string;
  quoteReference: string;
  quoteType: "Quick Quote" | "Full Quote";
  status: string;
  monthlyPremium: number;
  coverageAmount: number;
  createdAt: string;
}

export default function LeadDetailsPage({ leadId }: LeadDetailsPageProps) {
  const router = useRouter();
  const [lead, setLead] = useState<LeadDetail | null>(null);
  const [quotes, setQuotes] = useState<Quote[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isAuditLogOpen, setIsAuditLogOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        const data = await getLead(leadId);
        setLead(data);
        setQuotes(data.quotes || []);
      } catch (error) {
        console.error("Could not fetch lead from API:", error);
        setError("Failed to load lead details. Please try again.");
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          color: "#A0A0A0",
        }}
      >
        Loading lead details...
      </Box>
    );
  }

  if (error || !lead) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          color: "#A0A0A0",
        }}
      >
        {error || "Lead not found"}
      </Box>
    );
  }

  return (
    <main className="flex-1 p-6" style={{ background: "var(--background)" }}>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Lead Details Header with Action Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: "18px",
              fontWeight: 500,
              lineHeight: "36px",
              letterSpacing: "0.0703125px",
              color: "var(--text-primary)",
              margin: 0,
            }}
          >
            Lead Details
          </h2>

          <Box sx={{ display: "flex", gap: "12px" }}>
            {/* Actions Dropdown */}
            <Box sx={{ width: "160px" }}>
              <CustomSelect
                value=""
                onChange={(e: any) => {
                  const val = e.target.value;
                  if (val === "audit") {
                    setIsAuditLogOpen(true);
                  } else if (val === "edit") {
                    router.push(`/lead/${leadId}/edit`);
                  } else if (val === "cancel") {
                    setIsCancelModalOpen(true);
                  }
                }}
                displayEmpty
                renderValue={() => "Actions"}
                sx={{
                  height: "40px",
                  "& .MuiSelect-select": {
                    display: "flex",
                    alignItems: "center",
                    paddingTop: 0,
                    paddingBottom: 0,
                    height: "100%",
                  },
                }}
              >
                <option value="audit">View Audit Log</option>
                {![
                  "Accepted",
                  "Onboarding Submitted",
                  "Approved",
                  "Rejected",
                  "Cancelled",
                ].includes(lead.leadStatus) && (
                  <option value="edit">Edit</option>
                )}
                {![
                  "Accepted",
                  "Onboarding Submitted",
                  "Approved",
                  "Rejected",
                  "Cancelled",
                ].includes(lead.leadStatus) && (
                  <option value="cancel" style={{ color: "#FE7F7F" }}>
                    Mark as Cancelled
                  </option>
                )}
              </CustomSelect>
            </Box>

            {/* New Quote Button */}
            {!(
              ["Accepted", "Cancelled"].includes(lead.leadStatus) ||
              quotes.some((q) => q.status === "Accepted")
            ) && (
              <CustomButton
                onClick={() => {
                  router.push(
                    `/quotes/new?leadId=${leadId}${lead ? `&ref=${lead.leadReference}&company=${encodeURIComponent(lead.employerName)}` : ""}&leadEmployeeCount=${lead.numberOfEmployees}&mode=new`
                  );
                }}
                variant="primary"
                size="md"
                startIcon={<AddIcon sx={{ fontSize: 20 }} />}
                sx={{ width: "135px" }}
              >
                New Quote
              </CustomButton>
            )}
          </Box>
        </Box>

        <Divider sx={{ borderColor: "var(--border)", marginBottom: "31px" }} />

        {/* Lead Details Card */}
        <Card
          sx={{
            boxSizing: "border-box",
            background: "var(--card-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "12px",
            p: "25px",
            marginBottom: "31px",
            boxShadow: "none",
          }}
        >
          {/* Employer Details */}
          <Box sx={{ marginBottom: "40px" }}>
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "27px",
                letterSpacing: "-0.439453px",
                color: "var(--text-primary)",
                margin: "0 0 12px 0",
              }}
            >
              Employer Details
            </h3>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Company Name
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {lead.employerName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Registration Number
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {lead.registrationNumber || "N/A"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Industry
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    textTransform: "capitalize",
                  }}
                >
                  {(lead as any).industry || "N/A"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Number of Employees
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {lead.numberOfEmployees}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Province
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {(lead as any).province || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>

          <Divider sx={{ borderColor: "var(--border)", my: "25px" }} />

          {/* Contact Details */}
          <Box>
            <h3
              style={{
                fontFamily: "'Inter', sans-serif",
                fontSize: "18px",
                fontWeight: 700,
                lineHeight: "27px",
                letterSpacing: "-0.439453px",
                color: "var(--text-primary)",
                margin: "0 0 12px 0",
              }}
            >
              Contact Details
            </h3>

            <Grid container spacing={2}>
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Contact Person
                </Typography>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-primary)",
                    fontWeight: 500,
                  }}
                >
                  {lead.contactFirstName} {lead.contactLastName}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Position
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {(lead as any).contactPosition || "N/A"}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Email
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {lead.contactEmail}
                </Typography>
              </Grid>

              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography
                  sx={{
                    fontSize: "14px",
                    color: "var(--text-secondary)",
                    mb: "4px",
                  }}
                >
                  Phone
                </Typography>
                <Typography
                  sx={{ fontSize: "14px", color: "var(--text-primary)" }}
                >
                  {(lead as any).contactPhone || "N/A"}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        </Card>

        {/* Previous Quotes Section */}
        <h2
          style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: "18px",
            fontWeight: 500,
            lineHeight: "36px",
            letterSpacing: "0.0703125px",
            color: "var(--text-primary)",
            margin: "0 0 17px 0",
          }}
        >
          Previous Quotes
        </h2>

        {quotes.length === 0 ? (
          <Box
            sx={{
              background: "var(--card-secondary)",
              border: "1px solid var(--border)",
              borderRadius: "12px",
              p: "40px",
              textAlign: "center",
              color: "var(--text-secondary)",
            }}
          >
            No quotes available for this lead yet.
          </Box>
        ) : (
          <Stack spacing={2}>
            {quotes.map((quote) => (
              <PreviousQuoteCard key={quote.quoteId} quote={quote} />
            ))}
          </Stack>
        )}
      </div>
      <ActivitySlider
        open={isAuditLogOpen}
        onClose={() => setIsAuditLogOpen(false)}
        leadId={leadId}
      />

      <CancelLeadModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={async (reason: string) => {
          try {
            await cancelLead(leadId, reason);
            setLead((prev) =>
              prev ? { ...prev, leadStatus: "Cancelled" } : null
            );
            setIsCancelModalOpen(false);
            showToast("Lead cancelled successfully");
            setTimeout(() => router.push("/lead/view"), 1500);
          } catch (err: any) {
            console.error("Failed to cancel lead:", err);
            alert(err.message || "Failed to cancel lead.");
          }
        }}
      />
      {toast && <Toast message={toast} />}
    </main>
  );
}
