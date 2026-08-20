"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import SearchInput from "@/components/ui/SearchInput";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import { StatusChip } from "@/components/ui/StatusChip";
import CallMadeIcon from "@mui/icons-material/CallMade";
import Select from "@/components/ui/Select";
import CustomDatePicker from "@/components/ui/CustomDatePicker";

interface MetricProps {
  value: string | number;
  label: string;
}

const MetricCard = ({ value, label }: MetricProps) => (
  <Paper
    variant="outlined"
    sx={{
      px: 3,
      py: 1,
      borderRadius: 2,
      flex: 1,
      minWidth: 160,
      display: "flex",
      flexDirection: "column",
      gap: 1,
      boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
      border: "none",
    }}
  >
    <Typography sx={{ fontSize: 24, fontWeight: 700, color: "text.primary" }}>
      {value}
    </Typography>
    <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
      {label}
    </Typography>
  </Paper>
);

interface Claim {
  id: string;
  companyName: string;
  employerPolicyNo: string;
  employeeName: string;
  employeeIdNo: string;
  policyNoTop: string;
  policyNoBottom: string;
  claimNumber: string;
  claimType: string;
  claimDate: string;
  datePaid: string;
  status: string;
  assessor: string;
}
const STATUS_OPTIONS = [
  { label: "All", value: "" },
  { label: "Approved", value: "Approved" },
  { label: "Flagged", value: "Flagged" },
  { label: "Pending", value: "Pending" },
  { label: "Rejected", value: "Rejected" },
];
const STATUS_ROLES = [
  { label: "All", value: "" },
  { label: "Assessor", value: "Assessor" },
];
const INITIAL_CLAIMS: Claim[] = [
  {
    id: "1",
    companyName: "Mediterian Logistcs",
    employerPolicyNo: "3843-43434-343 333",
    employeeName: "Thabo Sipho Nkosi",
    employeeIdNo: "8804155032082",
    policyNoTop: "89347583",
    policyNoBottom: "45493583",
    claimNumber: "CLM-2026-003",
    claimType: "Disability Benefit",
    claimDate: "23-04-2026",
    datePaid: "06-05-2026",
    status: "Approved",
    assessor: "Kathryn Murphy",
  },
  {
    id: "2",
    companyName: "Stellenbosch Wineries Co-operative",
    employerPolicyNo: "3843-43434-343 333",
    employeeName: "John doe",
    employeeIdNo: "8804155032082",
    policyNoTop: "89347583",
    policyNoBottom: "45493583",
    claimNumber: "CLM-2026-006",
    claimType: "Funeral Benefit",
    claimDate: "26-04-2026",
    datePaid: "06-05-2026",
    status: "Approved",
    assessor: "Cody Fisher",
  },
  {
    id: "3",
    companyName: "DuraTech Mining",
    employerPolicyNo: "3843-43434-343 333",
    employeeName: "John Williamsion",
    employeeIdNo: "8804155032082",
    policyNoTop: "89347583",
    policyNoBottom: "45493583",
    claimNumber: "CLM-2026-009",
    claimType: "Disability Benefit",
    claimDate: "21-04-2026",
    datePaid: "Pending",
    status: "Flagged",
    assessor: "Jane Cooper",
  },
  {
    id: "4",
    companyName: "Exxaro Resources",
    employerPolicyNo: "3843-43434-343 333",
    employeeName: "Cane Cone",
    employeeIdNo: "8804155032082",
    policyNoTop: "89347583",
    policyNoBottom: "45493583",
    claimNumber: "CLM-2026-012",
    claimType: "Funeral Benefit",
    claimDate: "24-04-2026",
    datePaid: "Pending",
    status: "Pending",
    assessor: "Darlene Robertson",
  },
  {
    id: "5",
    companyName: "Seriti Resources",
    employerPolicyNo: "3843-43434-343 333",
    employeeName: "Moto Sibanye",
    employeeIdNo: "8804155032082",
    policyNoTop: "89347583",
    policyNoBottom: "45493583",
    claimNumber: "CLM-2026-015",
    claimType: "Disability Benefit",
    claimDate: "27-04-2026",
    datePaid: "06-05-2026",
    status: "Rejected",
    assessor: "Albert Flores",
  },
];

const ITEMS_PER_PAGE = 3;

export default function ClaimAdministrationPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");

  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const filteredData = useMemo(() => {
    return INITIAL_CLAIMS.filter((claim) => {
      const matchesSearch =
        claim.claimNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.employeeIdNo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyNoTop.toLowerCase().includes(searchTerm.toLowerCase()) ||
        claim.policyNoBottom.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "" || claim.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [searchTerm, statusFilter]);

  const totalPages = Math.ceil(filteredData.length / ITEMS_PER_PAGE) || 1;
  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredData.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredData, currentPage]);

  const columns: Column<Claim>[] = [
    {
      header: "Company & Policy No",
      cell: (row) => (
        <Box>
          <Box
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: 13,
              mb: 0.5,
            }}
          >
            {row.companyName}
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {row.employerPolicyNo}
          </Box>
        </Box>
      ),
    },
    {
      header: "Emp Name and ID no",
      cell: (row) => (
        <Box>
          <Box
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: 13,
              mb: 0.5,
            }}
          >
            {row.employeeName}
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {row.employeeIdNo}
          </Box>
        </Box>
      ),
    },
    {
      header: "Policy No.",
      cell: (row) => (
        <Box>
          <Box
            sx={{
              fontWeight: 700,
              color: "text.primary",
              fontSize: 13,
              mb: 0.5,
            }}
          >
            {row.policyNoTop}
          </Box>
          <Box sx={{ fontWeight: 700, color: "text.primary", fontSize: 13 }}>
            {row.policyNoBottom}
          </Box>
        </Box>
      ),
    },
    {
      header: "Claim Number",
      accessorKey: "claimNumber",
      cell: (row) => (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>
          {row.claimNumber}
        </Box>
      ),
    },
    {
      header: "Claim Type",
      accessorKey: "claimType",
      cell: (row) => (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>
          {row.claimType.split(" ").map((word, i) => (
            <Box key={i} component="span" sx={{ display: "block" }}>
              {word}
            </Box>
          ))}
        </Box>
      ),
    },
    {
      header: "Claim Date",
      accessorKey: "claimDate",
      cell: (row) => (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>
          {row.claimDate}
        </Box>
      ),
    },
    {
      header: "Date Paid",
      accessorKey: "datePaid",
      cell: (row) => (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>{row.datePaid}</Box>
      ),
    },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      header: "Assessor",
      accessorKey: "assessor",
      cell: (row) => (
        <Box sx={{ color: "text.secondary", fontSize: 13 }}>
          {row.assessor.split(" ").map((word, i) => (
            <Box key={i} component="span" sx={{ display: "block" }}>
              {word}
            </Box>
          ))}
        </Box>
      ),
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          startIcon={<CallMadeIcon sx={{ fontSize: 16 }} />}
          onClick={() => router.push(`/claimsAdministration/${row.id}`)}
          sx={{
            borderColor: "divider",
            textTransform: "none",
            color: "text.primary",
            borderRadius: 1.5,
            px: 1.5,
            height: 32,
            minWidth: "auto",
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Box sx={{ p: 3, display: "flex", flexDirection: "column", gap: 3 }}>
      <Typography variant="h5" sx={{ fontWeight: 700 }}>
        Claims Administration
      </Typography>

      <Stack direction="row" spacing={2} sx={{ overflowX: "auto", pb: 1 }}>
        <MetricCard value="14" label="Claims Received" />
        <MetricCard value="6" label="Claims Paid" />
        <MetricCard value="9" label="Claims Pending" />
        <MetricCard value="9" label="Claims Declined" />
        <MetricCard value="9" label="Claims Repudiated" />
      </Stack>

      <Paper
        variant="outlined"
        sx={{
          borderRadius: 3,
          display: "flex",
          flexDirection: "column",
          px: 3,
          py: 2,
          boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
          border: "none",
        }}
      >
        <Stack
          direction="row"
          sx={{
            py: 2,
            justifyContent: "space-between",
            alignItems: "center",
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <SearchInput
            value={searchTerm}
            onChange={setSearchTerm}
            placeholder="search by claim reference number, ID number, and policy number"
            sx={{ maxWidth: 450 }}
          />

          <Stack direction="row" spacing={2} sx={{ alignItems: "center" }}>
            <Select
              value={statusFilter}
              options={STATUS_OPTIONS}
              renderValue={(val) => (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Status:{" "}
                  <Box component="strong" sx={{ color: "text.primary" }}>
                    {STATUS_OPTIONS.find((o) => o.value === val)?.label ??
                      "All"}
                  </Box>
                </Box>
              )}
              onChange={(val) => {
                setStatusFilter(val);
                setCurrentPage(1);
              }}
              sx={{ minWidth: 140 }}
            />

            <Select
              value={roleFilter}
              options={STATUS_ROLES}
              renderValue={(val) => (
                <Box component="span" sx={{ color: "text.secondary" }}>
                  Role:{" "}
                  <Box component="strong" sx={{ color: "text.primary" }}>
                    {STATUS_ROLES.find((o) => o.value === val)?.label ?? "All"}
                  </Box>
                </Box>
              )}
              onChange={(val) => {
                setRoleFilter(val);
                setCurrentPage(1);
              }}
              sx={{ minWidth: 140 }}
            />
            <CustomDatePicker
              value={dateFilter}
              onChange={(val) => setDateFilter(val as string)}
            />
          </Stack>
        </Stack>

        <CustomTable
          columns={columns}
          data={paginatedData}
          emptyMessage="No claims found."
          colSpanCount={10}
          itemsPerPage={ITEMS_PER_PAGE}
          currentPage={currentPage}
          setCurrentPage={setCurrentPage}
          totalPages={totalPages}
          totalData={filteredData.length}
        />
      </Paper>
    </Box>
  );
}
