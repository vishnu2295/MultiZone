import { Box, Paper, Typography, Stack, IconButton } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

const REPORTS_LIST = [
  { id: "1", title: "Lapse Report" },
  { id: "2", title: "Re-instatement Report" },
  { id: "3", title: "NTU Report" },
  { id: "4", title: "Cancellation Report" },
];

export default function ReportsTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}>
      {REPORTS_LIST.map((report) => (
        <Paper
          key={report.id}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2.5,
            borderRadius: 2,
            borderColor: "divider",
            boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
            border: "none",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <InsertDriveFileOutlinedIcon
              sx={{ color: "#0ea5e9", fontSize: 24 }}
            />
            <Typography
              sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}
            >
              {report.title}
            </Typography>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "text.secondary" }}>
              <DownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Box>
  );
}
