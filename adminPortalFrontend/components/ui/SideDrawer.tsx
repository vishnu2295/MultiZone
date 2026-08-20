import React from "react";
import { Drawer, Box, Typography, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export interface SideDrawerProps {
  open: boolean;
  onClose: () => void;
  title?: React.ReactNode;
  children: React.ReactNode;
  footer?: React.ReactNode;
  width?: number | string | object;
}

export default function SideDrawer({
  open,
  onClose,
  title,
  children,
  footer,
  width = { xs: "100%", md: "50vw" },
}: SideDrawerProps) {
  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      slotProps={{
        paper: {
          sx: {
            width,
            p: 0,
          },
        },
      }}
    >
      <Box
        sx={{
          px: { xs: 3, md: 4 },
          pt: 2,
          pb: 2,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        {title && (
          <Typography
            sx={{ fontWeight: 700, fontSize: 18, color: "text.heading" }}
          >
            {title}
          </Typography>
        )}
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: "1px solid", borderColor: "divider", borderRadius: 2 }}
        >
          <CloseIcon sx={{ fontSize: 18 }} />
        </IconButton>
      </Box>
      <Box
        sx={{ px: { xs: 3, md: 4 }, pt: 2, pb: 4, overflowY: "auto", flex: 1 }}
      >
        {children}
      </Box>

      {/* Sticky Footer */}
      {footer && (
        <Box
          sx={{
            p: { xs: 3, md: 4 },
            borderTop: "1px solid",
            borderColor: "divider",
            display: "flex",
            justifyContent: "flex-end",
            gap: 2,
            mt: "auto",
          }}
        >
          {footer}
        </Box>
      )}
    </Drawer>
  );
}
