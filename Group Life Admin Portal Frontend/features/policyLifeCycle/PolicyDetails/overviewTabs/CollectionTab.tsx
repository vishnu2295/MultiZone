import DataField from "@/components/ui/DataField";
import { Box, Typography, Grid } from "@mui/material";

export default function CollectionTab() {
  return (
    <Box>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 3 }}>
        Bank Account Details
      </Typography>
      <Grid container spacing={4} sx={{ mb: 5 }}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Bank Name" value="FNB" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField
            label="Account Holder"
            value="Meridian Logistics (Pty) Ltd"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Account Type" value="Savings" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <DataField label="Account Number" value="3474387473847374" />
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
    </Box>
  );
}
