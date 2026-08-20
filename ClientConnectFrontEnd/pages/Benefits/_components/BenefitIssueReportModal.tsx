import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import {
  Alert,
  Box,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";
import axios from "axios";
import { useQuery } from "react-query";

import useToken from "hooks/useToken";
import { nodeSa } from "src/AxiosParams";

interface BenefitIssueReportModalProps {
  open: boolean;
  onClose: () => void;
}

interface BenefitIssueRow {
  id: string;
  BrokerageName: string;
  ProviderName: string;
  ProductOptionId: number;
  coverAmount: number;
  UniquePolicyCount: number;
}

const columns = [
  {
    field: "BrokerageName",
    headerName: "Brokerage Name",
    flex: 1.2,
    minWidth: 220,
  },
  {
    field: "ProviderName",
    headerName: "Scheme",
    flex: 1.1,
    minWidth: 220,
  },
  {
    field: "coverAmount",
    headerName: "Cover Amount",
    type: "number",
    flex: 0.8,
    minWidth: 160,
    valueFormatter: (params: { value?: number | null }) =>
      params.value != null ? `R ${Number(params.value).toLocaleString()}` : "-",
  },
  {
    field: "UniquePolicyCount",
    headerName: "Policy Impact",
    type: "number",
    flex: 0.7,
    minWidth: 150,
  },
];

export default function BenefitIssueReportModal({
  open,
  onClose,
}: BenefitIssueReportModalProps) {
  const accessToken = useToken();

  const issueReportQuery = useQuery(
    "processingPolicyIssues",
    async () =>
      await axios.get(`${nodeSa}/rules/reports/processingPolicyIssues`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }),
    {
      enabled: open && !!accessToken,
    },
  );

  const rows: BenefitIssueRow[] = Array.isArray(
    issueReportQuery?.data?.data?.data,
  )
    ? issueReportQuery.data.data.data.map(
        (row: Omit<BenefitIssueRow, "id">, index: number) => ({
          id: `${row.ProductOptionId}-${row.coverAmount}-${index}`,
          ...row,
        }),
      )
    : [];

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Possible Benefit Issues
          </Typography>
          <IconButton onClick={onClose} size="small" aria-label="Close report">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {issueReportQuery.isLoading && <LinearProgress sx={{ mb: 2 }} />}

        {issueReportQuery.isError && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Error fetching benefit issue report
          </Alert>
        )}

        {!issueReportQuery.isLoading &&
          !issueReportQuery.isError &&
          rows.length === 0 && (
            <Alert severity="info">No possible benefit issues found</Alert>
          )}

        {rows.length > 0 && (
          <Box sx={{ height: 520, width: "100%" }}>
            <DataGridPremium
              rows={rows}
              columns={columns}
              pagination
              slots={{ toolbar: GridToolbar }}
              slotProps={{
                toolbar: {
                  showQuickFilter: true,
                },
              }}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 10 },
                },
              }}
              pageSizeOptions={[10, 25, 50]}
              disableRowSelectionOnClick
            />
          </Box>
        )}
      </DialogContent>
    </Dialog>
  );
}
