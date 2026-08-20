import React, { useState, useMemo } from "react";
import { Box, Typography, Paper, Stack, Button, Tooltip } from "@mui/material";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import { StatusChip } from "../../../components/ui/StatusChip";
import DebitOrderDetailsDrawer from "../components/DebitOrderDetailsDrawer";

export interface DebitOrder {
  id: number;
  company: string;
  policyNo: string;
  month: string;
  amount: string;
  date: string;
  email: string;
  status: string;
  error: string;
  brokerage: string;
}

const MOCK_DEBIT_ORDERS_DATA: DebitOrder[] = [
  {
    id: 1,
    company: "Mediterian Logistcs",
    policyNo: "3843-43434-343333",
    month: "Jun 2026",
    amount: "R 6,955.00",
    date: "05-06-2026",
    email: "darlene@rma.co.za",
    status: "Successful",
    error: "",
    brokerage: "Kenn Brokerage",
  },
  {
    id: 2,
    company: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    month: "May 2026",
    amount: "R 6,955.00",
    date: "05-05-2026",
    email: "Jacob@rma.co.za",
    status: "Successful",
    error: "",
    brokerage: "Alpha Brokers",
  },
  {
    id: 3,
    company: "DuraTech Mining",
    policyNo: "3843-43434-343333",
    month: "Apr 2026",
    amount: "R 6,955.00",
    date: "05-04-2026",
    email: "Cameron@rma.co.za",
    status: "Successful",
    error: "",
    brokerage: "Kenn Brokerage",
  },
  {
    id: 4,
    company: "Gold Fields",
    policyNo: "3843-43434-343333",
    month: "Mar 2026",
    amount: "R 6,955.00",
    date: "05-03-2026",
    email: "Eleanor@rma.co.za",
    status: "Successful",
    error: "",
    brokerage: "Beta Brokers",
  },
  {
    id: 5,
    company: "Sibanye-Stillwater",
    policyNo: "3843-43434-343333",
    month: "Jan 2026",
    amount: "R 6,955.00",
    date: "05-02-2026",
    email: "Ralph@rma.co.za",
    status: "Failed",
    error: "Due to insufficient account balance.",
    brokerage: "Kenn Brokerage",
  },
  {
    id: 6,
    company: "Exxaro Resources",
    policyNo: "3843-43434-343333",
    month: "Dec 2025",
    amount: "R 6,955.00",
    date: "05-01-2026",
    email: "Wade@rma.co.za",
    status: "Successful",
    error: "",
    brokerage: "Alpha Brokers",
  },
];

export default function DebitOrder() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<DebitOrder | null>(null);

  const filteredDebitOrders = useMemo(() => {
    let result = MOCK_DEBIT_ORDERS_DATA;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (order) =>
          order.company.toLowerCase().includes(q) ||
          order.policyNo.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== "All") {
      result = result.filter((order) => order.status === selectedStatus);
    }

    return result;
  }, [searchQuery, selectedStatus]);

  const itemsPerPage = 6;
  const totalPages = Math.ceil(filteredDebitOrders.length / itemsPerPage);

  const columns: Column<DebitOrder>[] = useMemo(
    () => [
      {
        header: "Company & Policy No",
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
        header: "Month",
        accessorKey: "month",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 700 }}>
            {row.month}
          </Typography>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {row.amount}
          </Typography>
        ),
      },
      {
        header: "Date",
        accessorKey: "date",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {row.date}
          </Typography>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        cell: (row) => (
          <Typography sx={{ fontSize: 14, fontWeight: 500 }}>
            {row.email}
          </Typography>
        ),
      },
      {
        header: "Status",
        accessorKey: "status",
        cell: (row) => (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <StatusChip status={row.status} />
            {row.status === "Failed" && row.error && (
              <Tooltip title={row.error} placement="top">
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    color: "text.secondary",
                    cursor: "pointer",
                  }}
                >
                  <InfoOutlinedIcon sx={{ fontSize: 16 }} />
                </Box>
              </Tooltip>
            )}
          </Stack>
        ),
      },
      {
        header: "Actions",
        width: 150,
        cell: (row) => (
          <Button
            variant="outlined"
            size="small"
            onClick={() => setSelectedRow(row)}
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
            View Details
          </Button>
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
              options={["All", "Successful", "Failed"].map((s) => ({
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
          data={filteredDebitOrders}
          emptyMessage="No debit orders found matching the selected filters."
          colSpanCount={7}
          itemsPerPage={itemsPerPage}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
        />
      </Paper>

      <DebitOrderDetailsDrawer
        selectedRow={selectedRow}
        onClose={() => setSelectedRow(null)}
        historyData={MOCK_DEBIT_ORDERS_DATA}
      />
    </>
  );
}
