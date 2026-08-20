import { Box } from "@mui/material";
import EmployerQuoteDetailsStep, {
  Employer,
} from "../reviewAndOnboard/employerQuoteDetailsStep";

export default function OverviewTab({ employer }: { employer: Employer }) {
  return (
    <Box sx={{ pt: 2 }}>
      <EmployerQuoteDetailsStep employer={employer} embedded />
    </Box>
  );
}
