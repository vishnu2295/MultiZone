import { useState } from "react";
import { Box, Button, Paper } from "@mui/material";
import { useRouter } from "next/navigation";
import { CustomTable, Column } from "@/components/ui/CustomTable";
import SearchInput from "@/components/ui/SearchInput";
import { Select } from "@/components/ui/Select";
import { StatusChip } from "@/components/ui/StatusChip";
import { NorthEast } from "@mui/icons-material";

const ITEMS_PER_PAGE = 5;

const MOCK_DATA = [
  {
    id: "1",
    companyName: "Mediterian Logistcs",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,125",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "darlene@rma.co.za",
    status: "Active",
  },
  {
    id: "2",
    companyName: "Stellenbosch Wineries Co-operative",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,250",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "Jacob@rma.co.za",
    status: "Cancelled",
  },
  {
    id: "3",
    companyName: "DuraTech Mining",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,375",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "Cameron@rma.co.za",
    status: "Grace Period",
  },
  {
    id: "4",
    companyName: "Gold Fields",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,500",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "Eleanor@rma.co.za",
    status: "Re-Instated",
  },
  {
    id: "5",
    companyName: "Sibanye-Stillwater",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,625",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "Ralph@rma.co.za",
    status: "Lapsed",
  },
  {
    id: "6",
    companyName: "Exxaro Resources",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,750",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "Wade@rma.co.za",
    status: "NTU",
  },
  {
    id: "7",
    companyName: "Seriti Resources",
    policyNo: "3843-43434-343333",
    brokerage: "Kenn Brokerage",
    premiumBilled: "R 5,875",
    employees: "2000",
    phone: "+27 838-323-3232",
    email: "John@rma.co.za",
    status: "Active",
  },
];

export default function EmployerPoliciesTab() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const router = useRouter();

  const handleViewClick = (id: string) => {
    router.push(`/policyLifecycle/overview?from=policyAdministration`);
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
    { header: "Brokerage", accessorKey: "brokerage" },
    { header: "Total Premium Billed", accessorKey: "premiumBilled" },
    { header: "Total Employees", accessorKey: "employees" },
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
          View
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
            { label: "Cancelled", value: "Cancelled" },
            { label: "Grace Period", value: "Grace Period" },
            { label: "Re-Instated", value: "Re-Instated" },
            { label: "Lapsed", value: "Lapsed" },
            { label: "NTU", value: "NTU" },
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
