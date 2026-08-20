"use client";

import React from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Avatar,
  Divider,
  IconButton,
} from "@mui/material";
// import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { StatusChip } from "../../components/ui/StatusChip";
import { useRouter } from "next/navigation";

const labelStyle = { fontSize: 12, color: "text.secondary", mb: 0.5 };
const valueStyle = { fontSize: 14, fontWeight: 500, color: "text.valueText" };

const MOCK_DOCUMENTS = [
  { name: "Policy Cancellation Request", date: "2023-03-01", type: "PDF" },
  { name: "Overpayment Form", date: "2023-03-01", type: "PDF" },
  { name: "Proof of Payment", date: "2023-03-01", type: "PDF" },
  { name: "Bank Letter", date: "2023-03-01", type: "PDF" },
  { name: "Reason for Overpayment", date: "2024-01-15", type: "PDF" },
];

// Using mock data for demonstration
const MOCK_REFUND = {
  company: "Meridian Logistics (Pty) Ltd",
  policyNo: "23982789329832",
  refundNo: "REF-2024-001",
  amount: "R 10,000.00",
  date: "05-06-2026",
  status: "Approved",
  reason: "Policy Cancellation",
  brokerage: "Kenn Brokerage",
  refundType: "Overpayment",
  refundPeriod: "05-02-2026 to 05-04-2026",
  notes:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.",
};

export default function RefundDetailsPage() {
  const router = useRouter();

  const refund = MOCK_REFUND;

  const DETAILS = [
    { label: "Refund Type", value: refund.refundType },
    { label: "Refund Period", value: refund.refundPeriod },
    { label: "Refund Amount", value: refund.amount },
  ];

  return (
    <Box
      sx={{
        pt: "73px",
        p: { xs: 3, lg: 2 },
        pl: { xs: 3, lg: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: 1200,
        margin: "0 auto",
        width: "100%",
      }}
    >
      {/* <Stack direction="row" sx={{ alignItems: "center" }} spacing={2}> */}
      {/* <IconButton onClick={() => router.back()}>
          <ArrowBackIcon />
        </IconButton> */}
      <Typography variant="h5" sx={{ fontWeight: 700, color: "text.heading" }}>
        Refund Details
      </Typography>
      {/* </Stack> */}

      <Paper
        variant="outlined"
        sx={{ borderRadius: 3, display: "flex", flexDirection: "column" }}
      >
        {/* Top Section */}
        <Box
          sx={{
            p: 3,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Avatar
              sx={{
                width: 48,
                height: 48,
                fontWeight: 700,
                borderRadius: 2,
                bgcolor: "primary.light",
                color: "primary.main",
              }}
            >
              {refund.company.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                sx={{ fontSize: 16, fontWeight: 700, color: "text.heading" }}
              >
                {refund.company}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.heading", mt: 0.5 }}>
                Policy No : {refund.policyNo} &nbsp;|&nbsp; Brokerage :{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "text.heading" }}
                >
                  {refund.brokerage}
                </Box>
              </Typography>
            </Box>
          </Stack>
          <StatusChip status={refund.status} />
        </Box>

        <Divider />

        {/* Details Section */}
        <Box sx={{ p: 3 }}>
          <Stack direction="row" spacing={6} sx={{ mb: 4 }}>
            {DETAILS.map((item) => (
              <Box key={item.label}>
                <Typography sx={labelStyle}>{item.label}</Typography>
                <Typography sx={valueStyle}>{item.value}</Typography>
              </Box>
            ))}
          </Stack>
          <Box>
            <Typography sx={labelStyle}>Notes</Typography>
            <Typography sx={{ ...valueStyle, maxWidth: 600 }}>
              {refund.notes}
            </Typography>
          </Box>
        </Box>

        <Divider />

        <Box sx={{ p: 3 }}>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, color: "text.heading", mb: 2 }}
          >
            Uploaded Documents
          </Typography>
          <Stack spacing={2}>
            {MOCK_DOCUMENTS.map((doc) => (
              <Paper
                key={doc.name}
                variant="outlined"
                sx={{
                  p: 1.5,
                  minHeight: 58,
                  borderRadius: 2,
                  borderWidth: "0.63px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Stack
                  direction="row"
                  spacing={2}
                  sx={{ alignItems: "center" }}
                >
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: 1,
                      bgcolor: "primary.50",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "primary.main",
                    }}
                  >
                    <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
                  </Box>
                  <Box>
                    <Typography
                      sx={{
                        fontSize: 14,
                        fontWeight: 500,
                        color: "metrics.valueText",
                      }}
                    >
                      {doc.name}
                    </Typography>
                    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                      {doc.date} · {doc.type}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" spacing={1}>
                  <IconButton
                    size="small"
                    sx={{ color: "metrics.descriptionText" }}
                  >
                    <VisibilityOutlinedIcon fontSize="small" />
                  </IconButton>
                  <IconButton
                    size="small"
                    sx={{ color: "metrics.descriptionText" }}
                  >
                    <FileDownloadOutlinedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
}
