import React, { Fragment, useMemo } from "react";
import { Box, Divider, Typography, Grid } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";

export interface EmployeeDetails {
  name: string;
  initials: string;
  policyNumber: string;
  brokerage: string;
  vopdStatus: string;
  amlStatus: string;
  policyStatus: string;
  policyInceptionDate: string;
  totalPremiumPaid: string;
  dateOfBirth: string;
  communication: string;
  policyholderDetails: {
    employeePolicyNumber: string;
    employerPolicyNumber: string;
    companyName: string;
    brokerage: string;
    representative: string;
    memberType: string;
    fullName: string;
    idNumber: string;
    email: string;
    phoneNumber: string;
    address: string;
    premium: string;
    startDate: string;
    premiumStatus: string;
  };
  contactDetails: {
    email: string;
    phoneNumber: string;
    address: string;
  };
  vopdVerification: {
    policyholderIdNumber: string;
    fullNameVerified: string;
    dateOfBirthVerified: string;
    verificationDate: string;
  };
  amlVerification: {
    riskLevel: string;
    screeningDate: string;
    idNumberScreened: string;
    fullNameScreened: string;
  };
}

export interface DetailField {
  label: string;
  value: string;
}

export interface Section {
  title: string;
  md: number;
  statusChip?: React.ReactNode;
  fields: DetailField[];
}

const getSections = (employee: EmployeeDetails): Section[] => [
  {
    title: "Policyholder Details",
    md: 3,
    fields: [
      {
        label: "Employee Policy Number",
        value: employee?.policyholderDetails?.employeePolicyNumber || "",
      },
      {
        label: "Employer Policy Number",
        value: employee?.policyholderDetails?.employerPolicyNumber || "",
      },
      {
        label: "Company Name",
        value: employee?.policyholderDetails?.companyName || "",
      },
      {
        label: "Brokerage",
        value: employee?.policyholderDetails?.brokerage || "",
      },
      {
        label: "Representative",
        value: employee?.policyholderDetails?.representative || "",
      },
      {
        label: "Member Type",
        value: employee?.policyholderDetails?.memberType || "",
      },
      {
        label: "Full Name",
        value: employee?.policyholderDetails?.fullName || "",
      },
      {
        label: "ID Number / Passport Number",
        value: employee?.policyholderDetails?.idNumber || "",
      },
      {
        label: "Email",
        value: employee?.policyholderDetails?.email || "",
      },
      {
        label: "Phone Number",
        value: employee?.policyholderDetails?.phoneNumber || "",
      },
      {
        label: "Address",
        value: employee?.policyholderDetails?.address || "",
      },
      {
        label: "Premium",
        value: employee?.policyholderDetails?.premium || "",
      },
      {
        label: "Start Date",
        value: employee?.policyholderDetails?.startDate || "",
      },
      {
        label: "Premium",
        value: employee?.policyholderDetails?.premiumStatus || "",
      },
    ],
  },
  {
    title: "VOPD Verification",
    md: 3,
    statusChip: (
      <StatusChip
        status={employee?.vopdStatus || ""}
        label={`VOPD : ${employee?.vopdStatus || ""}`}
      />
    ),
    fields: [
      {
        label: "Policyholder ID Number",
        value: employee?.vopdVerification?.policyholderIdNumber || "",
      },
      {
        label: "Full Name Verified",
        value: employee?.vopdVerification?.fullNameVerified || "",
      },
      {
        label: "Date of Birth Verified",
        value: employee?.vopdVerification?.dateOfBirthVerified || "",
      },
      {
        label: "Verification Date",
        value: employee?.vopdVerification?.verificationDate || "",
      },
    ],
  },
  {
    title: "AML Verification",
    md: 3,
    statusChip: (
      <StatusChip
        status={employee?.amlStatus || ""}
        label={`AML Check : ${employee?.amlStatus || ""}`}
      />
    ),
    fields: [
      {
        label: "Risk Level",
        value: employee?.amlVerification?.riskLevel || "",
      },
      {
        label: "Screening Date",
        value: employee?.amlVerification?.screeningDate || "",
      },
      {
        label: "ID Number Screened",
        value: employee?.amlVerification?.idNumberScreened || "",
      },
      {
        label: "Full Name Screened",
        value: employee?.amlVerification?.fullNameScreened || "",
      },
    ],
  },
];

const SectionHeader = ({
  title,
  statusChip,
}: {
  title: string;
  statusChip?: React.ReactNode;
}) => (
  <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 3 }}>
    <Typography
      variant="h6"
      sx={{ fontWeight: 700, fontSize: 16, color: "text.heading" }}
    >
      {title}
    </Typography>
    {statusChip}
  </Box>
);

const DetailItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: 14, fontWeight: 500, color: "text.valueText" }}>
      {value}
    </Typography>
  </Box>
);

export default function OverviewTab({
  employee,
}: {
  employee: EmployeeDetails;
}) {
  const sections = useMemo(() => getSections(employee), [employee]);
  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
      {sections.map((section, index) => (
        <Fragment key={section.title}>
          <Box>
            <SectionHeader
              title={section.title}
              statusChip={section.statusChip}
            />
            <Grid container spacing={4}>
              {section.fields.map(({ label, value }, i) => (
                <Grid
                  key={`${label}-${i}`}
                  size={{ xs: 12, sm: 6, md: section.md }}
                >
                  <DetailItem label={label} value={value} />
                </Grid>
              ))}
            </Grid>
          </Box>
          {index < sections.length - 1 && <Divider />}
        </Fragment>
      ))}
    </Box>
  );
}
