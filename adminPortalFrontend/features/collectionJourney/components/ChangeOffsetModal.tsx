import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import { Modal } from "../../../components/ui/Modal";
import Select from "../../../components/ui/Select";
import CustomInput from "../../../components/ui/CustomInput";
import { CustomButton } from "../../../components/ui/CustomButton";
import { FormField } from "../../../components/ui/FormField";

export interface ChangeOffsetModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
}

const INVOICE_OPTIONS = [
  { label: "INV-2024-0891", value: "INV-2024-0891" },
  { label: "INV-2024-0892", value: "INV-2024-0892" },
];

export default function ChangeOffsetModal({
  open,
  onClose,
  onSubmit,
}: ChangeOffsetModalProps) {
  const [invoice, setInvoice] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    if (!open) {
      setInvoice("");
      setNotes("");
    }
  }, [open]);

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Change Offset"
      width={495}
      height={424}
      showButtons={false}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          height: "100%",
          justifyContent: "space-between",
        }}
      >
        <Stack spacing={3} sx={{ pt: 2 }}>
          <FormField label="Select Outstanding Invoice to Offset" required>
            <Box sx={{ "& .MuiFormControl-root": { width: "100%" } }}>
              <Select
                options={INVOICE_OPTIONS}
                value={invoice}
                onChange={setInvoice}
                placeholder="Select"
                sx={{ width: "100%", height: "44px" }}
              />
            </Box>
          </FormField>
          <FormField label="Notes" required>
            <CustomInput
              placeholder="Add Notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              multiline
              rows={4}
              sx={{ height: "auto", py: 1.5, alignItems: "flex-start" }}
            />
          </FormField>
        </Stack>

        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            pt: 2,
            mt: 4,
            borderTop: 1,
            borderColor: "divider",
            mx: -2.5,
            px: 2.5,
            mb: -1,
          }}
        >
          <CustomButton
            variantType="outlined"
            onClick={onClose}
            sx={{
              color: "text.secondary",
              borderColor: "transparent",
              "&:hover": {
                borderColor: "transparent",
                bgcolor: "action.hover",
              },
            }}
          >
            Cancel
          </CustomButton>
          <CustomButton variantType="primary" onClick={onSubmit}>
            Change Offset
          </CustomButton>
        </Box>
      </Box>
    </Modal>
  );
}
