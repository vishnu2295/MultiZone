import React, { useState } from "react";
import { Modal } from "@/components/ui/Modal";
import { Typography, Box, TextField } from "@mui/material";
import { useRouter } from "next/navigation";

interface RejectOnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteReference?: string;
}

import { mockData } from "../../onboardingAdministrationTabs/OnboardingQueueTab";

export default function RejectOnboardingModal({
  isOpen,
  onClose,
  quoteReference,
}: RejectOnboardingModalProps) {
  const [reason, setReason] = useState("");
  const router = useRouter();

  const handleClose = () => {
    setReason("");
    onClose();
  };

  const handleSubmit = () => {
    handleClose();
    if (quoteReference) {
      const item = mockData.find((d) => d.quoteReferenceNo === quoteReference);
      if (item) {
        item.status = "Rejected";
      }
    }
    router.push("/onboardingAdministration?tab=onboarding-queue");
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      title="Reject Onboarding"
      showButtons={true}
      submitText="Mark as Rejected"
      cancelText="Cancel"
      onSubmit={handleSubmit}
      width={424}
      height={330}
    >
      <Box sx={{ py: 2, display: "flex", flexDirection: "column", gap: 2 }}>
        <Typography sx={{ fontSize: 14 }}>
          Are you sure you want to reject this onboarding?
        </Typography>
        <TextField
          multiline
          rows={3}
          placeholder="Enter the reason"
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          fullWidth
          sx={{
            "& .MuiOutlinedInput-root": {
              bgcolor: "grey.50",
              "& fieldset": {
                border: "none",
              },
            },
          }}
        />
      </Box>
    </Modal>
  );
}
