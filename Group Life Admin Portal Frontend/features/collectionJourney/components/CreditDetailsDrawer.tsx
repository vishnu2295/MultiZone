import React from "react";
import { Box, Typography, Stack, Grid, Divider, Avatar } from "@mui/material";
import SideDrawer from "../../../components/ui/SideDrawer";
import { CustomButton } from "../../../components/ui/CustomButton";
import { CreditNoteRow } from "../collectionTabs/CreditNotes";
import ChangeOffsetModal from "./ChangeOffsetModal";
import ReverseModal from "./ReverseModal";

export interface CreditDetailsDrawerProps {
  open: boolean;
  onClose: () => void;
  selectedRow: CreditNoteRow | null;
}

const labelStyle = { fontSize: 12, color: "text.secondary", mb: 0.5 };
const valueStyle = { fontSize: 14, fontWeight: 500, color: "text.primary" };

const DetailItem = ({
  label,
  value,
  size = { xs: 12, sm: 4 },
  valueSx,
}: {
  label: string;
  value: React.ReactNode;
  size?: any;
  valueSx?: any;
}) => (
  <Grid size={size}>
    <Typography sx={labelStyle}>{label}</Typography>
    <Typography sx={valueSx ? { ...valueStyle, ...valueSx } : valueStyle}>
      {value}
    </Typography>
  </Grid>
);

const InvoiceDetails = ({ selectedRow }: { selectedRow: CreditNoteRow }) => (
  <Box>
    <Typography
      sx={{ fontWeight: 700, fontSize: 15, mb: 2, color: "text.heading" }}
    >
      Invoice Details
    </Typography>
    <Grid container spacing={3}>
      <DetailItem label="Bank Name" value={selectedRow.bankName} />
      <DetailItem label="Billed Month" value={selectedRow.month} />
      <DetailItem label="Amount" value={selectedRow.amount} />
      <DetailItem label="Debit Date" value={selectedRow.debitDate} />
    </Grid>
  </Box>
);

const OffsetApplied = ({ selectedRow }: { selectedRow: CreditNoteRow }) => (
  <Box>
    <Typography
      sx={{ fontWeight: 700, fontSize: 15, mb: 2, color: "text.heading" }}
    >
      Offset Applied
    </Typography>
    <Grid container spacing={3}>
      <DetailItem label="Credit Note No" value={selectedRow.creditNoteNo} />
      <DetailItem label="Billed Month" value={selectedRow.month} />
      <DetailItem label="Amount" value={selectedRow.amount} />
      <DetailItem
        label="Note"
        value="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
        size={{ xs: 12 }}
        valueSx={{ mt: 0.5 }}
      />
    </Grid>
  </Box>
);

const BalanceSection = ({ selectedRow }: { selectedRow: CreditNoteRow }) => {
  const balanceValue =
    typeof selectedRow.balance === "object"
      ? selectedRow.balance.value
      : selectedRow.balance;

  return (
    <Box
      sx={{
        bgcolor: "metrics.creditBalanceBg",
        border: "1px solid",
        borderColor: "metrics.creditBalanceBorder",
        borderRadius: 2,
        p: 2.5,
      }}
    >
      <Typography
        sx={{ fontWeight: 700, fontSize: 15, mb: 2, color: "text.heading" }}
      >
        Balance
      </Typography>
      <Grid container spacing={3}>
        <DetailItem label="Balance Amount" value={balanceValue} />
        <DetailItem label="Month" value={selectedRow.month} />
      </Grid>
    </Box>
  );
};

export default function CreditDetailsDrawer({
  open,
  onClose,
  selectedRow,
}: CreditDetailsDrawerProps) {
  const [isChangeOffsetOpen, setIsChangeOffsetOpen] = React.useState(false);
  const [isReverseModalOpen, setIsReverseModalOpen] = React.useState(false);

  const handleChangeOffsetSubmit = () => {
    setIsChangeOffsetOpen(false);
    onClose();
  };

  const handleReverseSubmit = () => {
    setIsReverseModalOpen(false);
    onClose();
  };

  if (!selectedRow) return null;

  return (
    <>
      <SideDrawer
        open={open && !isChangeOffsetOpen && !isReverseModalOpen}
        onClose={onClose}
        title="Details"
        width={{ xs: "100%", md: "55vw" }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
          {/* Header Section */}
          <Stack
            direction={{ xs: "column", sm: "row" }}
            sx={{
              justifyContent: "space-between",
              alignItems: { sm: "center" },
              gap: 2,
            }}
          >
            <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
              <Avatar
                sx={{
                  width: 48,
                  height: 48,
                  fontWeight: 700,
                  borderRadius: 2,
                  bgcolor: "primary.light",
                  color: "primary.main",
                }}
              >
                {selectedRow.companyName.substring(0, 2).toUpperCase()}
              </Avatar>
              <Box>
                <Typography
                  sx={{ fontWeight: 700, fontSize: 16, color: "text.heading" }}
                >
                  {selectedRow.companyName}
                </Typography>
                <Typography
                  sx={{ fontSize: 13, color: "text.heading", mt: 0.5 }}
                >
                  Policy No : {selectedRow.policyNo} &nbsp;|&nbsp; Brokerage :{" "}
                  <Box
                    component="span"
                    sx={{ fontWeight: 700, color: "text.primary" }}
                  >
                    {selectedRow.brokerage || "Kenn Brokerage"}
                  </Box>
                </Typography>
              </Box>
            </Stack>
            <Stack direction="row" spacing={1}>
              <CustomButton
                variantType="outlined"
                sizeType="sm"
                sx={{ color: "iconDark", borderColor: "divider" }}
                onClick={() => setIsChangeOffsetOpen(true)}
              >
                Change Offset
              </CustomButton>
              <CustomButton
                variantType="outlined"
                sizeType="sm"
                sx={{ color: "text.primary", borderColor: "divider" }}
                onClick={() => setIsReverseModalOpen(true)}
              >
                Reverse
              </CustomButton>
            </Stack>
          </Stack>

          <Divider />

          <InvoiceDetails selectedRow={selectedRow} />

          <Divider />

          <OffsetApplied selectedRow={selectedRow} />

          <BalanceSection selectedRow={selectedRow} />
        </Box>
      </SideDrawer>
      <ChangeOffsetModal
        open={isChangeOffsetOpen}
        onClose={() => setIsChangeOffsetOpen(false)}
        onSubmit={handleChangeOffsetSubmit}
      />
      <ReverseModal
        open={isReverseModalOpen}
        onClose={() => setIsReverseModalOpen(false)}
        onSubmit={handleReverseSubmit}
      />
    </>
  );
}
