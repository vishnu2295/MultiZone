"use client";

import {
  Box,
  Paper,
  Typography,
  Avatar,
  Stack,
  Divider,
  Tooltip,
  Menu,
  MenuItem,
} from "@mui/material";
import { StatusChip } from "../../../../../components/ui/StatusChip";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { useState, useMemo } from "react";
import OverviewTab, {
  EmployeeDetails,
} from "./employeeOverviewTabs/OverviewTab";
import DependantsTab from "./employeeOverviewTabs/DependantsTab";
import DocumentsTab from "./employeeOverviewTabs/DocumentsTab";
import CorrespondenceTab from "./employeeOverviewTabs/CorrespondenceTab";
import AuditTrailTab from "./employeeOverviewTabs/AuditTrailTab";
import ClaimsTab from "./employeeOverviewTabs/ClaimsTab";
import CancelPolicyModal from "./CancelPolicyModal";
import { useRouter, useSearchParams } from "next/navigation";
import BackButton from "@/components/ui/BackButton";
import { CustomButton } from "@/components/ui/CustomButton";
import { CustomTabs } from "@/components/ui/CustomTabs";
import { INITIAL_EMPLOYEES } from "../EmployeesTab";

const InfoBox = ({ label, value }: { label: string; value: string }) => (
  <Box
    sx={{
      bgcolor: "#f8fafc",
      border: "1px solid",
      borderColor: "divider",
      borderRadius: 1.5,
      px: 1.25,
      py: 0.8,
      display: "inline-flex",
      alignItems: "center",
    }}
  >
    <Typography sx={{ fontSize: 12, color: "text.secondary" }}>
      {label} :{" "}
      <Box component="span" sx={{ fontWeight: 600, color: "text.primary" }}>
        {value}
      </Box>
    </Typography>
  </Box>
);

const tabItems = [
  { label: "Overview", value: "overview" },
  { label: "Dependants & Beneficiaries", value: "dependants" },
  { label: "Documents", value: "documents" },
  { label: "Correspondence", value: "correspondence" },
  { label: "Claims", value: "claims" },
  { label: "Audit Trail", value: "audit_trail" },
];

const ComingSoon = ({ label }: { label: string }) => (
  <Box>
    <Typography
      variant="h6"
      sx={{ fontWeight: 600, color: "text.primary", mb: 2 }}
    >
      {label}
    </Typography>
  </Box>
);

const PolicyHeader = ({
  employee,
  onCancelClick,
  cancelledData,
  fromParam,
}: {
  employee: EmployeeDetails;
  onCancelClick: () => void;
  cancelledData: { reason: string; date: string } | null;
  fromParam: string | null;
}) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const handleActionClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleActionClose = () => {
    setAnchorEl(null);
  };

  return (
    <Box sx={{ p: 3 }}>
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "flex-start",
        }}
      >
        <Stack direction="row" spacing={2.5} sx={{ alignItems: "center" }}>
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
            {employee.initials}
          </Avatar>
          <Box>
            <Stack direction="row" spacing={1.5} sx={{ alignItems: "center" }}>
              <Typography
                sx={{ fontWeight: 700, fontSize: 18, color: "text.heading" }}
              >
                {employee.name}
              </Typography>
              <StatusChip
                status={employee.vopdStatus}
                label={`VOPD : ${employee.vopdStatus}`}
              />
              <StatusChip
                status={employee.amlStatus}
                label={`AML Check : ${employee.amlStatus}`}
              />
            </Stack>
            <Typography sx={{ fontSize: 14, color: "text.heading", mt: 0.5 }}>
              Policy No :{" "}
              <Box
                component="span"
                sx={{ fontWeight: 400, color: "text.heading" }}
              >
                {employee.policyNumber}
              </Box>{" "}
              | Brokerage :{" "}
              <Box
                component="span"
                sx={{ fontWeight: 700, color: "text.heading" }}
              >
                {employee.brokerage}
              </Box>
            </Typography>
          </Box>
        </Stack>
        {cancelledData ? (
          <Stack direction="row" spacing={1} sx={{ alignItems: "center" }}>
            <StatusChip
              status={`Marked as Cancelled : ${cancelledData.date}`}
              sx={{ px: 1, py: 0.5, borderRadius: 4 }}
            />
            <Tooltip title={cancelledData.reason} placement="top" arrow>
              <InfoOutlinedIcon
                sx={{ color: "text.primary", fontSize: 20, cursor: "pointer" }}
              />
            </Tooltip>
          </Stack>
        ) : (
          <StatusChip
            status={employee.policyStatus}
            sx={{
              px: 0.5,
              borderRadius: 1.5,
            }}
          />
        )}
      </Stack>

      {/* Info Row */}
      <Stack
        direction="row"
        sx={{
          justifyContent: "space-between",
          alignItems: "center",
          mt: 3,
        }}
      >
        <Stack direction="row" spacing={1} useFlexGap sx={{ flexWrap: "wrap" }}>
          <InfoBox
            label="Policy Inception Date"
            value={employee.policyInceptionDate}
          />
          <InfoBox
            label="Total Premium Paid"
            value={employee.totalPremiumPaid}
          />
          <InfoBox label="Date of Birth" value={employee.dateOfBirth} />
          <InfoBox label="Communication" value={employee.communication} />
        </Stack>

        {fromParam === "policyAdministration" && !cancelledData ? (
          <Box>
            <CustomButton
              sizeType="sm"
              variantType="outlined"
              onClick={handleActionClick}
              endIcon={<KeyboardArrowDownIcon />}
              sx={{ borderColor: "divider", color: "text.primary" }}
            >
              Actions
            </CustomButton>
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleActionClose}
              anchorOrigin={{
                vertical: "bottom",
                horizontal: "right",
              }}
              transformOrigin={{
                vertical: "top",
                horizontal: "right",
              }}
              sx={{ mt: 1 }}
            >
              <MenuItem onClick={handleActionClose} sx={{ fontSize: 14 }}>
                Update Personal Details
              </MenuItem>
              <MenuItem onClick={handleActionClose} sx={{ fontSize: 14 }}>
                Add Dependants
              </MenuItem>
              <MenuItem onClick={handleActionClose} sx={{ fontSize: 14 }}>
                Remove Dependants
              </MenuItem>
            </Menu>
          </Box>
        ) : !cancelledData ? (
          <CustomButton
            sizeType="sm"
            variantType="outlined"
            customColor="error.main"
            startIcon={<CancelOutlinedIcon />}
            onClick={onCancelClick}
          >
            Cancel Policy
          </CustomButton>
        ) : null}
      </Stack>
    </Box>
  );
};

export default function EmployeePolicyDetails() {
  const [activeTab, setActiveTab] = useState("overview");
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [cancelledData, setCancelledData] = useState<{
    reason: string;
    date: string;
  } | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const employeeId = searchParams.get("employeeId");
  const fromParam = searchParams.get("from");

  const baseEmployee =
    INITIAL_EMPLOYEES.find((e) => e.id === employeeId) || INITIAL_EMPLOYEES[0];

  const employee = useMemo(
    () => ({
      name: baseEmployee.name,
      initials: baseEmployee.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .substring(0, 2)
        .toUpperCase(),
      policyNumber: baseEmployee.policyNo,
      brokerage: "Kenn Brokerage",
      vopdStatus: baseEmployee.vopdVerified ? "Verified" : "Pending",
      amlStatus: baseEmployee.amlStatus,
      policyStatus: baseEmployee.status,
      policyInceptionDate: "12-03-2024",
      totalPremiumPaid: "R 1200000.00",
      dateOfBirth: "15-05-1988",
      communication: "Email",
      policyholderDetails: {
        employeePolicyNumber: "23982789329832",
        employerPolicyNumber: "23982789329832",
        companyName: "Meridian Logistics (Pty) Ltd",
        brokerage: "Kenn Brokerage",
        representative: "John doe",
        memberType: "Main Member",
        fullName: baseEmployee.name,
        idNumber: baseEmployee.idNumber,
        email: baseEmployee.email,
        phoneNumber: baseEmployee.phoneNumber,
        address: "45 Khumalo Street, Soweto, Johannesburg, 1804",
        premium: "R 5000",
        startDate: "01-01-2026",
        premiumStatus: "Active / Indefinite",
      },
      contactDetails: {
        email: baseEmployee.email,
        phoneNumber: baseEmployee.phoneNumber,
        address: "45 Khumalo Street, Soweto, Johannesburg, 1804",
      },
      vopdVerification: {
        policyholderIdNumber: baseEmployee.idNumber,
        fullNameVerified: baseEmployee.name,
        dateOfBirthVerified: "15-05-1988",
        verificationDate: "28-02-2023",
      },
      amlVerification: {
        riskLevel: "Low",
        screeningDate: "28-02-2023",
        idNumberScreened: baseEmployee.idNumber,
        fullNameScreened: baseEmployee.name,
      },
    }),
    [baseEmployee]
  );

  const TAB_CONTENT: Record<string, React.ReactNode> = {
    overview: (
      <Box>
        <OverviewTab employee={employee} />
      </Box>
    ),
    dependants: <DependantsTab />,
    documents: <DocumentsTab />,
    correspondence: <CorrespondenceTab />,
    claims: <ClaimsTab />,
    audit_trail: <AuditTrailTab />,
  };

  return (
    <>
      <BackButton
        onClickHandler={() => {
          const from = searchParams.get("from");
          if (from === "policyAdministration") {
            router.push(`/policyAdministration?tab=employee_policies`);
            return;
          }
          const policyId = searchParams.get("policyId");
          const policyParam = policyId ? `&policyId=${policyId}` : "";
          router.push(`/policyLifecycle/overview?tab=employees${policyParam}`);
        }}
      />
      <Box
        sx={{
          display: "flex",
          minHeight: "100vh",
          bgcolor: "background.default",
        }}
      >
        <Box
          component="main"
          sx={{
            flex: 1,
            pt: "73px",
            p: { xs: 3, lg: 2 },
            pl: { xs: 3, lg: 3 },
            display: "flex",
            flexDirection: "column",
            gap: 2,
            overflowY: "auto",
          }}
        >
          <Typography variant="h5" sx={{ fontWeight: 700 }}>
            Policy Details
          </Typography>

          <Paper
            variant="outlined"
            sx={{
              borderRadius: 3,
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Header Section */}
            <PolicyHeader
              employee={employee}
              onCancelClick={() => setIsCancelModalOpen(true)}
              cancelledData={cancelledData}
              fromParam={fromParam}
            />

            <Divider />

            {/* Tabs */}
            <CustomTabs
              tabs={tabItems}
              activeTab={activeTab}
              onChange={setActiveTab}
              containerSx={{ px: 2 }}
            />

            <Divider />

            {/* Tab Content */}
            <Box sx={{ p: 4 }}>{TAB_CONTENT[activeTab]}</Box>
          </Paper>
        </Box>
      </Box>

      <CancelPolicyModal
        open={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={(reason) => {
          setCancelledData({
            reason,
            date: "12-06-2026",
          });
          setIsCancelModalOpen(false);
          const emp = INITIAL_EMPLOYEES.find((e) => e.id === employeeId);
          if (emp) {
            emp.status = "Cancelled";
          }
        }}
      />
    </>
  );
}
