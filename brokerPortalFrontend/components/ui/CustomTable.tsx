import React from "react";
import {
  Box,
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
  CircularProgress,
} from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";

export interface Column<T> {
  header: string;
  accessorKey?: keyof T;
  cell?: (row: T, index: number) => React.ReactNode;
  width?: string | number;
}

export interface CustomTableProps<T> {
  columns?: Column<T>[];
  data: T[];
  emptyMessage?: string;
  colSpanCount?: number;
  itemsPerPage?: number;
  loading?: boolean;
  currentPage?: number;
  setCurrentPage?: (page: number) => void;
  totalPages?: number;
  totalData?: number;
  // Legacy props to support existing code
  headers?: string[];
  renderRow?: (row: T, index: number) => React.ReactNode;
  hasActions?: boolean;
}

export default function CustomTable<T>({
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
  headers,
  renderRow,
  hasActions = false,
}: CustomTableProps<T>) {
  const activePage = Math.max(1, Math.min(currentPage, totalPages));
  const start = itemsPerPage ? (activePage - 1) * itemsPerPage + 1 : 1;
  const end = itemsPerPage ? Math.min(activePage * itemsPerPage, totalData) : totalData;
  const tableHeaders = React.useMemo(
    () => (columns ? columns.map((c) => c.header) : headers || []),
    [columns, headers]
  );

  return (
    <>
      <TableContainer
        component={Paper}
        variant="outlined"
        sx={{ borderRadius: 2, boxShadow: "none", overflowX: "auto", background: "transparent", border: "none" }}
      >
        <Table
          sx={{
            overflowX: "auto",
            width: "max-content",
            minWidth: "100%",
          }}
        >
          <TableHead>
            <TableRow sx={{ bgcolor: "var(--table-header-bg)" }}>
              {tableHeaders.map((header, index) => {
                const column = columns?.[index];
                return (
                  <TableCell
                    key={index}
                    sx={{
                      fontWeight: "bold",
                      fontSize: "14px",
                      color: "var(--text-primary)",
                      whiteSpace: "nowrap",
                      width: column?.width,
                    }}
                  >
                    {header}
                  </TableCell>
                );
              })}
              {hasActions && (
                <TableCell
                  sx={{
                    color: "var(--text-primary)",
                    fontWeight: "bold",
                    whiteSpace: "nowrap",
                    position: "sticky",
                    right: 0,
                    background: "inherit",
                    zIndex: 2,
                  }}
                >
                  Actions
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          {loading ? (
            <TableBody>
              <TableRow>
                <TableCell colSpan={colSpanCount} align="center" sx={{ py: 12 }}>
                  <CircularProgress />
                </TableCell>
              </TableRow>
            </TableBody>
          ) : (
            <TableBody>
              {data && data.length > 0 ? (
                data.map((row, rowIndex) => {
                  if (renderRow) {
                    return renderRow(row, rowIndex);
                  }
                  if (columns) {
                    return (
                      <TableRow
                        key={rowIndex}
                        hover
                        sx={{
                          bgcolor: "var(--card-secondary)",
                          "&:last-child td, &:last-child th": { border: 0 },
                        }}
                      >
                        {columns.map((col, colIndex) => {
                          const value = col.accessorKey ? row[col.accessorKey as keyof T] : undefined;
                          return (
                            <TableCell
                              key={colIndex}
                              sx={{
                                fontSize: "14px",
                                color: "var(--text-primary)",
                                whiteSpace: "nowrap",
                                position: "relative",
                              }}
                            >
                              {col.cell
                                ? col.cell(row, rowIndex)
                                : value != null
                                  ? String(value)
                                  : null}
                            </TableCell>
                          );
                        })}
                      </TableRow>
                    );
                  }
                  return null;
                })
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={colSpanCount}
                    align="center"
                    sx={{ py: 12 }}
                  >
                    <Typography variant="body2" color="var(--text-secondary)">
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
          <Typography variant="body2" color="var(--text-secondary)">
            Showing {start} to {end} of {totalData} results
          </Typography>

          {totalPages > 1 && setCurrentPage && (
            <Stack direction="row" sx={{ gap: 0.5, alignItems: "center" }}>
              <IconButton
                size="small"
                disabled={activePage === 1}
                onClick={() => setCurrentPage(Math.max(1, activePage - 1))}
                sx={{ border: 1, borderColor: "var(--border)", borderRadius: 1.5, color: "var(--text-primary)" }}
              >
                <ChevronLeft fontSize="small" />
              </IconButton>

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
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
                    borderColor: "var(--border)",
                    color: page === activePage ? "#fff" : "var(--text-primary)",
                  }}
                >
                  {page}
                </Button>
              ))}

              <IconButton
                size="small"
                disabled={activePage === totalPages}
                onClick={() => setCurrentPage(Math.min(totalPages, activePage + 1))}
                sx={{ border: 1, borderColor: "var(--border)", borderRadius: 1.5, color: "var(--text-primary)" }}
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

// Re-export standard table components so consumers don't need to import from the UI folder directly if they build custom rows
export { TableRow as CustomTableRow, TableCell as CustomTableCell };
