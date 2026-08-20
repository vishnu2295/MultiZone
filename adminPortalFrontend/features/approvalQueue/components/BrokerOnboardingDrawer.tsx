import { useState, useEffect } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Button,
  Avatar,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Checkbox,
  FormControlLabel,
  TextField,
  Chip,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { StatusChip } from "@/components/ui/StatusChip";
import { Modal } from "@/components/ui/Modal";
import { CustomTabs } from "@/components/ui/CustomTabs";

interface BrokerOnboardingDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

const borderedCellSx = {
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "16px",
    width: "1px",
    bgcolor: "#E2E8F0",
  },
};

export function BrokerOnboardingDrawer({
  isOpen,
  onClose,
  data,
}: BrokerOnboardingDrawerProps) {
  const [activeTab, setActiveTab] = useState("brokerage_details");
  const [isRequestInfoChecked, setIsRequestInfoChecked] = useState(false);
  const [requestInfoText, setRequestInfoText] = useState("");
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [checklist, setChecklist] = useState<boolean[]>(Array(9).fill(true));

  // Reset state when data changes or drawer opens
  useEffect(() => {
    if (isOpen && data) {
      if (
        data.status === "Requested Info" ||
        data.status === "Approved" ||
        data.status === "Rejected"
      ) {
        setIsRequestInfoChecked(true); // Mocking that info was requested for these states if needed
        setRequestInfoText(
          "Please provide proof of address not older than 3 months."
        );
      } else {
        setIsRequestInfoChecked(false);
        setRequestInfoText("");
      }
      setActiveTab("brokerage_details");
    }
  }, [isOpen, data]);

  if (!data) return null;

  const isApprovedOrRejected =
    data.status === "Approved" || data.status === "Rejected";
  const isRequestedInfoState = data.status === "Requested Info";
  const isAwaitingApproval = data.status === "Awaiting Approval";

  const getInitials = (name: string) => {
    if (!name) return "B";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
    return parts[0][0].toUpperCase();
  };

  const getFicaRiskColor = (status: string) => {
    if (!status) return "success.main";
    const s = status.toLowerCase();
    if (s === "low") return "success.main";
    if (s === "medium") return "warning.main";
    if (s === "high") return "error.main";
    return "success.main";
  };

  const getFicaRiskBg = (status: string) => {
    if (!status) return "success.light";
    const s = status.toLowerCase();
    if (s === "low") return "status.activeBg"; // light green
    if (s === "medium") return "status.awaitingBg"; // light orange/yellow
    if (s === "high") return "status.rejectedBg"; // light red
    return "status.activeBg";
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
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{ fontStyle: "italic" }}
          >
            BR-008 — New Broker Onboarding
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
          flex: 1,
          overflowY: "auto",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* Top Company Info Card */}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
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
                {getInitials(data.brokerName)}
              </Avatar>
              <Box>
                <Typography variant="subtitle1" sx={{ fontWeight: 700 }}>
                  {data.brokerName?.replace(/\n/g, " ")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  FSP : <strong>{data.fspNumber?.replace("FSP-", "")}</strong> |
                  Total Representatives : <strong>32</strong>
                </Typography>
              </Box>
            </Box>
            <StatusChip status={data.status} />
          </Box>

          {/* FICA Chips */}
          <Box sx={{ display: "flex", gap: 2 }}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#F8FAFC",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                FICA :
              </Typography>
              <Chip
                label="Verified"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: "status.activeBg",
                  color: "status.activeText",
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#F8FAFC",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                FICA Status :
              </Typography>
              <Chip
                label="Active"
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: "status.activeBg",
                  color: "status.activeText",
                  borderRadius: 1,
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                bgcolor: "#F8FAFC",
                px: 1.5,
                py: 0.5,
                borderRadius: 2,
              }}
            >
              <Typography variant="caption" color="text.secondary">
                FICA Risk Rating :
              </Typography>
              <Chip
                label={data.ficaRiskStatus || "Low"}
                size="small"
                sx={{
                  height: 20,
                  fontSize: 11,
                  fontWeight: 600,
                  bgcolor: getFicaRiskBg(data.ficaRiskStatus),
                  color: getFicaRiskColor(data.ficaRiskStatus),
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>
        </Box>

        <Box sx={{ px: 3 }}>
          <CustomTabs
            tabs={[
              { label: "Brokerage Details", value: "brokerage_details" },
              { label: "Brokerage Checklist", value: "brokerage_checklist" },
              { label: "Documents", value: "documents" },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />
        </Box>

        {/* Tab Content */}
        <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 4 }}>
          {activeTab === "brokerage_details" && (
            <>
              {/* Broker Details */}
              <Box>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Broker Details
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      FSP Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.fspNumber?.replace("FSP-", "")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Trade Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.brokerName?.replace(/\n/g, " ")}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Registration Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      2012/098431/07
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 3,
                    mb: 3,
                    pt: 2,
                    borderTop: "1px solid #E2E8F0",
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Legal Capacity
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Company
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Company Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Private Company
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      FSP Status
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Active
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      FICA Verified
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Yes
                    </Typography>
                  </Box>
                </Box>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 3,
                    pt: 2,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      FICA Risk Rating
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Company
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Start Date
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      15-03-2021
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Address */}
              <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Address
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Physical Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      100 St Andrews Rd, Parktown,
                      <br />
                      Johannesburg, 2093, South Africa
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Postal Address
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      100 St Andrews Rd, Parktown,
                      <br />
                      Johannesburg, 2093, South Africa
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Contact Details */}
              <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Contact Details
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr",
                    gap: 3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Full Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.contactDetails?.split("\n")[0] || "Ayanda Khumalo"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      phone Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      {data.contactDetails?.split("\n")[1] || "011 234 5678"}
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Email
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      ayanda@pinnaclebrokers.co.za
                    </Typography>
                  </Box>
                </Box>
              </Box>

              {/* Bank Account Details */}
              <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Bank Account Details
                </Typography>
                <Box
                  sx={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr 1fr 1fr",
                    gap: 3,
                    mb: 3,
                  }}
                >
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Bank Name
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      FNB
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Account Holder
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Meridian Logistics (Pty) Ltd
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Account Type
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      Savings
                    </Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary">
                      Account Number
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 500 }}>
                      3474387473847374
                    </Typography>
                  </Box>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">
                    Bank Code
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500 }}>
                    FNB73643434
                  </Typography>
                </Box>
              </Box>

              {/* Categories */}
              <Box sx={{ pt: 3, borderTop: "1px solid #E2E8F0" }}>
                <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
                  Categories
                </Typography>
                <TableContainer
                  component={Paper}
                  variant="outlined"
                  sx={{
                    borderRadius: 2,
                    boxShadow: "none",
                    border: "1px solid #E2E8F0",
                  }}
                >
                  <Table size="small">
                    <TableHead sx={{ bgcolor: "light.tableHeaderBg" }}>
                      <TableRow>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            py: 1.5,
                            whiteSpace: "normal",
                          }}
                        >
                          Description
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            whiteSpace: "normal",
                            ...borderedCellSx,
                          }}
                        >
                          Category No.
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            whiteSpace: "normal",
                            ...borderedCellSx,
                          }}
                        >
                          Subcategory No.
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            whiteSpace: "normal",
                            ...borderedCellSx,
                          }}
                        >
                          Product Class
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            whiteSpace: "normal",
                            ...borderedCellSx,
                          }}
                        >
                          Advice Active Date
                        </TableCell>
                        <TableCell
                          sx={{
                            fontWeight: 600,
                            color: "text.primary",
                            borderBottom: "1px solid #E2E8F0",
                            whiteSpace: "normal",
                            ...borderedCellSx,
                          }}
                        >
                          Intermediary Active Date
                        </TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {[
                        {
                          desc: "Collective Investment Schemes",
                          cat: "2.1",
                          subCat: "2.1.1",
                          prodClass: "Collective Investments",
                        },
                        {
                          desc: "Long Term Insurance",
                          cat: "1.1",
                          subCat: "1.1.2",
                          prodClass: "Life",
                        },
                        {
                          desc: "Short Term Insurance",
                          cat: "1.2",
                          subCat: "1.2.1",
                          prodClass: "Personal Lines",
                        },
                      ].map((row, index) => (
                        <TableRow
                          key={index}
                          sx={{
                            "&:last-child td, &:last-child th": { border: 0 },
                          }}
                        >
                          <TableCell
                            sx={{
                              py: 1.5,
                              color: "text.primary",
                              fontWeight: 600,
                              fontSize: 13,
                              width: "25%",
                              whiteSpace: "normal",
                            }}
                          >
                            {row.desc}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.secondary",
                              fontSize: 13,
                              whiteSpace: "normal",
                              ...borderedCellSx,
                            }}
                          >
                            {row.cat}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.secondary",
                              fontSize: 13,
                              whiteSpace: "normal",
                              ...borderedCellSx,
                            }}
                          >
                            {row.subCat}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.secondary",
                              fontSize: 13,
                              whiteSpace: "normal",
                              ...borderedCellSx,
                            }}
                          >
                            {row.prodClass}
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.secondary",
                              fontSize: 13,
                              whiteSpace: "normal",
                              ...borderedCellSx,
                            }}
                          >
                            15-03-2021
                          </TableCell>
                          <TableCell
                            sx={{
                              color: "text.secondary",
                              fontSize: 13,
                              whiteSpace: "normal",
                              ...borderedCellSx,
                            }}
                          >
                            15-03-2021
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
              {/* Request Info Box */}
              <Box sx={{ mt: 2 }}>
                <FormControlLabel
                  control={
                    <Checkbox
                      size="small"
                      checked={isRequestInfoChecked}
                      onChange={(e) =>
                        setIsRequestInfoChecked(e.target.checked)
                      }
                      disabled={isRequestedInfoState || isApprovedOrRejected}
                      sx={{
                        color: "divider",
                        "&.Mui-checked": {
                          color: "primary.main",
                        },
                        "&.Mui-disabled": {
                          color: "action.disabled",
                        },
                        "&.Mui-checked.Mui-disabled": {
                          color: "action.disabled",
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>
                      Request info
                    </Typography>
                  }
                  sx={{
                    "& .MuiFormControlLabel-label.Mui-disabled": {
                      WebkitTextFillColor: "unset",
                      color: "text.primary",
                    },
                  }}
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
            </>
          )}

          {activeTab === "brokerage_checklist" && (
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1.5 }}>
              {[
                "FSP License Check",
                "FSP Key Individual Check",
                "FSP Compliance Officer Check",
                "FSP FIC Check",
                "CIPC Check",
                "Good Standing with SARS",
                "Compliance Officer / MLRO",
                "Operational Ability",
                "Financial Soundness",
              ].map((item, index) => (
                <Paper
                  key={index}
                  variant="outlined"
                  sx={{
                    p: 2,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    borderRadius: 2,
                    borderColor: "divider",
                    boxShadow: "none",
                  }}
                >
                  <Typography
                    variant="body2"
                    sx={{ color: "text.primary", fontWeight: 500 }}
                  >
                    {item}
                  </Typography>
                  <Checkbox
                    size="small"
                    checked={checklist[index]}
                    onChange={(e) => {
                      const newChecklist = [...checklist];
                      newChecklist[index] = e.target.checked;
                      setChecklist(newChecklist);
                    }}
                    sx={{
                      p: 0,
                      color: "divider",
                      "&.Mui-checked": {
                        color: "action.disabled",
                      },
                    }}
                  />
                </Paper>
              ))}
            </Box>
          )}

          {activeTab === "documents" && (
            <Box>
              <Typography variant="body2" color="text.secondary">
                Documents will appear here.
              </Typography>
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
              color: "white",
            }}
          >
            Send Request
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
                color: "white",
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
          <strong>"BR-008 — New Broker Onboarding"</strong> request for{" "}
          {data.brokerName?.replace(/\n/g, " ")}?
        </Typography>
      </Modal>
    </Drawer>
  );
}
