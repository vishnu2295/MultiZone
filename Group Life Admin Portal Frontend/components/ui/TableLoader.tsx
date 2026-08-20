import { TableCell, TableRow } from "@mui/material";
import Loader from "./Loader";

const TableLoader = ({ colSpanCount }: { colSpanCount: number }) => {
  return (
    <TableRow>
      <TableCell colSpan={colSpanCount} align="center" sx={{ py: 12 }}>
        <Loader />
      </TableCell>
    </TableRow>
  );
};
export default TableLoader;
