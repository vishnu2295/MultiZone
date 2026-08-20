// @ts-nocheck
import React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  LinearProgress,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";
import MainMemberBenefitsDetails from "./MainMemberBenefitsDetails";
import MainMemberBenefitEdit from "./MainMemberBenefitEdit";

interface MainMemberBenefitsProps {
  benefitsQuery: any;
  benefits: any[];
  role?: string;
  deleteBenefit: (benefitId: number | string) => Promise<void>;
  isDeletingBenefit?: boolean;
  dependentBenefits?: any[];
}

const MainMemberBenefits: React.FC<MainMemberBenefitsProps> = ({
  benefitsQuery,
  benefits,
  role,
  deleteBenefit,
  isDeletingBenefit,
  dependentBenefits = [],
}) => {
  const [selectedBenefit, setSelectedBenefit] = React.useState(null);
  const [benefitToEdit, setBenefitToEdit] = React.useState(null);
  const [benefitToDelete, setBenefitToDelete] = React.useState(null);
  const [deleteSuccess, setDeleteSuccess] = React.useState(false);

  const isUserAdmin = role === "CDA-RMA-User Admin";

  const handleDeleteConfirm = async () => {
    if (!benefitToDelete?.benefitId && !benefitToDelete?.id) {
      return;
    }

    await deleteBenefit(benefitToDelete.benefitId ?? benefitToDelete.id);
    setBenefitToDelete(null);
    setDeleteSuccess(true);
  };

  const columns = [
    {
      field: "benefit",
      headerName: "Benefit Name",
      flex: 2,
      minWidth: 300,
    },
    {
      field: "benefitAmount",
      headerName: "Amount",
      flex: 1,
      minWidth: 120,
      type: "number",
    },
    {
      field: "minAge",
      headerName: "Min Age",
      flex: 0.5,
      minWidth: 100,
      type: "number",
    },
    {
      field: "maxAge",
      headerName: "Max Age",
      flex: 0.5,
      minWidth: 100,
      type: "number",
    },
    {
      field: "dependents",
      headerName: "Dependents",
      flex: 1.5,
      minWidth: 250,
      renderCell: (params) => {
        const { spouse = 0, children = 0, familyMembers = 0 } = params.row;
        const chips = [];
        if (spouse > 0) {
          chips.push(
            <Chip
              key="spouse"
              label={`${spouse} Spouse${spouse > 1 ? "s" : ""}`}
              size="small"
              sx={{ backgroundColor: "#1976d2", color: "#fff" }}
            />,
          );
        }
        if (children > 0) {
          chips.push(
            <Chip
              key="children"
              label={`${children} Children`}
              size="small"
              sx={{ backgroundColor: "#2e7d32", color: "#fff" }}
            />,
          );
        }
        if (familyMembers > 0) {
          chips.push(
            <Chip
              key="family"
              label={`${familyMembers} Family`}
              size="small"
              sx={{ backgroundColor: "#ed6c02", color: "#fff" }}
            />,
          );
        }
        return (
          <Stack
            direction="row"
            spacing={0.5}
            alignItems="center"
            sx={{ height: "100%" }}
          >
            {chips.length > 0 ? (
              chips
            ) : (
              <Typography variant="body2" color="text.secondary">
                —
              </Typography>
            )}
          </Stack>
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 180,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => (
        <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
          <Button
            size="small"
            variant="outlined"
            onClick={() => setSelectedBenefit(params.row)}
          >
            View
          </Button>
          {isUserAdmin && (
            <Button
              size="small"
              variant="outlined"
              color="warning"
              startIcon={<EditIcon />}
              onClick={() => setBenefitToEdit(params.row)}
            >
              Edit
            </Button>
          )}
          {isUserAdmin && (
            <Button
              size="small"
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => setBenefitToDelete(params.row)}
            >
              Delete
            </Button>
          )}
        </Stack>
      ),
    },
  ];
  const rows = Array.isArray(benefits)
    ? benefits.map((row, index) => ({
        id: row.benefitId ?? index,
        ...row,
      }))
    : [];

  return (
    <>
      {benefitsQuery.isLoading && (
        <>
          <LinearProgress />
          <Skeleton variant="rectangular" height={400} sx={{ my: 2 }} />
        </>
      )}

      {benefitsQuery.isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching benefits
        </Alert>
      )}

      {!benefitsQuery.isLoading && rows.length > 0 && (
        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Main Member Benefits
            </Typography>
            <div style={{ height: 750, width: "100%" }}>
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
                  sorting: {
                    sortModel: [
                      { field: "benefitAmount", sort: "asc" },
                      { field: "minAge", sort: "asc" },
                    ],
                  },
                  filter: {
                    filterModel: {
                      items: [],
                      quickFilterExcludeHiddenColumns: true,
                    },
                  },
                  pagination: { paginationModel: { pageSize: 10 } },
                }}
                pageSizeOptions={[5, 10, 25]}
                disableRowSelectionOnClick
              />
            </div>
          </CardContent>
        </Card>
      )}

      {!benefitsQuery.isLoading &&
        !benefitsQuery.isError &&
        rows.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            No benefits found for this scheme
          </Alert>
        )}

      <MainMemberBenefitsDetails
        open={!!selectedBenefit}
        onClose={() => setSelectedBenefit(null)}
        benefit={selectedBenefit}
      />

      <MainMemberBenefitEdit
        open={!!benefitToEdit}
        onClose={() => setBenefitToEdit(null)}
        benefit={benefitToEdit}
        onSaveSuccess={() => benefitsQuery.refetch()}
        dependentBenefits={dependentBenefits}
      />

      <Dialog
        open={!!benefitToDelete}
        onClose={() => !isDeletingBenefit && setBenefitToDelete(null)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete benefit?</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete{" "}
            <strong>{benefitToDelete?.benefit ?? "this benefit"}</strong>? This
            action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setBenefitToDelete(null)}
            color="inherit"
            disabled={isDeletingBenefit}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
            disabled={isDeletingBenefit}
            startIcon={
              isDeletingBenefit ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {isDeletingBenefit ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={deleteSuccess}
        autoHideDuration={4000}
        onClose={() => setDeleteSuccess(false)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setDeleteSuccess(false)}
          severity="success"
          variant="filled"
        >
          Benefit deleted successfully
        </Alert>
      </Snackbar>
    </>
  );
};

export default MainMemberBenefits;
