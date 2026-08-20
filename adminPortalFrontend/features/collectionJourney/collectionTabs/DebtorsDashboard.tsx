import React, { useState } from "react";
import { Box, Stack, Button } from "@mui/material";
import { MetricCards } from "../../../components/ui/MetricCards";
import SearchInput from "../../../components/ui/SearchInput";
import PaymentsIcon from "@mui/icons-material/PaymentsOutlined";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutlined";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import SyncIcon from "@mui/icons-material/Sync";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CalendarTodayOutlinedIcon from "@mui/icons-material/CalendarTodayOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import {
  Avatar,
  Paper,
  Grid,
  Divider,
  Typography,
  useTheme,
} from "@mui/material";
import { StatusChip } from "../../../components/ui/StatusChip";

const METRICS = [
  {
    value: "R 261,995.00",
    description: "Total Billed",
    icon: <PaymentsIcon fontSize="small" />,
  },
  {
    value: "R 252,817.00",
    description: "Total Collected",
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
  {
    value: "R 9,178.00",
    description: "Total Outstanding",
    icon: <ErrorOutlineIcon fontSize="small" />,
  },
  {
    value: "R 500.00",
    description: "Total Unallocated",
    icon: <AccessTimeIcon fontSize="small" />,
  },
  {
    value: "87",
    description: "Active Policies",
    icon: <CheckCircleOutlineIcon fontSize="small" />,
  },
  {
    value: "202",
    description: "Inactive Policies",
    icon: <CancelOutlinedIcon fontSize="small" />,
  },
  {
    value: "R 3,200.00",
    description: "Total Refunds",
    icon: <SyncIcon fontSize="small" />,
  },
  {
    value: "R 1,200.00",
    description: "Total Credit Notes",
    icon: <DescriptionOutlinedIcon fontSize="small" />,
  },
];

interface Invoice {
  invoiceNo: string;
  billingMonth: string;
  invoiceDate: string;
  debitAmount: string;
  credit: string;
  method: string;
  paymentRef: string;
  status: "Paid" | "Unpaid";
  allocation: "Allocated" | "Unallocated";
  paymentDate: string;
}

const INVOICES: Invoice[] = [
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jun 2026",
    invoiceDate: "05-06-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-06-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "May 2026",
    invoiceDate: "05-05-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-05-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Apr 2026",
    invoiceDate: "05-04-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-04-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Mar 2026",
    invoiceDate: "05-03-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-03-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Feb 2026",
    invoiceDate: "05-02-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-02-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jan 2026",
    invoiceDate: "05-01-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-01-2026",
  },
  {
    invoiceNo: "INV-2024-0891",
    billingMonth: "Dec 2025",
    invoiceDate: "05-12-2025",
    debitAmount: "R 6,955.00",
    credit: "R 0.00",
    method: "Debit Order",
    paymentRef: "REF-003 9182",
    status: "Unpaid",
    allocation: "Unallocated",
    paymentDate: "n/a",
  },
];

const CONTACT_DETAILS = [
  { label: "Name", value: "Sandra Nkosi" },
  { label: "Email", value: "s.nkosi@meridianlogistics.co.za" },
  { label: "Phone Number", value: "082 341 9087" },
];

const BANK_DETAILS = [
  { label: "Bank Name", value: "FNB" },
  { label: "Account Holder", value: "Meridian Logistics (Pty) Ltd" },
  { label: "Account Type", value: "Savings" },
  { label: "Account Number", value: "3474387473847374" },
  { label: "Bank Code", value: "FNB73643434" },
  { label: "Debit Date", value: "1st of each month" },
  { label: "Payment Method", value: "Debit Order" },
];

const labelSx = { color: "text.secondary" };
const valueSx = { fontWeight: 500, color: "text.valueText" };

export default function DebtorsDashboard() {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const totalPages = Math.ceil(INVOICES.length / itemsPerPage);

  const invoiceColumns: Column<Invoice>[] = [
    { header: "Invoice No.", accessorKey: "invoiceNo" },
    {
      header: "Billing Month",
      accessorKey: "billingMonth",
      cell: (row) => (
        <span style={{ fontWeight: 700 }}>{row.billingMonth}</span>
      ),
    },
    { header: "Invoice Date", accessorKey: "invoiceDate" },
    { header: "Debit Amount", accessorKey: "debitAmount" },
    {
      header: "Credit",
      accessorKey: "credit",
      cell: (row) => (
        <span
          style={{
            color:
              row.credit === "R 0.00"
                ? "#F06565"
                : (theme.palette as any).status.activeText,
          }}
        >
          {row.credit}
        </span>
      ),
    },
    { header: "Method", accessorKey: "method" },
    {
      header: "Payment Ref",
      accessorKey: "paymentRef",
      cell: (row) => (
        <span style={{ width: "60px", display: "inline-block" }}>
          {row.paymentRef}
        </span>
      ),
    },
    { header: "Status", cell: (row) => <StatusChip status={row.status} /> },
    {
      header: "Allocation",
      cell: (row) => <StatusChip status={row.allocation} />,
    },
    { header: "Payment Date", accessorKey: "paymentDate" },
    {
      header: "Actions",
      cell: () => (
        <Button
          variant="outlined"
          size="small"
          sx={{ minWidth: 32, p: 0.5, borderColor: "divider" }}
        >
          <FileDownloadOutlinedIcon sx={{ color: "iconDark" }} />
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3, pt: 1 }}>
      {/* Header actions */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <Box sx={{ width: { xs: "100%", md: 450 } }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="company name, policy number, or registration number."
          />
        </Box>
        <Button
          variant="outlined"
          endIcon={<CalendarTodayOutlinedIcon fontSize="small" />}
          sx={{
            bgcolor: "background.paper",
            color: "text.primary",
            borderColor: "divider",
            textTransform: "none",
            fontWeight: 500,
            borderRadius: 1.5,
            px: 2,
          }}
        >
          Date range
        </Button>
      </Stack>

      <MetricCards metrics={METRICS} />

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: 3,
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Avatar
            sx={{
              bgcolor: "primary.light",
              color: "primary.main",
              width: 48,
              height: 48,
              fontWeight: 700,
            }}
          >
            MD
          </Avatar>
          <Box>
            <Typography
              variant="h6"
              sx={{ fontWeight: 700, color: "text.heading" }}
            >
              Meridian Logistics (Pty) Ltd
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 400, color: "text.heading" }}
            >
              Policy No : 23982789329832{" "}
              <span style={{ margin: "0 8px" }}>|</span> Brokerage :{" "}
              <span
                style={{ fontWeight: 700, color: theme.palette.text.primary }}
              >
                Kenn Brokerage
              </span>
            </Typography>
          </Box>
        </Stack>

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            Contact Details
          </Typography>
          <Grid container spacing={3}>
            {CONTACT_DETAILS.map((detail, index) => (
              <Grid key={index} size={{ xs: 12, sm: 4 }}>
                <Typography variant="caption" sx={labelSx}>
                  {detail.label}
                </Typography>
                <Typography variant="body2" sx={valueSx}>
                  {detail.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            Bank Account Details
          </Typography>
          <Grid container spacing={3}>
            {BANK_DETAILS.map((detail, index) => (
              <Grid key={index} size={{ xs: 12, sm: 3 }}>
                <Typography variant="caption" sx={labelSx}>
                  {detail.label}
                </Typography>
                <Typography variant="body2" sx={valueSx}>
                  {detail.value}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Box>

        <Divider />

        <Box>
          <Typography
            variant="subtitle1"
            sx={{ fontWeight: 700, mb: 2, color: "text.primary" }}
          >
            Invoices
          </Typography>
          <CustomTable
            columns={invoiceColumns}
            data={INVOICES.slice(
              (currentPage - 1) * itemsPerPage,
              currentPage * itemsPerPage
            )}
            currentPage={currentPage}
            setCurrentPage={setCurrentPage}
            totalPages={totalPages}
            itemsPerPage={itemsPerPage}
            colSpanCount={11}
          />
        </Box>
      </Paper>
    </Box>
  );
}
