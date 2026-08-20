// @ts-nocheck
import React from "react";
import {
  Alert,
  Box,
  Chip,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  FormControlLabel,
  Grid,
  IconButton,
  LinearProgress,
  Switch,
  Tab,
  Tabs,
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DataGridPremium, GridToolbar } from "@mui/x-data-grid-premium";
import axios from "axios";
import { useQuery } from "react-query";
import { nodeSa } from "src/AxiosParams";
import useToken from "hooks/useToken";

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

function DetailRow({ label, value }) {
  return (
    <Grid item xs={12} sm={6} md={4}>
      <Typography variant="caption" color="text.secondary" display="block">
        {label}
      </Typography>
      <Typography variant="body2" fontWeight={500}>
        {value ?? "—"}
      </Typography>
    </Grid>
  );
}

function formatCurrency(val) {
  if (val == null) return "—";
  return `R ${Number(val).toLocaleString()}`;
}

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-ZA", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function MainMemberBenefitsDetails({ open, onClose, benefit }) {
  const accessToken = useToken();
  const [tabValue, setTabValue] = React.useState(0);

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

  const dependentsByType = COVER_MEMBER_TYPES.reduce((acc, type) => {
    acc[type] = Array.isArray(allDependents)
      ? allDependents.filter(
          (d) => d.coverMemberType?.toLowerCase() === type.toLowerCase(),
        )
      : [];
    return acc;
  }, {});

  // Only show tabs for types that exist in the returned data
  const availableTypes = COVER_MEMBER_TYPES.filter(
    (t) => dependentsByType[t].length > 0,
  );

  const currentType = availableTypes[tabValue] ?? null;
  const currentRows = currentType ? dependentsByType[currentType] : [];

  if (!benefit) return null;

  return (
    <Dialog open={open} onClose={onClose} maxWidth="lg" fullWidth>
      <DialogTitle>
        <Box display="flex" alignItems="center" justifyContent="space-between">
          <Typography variant="h6" component="div">
            Benefit Details
          </Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent dividers>
        {/* Main Member Benefit Summary */}
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Main Member Benefit
        </Typography>

        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DetailRow label="Benefit Name" value={benefit.benefit} />
          <DetailRow
            label="Benefit Amount"
            value={formatCurrency(benefit.benefitAmount)}
          />
          <Grid item xs={12} sm={6} md={4}>
            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
            >
              Default Benefit
            </Typography>
            <Box sx={{ minHeight: 24, display: "flex", alignItems: "center" }}>
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Switch
                    checked={benefit?.defaultBenefit === true}
                    disabled
                    color="primary"
                  />
                }
                label={benefit?.defaultBenefit === true ? "Yes" : "No"}
              />
            </Box>
          </Grid>
        </Grid>

        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1, mb: 1 }}>
          Eligibility Criteria
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DetailRow label="Min Age" value={benefit.minAge} />
          <DetailRow label="Max Age" value={benefit.maxAge} />
        </Grid>

        <Divider sx={{ my: 1 }} />
        <Typography variant="subtitle2" fontWeight={600} sx={{ mt: 1, mb: 1 }}>
          Dependent Allowances
        </Typography>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DetailRow label="Spouses" value={benefit.spouse} />
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DetailRow label="Children" value={benefit.children} />
          <DetailRow label="Child Min Age" value={benefit.childMinAge} />
          <DetailRow label="Child Max Age" value={benefit.childMaxAge} />
          <DetailRow
            label="Student Child Min Age"
            value={benefit.studentChildMinAge}
          />
          <DetailRow
            label="Student Child Max Age"
            value={benefit.studentChildMaxAge}
          />
          <DetailRow
            label="Disabled Child Min Age"
            value={benefit.disabledChildMinAge}
          />
          <DetailRow
            label="Disabled Child Max Age"
            value={benefit.disabledChildMaxAge}
          />
        </Grid>
        <Grid container spacing={2} sx={{ mb: 2 }}>
          <DetailRow label="Family Members" value={benefit.familyMembers} />
          <DetailRow
            label="Family Member Min Age"
            value={benefit.familyMemberMinAge}
          />
          <DetailRow
            label="Family Member Max Age"
            value={benefit.familyMemberMaxAge}
          />
          <DetailRow
            label="Family Members Over 64"
            value={benefit.familyMembersOver64}
          />
          <DetailRow label="Extended Family" value={benefit.extended} />
          <DetailRow label="Other Benefit" value={benefit.otherBenefit} />
          <DetailRow label="Parent Benefit" value={benefit.parentBenefit} />
        </Grid>

        {/* Dependent Benefits */}
        <Divider sx={{ my: 2 }} />
        <Typography variant="subtitle1" fontWeight={700} gutterBottom>
          Dependent Benefits
        </Typography>

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
                rows={currentRows}
                columns={dependentColumns}
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
    </Dialog>
  );
}
