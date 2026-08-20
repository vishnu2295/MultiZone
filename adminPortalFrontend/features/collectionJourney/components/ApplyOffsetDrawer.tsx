import React, { useState, useEffect } from "react";
import { Box, Stack } from "@mui/material";
import SideDrawer from "../../../components/ui/SideDrawer";
import { CustomButton } from "../../../components/ui/CustomButton";
import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import Select from "../../../components/ui/Select";

interface ApplyOffsetDrawerProps {
  open: boolean;
  onClose: () => void;
  employer: string;
}

const EMPLOYER_OPTIONS = [
  { label: "Mediterian Logistcs", value: "Mediterian Logistcs" },
  {
    label: "Stellenbosch Wineries Co-operative",
    value: "Stellenbosch Wineries Co-operative",
  },
  { label: "DuraTech Mining", value: "DuraTech Mining" },
];

const INVOICE_OPTIONS = [
  { label: "INV-29283", value: "INV-29283" },
  { label: "INV-29284", value: "INV-29284" },
];

export default function ApplyOffsetDrawer({
  open,
  onClose,
  employer,
}: ApplyOffsetDrawerProps) {
  const [selectedEmployer, setSelectedEmployer] = useState(employer);
  const [invoice, setInvoice] = useState("");
  const [notes, setNotes] = useState("");

  useEffect(() => {
    setSelectedEmployer(employer);

    if (!open) {
      setInvoice("");
      setNotes("");
    }
  }, [open, employer]);

  const handleApplyOffset = () => {
    // validation
    // API
    onClose();
  };

  return (
    <SideDrawer open={open} onClose={onClose} title="Apply Offset">
      <Stack
        spacing={3}
        sx={{
          height: "100%",
          pt: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Box>
          <Stack spacing={3}>
            <FormField label="Employer" required>
              <Select
                value={selectedEmployer}
                onChange={setSelectedEmployer}
                options={EMPLOYER_OPTIONS}
                placeholder="Select Employer"
                sx={{ width: "100%" }}
              />
            </FormField>

            <FormField label="Select Outstanding Invoice to Offset" required>
              <Select
                value={invoice}
                onChange={setInvoice}
                options={INVOICE_OPTIONS}
                placeholder="Select"
                sx={{ width: "100%" }}
              />
            </FormField>

            <FormField label="Notes" required>
              <CustomInput
                multiline
                rows={10}
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add Notes"
                sx={{
                  height: "auto",
                  minHeight: "200px",
                  py: 1.5,
                  alignItems: "flex-start",
                }}
              />
            </FormField>
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{ pt: 2, mt: "auto", justifyContent: "flex-end" }}
        >
          <CustomButton
            variantType="secondary"
            onClick={onClose}
            sx={{ px: 4 }}
          >
            Cancel
          </CustomButton>
          <CustomButton
            variantType="primary"
            onClick={handleApplyOffset}
            sx={{ px: 4 }}
          >
            Apply Offset
          </CustomButton>
        </Stack>
      </Stack>
    </SideDrawer>
  );
}
