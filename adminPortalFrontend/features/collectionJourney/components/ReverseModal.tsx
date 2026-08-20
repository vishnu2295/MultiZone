import React, { useState, useEffect } from "react";
import { Typography, Box } from "@mui/material";
import { Modal } from "../../../components/ui/Modal";
import CustomInput from "../../../components/ui/CustomInput";

interface ReverseModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit?: (reason: string) => void;
}

export default function ReverseModal({
  open,
  onClose,
  onSubmit,
}: ReverseModalProps) {
  const [reason, setReason] = useState("");

  useEffect(() => {
    if (!open) {
      setReason("");
    }
  }, [open]);

  const handleSubmit = () => {
    onSubmit?.(reason);
    onClose();
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Submit for Reversal"
      showButtons={true}
      cancelText="Cancel"
      submitText="Submit for Reversal"
      onSubmit={handleSubmit}
      width={424}
      height={330}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          height: "100%",
        }}
      >
        <Typography sx={{ fontSize: 14, color: "text.primary", pt: 1 }}>
          Are you sure you want to submit this credit note for reversal?
        </Typography>

        <CustomInput
          multiline
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Enter the reason"
          sx={{
            height: "auto",
            minHeight: "120px",
            py: 1.5,
            alignItems: "flex-start",
            bgcolor: "background.default",
            border: "none",
            "& fieldset": { border: "none" },
          }}
        />
      </Box>
    </Modal>
  );
}
