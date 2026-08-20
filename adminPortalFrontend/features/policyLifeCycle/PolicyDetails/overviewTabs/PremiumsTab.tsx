import { Box, Paper, Typography, Grid } from "@mui/material";

interface PremiumCardProps {
  title: string;
  amount: string;
}

const PremiumCard = ({ title, amount }: PremiumCardProps) => (
  <Paper
    variant="outlined"
    sx={{
      p: 3,
      borderRadius: 2,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      borderColor: "divider",
    }}
  >
    <Typography
      sx={{
        fontSize: 12,
        fontWeight: 600,
        color: "text.secondary",
        textTransform: "uppercase",
        letterSpacing: 0.5,
      }}
    >
      {title}
    </Typography>
    <Typography sx={{ fontSize: 22, fontWeight: 700, color: "text.primary" }}>
      {amount}
    </Typography>
  </Paper>
);

export default function PremiumsTab() {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PremiumCard title="Total Billed" amount="R 83,475.00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PremiumCard title="Total Collected" amount="R 80,325.00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PremiumCard title="Outstanding" amount="R 3,150.00" />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 3 }}>
          <PremiumCard title="Unallocated" amount="R 0.00" />
        </Grid>
      </Grid>
    </Box>
  );
}
