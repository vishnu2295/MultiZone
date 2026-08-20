import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@/components/ui/button";
import FileDownloadOutlinedIcon from "@mui/icons-material/FileDownloadOutlined";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import CloudUploadOutlinedIcon from "@mui/icons-material/CloudUploadOutlined";

interface BulkUploadProps {
  fileName: string;
  setFileName: React.Dispatch<React.SetStateAction<string>>;
  setEmployeeList: React.Dispatch<React.SetStateAction<any[]>>;
  fileInputRef: React.RefObject<HTMLInputElement | null>;
  isDragging: boolean;
  setIsDragging: React.Dispatch<React.SetStateAction<boolean>>;
  processFile: (file: File) => void;
  handleDownloadTemplate: () => void;
}

export default function BulkUpload({
  fileName,
  setFileName,
  setEmployeeList,
  fileInputRef,
  isDragging,
  setIsDragging,
  processFile,
  handleDownloadTemplate,
}: BulkUploadProps) {
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const handleRemoveFile = () => {
    setFileName("");
    setEmployeeList([]);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      fileInputRef.current?.click();
    }
  };

  return (
    <Box
      sx={{
        bgcolor: "var(--card-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        p: "20px",
        position: "relative",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: "16px",
        }}
      >
        <Typography
          sx={{
            fontSize: "0.9375rem",
            fontWeight: 600,
            color: "var(--text-primary)",
            m: 0,
          }}
        >
          Bulk Upload
        </Typography>
        <Button
          variant="outlined"
          size="sm"
          startIcon={<FileDownloadOutlinedIcon sx={{ fontSize: 20 }} />}
          onClick={handleDownloadTemplate}
        >
          Download Template
        </Button>
      </Box>

      {!fileName ? (
        /* Drag and drop zone — shown before upload */
        <Box
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={0}
          sx={{
            border: `1.5px dashed ${isDragging ? "var(--primary)" : "var(--border)"}`,
            borderRadius: "10px",
            p: "48px 24px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            gap: "10px",
            cursor: "pointer",
            background: isDragging
              ? "rgba(31,195,235,0.05)"
              : "transparent",
            transition: "border-color 0.15s, background 0.15s",
          }}
        >
          <CloudUploadOutlinedIcon sx={{ fontSize: 36, color: "var(--primary)" }} />
          <Typography
            sx={{
              fontSize: "0.875rem",
              color: "var(--text-secondary)",
              margin: 0,
            }}
          >
            Drag and Drop or{" "}
            <span
              style={{
                color: "var(--primary)",
                textDecoration: "underline",
              }}
            >
              Click to upload
            </span>
          </Typography>
          <Typography
            sx={{
              fontSize: "0.75rem",
              color: "var(--text-muted)",
              margin: 0,
            }}
          >
            Only .xls, .csv files allowed
          </Typography>
        </Box>
      ) : (
        /* File row — shown after upload */
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            background: "var(--table-header-bg)",
            border: "1px solid var(--border)",
            borderRadius: "8px",
            p: "10px 14px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="var(--primary)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
              <polyline points="14 2 14 8 20 8" />
            </svg>
            <span
              style={{
                fontSize: "0.875rem",
                color: "var(--text-primary)",
              }}
            >
              {fileName}
            </span>
          </Box>
          <button
            onClick={handleRemoveFile}
            style={{
              background: "transparent",
              border: "none",
              cursor: "pointer",
              color: "var(--destructive)",
              display: "flex",
              alignItems: "center",
              padding: "2px",
            }}
          >
            <DeleteOutlinedIcon sx={{ fontSize: 16 }} />
          </button>
        </Box>
      )}
    </Box>
  );
}
