import React from "react";
import {
  Box,
  Typography,
  Stack,
  Tooltip,
  Grid,
  Divider,
  Avatar,
} from "@mui/material";
import SideDrawer from "../../../components/ui/SideDrawer";
import { CustomTable, Column } from "../../../components/ui/CustomTable";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import { StatusChip } from "../../../components/ui/StatusChip";
import { DebitOrder } from "../collectionTabs/DebitOrders";

const BANK_DETAILS = [
  { label: "Bank Name", value: "FNB" },
  { label: "Account Holder", value: "Meridian Logistics (Pty) Ltd" },
  { label: "Account Type", value: "Savings" },
  { label: "Account Number", value: "3474387473847374" },
  { label: "Bank Code", value: "FNB73643434" },
  { label: "Debit Date", value: "1st of each month" },
  { label: "Payment Method", value: "Debit Order" },
];

const labelStyle = { fontSize: 12, color: "text.secondary", mb: 0.5 };
const valueStyle = { fontSize: 14, fontWeight: 500, color: "text.valueText" };

const historyColumns: Column<DebitOrder>[] = [
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
      <Typography sx={{ fontSize: 14, fontWeight: 500 }}>{row.date}</Typography>
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
];

interface DebitOrderDetailsDrawerProps {
  selectedRow: DebitOrder | null;
  onClose: () => void;
  historyData: DebitOrder[];
}

export default function DebitOrderDetailsDrawer({
  selectedRow,
  onClose,
  historyData,
}: DebitOrderDetailsDrawerProps) {
  return (
    <SideDrawer
      open={Boolean(selectedRow)}
      onClose={onClose}
      title="Employer Details"
      width={{ xs: "100%", md: "55vw" }}
    >
      {selectedRow && (
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Header Info */}
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
              {selectedRow.company.substring(0, 2).toUpperCase()}
            </Avatar>
            <Box>
              <Typography
                sx={{ fontWeight: 700, fontSize: 16, color: "text.heading" }}
              >
                {selectedRow.company}
              </Typography>
              <Typography sx={{ fontSize: 13, color: "text.heading", mt: 0.5 }}>
                Policy No : {selectedRow.policyNo} &nbsp;|&nbsp; Brokerage :{" "}
                <Box
                  component="span"
                  sx={{ fontWeight: 600, color: "text.primary" }}
                >
                  {selectedRow.brokerage}
                </Box>
              </Typography>
            </Box>
          </Stack>

          {/* Bank Account Details */}
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                mb: 2,
                color: "text.heading",
              }}
            >
              Bank Account Details
            </Typography>
            <Grid container spacing={3}>
              {BANK_DETAILS.map((detail) => (
                <Grid key={detail.label} size={{ xs: 12, sm: 4 }}>
                  <Typography sx={labelStyle}>{detail.label}</Typography>
                  <Typography sx={valueStyle}>{detail.value}</Typography>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Divider />

          {/* Payment History */}
          <Box>
            <Typography
              sx={{
                fontWeight: 700,
                fontSize: 16,
                mb: 2,
                color: "text.heading",
              }}
            >
              Debit Order Payment History
            </Typography>
            <CustomTable
              columns={historyColumns}
              data={historyData}
              emptyMessage="No history found."
            />
          </Box>
        </Box>
      )}
    </SideDrawer>
  );
}
