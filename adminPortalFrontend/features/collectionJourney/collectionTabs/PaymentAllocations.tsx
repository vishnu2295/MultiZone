import React, { useState, useMemo } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  Button,
  IconButton,
} from "@mui/material";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import { StatusChip } from "../../../components/ui/StatusChip";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import AllocatePaymentDrawer from "../components/AllocatePaymentDrawer";

export interface PaymentAllocation {
  id: number;
  company: string;
  policyNo: string;
  invoiceNo: string;
  billingMonth: string;
  invoiceDate: string;
  debitAmount: string;
  credit: string;
  paymentRef: string;
  status: string;
  allocation: string;
  paymentDate: string;
}

const MOCK_DATA: PaymentAllocation[] = [
  {
    id: 1,
    company: "Mediterian Logistcs",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jun 2026",
    invoiceDate: "05-06-2026",
    debitAmount: "R 6,955.00",
    credit: "R 0.00",
    paymentRef: "REF-003 9182",
    status: "Unpaid",
    allocation: "Unallocated",
    paymentDate: "08-06-2026",
  },
  {
    id: 2,
    company: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "May 2026",
    invoiceDate: "05-05-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-05-2026",
  },
  {
    id: 3,
    company: "DuraTech Mining",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Apr 2026",
    invoiceDate: "05-04-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-04-2026",
  },
  {
    id: 4,
    company: "Gold Fields",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Mar 2026",
    invoiceDate: "05-03-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-03-2026",
  },
  {
    id: 5,
    company: "Sibanye-Stillwater",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Feb 2026",
    invoiceDate: "05-02-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-02-2026",
  },
  {
    id: 6,
    company: "Exxaro Resources",
    policyNo: "3843-43434-343333",
    invoiceNo: "INV-2024-0891",
    billingMonth: "Jan 2026",
    invoiceDate: "05-01-2026",
    debitAmount: "R 6,955.00",
    credit: "R 6,955.00",
    paymentRef: "REF-003 9182",
    status: "Paid",
    allocation: "Allocated",
    paymentDate: "08-01-2026",
  },
];

export default function PaymentAllocations() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedAllocation, setSelectedAllocation] = useState<
    PaymentAllocation | undefined
  >();

  const filteredData = useMemo(() => {
    let result = MOCK_DATA;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.company.toLowerCase().includes(q) ||
          item.policyNo.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    return result;
  }, [searchQuery, selectedStatus]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns: Column<PaymentAllocation>[] = useMemo(
    () => [
      {
        header: "Debitor",
        accessorKey: "company",
        cell: (row) => (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              {row.company}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {row.policyNo}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Invoice No.",
        accessorKey: "invoiceNo",
      },
      {
        header: "Billing Month",
        accessorKey: "billingMonth",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {row.billingMonth}
          </Typography>
        ),
      },
      {
        header: "Invoice Date",
        accessorKey: "invoiceDate",
      },
      {
        header: "Debit Amount",
        accessorKey: "debitAmount",
      },
      {
        header: "Credit",
        accessorKey: "credit",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 500,
              color: row.credit === "R 0.00" ? "error.main" : "success.main",
            }}
          >
            {row.credit}
          </Typography>
        ),
      },
      {
        header: "Payment Ref",
        accessorKey: "paymentRef",
        cell: (row) => {
          const parts = row.paymentRef.split(" ");
          return (
            <Box>
              <Typography sx={{ fontSize: 14 }}>{parts[0]}</Typography>
              {parts.length > 1 && (
                <Typography sx={{ fontSize: 14 }}>{parts[1]}</Typography>
              )}
            </Box>
          );
        },
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Allocation",
        accessorKey: "allocation",
        cell: (row) => <StatusChip status={row.allocation} />,
      },
      {
        header: "Payment Date",
        accessorKey: "paymentDate",
      },
      {
        header: "Actions",
        width: 120,
        cell: (row) =>
          row.status === "Unpaid" ? (
            <Button
              variant="outlined"
              size="small"
              onClick={() => {
                setSelectedAllocation(row);
                setDrawerOpen(true);
              }}
              startIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
              sx={{
                textTransform: "none",
                fontWeight: 400,
                borderRadius: 1.5,
                fontSize: 13,
                borderColor: "divider",
                color: "text.primary",
              }}
            >
              Allocate
            </Button>
          ) : (
            <IconButton
              size="small"
              sx={{
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 1.5,
              }}
            >
              <FileDownloadOutlinedIcon
                fontSize="small"
                sx={{ color: "iconDark" }}
              />
            </IconButton>
          ),
      },
    ],
    []
  );

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, lg: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
      }}
    >
      {/* Header actions */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: 500 } }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="search by employer policy number, employer company name, or registration number."
          />
        </Box>
        <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
          <Select
            value={selectedStatus}
            onChange={(val) => setSelectedStatus(val)}
            options={["All", "Paid", "Unpaid"].map((s) => ({
              label: `Status : ${s}`,
              value: s,
            }))}
            sx={{ minWidth: 160 }}
          />
        </Stack>
      </Stack>

      {/* Table */}
      <CustomTable
        columns={columns}
        data={filteredData}
        emptyMessage="No payment allocations found matching the selected filters."
        colSpanCount={11}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <AllocatePaymentDrawer
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        allocation={selectedAllocation}
      />
    </Paper>
  );
}
