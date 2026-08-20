import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import SideDrawer from "../../../components/ui/SideDrawer";
import FormField from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import Select from "../../../components/ui/Select";
import { CustomButton } from "../../../components/ui/CustomButton";
import LogoutOutlinedIcon from "@mui/icons-material/LogoutOutlined";

interface RaiseRequestDrawerProps {
  open: boolean;
  onClose: () => void;
  mockDocuments: { name: string; date: string; type: string }[];
}

const EMPLOYER_OPTIONS = [
  { label: "Mediterian Logistcs", value: "mediterian" },
  { label: "Stellenbosch Wineries Co-operative", value: "stellenbosch" },
];

const REFUND_TYPE_OPTIONS = [
  { label: "Overpayment", value: "overpayment" },
  { label: "Policy Cancellation", value: "cancellation" },
  { label: "Duplicate Payment", value: "duplicate" },
];

const REFUND_PERIOD_OPTIONS = [
  { label: "05-02-2026 to 05-04-2026", value: "period1" },
  { label: "05-01-2026 to 05-03-2026", value: "period2" },
];

export default function RaiseRequestDrawer({
  open,
  onClose,
  mockDocuments,
}: RaiseRequestDrawerProps) {
  const [employer, setEmployer] = useState("");
  const [refundType, setRefundType] = useState("");
  const [refundPeriod, setRefundPeriod] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<Record<string, File>>({});

  useEffect(() => {
    if (open) {
      setEmployer("");
      setRefundType("");
      setRefundPeriod("");
      setUploadedFiles({});
    }
  }, [open]);

  const handleFileUpload = (
    docName: string,
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setUploadedFiles((prev) => ({
        ...prev,
        [docName]: event.target.files![0],
      }));
    } else {
      setUploadedFiles((prev) => {
        const next = { ...prev };
        delete next[docName];
        return next;
      });
    }
  };

  return (
    <SideDrawer open={open} onClose={onClose} title="Raise New Refund Request">
      <Stack spacing={4}>
        <Stack spacing={3}>
          <FormField label="Employer" required>
            <Select
              value={employer}
              onChange={(val) => setEmployer(val)}
              options={EMPLOYER_OPTIONS}
              placeholder="Select Employer"
              sx={{ width: "100%", maxWidth: "100%" }}
            />
          </FormField>

          <Stack direction="row" spacing={2}>
            <Box sx={{ flex: 1 }}>
              <FormField label="Refund Type" required>
                <Select
                  value={refundType}
                  onChange={(val) => setRefundType(val)}
                  options={REFUND_TYPE_OPTIONS}
                  placeholder="Select Refund Type"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </FormField>
            </Box>
            <Box sx={{ flex: 1 }}>
              <FormField label="Refund Period" required>
                <Select
                  value={refundPeriod}
                  onChange={(val) => setRefundPeriod(val)}
                  options={REFUND_PERIOD_OPTIONS}
                  placeholder="Select Refund Period"
                  sx={{ width: "100%", maxWidth: "100%" }}
                />
              </FormField>
            </Box>
          </Stack>

          <FormField label="Total Refund Amount" required>
            <CustomInput placeholder="Enter refund amount" />
          </FormField>

          <FormField label="Notes" required>
            <CustomInput
              placeholder="Add Notes"
              multiline
              rows={5}
              sx={{
                height: "auto",
                minHeight: 120,
                py: 1.5,
                alignItems: "flex-start",
              }}
            />
          </FormField>
        </Stack>

        <Box>
          <Typography
            sx={{ fontSize: 16, fontWeight: 700, mb: 2, color: "text.heading" }}
          >
            Upload Supporting Documents
          </Typography>
          <Stack spacing={1.5}>
            {mockDocuments.map((docObj) => {
              const doc = docObj.name;
              return (
                <Box
                  key={doc}
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    p: 2,
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <Typography variant="body2" sx={{ fontSize: 14 }}>
                    {doc}
                  </Typography>
                  <Box
                    component="label"
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 0.5,
                      color: "primary.main",
                      cursor: "pointer",
                      fontWeight: 600,
                      fontSize: 13,
                      "&:hover": { color: "primary.dark" },
                    }}
                  >
                    <input
                      type="file"
                      hidden
                      ref={(input) => {
                        if (input) {
                          input.oncancel = () => {
                            setUploadedFiles((prev) => {
                              const next = { ...prev };
                              delete next[doc];
                              return next;
                            });
                          };
                        }
                      }}
                      onClick={(e) => {
                        e.currentTarget.value = "";
                      }}
                      onChange={(e) => handleFileUpload(doc, e)}
                    />
                    {uploadedFiles[doc] ? (
                      <Typography
                        variant="caption"
                        sx={{
                          maxWidth: 150,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                          color: "success.main",
                        }}
                        title={uploadedFiles[doc].name}
                      >
                        {uploadedFiles[doc].name}
                      </Typography>
                    ) : (
                      <>
                        <LogoutOutlinedIcon
                          sx={{ fontSize: 16, transform: "rotate(-90deg)" }}
                        />
                        Attach
                      </>
                    )}
                  </Box>
                </Box>
              );
            })}
          </Stack>
        </Box>

        <Stack
          direction="row"
          spacing={2}
          sx={{ pt: 2, pb: 4, justifyContent: "flex-end" }}
        >
          <CustomButton
            variantType="ghost"
            sx={{ color: "text.secondary" }}
            onClick={onClose}
          >
            Cancel
          </CustomButton>
          <CustomButton variantType="primary">Raise Request</CustomButton>
        </Stack>
      </Stack>
    </SideDrawer>
  );
}
