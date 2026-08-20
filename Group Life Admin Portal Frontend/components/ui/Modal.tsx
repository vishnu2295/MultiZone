import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Button,
} from "@mui/material";
import { Close } from "@mui/icons-material";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  width?: string | number;
  height?: string | number;
  showButtons?: boolean;
  submitText?: string;
  cancelText?: string;
  onSubmit?: () => void;
}

export const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  title,
  children,
  width,
  height,
  showButtons,
  submitText,
  cancelText,
  onSubmit,
}) => {
  return (
    <Dialog
      open={isOpen}
      onClose={onClose}
      fullWidth
      maxWidth={width ? false : "sm"}
      slotProps={{
        paper: {
          sx: {
            borderRadius: 3,
            width: width ?? "100%",
            height: height ?? "auto",
            maxWidth: width ?? 600,
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
          py: 2,
          px: 2.5,
        }}
      >
        <Typography
          component="span"
          variant="subtitle1"
          sx={{ fontWeight: 700, fontSize: "18px", color: "text.heading" }}
        >
          {title}
        </Typography>
        <IconButton size="small" onClick={onClose} edge="end">
          <Close fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: 2.5 }}>{children}</DialogContent>

      {showButtons && (
        <DialogActions
          sx={{
            justifyContent: "flex-end",
            gap: 1.5,
            px: 2.5,
            py: 2,
            borderTop: 1,
            borderColor: "divider",
          }}
        >
          <Button
            onClick={onClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              fontWeight: 600,
              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            {cancelText ?? "Cancel"}
          </Button>
          <Button
            variant="contained"
            onClick={onSubmit}
            sx={{
              bgcolor: "#00B2E2",
              color: "#fff",
              textTransform: "none",
              fontWeight: 600,
              borderRadius: 2,
              px: 3,
              boxShadow: "none",
              "&:hover": {
                bgcolor: "#0091B8",
                boxShadow: "none",
              },
            }}
          >
            {submitText ?? "Submit"}
          </Button>
        </DialogActions>
      )}
    </Dialog>
  );
};
