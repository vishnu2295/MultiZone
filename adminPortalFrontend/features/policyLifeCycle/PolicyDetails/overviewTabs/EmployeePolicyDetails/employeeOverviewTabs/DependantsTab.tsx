import { Column, CustomTable } from "@/components/ui/CustomTable";
import { Box, Button } from "@mui/material";

export interface Dependant {
  id: string;
  name: string;
  idNumber: string;
  relationship: string;
  beneficiarySplit: string;
  dateOfBirth: string;
  age: string;
}

const MOCK_DEPENDANTS: Dependant[] = [
  {
    id: "1",
    name: "Thabo Sipho Nkosi",
    idNumber: "8804155032082",
    relationship: "Spouse",
    beneficiarySplit: "50%",
    dateOfBirth: "12-03-1980",
    age: "45",
  },
  {
    id: "2",
    name: "John doe",
    idNumber: "8804155032082",
    relationship: "Child",
    beneficiarySplit: "25%",
    dateOfBirth: "04-03-2011",
    age: "16",
  },
  {
    id: "3",
    name: "John Williamsion",
    idNumber: "8804155032082",
    relationship: "Child",
    beneficiarySplit: "25%",
    dateOfBirth: "09-07-2014",
    age: "13",
  },
];

export default function DependantsTab() {
  const columns: Column<Dependant>[] = [
    {
      header: "Name and ID no",
      cell: (row) => (
        <Box>
          <Box
            component="strong"
            sx={{ display: "block", color: "text.primary" }}
          >
            {row.name}
          </Box>
          <Box sx={{ color: "text.secondary", fontSize: 13 }}>
            {row.idNumber}
          </Box>
        </Box>
      ),
    },
    {
      header: "Relationship",
      accessorKey: "relationship",
    },
    {
      header: "Beneficiary Split",
      accessorKey: "beneficiarySplit",
    },
    {
      header: "Date of Birth",
      accessorKey: "dateOfBirth",
    },
    {
      header: "Age",
      accessorKey: "age",
    },
    {
      header: "",
      cell: (row) => (
        <Button
          variant="outlined"
          color="inherit"
          size="small"
          sx={{
            borderColor: "divider",
            textTransform: "none",
            color: "text.primary",
            borderRadius: 1.5,
            px: 2,
            height: 32,
          }}
        >
          Edit Details
        </Button>
      ),
    },
  ];

  return (
    <Box>
      <CustomTable
        columns={columns}
        data={MOCK_DEPENDANTS}
        emptyMessage="No dependants found."
        colSpanCount={6}
      />
    </Box>
  );
}
