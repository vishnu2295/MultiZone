// @ts-nocheck
import React from "react";
import {
  Alert,
  Button,
  Card,
  CardContent,
  CircularProgress,
  LinearProgress,
  Skeleton,
  Snackbar,
  Stack,
  Typography,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";

interface UnallocatedBenefitsProps {
  rmaBenefitsQuery: any;
  unallocatedRows: any[];
  addBenefit: (row: any) => Promise<void>;
  isAddingBenefit?: boolean;
  role?: string;
}

const UnallocatedBenefits: React.FC<UnallocatedBenefitsProps> = ({
  rmaBenefitsQuery,
  unallocatedRows,
  addBenefit,
  isAddingBenefit,
  role,
}) => {
  const isUserAdmin = role === "CDA-RMA-User Admin";

  const [addingRowId, setAddingRowId] = React.useState<number | string | null>(
    null,
  );
  const [successMessage, setSuccessMessage] = React.useState<string | null>(
    null,
  );

  const handleAdd = async (row: any) => {
    setAddingRowId(row.id);
    try {
      await addBenefit(row);
      setSuccessMessage(`"${row.name}" added successfully`);
    } finally {
      setAddingRowId(null);
    }
  };

  const unallocatedColumns = [
    // {
    //   field: "id",
    //   headerName: "ID",
    //   flex: 0.5,
    //   minWidth: 100,
    // },
    {
      field: "name",
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
      field: "actions",
      headerName: "Actions",
      flex: 1,
      minWidth: 130,
      sortable: false,
      filterable: false,
      disableColumnMenu: true,
      renderCell: (params) => {
        const isThisRowAdding = addingRowId === params.row.id;
        return (
          <Stack direction="row" spacing={1} alignItems="center" sx={{ py: 1 }}>
            {isUserAdmin && (
              <Button
                size="small"
                variant="outlined"
                color="success"
                startIcon={
                  isThisRowAdding ? (
                    <CircularProgress size={14} color="inherit" />
                  ) : (
                    <AddIcon />
                  )
                }
                disabled={isAddingBenefit || addingRowId !== null}
                onClick={() => handleAdd(params.row)}
              >
                {isThisRowAdding ? "Adding..." : "Add"}
              </Button>
            )}
          </Stack>
        );
      },
    },
  ];

  return (
    <>
      {rmaBenefitsQuery.isLoading && (
        <>
          <LinearProgress />
          <Skeleton variant="rectangular" height={400} sx={{ my: 2 }} />
        </>
      )}

      {rmaBenefitsQuery.isError && (
        <Alert severity="error" sx={{ my: 2 }}>
          Error fetching unallocated benefits
        </Alert>
      )}

      {!rmaBenefitsQuery.isLoading && unallocatedRows.length > 0 && (
        <Card variant="outlined" sx={{ my: 2 }}>
          <CardContent>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Unallocated Benefits
            </Typography>
            <div style={{ height: 750, width: "100%" }}>
              <DataGridPremium
                rows={unallocatedRows}
                columns={unallocatedColumns}
                pagination
                slots={{ toolbar: GridToolbar }}
                slotProps={{
                  toolbar: {
                    showQuickFilter: true,
                  },
                }}
                initialState={{
                  sorting: {
                    sortModel: [{ field: "benefitAmount", sort: "asc" }],
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

      {!rmaBenefitsQuery.isLoading &&
        !rmaBenefitsQuery.isError &&
        unallocatedRows.length === 0 && (
          <Alert severity="info" sx={{ my: 2 }}>
            No unallocated main member benefits found for this scheme
          </Alert>
        )}

      <Snackbar
        open={!!successMessage}
        autoHideDuration={4000}
        onClose={() => setSuccessMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSuccessMessage(null)}
          severity="success"
          variant="filled"
          sx={{ width: "100%" }}
        >
          {successMessage}
        </Alert>
      </Snackbar>
    </>
  );
};

export default UnallocatedBenefits;
