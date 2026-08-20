import { Box } from "@mui/material";
import EmployeeValidationStep from "../reviewAndOnboard/employeeValidationStep";

export default function EmployeeValidationTab({
  employees,
}: {
  employees: any[];
}) {
  return (
    <Box sx={{ pt: 2 }}>
      <EmployeeValidationStep employees={employees} embedded />
    </Box>
  );
}
