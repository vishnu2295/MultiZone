"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";
import {
  Box,
  Typography,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
} from "@mui/material";
import { getLeads, Lead } from "@/lib/api/leads";

interface LeadModalProps {
  open: boolean;
  onClose: () => void;
  onProceed: (lead: Lead) => void;
}

function useModalLeads(open: boolean) {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open || leads.length > 0) return;

    setLoading(true);
    getLeads({ lead_status: "Draft,In Progress,Quote Generated", limit: 10000 })
      .then((apiLeads) => setLeads(apiLeads))
      .catch((err) => console.error("Failed to load leads for modal:", err))
      .finally(() => setLoading(false));
  }, [open, leads.length]);

  return { leads, loading };
}

export default function LeadSelectionModal({
  open,
  onClose,
  onProceed,
}: LeadModalProps) {
  const { leads, loading } = useModalLeads(open);
  const [selected, setSelected] = useState<Lead | null>(null);

  // Reset selection when modal closes
  useEffect(() => {
    if (!open) setSelected(null);
  }, [open]);

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
      slotProps={{
        paper: {
          sx: {
            bgcolor: "var(--card-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "10px",
            color: "var(--text-primary)",
          },
        },
      }}
    >
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid var(--border)",
          p: "24px",
        }}
      >
        <Box
          component="span"
          sx={{
            fontWeight: 500,
            fontSize: "1.25rem",
            color: "var(--text-primary)",
          }}
        >
          Generate New Quote
        </Box>
        <IconButton onClick={onClose} sx={{ color: "var(--text-secondary)" }}>
          <X size={24} />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ p: "24px", maxHeight: "60vh", overflowY: "auto" }}>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {loading ? (
            <Typography sx={{ color: "#A0A0A0", textAlign: "center", py: 2 }}>
              Loading leads...
            </Typography>
          ) : leads.length === 0 ? (
            <Typography sx={{ color: "#A0A0A0", textAlign: "center", py: 2 }}>
              No leads available
            </Typography>
          ) : (
            leads.map((lead) => (
              <Button
                key={lead.leadId}
                onClick={() => setSelected(lead)}
                sx={{
                  display: "block",
                  width: "100%",
                  p: "16px",
                  borderRadius: "10px",
                  textAlign: "left",
                  bgcolor: "var(--table-header-bg)",
                  border:
                    selected?.leadId === lead.leadId
                      ? "2px solid var(--primary)"
                      : "1px solid var(--border)",
                  color: "var(--text-primary)",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "var(--border)",
                    borderColor: "var(--primary)",
                  },
                }}
              >
                <Typography
                  variant="subtitle1"
                  sx={{
                    fontWeight: 500,
                    color: "var(--text-primary)",
                    mb: "4px",
                  }}
                >
                  {lead.employerName}
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: "var(--text-secondary)" }}
                >
                  Employees: {lead.numberOfEmployees} • Status: {lead.status}
                </Typography>
              </Button>
            ))
          )}
        </Stack>
      </DialogContent>

      <DialogActions
        sx={{
          borderTop: "1px solid var(--border)",
          p: "24px",
          justifyContent: "flex-end",
        }}
      >
        <Button
          onClick={() => selected && onProceed(selected)}
          disabled={!selected}
          variant="contained"
          sx={{
            bgcolor: "var(--primary)",
            color: "var(--button-primary-color)",
            borderRadius: "8px",
            fontWeight: 700,
            textTransform: "none",
            px: "24px",
            height: "36px",
            "&:hover": { bgcolor: "#1AB3D9" },
            "&.Mui-disabled": {
              bgcolor: "var(--border)",
              color: "var(--text-secondary)",
            },
          }}
        >
          Proceed With Quote Generation
        </Button>
      </DialogActions>
    </Dialog>
  );
}
