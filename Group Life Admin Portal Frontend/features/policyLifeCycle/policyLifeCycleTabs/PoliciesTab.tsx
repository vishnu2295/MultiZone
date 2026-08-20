import { CustomButton } from "@/components/ui/CustomButton";
import { Column, CustomTable } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import useToken from "@/hooks/useToken";
import { NorthEast } from "@mui/icons-material";
import { Box, Paper, Select, MenuItem, Stack, Typography } from "@mui/material";
import { StatusChip } from "@/components/ui/StatusChip";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";

export interface Policy {
  id: string;
  companyPolicyNo: string;
  policyNumber: string;
  brokerage: string;
  totalEmployees: string;
  phoneNumber: string;
  email: string;
  status: "Active" | "Inactive";
}
const INITIAL_POLICY: Policy[] = [
  {
    id: "1",
    status: "Inactive",
    companyPolicyNo: "Mediterian Logistcs ",
    policyNumber: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    totalEmployees: "2000",
    phoneNumber: "+27 838-323-3232",
    email: "Jacob@rma.co.za",
  },
  {
    id: "2",
    status: "Active",
    companyPolicyNo: "Mediterian Logistcs",
    policyNumber: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    totalEmployees: "2000",
    phoneNumber: "+27 838-323-3232",
    email: "darlene@rma.co.za",
  },
];
const STATUS_OPTIONS = ["All", "Active", "Inactive"];
const ITEMS_PER_PAGE = 6;
export default function PoliciesTab() {
  const [policy, setPolicy] = useState<Policy[]>(INITIAL_POLICY);
  //Todo : Add Logic to fetch Policies from API

  const [currentPage, setCurrentPage] = useState(1);
  // Filters
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");

  const totalPages = Math.ceil(INITIAL_POLICY.length / ITEMS_PER_PAGE) || 1;
  const router = useRouter();
  const accessToken: any = useToken();
  const handleToggleStatus = (role: Policy) => {
    router.push(`/policyLifecycle/overview?policyId=${role.id}`);
  };
  const policyColumns: Column<Policy>[] = useMemo(
    () => [
      {
        header: "Company & Policy No",
        accessorKey: "companyPolicyNo",
        cell: (row) => (
          <Box>
            <Typography sx={{ fontWeight: 700, fontSize: 14 }}>
              {row.companyPolicyNo}
            </Typography>
            <Typography sx={{ fontWeight: 500, fontSize: 12 }}>
              {row.policyNumber}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Brokerage",
        accessorKey: "brokerage",
        width: "35%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 350,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.brokerage}
          </Typography>
        ),
      },
      {
        header: "Total Employees",
        accessorKey: "totalEmployees",
        width: "15%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 100,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.totalEmployees}
          </Typography>
        ),
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        width: "25%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 150,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.phoneNumber}
          </Typography>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        width: "45%",
        cell: (row) => (
          <Typography
            sx={{
              fontSize: 14,
              color: "text.secondary",
              maxWidth: 250,
              whiteSpace: "normal",
              wordWrap: "break-word",
            }}
          >
            {row.email}
          </Typography>
        ),
      },
      {
        header: "Status",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Actions",
        width: 280,
        cell: (row) => (
          <Stack direction="row" spacing={1}>
            <CustomButton
              variantType="secondary"
              sizeType="sm"
              onClick={() => handleToggleStatus(row)}
              startIcon={<NorthEast sx={{ fontSize: 16 }} />}
            >
              {"View Details"}
            </CustomButton>
          </Stack>
        ),
      },
    ],
    []
  );
  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        p: { xs: 2.5, lg: 3 },
        display: "flex",
        flexDirection: "column",
        gap: 3,
        boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
        border: "none",
        mt: 1,
      }}
    >
      {/* Card header */}
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        {/* Search */}
        <Box sx={{ width: "100%", maxWidth: 450 }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => {
              setSearchQuery(val);
            }}
            placeholder="company name, policy number or registration number"
          />
        </Box>

        {/* Status filter */}
        <Select
          value={selectedStatus}
          renderValue={(val) => (
            <Box component="span" sx={{ color: "text.secondary" }}>
              Status :{" "}
              <Box component="strong" sx={{ color: "text.primary" }}>
                {val as string}
              </Box>
            </Box>
          )}
          onChange={(e) => {
            setSelectedStatus(e.target.value as string);
          }}
          sx={{ minWidth: 140 }}
        >
          {STATUS_OPTIONS.map((s) => (
            <MenuItem key={s} value={s}>
              {s}
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <CustomTable
        columns={policyColumns}
        data={policy}
        emptyMessage="No roles found matching the selected filters."
        colSpanCount={4}
        itemsPerPage={ITEMS_PER_PAGE}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={totalPages}
      />
    </Paper>
  );
}
