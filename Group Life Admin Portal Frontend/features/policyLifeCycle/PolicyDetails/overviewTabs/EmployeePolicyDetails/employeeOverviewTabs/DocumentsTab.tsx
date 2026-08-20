import { Box, Paper, Stack, Typography, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";

interface DocumentItem {
  id: string;
  title: string;
  date: string;
  type: string;
}

const DOCUMENTS: DocumentItem[] = [
  {
    id: "1",
    title: "Group Policy Schedule",
    date: "2023-03-01",
    type: "PDF",
  },
  {
    id: "2",
    title: "Welcome Letter",
    date: "2023-03-01",
    type: "PDF",
  },
  {
    id: "3",
    title: "Terms and Conditions",
    date: "2023-03-01",
    type: "PDF",
  },
  {
    id: "4",
    title: "Disclosure Letter",
    date: "2023-03-01",
    type: "PDF",
  },
  {
    id: "5",
    title: "Amendment Letter — Premium Adjustment",
    date: "2024-01-15",
    type: "PDF",
  },
];

export default function DocumentsTab() {
  return (
    <Stack spacing={2}>
      {DOCUMENTS.map((doc) => (
        <Paper
          key={doc.id}
          variant="outlined"
          sx={{
            p: 1.5,
            minHeight: 58,
            borderRadius: 2,
            borderWidth: "0.63px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: 1,
                bgcolor: "primary.50",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "primary.main",
              }}
            >
              <DescriptionOutlinedIcon sx={{ fontSize: 20 }} />
            </Box>
            <Box>
              <Typography
                sx={{
                  fontSize: 14,
                  fontWeight: 500,
                  color: "metrics.valueText",
                }}
              >
                {doc.title}
              </Typography>
              <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
                {doc.date} · {doc.type}
              </Typography>
            </Box>
          </Stack>

          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: "metrics.descriptionText" }}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" sx={{ color: "metrics.descriptionText" }}>
              <FileDownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
