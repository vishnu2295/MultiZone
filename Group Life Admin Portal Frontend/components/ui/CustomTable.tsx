import React from "react";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Stack,
  IconButton,
  Button,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import TableLoader from "./TableLoader";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T) => React.ReactNode;
  width?: string | number;
}

export interface CustomTableProps<T> {
  columns: Column<T>[];
  data: T[];
  emptyMessage?: string;
  colSpanCount?: number;
  itemsPerPage?: number;
  loading?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  totalData?: number;
}

export function CustomTable<T>({
  columns,
  data,
  emptyMessage = "No results found matching the selected filters.",
  colSpanCount = 10,
  itemsPerPage,
  loading,
  currentPage = 0,
  setCurrentPage,
  totalPages = 1,
  totalData = 0,
}: CustomTableProps<T>) {
  // Make sure active page is within bounds when data changes (e.g. from search)
  const activePage = itemsPerPage ? Math.min(currentPage, totalPages) : 1;
  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, boxShadow: "none" }}
      >
        <Table sx={{ minWidth: 650, width: "100%", tableLayout: "auto" }}>
          <TableHead>
            <TableRow
              sx={{
                bgcolor: (theme) =>
                  theme.palette.mode === "dark"
                    ? "dark.tableHeaderBg"
                    : "light.tableHeaderBg",
              }}
            >
              {columns.map((col, index) => (
                <TableCell
                  key={index}
                  sx={{
                    fontWeight: 500,
                    fontSize: "14px",
                    color: "text.primary",
                    ...(col.width ? { width: col.width } : {}),
                  }}
                >
                  {col.header}
                </TableCell>
              ))}
            </TableRow>
          </TableHead>

          {loading ? (
            <TableBody>
              <TableLoader colSpanCount={colSpanCount} />
            </TableBody>
          ) : (
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    hover
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                    }}
                  >
                    {columns.map((col, colIndex) => (
                      <TableCell
                        key={colIndex}
                        sx={{
                          fontSize: 14,
                          color: "text.primary",
                          position: "relative",
                          "&::after":
                            colIndex !== columns.length - 1
                              ? {
                                  content: '""',
                                  position: "absolute",
                                  right: 0,
                                  top: "50%",
                                  transform: "translateY(-50%)",
                                  height: "24px",
                                  width: "1px",
                                  bgcolor: "divider",
                                }
                              : undefined,
                        }}
                      >
                        {col.cell
                          ? col.cell(row)
                          : col.accessorKey &&
                              row[col.accessorKey] !== undefined
                            ? String(row[col.accessorKey])
                            : null}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={colSpanCount}
                    align="center"
                    sx={{ py: 12 }}
                  >
                    <Typography variant="body2" color="text.secondary">
                      {emptyMessage}
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          )}
        </Table>
      </TableContainer>

      {/* Pagination Controls */}
      {itemsPerPage && data.length > 0 && (
        <Stack
          direction={{ xs: "column", sm: "row" }}
          sx={{
            justifyContent: "space-between",
            gap: 2,
            alignItems: { sm: "center" },
            mt: 3,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {(activePage - 1) * itemsPerPage + 1} to{" "}
            {Math.min(activePage * itemsPerPage, totalData)} of {totalData}{" "}
            results
          </Typography>

          {totalPages > 1 && setCurrentPage && (
            <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
              <IconButton
                size="small"
                disabled={activePage === 1}
                onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                sx={{ border: 1, borderColor: "divider", borderRadius: 1.5 }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <Button
                    key={page}
                    variant={page === activePage ? "contained" : "outlined"}
                    size="small"
                    onClick={() => setCurrentPage(page)}
                    sx={{
                      minWidth: 36,
                      height: 36,
                      p: 0,
                      fontWeight: page === activePage ? 800 : 600,
                      borderRadius: 1.5,
                      fontSize: 13,
                    }}
                  >
                    {page}
                  </Button>
                )
              )}

              <IconButton
                size="small"
                disabled={activePage === totalPages}
                onClick={() =>
                  setCurrentPage(Math.min(totalPages, activePage + 1))
                }
                sx={{ border: 1, borderColor: "divider", borderRadius: 1.5 }}
              >
                <ChevronRight fontSize="small" />
              </IconButton>
            </Stack>
          )}
        </Stack>
      )}
    </>
  );
}
