import React from "react";
import { Modal } from "@/components/ui/Modal";
import { Typography, Box } from "@mui/material";

interface CreatePolicyModalProps {
  isOpen: boolean;
  onClose: () => void;
  quoteReference?: string;
}

export default function CreatePolicyModal({
  isOpen,
  onClose,
  quoteReference,
}: CreatePolicyModalProps) {
  const handleSubmit = () => {
    // Handle create policy logic
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Create Policy"
      showButtons={true}
      submitText="Create"
      cancelText="Cancel"
      onSubmit={handleSubmit}
      width={424}
      height={236}
    >
      <Box sx={{ py: 2 }}>
        <Typography>
          Are you sure you want to create this policy for the quote number{" "}
          <strong>{quoteReference}</strong>?
        </Typography>
      </Box>
    </Modal>
  );
}
