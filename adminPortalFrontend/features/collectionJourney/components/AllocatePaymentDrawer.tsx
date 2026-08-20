import React from "react";
import { Box, Stack } from "@mui/material";
import SideDrawer from "../../../components/ui/SideDrawer";
import FormField from "../../../components/ui/FormField";
import Select from "../../../components/ui/Select";
import CustomInput from "../../../components/ui/CustomInput";
import { CustomButton } from "../../../components/ui/CustomButton";
import type { PaymentAllocation } from "../collectionTabs/PaymentAllocations";

interface AllocatePaymentDrawerProps {
  open: boolean;
  onClose: () => void;
  allocation?: PaymentAllocation; // The selected payment allocation
}

const selectStyles = { width: "100%", height: "44px", maxWidth: "none" };

const EMPLOYER_OPTIONS = [
  { label: "Mediterian Logistcs", value: "mediterian" },
  { label: "Stellenbosch Wineries Co-operative", value: "stellenbosch" },
];

const BANK_ACCOUNT_OPTIONS = [
  { label: "FNB - 62134567890", value: "fnb" },
  { label: "Standard Bank - 101234567", value: "standard_bank" },
  { label: "ABSA - 4012345678", value: "absa" },
];

const MONTH_OPTIONS = [
  { label: "January 2026", value: "jan-2026" },
  { label: "February 2026", value: "feb-2026" },
  { label: "March 2026", value: "mar-2026" },
];

const PERIOD_OPTIONS = [
  { label: "01 Jan 2026 - 31 Jan 2026", value: "jan-2026-period" },
  { label: "01 Feb 2026 - 28 Feb 2026", value: "feb-2026-period" },
  { label: "01 Mar 2026 - 31 Mar 2026", value: "mar-2026-period" },
];

export default function AllocatePaymentDrawer({
  open,
  onClose,
  allocation,
}: AllocatePaymentDrawerProps) {
  const [employer, setEmployer] = React.useState("");
  const [bankAccount, setBankAccount] = React.useState("");
  const [month, setMonth] = React.useState("");
  const [period, setPeriod] = React.useState("");

  React.useEffect(() => {
    if (open) {
      setEmployer(allocation?.company ?? "");
      setBankAccount("");
      setMonth("");
      setPeriod("");
    }
  }, [open, allocation]);

  return (
    <SideDrawer
      open={open}
      onClose={onClose}
      title="Allocate Payment"
      width={{ xs: "100%", md: 650 }}
    >
      <Stack spacing={3}>
        <FormField label="Employer" required>
          <Select
            options={EMPLOYER_OPTIONS}
            value={employer}
            onChange={(val) => setEmployer(val)}
            placeholder="Select Employer"
            sx={selectStyles}
          />
        </FormField>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <FormField label="Bank account money received to" required>
              <Select
                options={BANK_ACCOUNT_OPTIONS}
                value={bankAccount}
                onChange={(val) => setBankAccount(val)}
                placeholder="Select"
                sx={selectStyles}
              />
            </FormField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormField label="Payment Reference" required>
              <CustomInput
                placeholder="REF-0039182"
                defaultValue={allocation?.paymentRef?.replace(" ", "") || ""}
              />
            </FormField>
          </Box>
        </Stack>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Box sx={{ flex: 1 }}>
            <FormField label="Month of Payment Received" required>
              <Select
                options={MONTH_OPTIONS}
                value={month}
                onChange={(val) => setMonth(val)}
                placeholder="Select"
                sx={selectStyles}
              />
            </FormField>
          </Box>
          <Box sx={{ flex: 1 }}>
            <FormField label="Date period of the payment allocation" required>
              <Select
                options={PERIOD_OPTIONS}
                value={period}
                onChange={(val) => setPeriod(val)}
                placeholder="Select Month"
                sx={selectStyles}
              />
            </FormField>
          </Box>
        </Stack>

        <FormField label="Notes" required>
          <CustomInput
            placeholder="Add Notes"
            multiline
            rows={8}
            sx={{ height: "auto", py: 1.5, alignItems: "flex-start" }}
          />
        </FormField>
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        sx={{
          justifyContent: "flex-end",
          mt: 4,
          pt: 3,
          borderTop: "1px solid",
          borderColor: "divider",
        }}
      >
        <CustomButton
          variantType="ghost"
          onClick={onClose}
          sx={{ color: "text.secondary" }}
        >
          Cancel
        </CustomButton>
        <CustomButton variantType="primary" sx={{ px: 3 }}>
          Allocate Payment
        </CustomButton>
      </Stack>
    </SideDrawer>
  );
}
