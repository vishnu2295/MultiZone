import { Column, CustomTable } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import {
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
  IconButton,
} from "@mui/material";
import { StatusChip } from "../../../../components/ui/StatusChip";
import DownloadIcon from "@mui/icons-material/Download";
import { useMemo, useState } from "react";

export interface Invoice {
  id: string;
  invoiceNo: string;
  billingMonth: string;
  invoiceDate: string;
  debitAmount: string;
  credit: string;
  method: string;
  paymentRef: string;
  status: "Paid" | "Unpaid";
  paymentDate: string;
}

const INITIAL_INVOICES: Invoice[] = [
  {
    id: "1",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jun 2026",
    invoiceDate: "05-06-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-06-2026",
  },
  {
    id: "2",
    invoiceNo: "INV-2024-0891",
    billingMonth: "May 2026",
    invoiceDate: "05-05-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-05-2026",
  },
  {
    id: "3",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Apr 2026",
    invoiceDate: "05-04-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-04-2026",
  },
  {
    id: "4",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Mar 2026",
    invoiceDate: "05-03-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-03-2026",
  },
  {
    id: "5",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Feb 2026",
    invoiceDate: "05-02-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-02-2026",
  },
  {
    id: "6",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jan 2026",
    invoiceDate: "05-01-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Paid",
    paymentDate: "08-01-2026",
  },
  {
    id: "7",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Dec 2025",
    invoiceDate: "05-12-2025",
    debitAmount: "R 6,955.00",
    credit: "R 0.00",
    method: "Debit Order",
    paymentRef: "REF-0039182",
    status: "Unpaid",
    paymentDate: "n/a",
  },
];

const BILLING_MONTH_OPTIONS = [
  "All",
  "Jun 2026",
  "May 2026",
  "Apr 2026",
  "Mar 2026",
  "Feb 2026",
  "Jan 2026",
  "Dec 2025",
];
const STATUS_OPTIONS = ["All", "Paid", "Unpaid"];

export default function InvoicesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedBillingMonth, setSelectedBillingMonth] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const columns: Column<Invoice>[] = useMemo(
    () => [
      {
        header: "Invoice No.",
        accessorKey: "invoiceNo",
        width: "10%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.invoiceNo}
          </Typography>
        ),
      },
      {
        header: "Billing Month",
        accessorKey: "billingMonth",
        width: "10%",
        cell: (row) => (
          <Typography
            sx={{ fontWeight: 700, fontSize: 13, color: "text.primary" }}
          >
            {row.billingMonth}
          </Typography>
        ),
      },
      {
        header: "Invoice Date",
        accessorKey: "invoiceDate",
        width: "10%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.invoiceDate}
          </Typography>
        ),
      },
      {
        header: "Debit Amount",
        accessorKey: "debitAmount",
        width: "10%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.debitAmount}
          </Typography>
        ),
      },
      {
        header: "Credit",
        accessorKey: "credit",
        width: "10%",
        cell: (row) => (
          <Typography
            sx={{
              color:
                row.status === "Paid"
                  ? "status.activeText"
                  : "status.lapsedText",
              fontWeight: 500,
              fontSize: 13,
            }}
          >
            {row.credit}
          </Typography>
        ),
      },
      {
        header: "Method",
        accessorKey: "method",
        width: "10%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.method}
          </Typography>
        ),
      },
      {
        header: "Payment Ref",
        accessorKey: "paymentRef",
        width: "12%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.paymentRef}
          </Typography>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        width: "10%",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Payment Date",
        accessorKey: "paymentDate",
        width: "10%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.paymentDate}
          </Typography>
        ),
      },
      {
        header: "Actions",
        accessorKey: "id",
        width: "8%",
        cell: () => (
          <IconButton
            size="small"
            sx={{
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 1.5,
              color: "text.secondary",
            }}
          >
            <DownloadIcon fontSize="small" />
          </IconButton>
        ),
      },
    ],
    []
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 350 }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="search by invoice no, payment ref no."
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Select
            value={selectedBillingMonth}
            renderValue={(val) => (
              <Box
                component="span"
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Billing Month :{" "}
                <Box component="strong" sx={{ color: "text.primary" }}>
                  {val as string}
                </Box>
              </Box>
            )}
            onChange={(e) => setSelectedBillingMonth(e.target.value as string)}
            sx={{ minWidth: 180, height: 40, borderRadius: 2 }}
          >
            {BILLING_MONTH_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 14 }}>
                {s}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedStatus}
            renderValue={(val) => (
              <Box
                component="span"
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Status :{" "}
                <Box component="strong" sx={{ color: "text.primary" }}>
                  {val as string}
                </Box>
              </Box>
            )}
            onChange={(e) => setSelectedStatus(e.target.value as string)}
            sx={{ minWidth: 140, height: 40, borderRadius: 2 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 14 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <CustomTable
        columns={columns}
        data={INITIAL_INVOICES}
        emptyMessage="No invoices found matching your criteria."
        itemsPerPage={10}
        currentPage={1}
        totalPages={1}
      />
    </Box>
  );
}
