import DataField from "@/components/ui/DataField";
import { Box, Divider, Grid, Typography } from "@mui/material";

export default function OverviewTab() {
  return (
    <Box>
      {/* Company Details */}
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>
        Company Details
      </Typography>
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Policy Number" value="GRP-2023-00412" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField
            label="Company Name"
            value="Meridian Logistics (Pty) Ltd"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Registration Number" value="2019/347821/07" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Brokerage" value="Kenn Brokerage" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Bank Code" value="FNB73643434" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Debit Date" value="1st of each month" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Payment Method" value="Debit Order" />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 4 }} />

      {/* Contact Person */}
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>
        Contact Person
      </Typography>
      <Grid container spacing={4}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Name" value="Sandra Nkosi" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Email" value="s.nkosi@meridianlogistics.co.za" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Phone Number" value="082 341 9087" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField
            label="Address"
            value="14 Commerce Park, Germiston, Gauteng, 1401"
          />
        </Grid>
      </Grid>
    </Box>
  );
}
