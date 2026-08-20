import React, { useState, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { Modal } from "../../../components/ui/Modal";
import FormField from "../../../components/ui/FormField";
import { CustomButton } from "../../../components/ui/CustomButton";
import CustomInput from "../../../components/ui/CustomInput";

interface DownloadReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportName: string;
}

export function DownloadReportModal({
  isOpen,
  onClose,
  reportName,
}: DownloadReportModalProps) {
  const [date, setDate] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setDate("");
    }
  }, [isOpen]);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Download ${reportName}`}
      showButtons={false}
      width={424}
      height={324}
    >
      <Box sx={{ display: "flex", flexDirection: "column", height: "100%" }}>
        <Typography
          variant="body2"
          sx={{ color: "text.primary", mb: 3, mt: 1 }}
        >
          Please select the date range for the report you want to download.
        </Typography>

        <FormField label="Date Range">
          <CustomInput
            type="date"
            placeholder="Select date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            sx={{
              color: date ? "text.valueText" : "text.secondary",
              "& input::-webkit-calendar-picker-indicator": {
                cursor: "pointer",
              },
            }}
          />
        </FormField>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 1.5,
            mx: -2.5,
            mb: -2.5,
            mt: "auto",
            px: 2.5,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <CustomButton variantType="ghost" onClick={onClose}>
            Cancel
          </CustomButton>
          <CustomButton variantType="primary" onClick={onClose}>
            Save Details
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
}

export default DownloadReportModal;
