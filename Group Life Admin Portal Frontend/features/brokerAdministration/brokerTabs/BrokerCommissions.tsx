"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";

import { Box, Button, Paper, Stack, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import { Download } from "@mui/icons-material";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import { MetricCards } from "../../../components/ui/MetricCards";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface CommissionRecord {
  id: string;
  billingMonth: string;
  brokerName: string;
  fspNumber: string;
  policyNo: string;
  commissionPercent: string;
  contribution: string;
  commissionEarned: string;
  status: "Failed Payment" | "Pending" | "Paid";
}

interface CommissionProps {
  value: string;
  description: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const INITIAL_COMMISSIONS: CommissionRecord[] = [
  {
    id: "1",
    billingMonth: "April 2026",
    brokerName: "Apex Brokerage Partners",
    fspNumber: "FSP : 10102",
    policyNo: "POL-TEST-01",
    commissionPercent: "12.5%",
    contribution: "R 100,000.00",
    commissionEarned: "R 12500",
    status: "Failed Payment",
  },
  {
    id: "2",
    billingMonth: "April 2026",
    brokerName: "Monarch Brokerage Partners",
    fspNumber: "FSP : 10102",
    policyNo: "POL-TEST-01",
    commissionPercent: "12.5%",
    contribution: "R 100,000.00",
    commissionEarned: "R 12500",
    status: "Pending",
  },
  {
    id: "3",
    billingMonth: "April 2026",
    brokerName: "Swiss Brokerage Partners",
    fspNumber: "FSP : 10102",
    policyNo: "POL-TEST-01",
    commissionPercent: "12.5%",
    contribution: "R 100,000.00",
    commissionEarned: "R 12500",
    status: "Paid",
  },
  {
    id: "4",
    billingMonth: "April 2026",
    brokerName: "Crane Brokerage Partners",
    fspNumber: "FSP : 10102",
    policyNo: "POL-TEST-01",
    commissionPercent: "12.5%",
    contribution: "R 100,000.00",
    commissionEarned: "R 12500",
    status: "Paid",
  },
  {
    id: "5",
    billingMonth: "April 2026",
    brokerName: "Johanantha Brokerage Partners",
    fspNumber: "FSP : 10102",
    policyNo: "POL-TEST-01",
    commissionPercent: "12.5%",
    contribution: "R 100,000.00",
    commissionEarned: "R 12500",
    status: "Paid",
  },
];

const COMMISSION_METRICS: CommissionProps[] = [
  { value: "R 1,00,000.00", description: "Commissions Paid for April 2026" },
  { value: "12", description: "Brokers need to be paid for April 2026" },
  { value: "30", description: "Brokers paid for April 2026" },
  { value: "3", description: "Failed Payments this month" },
];

const STATUS_OPTIONS = ["All", "Paid", "Pending", "Failed Payment"];
const BROKER_OPTIONS = ["All"];
const MONTH_YEAR_OPTIONS = ["All"];

const ITEMS_PER_PAGE = 6;

export default function BrokerCommissions() {
  const router = useRouter();
  const [commissions] = useState<CommissionRecord[]>(INITIAL_COMMISSIONS);

  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedBroker, setSelectedBroker] = useState("All");
  const [selectedMonthYear, setSelectedMonthYear] = useState("All");

  const filteredCommissions = useMemo(() => {
    let result = commissions;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (c) =>
          c.brokerName.toLowerCase().includes(q) ||
          c.fspNumber.toLowerCase().includes(q) ||
          c.policyNo.toLowerCase().includes(q)
      );
    }
    if (selectedStatus !== "All")
      result = result.filter((c) => c.status === selectedStatus);
    return result;
  }, [commissions, searchQuery, selectedStatus]);

  const commissionColumns: Column<CommissionRecord>[] = useMemo(
    () => [
      { header: "Billing Month", accessorKey: "billingMonth" },
      {
        header: "Broker",
        accessorKey: "brokerName",
        cell: (row) => (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              {row.brokerName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {row.fspNumber}
            </Typography>
          </Box>
        ),
      },
      { header: "Policy No", accessorKey: "policyNo" },
      { header: "Commission %", accessorKey: "commissionPercent" },
      { header: "Contribution", accessorKey: "contribution" },
      { header: "Commission Earned", accessorKey: "commissionEarned" },
      {
        header: "Status",
        cell: (row) => (
          <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
            <StatusChip status={row.status} />
            {row.status === "Failed Payment" && (
              <Button
                variant="contained"
                size="small"
                sx={{
                  bgcolor: "#06b6d4", // Cyan
                  "&:hover": { bgcolor: "#0891b2" },
                  textTransform: "none",
                  fontWeight: 600,
                  borderRadius: 1.5,
                  fontSize: 12,
                  px: 1.5,
                  minWidth: "auto",
                  height: 24,
                  boxShadow: "none",
                }}
              >
                Retry
              </Button>
            )}
          </Stack>
        ),
      },
    ],
    []
  );

  return (
    <>
      <MetricCards metrics={COMMISSION_METRICS} />

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          p: { xs: 2.5, lg: 3 },
          display: "flex",
          flexDirection: "column",
          gap: 3,
          mt: 3,
          overflowX: "auto",
        }}
      >
        <Box sx={{ minWidth: { xs: 1000, lg: "100%" } }}>
          <Stack direction="column" sx={{ gap: 0.5 }}>
            <Stack
              direction={{ xs: "column", md: "row" }}
              sx={{
                gap: 2,
                justifyContent: "space-between",
                alignItems: { md: "center" },
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: 700, flexShrink: 0 }}
              >
                Broker Commissions
              </Typography>

              <Stack
                direction="row"
                sx={{
                  gap: 1.5,
                  flexWrap: "nowrap",
                  alignItems: "center",
                  "& > *": { flexShrink: 0 },
                }}
              >
                <Box sx={{ width: 280 }}>
                  <SearchInput
                    value={searchQuery}
                    onChange={(val) => {
                      setSearchQuery(val);
                    }}
                    placeholder="Search broker name, FSP no, policy number.."
                  />
                </Box>

                <Select
                  value={selectedStatus}
                  onChange={(val) => {
                    setSelectedStatus(val);
                  }}
                  options={STATUS_OPTIONS.map((s) => ({
                    label: `Status : ${s}`,
                    value: s,
                  }))}
                  sx={{ minWidth: 140 }}
                />

                <Select
                  value={selectedBroker}
                  onChange={(val) => {
                    setSelectedBroker(val);
                  }}
                  options={BROKER_OPTIONS.map((s) => ({
                    label: `Broker : ${s}`,
                    value: s,
                  }))}
                  sx={{ minWidth: 140 }}
                />

                <Select
                  value={selectedMonthYear}
                  onChange={(val) => {
                    setSelectedMonthYear(val);
                  }}
                  options={MONTH_YEAR_OPTIONS.map((s) => ({
                    label: `Month and Year : ${s}`,
                    value: s,
                  }))}
                  sx={{ minWidth: 160 }}
                />

                <Button
                  variant="outlined"
                  startIcon={<Download fontSize="small" />}
                  sx={{
                    textTransform: "none",
                    fontWeight: 600,
                    borderRadius: 2,
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                >
                  Download CSV
                </Button>
              </Stack>
            </Stack>

            <Typography
              variant="body2"
              sx={{ fontStyle: "italic", color: "text.secondary", mt: 1 }}
            >
              Note : Billing month is calculated from 1st of every month to 30th
              of every month.
            </Typography>
          </Stack>

          <Box sx={{ mt: 3 }}>
            <CustomTable
              columns={commissionColumns}
              data={filteredCommissions}
              emptyMessage="No broker commissions found matching the selected filters."
              colSpanCount={7}
              itemsPerPage={ITEMS_PER_PAGE}
            />
          </Box>
        </Box>
      </Paper>
    </>
  );
}
