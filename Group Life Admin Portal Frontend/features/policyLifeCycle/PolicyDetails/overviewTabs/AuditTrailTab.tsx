import { Box, Typography, Stack } from "@mui/material";

export interface AuditEvent {
  id: string;
  action: string;
  date: string;
  actor: string;
  reference: string;
}

const INITIAL_AUDIT_TRAIL: AuditEvent[] = [
  {
    id: "1",
    action: "Payment received — R 6,955.00",
    date: "2024-06-03",
    actor: "System",
    reference: "REF-0039182",
  },
  {
    id: "2",
    action: "Premium amended — R 6,565 -> R 6,955",
    date: "2024-01-15",
    actor: "Thabo Mokoena",
    reference: "AMD-2024-0027",
  },
  {
    id: "3",
    action: "Policy activated",
    date: "2023-03-01",
    actor: "System",
    reference: "GRP-2023-0412",
  },
];

export default function AuditTrailTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4, pt: 1 }}>
      {INITIAL_AUDIT_TRAIL.map((event) => (
        <Box
          key={event.id}
          sx={{
            display: "flex",
            alignItems: "flex-start",
          }}
        >
          {/* Vertical Blue Line indicator */}
          <Box
            sx={{
              width: 3,
              height: 40,
              bgcolor: "#0ea5e9", // cyan-ish color matching the tabs
              borderRadius: 1,
              mr: 2,
              mt: 0.25,
            }}
          />

          {/* Event Content */}
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}
            >
              {event.action}
            </Typography>
            <Stack
              direction="row"
              spacing={1.5}
              sx={{ mt: 0.5, color: "text.secondary", fontSize: 13 }}
            >
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                {event.date}
              </Typography>
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                &middot;
              </Typography>
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                {event.actor}
              </Typography>
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                &middot;
              </Typography>
              <Typography component="span" sx={{ fontSize: "inherit" }}>
                {event.reference}
              </Typography>
            </Stack>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
