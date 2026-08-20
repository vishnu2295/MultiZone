import { Box, Typography } from "@mui/material";

export default function DataField({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <Box>
      <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
        {label}
      </Typography>
      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "text.primary" }}>
        {value}
      </Typography>
    </Box>
  );
}
