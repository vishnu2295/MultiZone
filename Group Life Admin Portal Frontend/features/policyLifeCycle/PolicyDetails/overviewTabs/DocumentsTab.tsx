import { Box, Paper, Typography, Stack, IconButton } from "@mui/material";
import InsertDriveFileOutlinedIcon from "@mui/icons-material/InsertDriveFileOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DownloadOutlinedIcon from "@mui/icons-material/DownloadOutlined";

export interface DocumentItem {
  id: string;
  title: string;
  date: string;
  format: string;
}

const INITIAL_DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    title: "Group Policy Schedule",
    date: "2023-03-01",
    format: "PDF",
  },
  {
    id: "2",
    title: "Welcome Letter",
    date: "2023-03-01",
    format: "PDF",
  },
  {
    id: "3",
    title: "Terms and Conditions",
    date: "2023-03-01",
    format: "PDF",
  },
  {
    id: "4",
    title: "Disclosure Letter",
    date: "2023-03-01",
    format: "PDF",
  },
  {
    id: "5",
    title: "Amendment Letter — Premium Adjustment",
    date: "2024-01-15",
    format: "PDF",
  },
];

export default function DocumentsTab() {
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
      {INITIAL_DOCUMENTS.map((doc) => (
        <Paper
          key={doc.id}
          variant="outlined"
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            p: 2,
            borderRadius: 2,
            borderColor: "divider",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <InsertDriveFileOutlinedIcon
              sx={{ color: "#0ea5e9", fontSize: 24 }}
            />
            <Box>
              <Typography
                sx={{ fontWeight: 600, fontSize: 14, color: "text.primary" }}
              >
                {doc.title}
              </Typography>
              <Typography
                sx={{ fontSize: 13, color: "text.secondary", mt: 0.25 }}
              >
                {doc.date} &middot; {doc.format}
              </Typography>
            </Box>
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
