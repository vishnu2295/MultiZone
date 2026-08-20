import React from "react";
import { Typography, TextField } from "@mui/material";
import { Modal } from "@/components/ui/Modal";

interface CancelPolicyModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelPolicyModal({
  open,
  onClose,
  onConfirm,
}: CancelPolicyModalProps) {
  const [reason, setReason] = React.useState("");

  const handleConfirm = () => {
    onConfirm(reason);
    setReason("");
  };

  return (
    <Modal
      isOpen={open}
      onClose={onClose}
      title="Cancel Policy"
      width={424}
      height={330}
      showButtons={true}
      cancelText="Cancel"
      submitText="Mark as Cancelled"
      onSubmit={handleConfirm}
    >
      <Typography sx={{ fontSize: 14, color: "text.primary", mt: 1, mb: 2 }}>
        Are you sure you want to cancel this policy?
      </Typography>

      <TextField
        multiline
        rows={3}
        fullWidth
        placeholder="Enter the reason"
        value={reason}
        onChange={(e) => setReason(e.target.value)}
        sx={{
          "& .MuiOutlinedInput-root": {
            bgcolor: "background.default",
            borderRadius: 2,
            "& fieldset": {
              border: "none",
            },
          },
        }}
      />
    </Modal>
  );
}
