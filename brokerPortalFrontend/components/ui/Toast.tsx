import { Box, Typography } from "@mui/material";

interface ToastProps {
  message: string;
}

export default function Toast({ message }: ToastProps) {
  return (
    <Box
      sx={{
        position: "fixed",
        top: 24,
        right: 24,
        zIndex: 9999,
        bgcolor: "var(--card-secondary)",
        border: "1px solid var(--border)",
        borderRadius: 2,
        p: "12px 16px",
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        boxShadow: "0 4px 24px rgba(0,0,0,0.2)",
        minWidth: 220,
      }}
    >
      <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
        <circle cx="9" cy="9" r="9" fill="var(--success)" opacity="0.15" />
        <path
          d="M5.5 9.5l2.5 2.5 4.5-5"
          stroke="var(--success)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      <Typography sx={{ fontSize: "14px", fontWeight: 500, color: "var(--text-primary)" }}>
        {message}
      </Typography>
    </Box>
  );
}
