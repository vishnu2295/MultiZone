import { Column, CustomTable } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import {
  Box,
  MenuItem,
  Select,
  Stack,
  Typography,
  Button,
} from "@mui/material";
import { StatusChip } from "../../../../components/ui/StatusChip";
import NorthEastIcon from "@mui/icons-material/NorthEast";
import { useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export interface Employee {
  id: string;
  name: string;
  idNumber: string;
  policyNo: string;
  phoneNumber: string;
  email: string;
  vopdVerified: boolean;
  amlStatus: string;
  status:
    "Active" | "Cancelled" | "Grace Period" | "Re-instated" | "Lapsed" | "NTU";
}

export const INITIAL_EMPLOYEES: Employee[] = [
  {
    id: "1",
    name: "Thabo Sipho Nkosi",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "thabo.nkosi@meridianlogistics.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Active",
  },
  {
    id: "2",
    name: "John doe",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "john@meridianlogistics.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Cancelled",
  },
  {
    id: "3",
    name: "John Williamsion",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "williamson@rma.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Grace Period",
  },
  {
    id: "4",
    name: "Cane Cone",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "cone@rma.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Re-instated",
  },
  {
    id: "5",
    name: "Moto Sibanye",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "moto@rma.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Lapsed",
  },
  {
    id: "6",
    name: "Exxaro David",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "exxaro@rma.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "NTU",
  },
  {
    id: "7",
    name: "Seriti Ross",
    idNumber: "8804155032082",
    policyNo: "8934758345493583",
    phoneNumber: "072 312 4455",
    email: "seriti@rma.co.za",
    vopdVerified: true,
    amlStatus: "Clear : Low Risk",
    status: "Active",
  },
];

const STATUS_OPTIONS = [
  "All",
  "Active",
  "Cancelled",
  "Grace Period",
  "Re-instated",
  "Lapsed",
  "NTU",
];
const ROLE_OPTIONS = ["All", "Admin", "User", "Manager"];

export default function EmployeesTab() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [selectedRole, setSelectedRole] = useState("All");

  const columns: Column<Employee>[] = useMemo(
    () => [
      {
        header: "Name and ID no",
        accessorKey: "name",
        width: "15%",
        cell: (row) => (
          <Box>
            <Typography
              sx={{ fontWeight: 600, fontSize: 13, color: "text.primary" }}
            >
              {row.name}
            </Typography>
            <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
              {row.idNumber}
            </Typography>
          </Box>
        ),
      },
      {
        header: "Policy No.",
        accessorKey: "policyNo",
        width: "12%",
        cell: (row) => (
          <Typography
            sx={{ fontWeight: 600, fontSize: 13, color: "text.primary" }}
          >
            {row.policyNo.slice(0, 16)} {/* wrap or break handled by table */}
          </Typography>
        ),
      },
      {
        header: "Phone Number",
        accessorKey: "phoneNumber",
        width: "12%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.phoneNumber}
          </Typography>
        ),
      },
      {
        header: "Email",
        accessorKey: "email",
        width: "18%",
        cell: (row) => (
          <Typography sx={{ fontSize: 13, color: "text.secondary" }}>
            {row.email}
          </Typography>
        ),
      },
      {
        header: "VOPD Verification",
        accessorKey: "vopdVerified",
        width: "12%",
        cell: (row) => (
          <StatusChip status={row.vopdVerified ? "Verified" : "Pending"} />
        ),
      },
      {
        header: "AML Verification",
        accessorKey: "amlStatus",
        width: "12%",
        cell: (row) => <StatusChip status={row.amlStatus} />,
      },
      {
        header: "Status",
        accessorKey: "status",
        width: "10%",
        cell: (row) => <StatusChip status={row.status} />,
      },
      {
        header: "Actions",
        accessorKey: "id",
        width: "10%",
        cell: (row) => (
          <Button
            onClick={() => {
              const currentPolicyId = searchParams.get("policyId") || "";
              router.push(
                `/policyLifecycle/overview/employee?policyId=${currentPolicyId}&employeeId=${row.id}`
              );
            }}
            variant="outlined"
            size="small"
            startIcon={<NorthEastIcon sx={{ fontSize: 16 }} />}
            sx={{
              textTransform: "none",
              borderRadius: 2,
              color: "text.primary",
              borderColor: "divider",
              px: 2,
              py: 0.5,
              fontWeight: 500,
            }}
          >
            View Details
          </Button>
        ),
      },
    ],
    [router]
  );

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        sx={{
          gap: 2,
          justifyContent: "space-between",
          alignItems: { md: "center" },
        }}
      >
        <Box sx={{ flex: 1, maxWidth: 400 }}>
          <SearchInput
            value={searchQuery}
            onChange={(val) => setSearchQuery(val)}
            placeholder="search by employee names, policy number, or ID number."
          />
        </Box>

        <Stack direction="row" spacing={2}>
          <Select
            value={selectedStatus}
            renderValue={(val) => (
              <Box
                component="span"
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Status :{" "}
                <Box component="strong" sx={{ color: "text.primary" }}>
                  {val as string}
                </Box>
              </Box>
            )}
            onChange={(e) => setSelectedStatus(e.target.value as string)}
            sx={{ minWidth: 160, height: 40, borderRadius: 2 }}
          >
            {STATUS_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 14 }}>
                {s}
              </MenuItem>
            ))}
          </Select>

          <Select
            value={selectedRole}
            renderValue={(val) => (
              <Box
                component="span"
                sx={{ color: "text.secondary", fontSize: 14 }}
              >
                Role :{" "}
                <Box component="strong" sx={{ color: "text.primary" }}>
                  {val as string}
                </Box>
              </Box>
            )}
            onChange={(e) => setSelectedRole(e.target.value as string)}
            sx={{ minWidth: 140, height: 40, borderRadius: 2 }}
          >
            {ROLE_OPTIONS.map((s) => (
              <MenuItem key={s} value={s} sx={{ fontSize: 14 }}>
                {s}
              </MenuItem>
            ))}
          </Select>
        </Stack>
      </Stack>

      <CustomTable
        columns={columns}
        data={INITIAL_EMPLOYEES}
        emptyMessage="No employees found matching your criteria."
        itemsPerPage={10}
        currentPage={1}
        totalPages={1}
      />
    </Box>
  );
}
