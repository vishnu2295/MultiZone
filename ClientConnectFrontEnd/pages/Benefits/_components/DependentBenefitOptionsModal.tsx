// @ts-nocheck
import React from "react";
import {
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import axios from "axios";
import { useMutation } from "react-query";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";
import { nodeSa } from "src/AxiosParams";
import useToken from "hooks/useToken";

const DEPENDENT_BENEFIT_TYPES = ["Spouse", "Child", "Extended Family"];

const dependentBenefitOptionColumns = [
  { field: "benefit", headerName: "Benefit Name", flex: 2, minWidth: 200 },
  // {
  //   field: "coverMemberType",
  //   headerName: "Cover Member Type",
  //   flex: 1,
  //   minWidth: 150,
  // },
  {
    field: "coverAmount",
    headerName: "Cover Amount",
    flex: 1,
    minWidth: 130,
    type: "number",
    valueFormatter: (params) =>
      params.value != null ? `R ${Number(params.value).toLocaleString()}` : "—",
  },
  {
    field: "minAge",
    headerName: "Min Age",
    flex: 0.5,
    minWidth: 80,
    type: "number",
  },
  {
    field: "maxAge",
    headerName: "Max Age",
    flex: 0.5,
    minWidth: 80,
    type: "number",
  },
];

interface DependentBenefitOptionsModalProps {
  open: boolean;
  onClose: () => void;
  dependentBenefits: any[];
  mainMemberBenefitId?: number | string;
  onAddSuccess?: () => void | Promise<void>;
}

export default function DependentBenefitOptionsModal({
  open,
  onClose,
  dependentBenefits,
  mainMemberBenefitId,
  onAddSuccess,
}: DependentBenefitOptionsModalProps) {
  const accessToken = useToken();
  const [activeTab, setActiveTab] = React.useState(0);
  const [addingRowId, setAddingRowId] = React.useState<number | string | null>(
    null,
  );
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  const addDependentBenefitMutation = useMutation(
    async (dependentBenefitId: number | string) =>
      axios.post(
        `${nodeSa}/rules/mainMemberBenefit/${mainMemberBenefitId}/dependentBenefits`,
        {
          dependantBenefitId: dependentBenefitId,
        },
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ),
    {
      onSuccess: async () => {
        setAddingRowId(null);

        if (onAddSuccess) {
          await onAddSuccess();
        }

        setSnackbar({
          open: true,
          severity: "success",
          message: "Dependent benefit added successfully",
        });
        onClose();
      },
      onError: (error: any) => {
        setAddingRowId(null);

        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Failed to add dependent benefit";

        setSnackbar({ open: true, severity: "error", message });
      },
    },
  );

  const byType = DEPENDENT_BENEFIT_TYPES.reduce(
    (acc, type) => {
      acc[type] = Array.isArray(dependentBenefits)
        ? dependentBenefits.filter(
            (d) => d.coverMemberType?.toLowerCase() === type.toLowerCase(),
          )
        : [];
      return acc;
    },
    {} as Record<string, any[]>,
  );

  const availableTypes = DEPENDENT_BENEFIT_TYPES.filter(
    (t) => byType[t].length > 0,
  );

  const currentType = availableTypes[activeTab] ?? null;
  const currentRows = (currentType ? byType[currentType] : []).map(
    (row, i) => ({
      id:
        row.id ??
        row.dependantBenefitId ??
        row.dependentBenefitId ??
        row.benefitId ??
        i,
      ...row,
    }),
  );

  const isAdding = addDependentBenefitMutation.isLoading;

  const handleAddDependentBenefit = async (row: any) => {
    const rowId = row?.id;
    const dependentBenefitId =
      row?.dependantBenefitId ??
      row?.dependentBenefitId ??
      row?.benefitId ??
      row?.id;

    if (!mainMemberBenefitId || !dependentBenefitId) {
      setSnackbar({
        open: true,
        severity: "error",
        message: "Missing benefit details for this action",
      });
      return;
    }

    setAddingRowId(rowId ?? dependentBenefitId);
    await addDependentBenefitMutation.mutateAsync(dependentBenefitId);
  };

  // Reset tab when modal opens
  React.useEffect(() => {
    if (open) setActiveTab(0);
  }, [open]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Dependent Benefit Options
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent dividers>
        {availableTypes.length === 0 ? (
          <Alert severity="info">No dependent benefit options available</Alert>
        ) : (
          <>
            <Tabs
              value={activeTab}
              onChange={(_, val) => setActiveTab(val)}
              sx={{ mb: 2 }}
              variant="scrollable"
              scrollButtons="auto"
            >
              {availableTypes.map((type) => (
                <Tab
                  key={type}
                  label={
                    <Box display="flex" alignItems="center" gap={0.5}>
                      {type}
                      <Chip
                        label={byType[type].length}
                        size="small"
                        sx={{ height: 18, fontSize: 11 }}
                      />
                    </Box>
                  }
                />
              ))}
            </Tabs>
            <div style={{ height: 450, width: "100%" }}>
              <DataGridPremium
                rows={currentRows}
                columns={[
                  ...dependentBenefitOptionColumns,
                  {
                    field: "actions",
                    headerName: "Actions",
                    minWidth: 100,
                    sortable: false,
                    filterable: false,
                    disableColumnMenu: true,
                    renderCell: (params) => {
                      const isCurrentRowAdding =
                        isAdding && addingRowId === params.row.id;

                      return (
                        <IconButton
                          size="small"
                          color="success"
                          onClick={() => handleAddDependentBenefit(params.row)}
                          disabled={isAdding}
                          aria-label="Add dependent benefit"
                        >
                          {isCurrentRowAdding ? (
                            <CircularProgress size={18} color="inherit" />
                          ) : (
                            <AddIcon fontSize="small" />
                          )}
                        </IconButton>
                      );
                    },
                  },
                ]}
                slots={{ toolbar: GridToolbar }}
                slotProps={{ toolbar: { showQuickFilter: true } }}
                pagination
                initialState={{
                  sorting: {
                    sortModel: [{ field: "minAge", sort: "asc" }],
                  },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
              />
            </div>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="inherit" disabled={isAdding}>
          Close
        </Button>
      </DialogActions>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Dialog>
  );
}
