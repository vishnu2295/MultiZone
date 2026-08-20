import { Box, Stack, Typography } from "@mui/material";

export interface AuditTrailEvent {
  id: string;
  action: string;
  date: string;
  user: string;
  reference: string;
}

const AUDIT_TRAIL_DATA: AuditTrailEvent[] = [
  {
    id: "1",
    action: "Annual policy schedule issued",
    date: "2024-03-01",
    user: "System",
    reference: "SCH-IND-18234-03",
  },
  {
    id: "2",
    action: "Policy activated",
    date: "2023-03-01",
    user: "System",
    reference: "IND-2023-18234",
  },
];

export default function AuditTrailTab() {
  return (
    <Stack spacing={4}>
      {AUDIT_TRAIL_DATA.map((event) => (
        <Box
          key={event.id}
          sx={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* Blue vertical indicator */}
          <Box
            sx={{
              width: 4,
              height: 40,
              bgcolor: "sidebar.activeBg",
              borderRadius: 4,
              mr: 2,
            }}
          />

          <Box>
            <Typography
              sx={{
                fontWeight: 600,
                fontSize: 14,
                color: "metrics.valueText",
                mb: 0.5,
              }}
            >
              {event.action}
            </Typography>
            <Typography
              sx={{
                fontSize: 13,
                color: "metrics.descriptionText",
                display: "flex",
                alignItems: "center",
                gap: 1,
              }}
            >
              {event.date}
              <Box component="span" sx={{ fontSize: 16 }}>
                &middot;
              </Box>
              {event.user}
              <Box component="span" sx={{ fontSize: 16 }}>
                &middot;
              </Box>
              {event.reference}
            </Typography>
          </Box>
        </Box>
      ))}
    </Stack>
  );
}
