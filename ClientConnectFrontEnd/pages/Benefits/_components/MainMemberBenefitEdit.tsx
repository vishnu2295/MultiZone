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
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  InputAdornment,
  Snackbar,
  Switch,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import SaveIcon from "@mui/icons-material/Save";
import VisibilityIcon from "@mui/icons-material/Visibility";
import axios from "axios";
import { useMutation, useQuery } from "react-query";
import {
  DataGridPremium,
  GridActionsCellItem,
  GridToolbar,
} from "@mui/x-data-grid-premium";
import { nodeSa } from "src/AxiosParams";
import useToken from "hooks/useToken";
import DependentBenefitOptionsModal from "./DependentBenefitOptionsModal";

const COVER_MEMBER_TYPES = ["Spouse", "Child", "Extended Family"];

const dependentColumns = [
  { field: "benefit", headerName: "Benefit Name", flex: 2, minWidth: 250 },
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
  { field: "subGroup", headerName: "Sub Group", flex: 1, minWidth: 120 },
];

interface MainMemberBenefitEditProps {
  open: boolean;
  onClose: () => void;
  benefit: any;
  onSaveSuccess: () => void;
  dependentBenefits?: any[];
}

function NumberField({
  label,
  value,
  onChange,
  name,
  prefix,
}: {
  label: string;
  value: any;
  onChange: (name: string, value: string) => void;
  name: string;
  prefix?: string;
}) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <TextField
        label={label}
        type="number"
        size="small"
        fullWidth
        value={value ?? ""}
        onChange={(e) => onChange(name, e.target.value)}
        InputProps={
          prefix
            ? {
                startAdornment: (
                  <InputAdornment position="start">{prefix}</InputAdornment>
                ),
              }
            : undefined
        }
        inputProps={{ min: 0 }}
      />
    </Grid>
  );
}

export default function MainMemberBenefitEdit({
  open,
  onClose,
  benefit,
  onSaveSuccess,
  dependentBenefits = [],
}: MainMemberBenefitEditProps) {
  const accessToken = useToken();

  const [form, setForm] = React.useState<Record<string, any>>({});
  const [tabValue, setTabValue] = React.useState(0);
  const [dependentOptionsOpen, setDependentOptionsOpen] = React.useState(false);
  const [dependentBenefitToDelete, setDependentBenefitToDelete] =
    React.useState<any>(null);
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    severity: "success" | "error";
    message: string;
  }>({ open: false, severity: "success", message: "" });

  // Sync form state when benefit changes
  React.useEffect(() => {
    if (benefit) {
      setTabValue(0);
      setForm({
        benefitAmount: benefit.benefitAmount ?? "",
        defaultBenefit: benefit.defaultBenefit === true,
        minAge: benefit.minAge ?? "",
        maxAge: benefit.maxAge ?? "",
        spouse: benefit.spouse ?? "",
        children: benefit.children ?? "",
        childMinAge: benefit.childMinAge ?? "",
        childMaxAge: benefit.childMaxAge ?? "",
        studentChildMinAge: benefit.studentChildMinAge ?? "",
        studentChildMaxAge: benefit.studentChildMaxAge ?? "",
        disabledChildMinAge: benefit.disabledChildMinAge ?? "",
        disabledChildMaxAge: benefit.disabledChildMaxAge ?? "",
        familyMembers: benefit.familyMembers ?? "",
        familyMemberMinAge: benefit.familyMemberMinAge ?? "",
        familyMemberMaxAge: benefit.familyMemberMaxAge ?? "",
        familyMembersOver64: benefit.familyMembersOver64 ?? "",
        extended: benefit.extended ?? "",
        otherBenefit: benefit.otherBenefit ?? "",
        parentBenefit: benefit.parentBenefit ?? "",
      });
    }
  }, [benefit]);

  const handleChange = (name: string, value: string) => {
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const benefitId = benefit?.benefitId;

  const dependentsQuery = useQuery(
    ["dependentBenefits", benefitId],
    async () =>
      await axios.get(
        `${nodeSa}/rules/mainMemberBenefit/${benefitId}/dependentBenefits`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ),
    { enabled: open && !!accessToken && !!benefitId },
  );

  const allDependents =
    dependentsQuery?.data?.data?.data ?? dependentsQuery?.data?.data ?? [];

  const deleteDependentBenefitMutation = useMutation(
    async (dependentBenefit: any) =>
      axios.delete(
        `${nodeSa}/rules/mainMemberBenefit/${benefitId}/dependentBenefits/${dependentBenefit?.dependantBenefitId ?? dependentBenefit?.dependentBenefitId ?? dependentBenefit?.benefitId ?? dependentBenefit?.id}`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ),
    {
      onSuccess: async () => {
        setDependentBenefitToDelete(null);
        await dependentsQuery.refetch();
        onSaveSuccess();
        setSnackbar({
          open: true,
          severity: "success",
          message: "Dependent benefit deleted successfully",
        });
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Failed to delete dependent benefit";
        setSnackbar({ open: true, severity: "error", message });
      },
    },
  );

  const dependentsByType = COVER_MEMBER_TYPES.reduce((acc, type) => {
    acc[type] = Array.isArray(allDependents)
      ? allDependents.filter(
          (d) => d.coverMemberType?.toLowerCase() === type.toLowerCase(),
        )
      : [];
    return acc;
  }, {});

  const availableTypes = COVER_MEMBER_TYPES.filter(
    (t) => dependentsByType[t].length > 0,
  );

  const currentType = availableTypes[tabValue] ?? null;
  const currentRows = currentType ? dependentsByType[currentType] : [];

  const dependentRows = currentRows.map((row, index) => ({
    ...row,
    id:
      row.id ??
      row.dependantBenefitId ??
      row.dependentBenefitId ??
      row.benefitId ??
      index,
  }));

  const updateMutation = useMutation(
    async (payload: Record<string, any>) =>
      axios.put(
        `${nodeSa}/rules/mainMemberBenefit/${benefit?.benefitId ?? benefit?.id}`,
        payload,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        },
      ),
    {
      onSuccess: () => {
        setSnackbar({
          open: true,
          severity: "success",
          message: "Benefit updated successfully",
        });
        onSaveSuccess();
      },
      onError: (error: any) => {
        const message =
          error?.response?.data?.message ??
          error?.message ??
          "Failed to update benefit";
        setSnackbar({ open: true, severity: "error", message });
      },
    },
  );

  const handleSave = () => {
    // Convert numeric string fields to numbers where appropriate
    const numericFields = [
      "benefitAmount",
      "minAge",
      "maxAge",
      "spouse",
      "children",
      "childMinAge",
      "childMaxAge",
      "studentChildMinAge",
      "studentChildMaxAge",
      "disabledChildMinAge",
      "disabledChildMaxAge",
      "familyMembers",
      "familyMemberMinAge",
      "familyMemberMaxAge",
      "familyMembersOver64",
      "extended",
      "otherBenefit",
      "parentBenefit",
    ];

    const payload = Object.fromEntries(
      Object.entries(form).map(([key, val]) => {
        if (numericFields.includes(key)) {
          return [key, val === "" || val === null ? null : Number(val)];
        }
        return [key, val];
      }),
    );

    updateMutation.mutate(payload);
  };

  const handleDeleteDependentBenefitConfirm = async () => {
    if (!dependentBenefitToDelete) {
      return;
    }

    await deleteDependentBenefitMutation.mutateAsync(dependentBenefitToDelete);
  };

  const dependentColumnsWithActions = [
    ...dependentColumns,
    {
      field: "actions",
      type: "actions",
      headerName: "Actions",
      width: 90,
      getActions: (params: any) => [
        <GridActionsCellItem
          key={`delete-${params.row.id}`}
          icon={<DeleteIcon />}
          label="Delete"
          onClick={() => setDependentBenefitToDelete(params.row)}
          color="error"
          disabled={deleteDependentBenefitMutation.isLoading}
        />,
      ],
    },
  ];

  if (!benefit) return null;

  const isSaving = updateMutation.isLoading;
  const isDeletingDependentBenefit = deleteDependentBenefitMutation.isLoading;

  return (
    <>
      <Dialog
        open={open}
        onClose={() => !isSaving && onClose()}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle>
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
          >
            <Typography variant="h6" component="div">
              Edit Benefit
            </Typography>
            <IconButton onClick={onClose} size="small" disabled={isSaving}>
              <CloseIcon />
            </IconButton>
          </Box>
        </DialogTitle>

        <DialogContent dividers>
          {/* Benefit Name — read-only */}
          <Typography variant="subtitle1" fontWeight={700} gutterBottom>
            Main Member Benefit
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <Grid item xs={12} sm={6} md={4}>
              <TextField
                label="Benefit Name"
                value={benefit.benefit ?? "—"}
                size="small"
                fullWidth
                disabled
                helperText="Benefit name cannot be changed"
              />
            </Grid>
            <NumberField
              label="Benefit Amount"
              name="benefitAmount"
              value={form.benefitAmount}
              onChange={handleChange}
              prefix="R"
            />
            <Grid item xs={12} sm={6} md={4}>
              <Box
                sx={{
                  minHeight: 56,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <FormControlLabel
                  sx={{ m: 0 }}
                  control={
                    <Switch
                      checked={!!form.defaultBenefit}
                      onChange={(e) =>
                        handleChange("defaultBenefit", e.target.checked)
                      }
                      color="primary"
                    />
                  }
                  label={
                    form.defaultBenefit
                      ? "Default Benefit: Yes"
                      : "Default Benefit: No"
                  }
                />
              </Box>
            </Grid>
          </Grid>

          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mt: 1, mb: 1 }}
          >
            Eligibility Criteria
          </Typography>
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <NumberField
              label="Min Age"
              name="minAge"
              value={form.minAge}
              onChange={handleChange}
            />
            <NumberField
              label="Max Age"
              name="maxAge"
              value={form.maxAge}
              onChange={handleChange}
            />
          </Grid>

          <Divider sx={{ my: 1 }} />
          <Typography
            variant="subtitle2"
            fontWeight={600}
            sx={{ mt: 1, mb: 1 }}
          >
            Dependent Allowances
          </Typography>

          {/* Spouses */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <NumberField
              label="Spouses"
              name="spouse"
              value={form.spouse}
              onChange={handleChange}
            />
          </Grid>

          {/* Children */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <NumberField
              label="Children"
              name="children"
              value={form.children}
              onChange={handleChange}
            />
            <NumberField
              label="Child Min Age"
              name="childMinAge"
              value={form.childMinAge}
              onChange={handleChange}
            />
            <NumberField
              label="Child Max Age"
              name="childMaxAge"
              value={form.childMaxAge}
              onChange={handleChange}
            />
            <NumberField
              label="Student Child Min Age"
              name="studentChildMinAge"
              value={form.studentChildMinAge}
              onChange={handleChange}
            />
            <NumberField
              label="Student Child Max Age"
              name="studentChildMaxAge"
              value={form.studentChildMaxAge}
              onChange={handleChange}
            />
            <NumberField
              label="Disabled Child Min Age"
              name="disabledChildMinAge"
              value={form.disabledChildMinAge}
              onChange={handleChange}
            />
            <NumberField
              label="Disabled Child Max Age"
              name="disabledChildMaxAge"
              value={form.disabledChildMaxAge}
              onChange={handleChange}
            />
          </Grid>

          {/* Family Members */}
          <Grid container spacing={2} sx={{ mb: 2 }}>
            <NumberField
              label="Family Members"
              name="familyMembers"
              value={form.familyMembers}
              onChange={handleChange}
            />
            <NumberField
              label="Family Member Min Age"
              name="familyMemberMinAge"
              value={form.familyMemberMinAge}
              onChange={handleChange}
            />
            <NumberField
              label="Family Member Max Age"
              name="familyMemberMaxAge"
              value={form.familyMemberMaxAge}
              onChange={handleChange}
            />
            <NumberField
              label="Family Members Over 64"
              name="familyMembersOver64"
              value={form.familyMembersOver64}
              onChange={handleChange}
            />
            <NumberField
              label="Extended Family"
              name="extended"
              value={form.extended}
              onChange={handleChange}
            />
            <NumberField
              label="Other Benefit"
              name="otherBenefit"
              value={form.otherBenefit}
              onChange={handleChange}
            />
            <NumberField
              label="Parent Benefit"
              name="parentBenefit"
              value={form.parentBenefit}
              onChange={handleChange}
            />
          </Grid>

          {/* Dependent Benefits */}
          <Divider sx={{ my: 2 }} />
          <Box
            display="flex"
            alignItems="center"
            justifyContent="space-between"
            sx={{ mb: 1 }}
          >
            <Typography variant="subtitle1" fontWeight={700}>
              Dependent Benefits
            </Typography>
            <Button
              size="small"
              variant="outlined"
              startIcon={<VisibilityIcon />}
              onClick={() => setDependentOptionsOpen(true)}
              disabled={!dependentBenefits || dependentBenefits.length === 0}
            >
              View Benefit Options
            </Button>
          </Box>

          {dependentsQuery.isLoading && (
            <Box display="flex" alignItems="center" gap={1} sx={{ my: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                Loading dependent benefits...
              </Typography>
            </Box>
          )}

          {dependentsQuery.isError && (
            <Alert severity="error" sx={{ my: 1 }}>
              Error fetching dependent benefits
            </Alert>
          )}

          {!dependentsQuery.isLoading &&
            !dependentsQuery.isError &&
            availableTypes.length === 0 && (
              <Alert severity="info" sx={{ my: 1 }}>
                No dependent benefits found for this benefit
              </Alert>
            )}

          {!dependentsQuery.isLoading && availableTypes.length > 0 && (
            <>
              <Tabs
                value={tabValue}
                onChange={(_, val) => setTabValue(val)}
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
                          label={dependentsByType[type].length}
                          size="small"
                          sx={{ height: 18, fontSize: 11 }}
                        />
                      </Box>
                    }
                  />
                ))}
              </Tabs>

              <div style={{ height: 400, width: "100%" }}>
                <DataGridPremium
                  rows={dependentRows}
                  columns={dependentColumnsWithActions}
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
          <Button onClick={onClose} color="inherit" disabled={isSaving}>
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            variant="contained"
            color="primary"
            disabled={isSaving}
            startIcon={
              isSaving ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <SaveIcon />
              )
            }
          >
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={!!dependentBenefitToDelete}
        onClose={() =>
          !isDeletingDependentBenefit && setDependentBenefitToDelete(null)
        }
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Delete dependent benefit?</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete the combination of
            <strong>
              {` ${benefit?.benefit ?? "this main member benefit"}`}
            </strong>
            {" and "}
            <strong>
              {dependentBenefitToDelete?.benefit ?? "this dependent benefit"}
            </strong>
            ? This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={() => setDependentBenefitToDelete(null)}
            color="inherit"
            disabled={isDeletingDependentBenefit}
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteDependentBenefitConfirm}
            color="error"
            variant="contained"
            disabled={isDeletingDependentBenefit}
            startIcon={
              isDeletingDependentBenefit ? (
                <CircularProgress size={16} color="inherit" />
              ) : (
                <DeleteIcon />
              )
            }
          >
            {isDeletingDependentBenefit ? "Deleting..." : "Delete"}
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={5000}
        onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setSnackbar((s) => ({ ...s, open: false }))}
          severity={snackbar.severity}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>

      <DependentBenefitOptionsModal
        open={dependentOptionsOpen}
        onClose={() => setDependentOptionsOpen(false)}
        mainMemberBenefitId={benefitId}
        onAddSuccess={async () => {
          await dependentsQuery.refetch();
          onSaveSuccess();
        }}
        dependentBenefits={
          Array.isArray(dependentBenefits)
            ? dependentBenefits
            : (dependentBenefits?.benefits ?? [])
        }
      />
    </>
  );
}
