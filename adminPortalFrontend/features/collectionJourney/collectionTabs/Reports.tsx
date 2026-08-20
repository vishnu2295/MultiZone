import React, { useState } from "react";
import { Box, Typography, Paper, Stack, IconButton } from "@mui/material";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import { DownloadReportModal } from "../components/DownloadReportModal";

const REPORTS = [
  "Collections Report",
  "Outstanding Premiums Report",
  "Refunds Report",
  "Allocations Report",
  "Bank statement",
  "Credit Notes report",
];

export default function Reports() {
  const [downloadModalReport, setDownloadModalReport] = useState<string | null>(
    null
  );

  const handleDownload = (reportName: string) => {
    setDownloadModalReport(reportName);
  };

  const handleCloseModal = () => {
    setDownloadModalReport(null);
  };

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
      {REPORTS.map((reportName) => (
        <Paper
          key={reportName}
          elevation={0}
          sx={{
            p: 2.5,
            borderRadius: 2,
            boxShadow: "0px 4px 12.2px 0px #C4C4C440",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            bgcolor: "background.paper",
          }}
        >
          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <DescriptionOutlinedIcon sx={{ color: "primary.main" }} />
            <Typography
              sx={{
                fontSize: 14,
                fontWeight: 600,
                color: "text.primary",
              }}
            >
              {reportName}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1}>
            <IconButton size="small" sx={{ color: "metrics.descriptionText" }}>
              <VisibilityOutlinedIcon fontSize="small" />
            </IconButton>
            <IconButton
              size="small"
              sx={{ color: "metrics.descriptionText" }}
              onClick={() => handleDownload(reportName)}
            >
              <FileDownloadOutlinedIcon fontSize="small" />
            </IconButton>
          </Stack>
        </Paper>
      ))}

      {downloadModalReport && (
        <DownloadReportModal
          isOpen={true}
          onClose={handleCloseModal}
          reportName={downloadModalReport}
        />
      )}
    </Box>
  );
}
