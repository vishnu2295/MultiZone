"use client";

import {
  Box,
  Typography,
  Paper,
  Button,
  Grid,
  Divider,
  Chip,
  TextField,
  IconButton,
  Stack,
} from "@mui/material";
import FlagOutlinedIcon from "@mui/icons-material/FlagOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";

interface DetailItemProps {
  label: string;
  value: React.ReactNode;
}

const DetailItem = ({ label, value }: DetailItemProps) => (
  <Box>
    <Typography
      sx={{
        fontSize: 12,
        color: "text.secondary",
        mb: 0.5,
        fontWeight: 400,
      }}
    >
      {label}
    </Typography>
    <Typography
      sx={{
        fontSize: 14,
        color: "text.primary",
        fontWeight: 500,
      }}
    >
      {value}
    </Typography>
  </Box>
);

const SectionTitle = ({ title }: { title: string }) => (
  <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>{title}</Typography>
);

const DetailSection = ({
  title,
  items,
}: {
  title: string;
  items: DetailItemProps[];
}) => (
  <Box>
    <SectionTitle title={title} />
    <Grid container spacing={3}>
      {items.map((item, index) => (
        <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
          <DetailItem label={item.label} value={item.value} />
        </Grid>
      ))}
    </Grid>
  </Box>
);

const CLAIM_DATA = {
  timeline: [
    { label: "Date of Event/Incident", value: "23-04-2026" },
    { label: "Submission Date", value: "01-05-2026" },
    { label: "Assessment/Decision Date", value: "Pending" },
    { label: "Payout / Settlement Date", value: "Pending" },
  ],
  claimantDetails: [
    { label: "Name", value: "Sandra Nkosi" },
    { label: "SA ID", value: "846736527263625" },
    { label: "Relationship", value: "Son" },
    { label: "Event Cause", value: "Medical Illness" },
    { label: "Claim Category", value: "Disability Claim" },
    { label: "Subcategory", value: "Permanent Disability" },
    { label: "Assigned Assessor", value: "Lerato Asses" },
    { label: "Contact Number", value: "+27 3243433333" },
    { label: "Email Address", value: "sandra@gmail.com" },
  ],
  financialSummary: [
    { label: "Claim Amount Requested", value: "150,000" },
    { label: "Approved Payout Amount", value: "Pending" },
    { label: "Repudiated Amount", value: "R 0" },
    { label: "Repudiation Reason", value: "N/A" },
  ],
  bankingDetails: [
    { label: "Account Holder Name", value: "John Doe" },
    { label: "Bank Name", value: "FNB" },
    { label: "Account Type", value: "Savings" },
    { label: "Account Number", value: "3474387473847374" },
    { label: "Bank Code", value: "FNB73643434" },
  ],
  complianceAudit: [
    { label: "VDPD Verification Check", value: "John Doe" },
    { label: "AML Audit Check", value: "Passed" },
    { label: "Waiting Period Status", value: "Satisfied" },
    { label: "Contestability Check", value: "Passed (Clear)" },
    { label: "System Fraud Risk Score", value: "Low Risk" },
  ],
};

const DOCUMENTS = [
  { title: "ID DOCUMENT", subtext: "2023-03-01 - PDF" },
  { title: "Death_certificate", subtext: "2023-03-01 - PDF" },
];

export default function ClaimDetailsPage() {
  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Claim Details
      </Typography>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 3,
          boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
          border: "none",
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
          }}
        >
          <Box>
            <Typography sx={{ fontSize: 18, fontWeight: 700, mb: 0.5 }}>
              CLM-2026-003
            </Typography>
            <Typography sx={{ fontSize: 14, color: "text.secondary" }}>
              Policy No : 23982789329832 | Brokerage :{" "}
              <Box component="strong" sx={{ color: "text.primary" }}>
                Kenn Brokerage
              </Box>
            </Typography>
          </Box>
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Button
              variant="outlined"
              color="inherit"
              startIcon={<FlagOutlinedIcon fontSize="small" />}
              sx={{
                borderColor: "divider",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: 600,
                color: "text.primary",
                height: 36,
              }}
            >
              Flag for Follow-up
            </Button>
            <Chip
              label="Pending"
              sx={{
                bgcolor: "#FFF3E0",
                color: "#E65100",
                fontWeight: 600,
                borderRadius: 1.5,
                height: 36,
                px: 1,
              }}
            />
          </Box>
        </Box>

        <Divider />

        <DetailSection
          title="Processing & Event Timeline"
          items={CLAIM_DATA.timeline}
        />
        <Divider />

        <DetailSection
          title="Claimant Details & Classification"
          items={CLAIM_DATA.claimantDetails}
        />
        <Divider />

        <DetailSection
          title="Financial Summary"
          items={CLAIM_DATA.financialSummary}
        />
        <Divider />

        <DetailSection
          title="Claimant Payout Banking Details"
          items={CLAIM_DATA.bankingDetails}
        />
        <Divider />

        <DetailSection
          title="Risk & Compliance Verification Audit"
          items={CLAIM_DATA.complianceAudit}
        />
        <Divider />

        {/* Required Documents Checklist */}
        <Box>
          <SectionTitle title="Required Documents Checklist" />
          <Stack spacing={2}>
            {DOCUMENTS.map((doc, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  border: "1px solid",
                  borderColor: "divider",
                  borderRadius: 2,
                  p: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <Box
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: 1.5,
                      bgcolor: "primary.50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <DescriptionOutlinedIcon
                      color="primary"
                      sx={{ fontSize: 18 }}
                    />
                  </Box>
                  <Box>
                    <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                      {doc.title}
                    </Typography>
                    <Typography sx={{ fontSize: 11, color: "text.secondary" }}>
                      {doc.subtext}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small">
                    <VisibilityOutlinedIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </IconButton>
                  <IconButton size="small">
                    <FileDownloadOutlinedIcon
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </IconButton>
                </Box>
              </Box>
            ))}
          </Stack>
        </Box>

        <Divider />

        {/* Notes */}
        <Box>
          <SectionTitle title="Notes" />
          <Typography sx={{ fontSize: 13, fontWeight: 600, mb: 1 }}>
            Add your notes here{" "}
            <Box component="span" sx={{ color: "error.main" }}>
              *
            </Box>
          </Typography>
          <Box sx={{ display: "flex", gap: 2, alignItems: "flex-start" }}>
            <TextField
              fullWidth
              placeholder="Enter your notes"
              sx={{
                height: "52px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: 2,
                },
              }}
            />
            <Button
              variant="contained"
              sx={{
                bgcolor: "#00C3F9",
                color: "white",
                "&:hover": { bgcolor: "#00B0E0" },
                textTransform: "none",
                fontWeight: 600,
                borderRadius: 2,
                px: 3,
                height: 48,
                flexShrink: 0,
                mt: 1,
              }}
            >
              Add Notes
            </Button>
          </Box>
        </Box>

        {/* Bottom Actions */}
        <Box
          sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 2 }}
        >
          <Button
            variant="text"
            color="inherit"
            sx={{
              textTransform: "none",
              fontWeight: 600,
              color: "text.secondary",
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{
              bgcolor: "#00C3F9",
              color: "white",
              "&:hover": { bgcolor: "#00B0E0" },
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
            }}
          >
            Submit For Approval
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
