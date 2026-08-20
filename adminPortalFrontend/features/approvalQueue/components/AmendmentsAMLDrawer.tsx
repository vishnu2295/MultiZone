import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
} from "@mui/material";
import {
  Close,
  InsertDriveFileOutlined,
  RemoveRedEyeOutlined,
  DownloadOutlined,
} from "@mui/icons-material";
import { StatusChip } from "@/components/ui/StatusChip";
import { Modal } from "@/components/ui/Modal";

interface AmendmentsAMLDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

export function AmendmentsAMLDrawer({
  isOpen,
  onClose,
  data,
}: AmendmentsAMLDrawerProps) {
  const [isRequestInfoChecked, setIsRequestInfoChecked] = useState(false);
  const [requestInfoText, setRequestInfoText] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);

  // Reset state when data changes or drawer opens
  useEffect(() => {
    if (isOpen && data) {
      if (
        data.status === "Requested Info" ||
        data.status === "Approved" ||
        data.status === "Rejected"
      ) {
        setIsRequestInfoChecked(true);
        setRequestInfoText(
          "Please provide proof of address not older than 3 months."
        );
      } else {
        setIsRequestInfoChecked(false);
        setRequestInfoText("");
      }
    }
  }, [isOpen, data]);

  if (!data) return null;

  const isApprovedOrRejected =
    data.status === "Approved" || data.status === "Rejected";
  const isRequestedInfoState = data.status === "Requested Info";
  const isAwaitingApproval = data.status === "Awaiting Approval";

  const getRiskColor = (risk: string) => {
    const r = risk?.toLowerCase();
    if (r === "high") return "error.main";
    if (r === "medium") return "warning.main";
    return "success.main";
  };

  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          px: 3,
          py: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-start",
          borderBottom: "1px solid #E2E8F0",
          flexShrink: 0,
        }}
      >
        <Box>
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, fontSize: "18px", mb: 0.5 }}
          >
            Review Approval Request
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {data.refId} — Amendment AML Check
          </Typography>
        </Box>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Body ── */}
      <Box
        sx={{
          p: 3,
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
          gap: 4,
        }}
      >
        {/* Top Company Info Card */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <Avatar
              sx={{
                bgcolor: "status.lightCyan",
                color: "primary.main",
                width: 48,
                height: 48,
                borderRadius: 2,
                fontWeight: 600,
              }}
            >
              MD
            </Avatar>
            <Box>
              <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                {data.company?.replace(/\n/g, " ")}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Policy No : {data.policyNumber?.replace(/\n/g, "")} | Brokerage
                : <strong>{data.brokerName?.replace(/\n/g, " ")}</strong>
              </Typography>
            </Box>
          </Box>
          <StatusChip status={data.status} />
        </Box>

        {/* Main Member Details */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Main Member Details
          </Typography>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr 1fr",
              gap: 2,
              mb: 2,
            }}
          >
            {[
              { label: "Name", value: data.mainMember?.split("\n")[0] },
              {
                label: "ID Number",
                value: data.mainMember?.split("\n")[2] || "8407125049083",
              },
              {
                label: "Created by",
                value: data.createdBy?.replace("\n", " | "),
              },
            ].map((detail, index) => (
              <Box key={index}>
                <Typography variant="caption" color="text.secondary">
                  {detail.label}
                </Typography>
                <Typography variant="body2" sx={{ fontWeight: 500 }}>
                  {detail.value}
                </Typography>
              </Box>
            ))}
          </Box>
          <Box>
            <Typography variant="caption" color="text.secondary">
              Risk Level
            </Typography>
            <Typography
              variant="body2"
              sx={{ fontWeight: 500, color: getRiskColor(data.risk) }}
            >
              {data.risk || "High"}
            </Typography>
          </Box>
        </Box>

        {/* Attachments */}
        <Box>
          <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
            Attachments
          </Typography>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {[
              {
                name: "AML_Report_OAML001.pdf",
                meta: "2023-03-01 · PDF",
              },
            ].map((file, index) => (
              <Paper
                key={index}
                variant="outlined"
                sx={{
                  p: 1.5,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderRadius: 2,
                  borderColor: "divider",
                  boxShadow: "none",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <InsertDriveFileOutlined sx={{ color: "primary.main" }} />
                  <Box>
                    <Typography
                      variant="body2"
                      sx={{ fontWeight: 600, fontSize: 13 }}
                    >
                      {file.name}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">
                      {file.meta}
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: "flex", gap: 1 }}>
                  <IconButton size="small">
                    <RemoveRedEyeOutlined
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </IconButton>
                  <IconButton size="small">
                    <DownloadOutlined
                      sx={{ fontSize: 18, color: "text.secondary" }}
                    />
                  </IconButton>
                </Box>
              </Paper>
            ))}
          </Box>
        </Box>

        {/* Request Info Box */}
        <Box>
          <FormControlLabel
            control={
              <Checkbox
                size="small"
                checked={isRequestInfoChecked}
                onChange={(e) => setIsRequestInfoChecked(e.target.checked)}
                disabled={isRequestedInfoState || isApprovedOrRejected}
                sx={{
                  color: "divider",
                  "&.Mui-checked": {
                    color: "primary.main",
                  },
                }}
              />
            }
            label={
              <Typography variant="body2" sx={{ fontWeight: 700 }}>
                Request info
              </Typography>
            }
          />

          {isRequestInfoChecked && (
            <Box sx={{ mt: 1 }}>
              {isRequestedInfoState || isApprovedOrRejected ? (
                <Typography variant="body2" color="text.primary">
                  {requestInfoText}
                </Typography>
              ) : (
                <TextField
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Enter the information you required"
                  value={requestInfoText}
                  onChange={(e) => setRequestInfoText(e.target.value)}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 2,
                      bgcolor: "background.paper",
                      fontSize: "14px",
                    },
                  }}
                />
              )}
            </Box>
          )}
        </Box>
      </Box>

      {/* ── Footer ── */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: isApprovedOrRejected ? "center" : "flex-end",
          gap: 2,
          flexShrink: 0,
        }}
      >
        {isApprovedOrRejected ? (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic", textAlign: "center" }}
          >
            This request has already been {data.status.toLowerCase()} and cannot
            be actioned again.
          </Typography>
        ) : isAwaitingApproval && isRequestInfoChecked ? (
          <Button
            variant="contained"
            color="primary"
            sx={{
              fontWeight: 600,
              textTransform: "none",
              boxShadow: "none",
              borderRadius: 1.5,
              px: 4,
              color: "primary.light",
            }}
          >
            Save Details
          </Button>
        ) : (
          <>
            <Button
              variant="text"
              onClick={onClose}
              sx={{
                color: "text.secondary",
                fontWeight: 600,
                textTransform: "none",
                "&:hover": { bgcolor: "transparent", color: "text.primary" },
              }}
            >
              Reject
            </Button>

            <Button
              variant="contained"
              color="primary"
              onClick={() => setIsApproveModalOpen(true)}
              sx={{
                fontWeight: 600,
                textTransform: "none",
                boxShadow: "none",
                borderRadius: 1.5,
                px: 4,
                color: "primary.light",
              }}
            >
              Approve
            </Button>
          </>
        )}
      </Box>

      {/* Approve Request Modal */}
      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve Request"
        width={424}
        showButtons
        submitText="Yes, Approve Request"
        cancelText="Cancel"
        onSubmit={() => {
          setIsApproveModalOpen(false);
          onClose(); // Optional: Close the drawer after approval
        }}
      >
        <Typography variant="body2" sx={{ color: "text.primary", py: 5 }}>
          Are you sure you want to approve{" "}
          <strong>"{data.refId} — Amendment AML Check"</strong> request?
        </Typography>
      </Modal>
    </Drawer>
  );
}
