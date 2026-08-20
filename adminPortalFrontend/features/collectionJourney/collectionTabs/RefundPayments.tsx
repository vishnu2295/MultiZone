import React, { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Stack } from "@mui/material";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import AddIcon from "@mui/icons-material/Add";
import { StatusChip } from "../../../components/ui/StatusChip";
import { CustomButton } from "../../../components/ui/CustomButton";
import RaiseRequestDrawer from "../components/RaiseRequestDrawer";
export interface Refund {
  id: number;
  company: string;
  policyNo: string;
  refundNo: string;
  amount: string;
  date: string;
  status: string;
  reason: string;
  brokerage: string;
  refundType: string;
  refundPeriod: string;
  notes: string;
}

const MOCK_REFUND_DATA: Refund[] = [
  {
    id: 1,
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
  },
  {
    id: 2,
    company: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    refundNo: "REF-2024-002",
    amount: "R 6,955.00",
    date: "05-05-2026",
    status: "Pending",
    reason: "Overpayment",
    brokerage: "Auto Brokerage",
    refundType: "Overpayment",
    refundPeriod: "01-01-2026 to 01-03-2026",
    notes: "Overpaid premium by mistake.",
  },
];

const MOCK_DOCUMENTS = [
  { name: "Policy Cancellation Request", date: "2023-03-01", type: "PDF" },
  { name: "Overpayment Form", date: "2023-03-01", type: "PDF" },
  { name: "Proof of Payment", date: "2023-03-01", type: "PDF" },
  { name: "Bank Letter", date: "2023-03-01", type: "PDF" },
  { name: "Reason for Overpayment", date: "2024-01-15", type: "PDF" },
];

const secondaryText = {
  fontSize: 14,
  fontWeight: 500,
  color: "text.secondary",
};

const headingText = {
  fontSize: 14,
  fontWeight: 700,
  color: "text.heading",
};

export default function RefundPayments() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [isRaiseRequestOpen, setIsRaiseRequestOpen] = useState(false);
  const router = useRouter();

  const filteredRefunds = useMemo(() => {
    let result = MOCK_REFUND_DATA;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (refund) =>
          refund.company.toLowerCase().includes(q) ||
          refund.policyNo.toLowerCase().includes(q) ||
          refund.refundNo.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== "All") {
      result = result.filter((refund) => refund.status === selectedStatus);
    }

    return result;
  }, [searchQuery, selectedStatus]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredRefunds.length / itemsPerPage);

  const columns: Column<Refund>[] = useMemo(
    () => [
      {
        header: "Company & Policy No",
        accessorKey: "company",
        cell: (row) => (
          <Box>
            <Typography sx={headingText}>{row.company}</Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {row.policyNo}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Refund No.",
        accessorKey: "refundNo",
        cell: (row) => (
          <Typography sx={secondaryText}>{row.refundNo}</Typography>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (row) => <Typography sx={secondaryText}>{row.amount}</Typography>,
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (row) => <Typography sx={secondaryText}>{row.date}</Typography>,
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (row) => (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <StatusChip status={row.status} />
          </Stack>
        ),
      },
      {
        header: "Reason",
        accessorKey: "reason",
        cell: (row) => <Typography sx={headingText}>{row.reason}</Typography>,
      },
      {
        header: "Actions",
        width: 150,
        cell: (row) => (
          <CustomButton
            variantType="outlined"
            sizeType="sm"
            startIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
            sx={{
              fontSize: 13,
              fontWeight: 400,
              borderColor: "divider",
              color: "text.primary",
            }}
            onClick={() => router.push("/collections/refundDetails")}
          >
            View Details
          </CustomButton>
        ),
      },
    ],
    []
  );

  return (
    <>
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
              options={["All", "Approved", "Pending", "Rejected"].map((s) => ({
                label: `Status : ${s}`,
                value: s,
              }))}
              sx={{ minWidth: 160 }}
            />
            <CustomButton
              variantType="primary"
              startIcon={<AddIcon />}
              sx={{ px: 3 }}
              onClick={() => setIsRaiseRequestOpen(true)}
            >
              Raise New Refund Request
            </CustomButton>
          </Stack>
        </Stack>

        {/* Table */}
        <CustomTable
          columns={columns}
          data={filteredRefunds}
          emptyMessage="No refund payments found matching the selected filters."
          colSpanCount={7}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </Paper>

      <RaiseRequestDrawer
        open={isRaiseRequestOpen}
        onClose={() => setIsRaiseRequestOpen(false)}
        mockDocuments={MOCK_DOCUMENTS}
      />
    </>
  );
}
