import React, { useState, useMemo, useEffect } from "react";
import { Box, Stack, Typography, Paper, Tooltip } from "@mui/material";
import SearchInput from "../../../components/ui/SearchInput";
import Select from "../../../components/ui/Select";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import { StatusChip } from "../../../components/ui/StatusChip";
import { CustomButton } from "../../../components/ui/CustomButton";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ArrowOutwardIcon from "@mui/icons-material/ArrowOutward";
import ApplyOffsetDrawer from "../components/ApplyOffsetDrawer";
import ReverseModal from "../components/ReverseModal";
import CreditDetailsDrawer from "../components/CreditDetailsDrawer";

export interface CreditNoteRow {
  id: string;
  companyName: string;
  policyNo: string;
  creditNoteNo: string;
  amount: string;
  month: string;
  status: string;
  balance: string | { value: string; color: string };
  actions: "offset-reverse" | "view-details";
  infoTooltip?: string;
  bankName?: string;
  debitDate?: string;
  brokerage?: string;
}

const cellTextSx = {
  fontSize: 14,
  fontWeight: 500,
  color: "text.secondary",
};

const MOCK_DATA: CreditNoteRow[] = [
  {
    id: "1",
    companyName: "Mediterian Logistcs",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Open",
    balance: "Mar 2026",
    actions: "offset-reverse",
    bankName: "INV-2024-0891",
    debitDate: "1st of each month",
  },
  {
    id: "2",
    companyName: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Off-sett Applied : INV-29283",
    balance: "R 0.00",
    actions: "view-details",
    bankName: "INV-2024-0892",
    debitDate: "1st of each month",
  },
  {
    id: "3",
    companyName: "DuraTech Mining",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Off-sett Applied : INV-29283",
    balance: { value: "R 300.00", color: "success.main" },
    actions: "view-details",
    bankName: "INV-2024-0893",
    debitDate: "1st of each month",
  },
  {
    id: "4",
    companyName: "Gold Fields",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Off-sett Applied : INV-29283",
    balance: { value: "R 567.00", color: "error.main" },
    actions: "view-details",
    bankName: "INV-2024-0894",
    debitDate: "1st of each month",
  },
  {
    id: "5",
    companyName: "Sibanye-Stillwater",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Submitted for Reversal",
    infoTooltip: "The policy has been submitted for reversal.",
    balance: "Feb 2026",
    actions: "view-details",
    bankName: "INV-2024-0895",
    debitDate: "1st of each month",
  },
  {
    id: "6",
    companyName: "Exxaro Resources",
    policyNo: "3843-43434-343333",
    creditNoteNo: "CN-2024-001",
    amount: "R 6,955.00",
    month: "Mar 2026",
    status: "Reversed",
    balance: "Feb 2026",
    actions: "view-details",
    bankName: "INV-2024-0896",
    debitDate: "1st of each month",
  },
];

const STATUS_OPTIONS = ["All", "Open", "Reversed"].map((s) => ({
  label: `Status : ${s}`,
  value: s,
}));

export default function CreditNotes() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);
  const [offsetCreditNote, setOffsetCreditNote] =
    useState<CreditNoteRow | null>(null);
  const [reverseCreditNote, setReverseCreditNote] =
    useState<CreditNoteRow | null>(null);
  const [selectedRow, setSelectedRow] = useState<CreditNoteRow | null>(null);
  const itemsPerPage = 6;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, selectedStatus]);

  const filteredData = useMemo(() => {
    let result = MOCK_DATA;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (item) =>
          item.companyName.toLowerCase().includes(q) ||
          item.policyNo.toLowerCase().includes(q)
      );
    }

    if (selectedStatus !== "All") {
      result = result.filter((item) => item.status === selectedStatus);
    }

    return result;
  }, [searchQuery, selectedStatus]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const columns: Column<CreditNoteRow>[] = useMemo(
    () => [
      {
        header: "Company & Policy No",
        cell: (row) => (
          <Box>
            <Typography
              sx={{ fontSize: 14, fontWeight: 700, color: "text.heading" }}
            >
              {row.companyName}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {row.policyNo}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Credit Note No",
        accessorKey: "creditNoteNo",
        cell: (row) => (
          <Typography sx={cellTextSx}>{row.creditNoteNo}</Typography>
        ),
      },
      {
        header: "Amount",
        accessorKey: "amount",
        cell: (row) => <Typography sx={cellTextSx}>{row.amount}</Typography>,
      },
      {
        header: "Month",
        accessorKey: "month",
        cell: (row) => <Typography sx={cellTextSx}>{row.month}</Typography>,
      },
      {
        header: "Status",
        cell: (row) => (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <StatusChip status={row.status} />
            {row.infoTooltip && (
              <Tooltip title={row.infoTooltip} arrow placement="top">
                <InfoOutlinedIcon
                  fontSize="small"
                  sx={{ color: "text.primary", cursor: "pointer" }}
                />
              </Tooltip>
            )}
          </Stack>
        ),
      },
      {
        header: "Balance",
        cell: (row) => {
          if (typeof row.balance === "object") {
            return (
              <Typography
                sx={{ fontSize: 14, fontWeight: 500, color: row.balance.color }}
              >
                {row.balance.value}
              </Typography>
            );
          }
          return <Typography sx={cellTextSx}>{row.balance}</Typography>;
        },
      },
      {
        header: "Actions",
        cell: (row) => (
          <Stack direction="row" spacing={1}>
            {row.actions === "offset-reverse" ? (
              <>
                <CustomButton
                  onClick={() => setOffsetCreditNote(row)}
                  variantType="outlined"
                  sizeType="sm"
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                >
                  Offset
                </CustomButton>
                <CustomButton
                  onClick={() => setReverseCreditNote(row)}
                  variantType="outlined"
                  sizeType="sm"
                  sx={{
                    fontSize: 13,
                    fontWeight: 400,
                    borderColor: "divider",
                    color: "text.primary",
                  }}
                >
                  Reverse
                </CustomButton>
              </>
            ) : (
              <CustomButton
                onClick={() => setSelectedRow(row)}
                variantType="outlined"
                sizeType="sm"
                startIcon={<ArrowOutwardIcon sx={{ fontSize: 16 }} />}
                sx={{
                  fontSize: 13,
                  fontWeight: 400,
                  borderColor: "divider",
                  color: "text.primary",
                }}
              >
                View Details
              </CustomButton>
            )}
          </Stack>
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
            options={STATUS_OPTIONS}
            sx={{ minWidth: 160 }}
          />
        </Stack>
      </Stack>

      <CustomTable
        columns={columns}
        data={filteredData}
        emptyMessage="No credit notes found matching the selected filters."
        colSpanCount={7}
        itemsPerPage={itemsPerPage}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />

      <ApplyOffsetDrawer
        open={Boolean(offsetCreditNote)}
        onClose={() => setOffsetCreditNote(null)}
        employer={offsetCreditNote?.companyName || ""}
      />

      <ReverseModal
        open={Boolean(reverseCreditNote)}
        onClose={() => setReverseCreditNote(null)}
      />

      <CreditDetailsDrawer
        open={Boolean(selectedRow)}
        onClose={() => setSelectedRow(null)}
        selectedRow={selectedRow}
      />
    </Paper>
  );
}
