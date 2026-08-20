import { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { StatusChip } from "@/components/ui/StatusChip";
import { NorthEast } from "@mui/icons-material";

const ITEMS_PER_PAGE = 6;

const MOCK_DATA = [
  {
    id: "1",
    companyName: "Mediterian Logistcs",
    policyNo: "3843-43434-343333",
    employeeName: "Thabo Sipho Nkosi",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,125",
    phone: "+27 838-323-3232",
    email: "darlene@rma.co.za",
    status: "Active",
  },
  {
    id: "2",
    companyName: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    employeeName: "John doe",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,250",
    phone: "+27 838-323-3232",
    email: "Jacob@rma.co.za",
    status: "Active",
  },
  {
    id: "3",
    companyName: "DuraTech Mining",
    policyNo: "3843-43434-343333",
    employeeName: "John Williamsion",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,375",
    phone: "+27 838-323-3232",
    email: "Cameron@rma.co.za",
    status: "Active",
  },
  {
    id: "4",
    companyName: "Gold Fields",
    policyNo: "3843-43434-343333",
    employeeName: "Cane Cone",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,500",
    phone: "+27 838-323-3232",
    email: "Eleanor@rma.co.za",
    status: "Active",
  },
  {
    id: "5",
    companyName: "Sibanye-Stillwater",
    policyNo: "3843-43434-343333",
    employeeName: "Moto Sibanye",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,625",
    phone: "+27 838-323-3232",
    email: "Ralph@rma.co.za",
    status: "Removed",
  },
  {
    id: "6",
    companyName: "Exxaro Resources",
    policyNo: "3843-43434-343333",
    employeeName: "Exxaro David",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,750",
    phone: "+27 838-323-3232",
    email: "Wade@rma.co.za",
    status: "Active",
  },
  {
    id: "7",
    companyName: "Seriti Resources",
    policyNo: "3843-43434-343333",
    employeeName: "Seriti Ross",
    employeeId: "8804155032082",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,875",
    phone: "+27 838-323-3232",
    email: "John@rma.co.za",
    status: "Active",
  },
];

export default function EmployeePoliciesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleViewClick = (id: string) => {
    router.push(
      `/policyLifecycle/overview/employee?from=policyAdministration&employeeId=${id}`
    );
  };

  const columns: Column<any>[] = [
    {
      header: "Company & Policy No",
      cell: (row) => (
        <Box>
          <Box
            component="strong"
            sx={{ display: "block", color: "text.primary" }}
          >
            {row.companyName}
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {row.policyNo}
          </Box>
        </Box>
      ),
    },
    {
      header: "Name and ID no",
      cell: (row) => (
        <Box>
          <Box
            component="strong"
            sx={{ display: "block", color: "text.primary" }}
          >
            {row.employeeName}
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {row.employeeId}
          </Box>
        </Box>
      ),
    },
    { header: "Brokerage", accessorKey: "brokerage" },
    { header: "Total Premium Billed", accessorKey: "premiumBilled" },
    { header: "Phone Number", accessorKey: "phone" },
    { header: "Email", accessorKey: "email" },
    {
      header: "Status",
      cell: (row) => <StatusChip status={row.status} />,
    },
    {
      header: "Actions",
      cell: (row) => (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          endIcon={<NorthEast fontSize="small" />}
          onClick={() => handleViewClick(row.id)}
          sx={{
            borderColor: "divider",
            textTransform: "none",
            color: "text.primary",
            borderRadius: 1.5,
            px: 2,
            height: 32,
          }}
        >
          View Details
        </Button>
      ),
    },
  ];

  return (
    <Paper
      variant="outlined"
      sx={{
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        gap: 3,
        p: { xs: 2.5, lg: 3 },
        boxShadow: " 0px 4px 12.2px 0px #C4C4C440",
        border: "none",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 2,
        }}
      >
        <SearchInput
          value={searchQuery}
          onChange={setSearchQuery}
          placeholder="company name, policy number, or registration number."
          sx={{ width: 440, maxWidth: "100%" }}
        />
        <Select
          value={selectedStatus}
          onChange={setSelectedStatus}
          options={[
            { label: "All", value: "" },
            { label: "Active", value: "Active" },
            { label: "Removed", value: "Removed" },
          ]}
          renderValue={(val) => (
            <Box
              component="span"
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Status :{" "}
              <Box component="strong" sx={{ color: "text.primary" }}>
                {val || "All"}
              </Box>
            </Box>
          )}
          sx={{ minWidth: 160 }}
        />
      </Box>

      <CustomTable
        columns={columns}
        data={MOCK_DATA}
        currentPage={currentPage}
        setCurrentPage={setCurrentPage}
        totalPages={2}
        totalData={10}
        itemsPerPage={ITEMS_PER_PAGE}
      />
    </Paper>
  );
}
