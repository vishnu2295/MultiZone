"use client";

import { useState, useEffect, useCallback } from "react";
import {
  Drawer,
  Box,
  Typography,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Checkbox,
  TextField,
  CircularProgress,
  Stack,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { FormField } from "../../../components/ui/FormField";
import CustomInput from "../../../components/ui/CustomInput";
import { CustomButton } from "../../../components/ui/CustomButton";
import axios from "axios";
import useToken from "@/hooks/useToken";
import { Role, RolePermission } from "./RolesMatrix";

// ── Types ─────────────────────────────────────────────────────────────────────

interface ModulePermission {
  view: boolean;
  create: boolean;
  update: boolean;
  delete: boolean;
  approve: boolean;
  reject: boolean;
  fullControl: boolean;
}

interface AddNewRoleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  role?: Role | null;
  moduleList: { id: string; name: string }[];
  onSuccess?: () => void;
}

// ── Permission keys in column order ───────────────────────────────────────────
const PERMISSION_KEYS: (keyof ModulePermission)[] = [
  "view",
  "create",
  "update",
  "delete",
  "approve",
  "reject",
  "fullControl",
];

const COLUMN_LABELS: Record<keyof ModulePermission, string> = {
  view: "View",
  create: "Create",
  update: "Update",
  delete: "Delete",
  approve: "Approve",
  reject: "Reject",
  fullControl: "Full Control",
};

// ── Helpers ───────────────────────────────────────────────────────────────────

const buildDefaultPermissions = (
  modules: { id: string }[]
): Record<string, ModulePermission> =>
  Object.fromEntries(
    modules.map((m) => [
      m.id,
      {
        view: false,
        create: false,
        update: false,
        delete: false,
        approve: false,
        reject: false,
        fullControl: false,
      },
    ])
  );

/**
 * Merge existing API permissions on top of the blank defaults.
 * The API returns permissions as: { module: { id, name }, canView, ... }
 */
const mergePermissions = (
  defaults: Record<string, ModulePermission>,
  existing: RolePermission[]
): Record<string, ModulePermission> => {
  const merged = { ...defaults };
  for (const p of existing) {
    const moduleId = p.module?.id;
    if (!moduleId) continue;
    merged[moduleId] = {
      view: p.view,
      create: p.create,
      update: p.update,
      delete: p.delete,
      approve: p.approve,
      reject: p.reject,
      fullControl: p.fullControl,
    };
  }
  return merged;
};

// ── Shared cell sx ────────────────────────────────────────────────────────────
const dividerCellSx = {
  position: "relative" as const,
  "&::before": {
    content: '""',
    position: "absolute",
    left: 0,
    top: "50%",
    transform: "translateY(-50%)",
    height: "24px",
    width: "1px",
    bgcolor: "#E2E8F0",
  },
  py: 1,
  px: 2,
  whiteSpace: "nowrap",
};

// ─────────────────────────────────────────────────────────────────────────────

export default function AddNewRoleDrawer({
  isOpen,
  onClose,
  mode = "add",
  role,
  moduleList,
  onSuccess,
}: AddNewRoleDrawerProps) {
  const accessToken: any = useToken();

  // ── Form state ───────────────────────────────────────────────────────────────
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [permissions, setPermissions] = useState<
    Record<string, ModulePermission>
  >({});
  const [errors, setErrors] = useState<{ name?: string }>({});
  const [submitting, setSubmitting] = useState(false);

  // ── Re-initialise state when the drawer opens ───────────────────────────────
  useEffect(() => {
    if (!isOpen) return;

    setName(role?.name ?? "");
    setDescription(role?.description ?? "");
    setErrors({});

    const defaults = buildDefaultPermissions(moduleList);

    if (mode === "edit" && role?.permissions && role.permissions.length > 0) {
      // Permissions already come with the list response — use them directly
      setPermissions(mergePermissions(defaults, role.permissions));
    } else {
      // Add mode (or role has no permissions yet) — start all unchecked
      setPermissions(defaults);
    }
  }, [isOpen, role, moduleList, mode]);

  // ── Checkbox toggle ──────────────────────────────────────────────────────────
  const handlePermissionChange = useCallback(
    (moduleId: string, key: keyof ModulePermission, checked: boolean) => {
      setPermissions((prev) => ({
        ...prev,
        [moduleId]: { ...prev[moduleId], [key]: checked },
      }));
    },
    []
  );

  // ── Validation ───────────────────────────────────────────────────────────────
  const validate = () => {
    const e: { name?: string } = {};
    if (!name.trim()) e.name = "Role name is required";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  // ── Submit (POST for add, PATCH for edit) ────────────────────────────────────
  const handleSave = async () => {
    if (!validate()) return;

    const payload = {
      name: name.trim(),
      description: description.trim(),
      permissions: moduleList.map((m) => ({
        moduleId: m.id,
        view: permissions[m.id]?.view ?? false,
        create: permissions[m.id]?.create ?? false,
        update: permissions[m.id]?.update ?? false,
        delete: permissions[m.id]?.delete ?? false,
        approve: permissions[m.id]?.approve ?? false,
        reject: permissions[m.id]?.reject ?? false,
        fullControl: permissions[m.id]?.fullControl ?? false,
      })),
    };

    const headers = {
      Authorization: `Bearer ${accessToken?.accessToken}`,
      "Content-Type": "application/json",
    };

    try {
      setSubmitting(true);

      if (mode === "edit" && role?.id) {
        // ── Update existing role ──
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/roles/${role.id}`;
        await axios.patch(url, payload, { headers });
      } else {
        // ── Create new role ──
        const url = `${process.env.NEXT_PUBLIC_API_URL}/admin/roles`;
        await axios.post(url, payload, { headers });
      }

      onClose();
      onSuccess?.();
    } catch (error: any) {
      console.error(
        `Error ${mode === "edit" ? "updating" : "creating"} role:`,
        error
      );
    } finally {
      setSubmitting(false);
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────────
  return (
    <Drawer
      anchor="right"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          maxWidth: 800,
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      {/* ── Header ── */}
      <Box
        sx={{
          p: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: "1px solid #E2E8F0",
          flexShrink: 0,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 700, fontSize: "18px" }}>
          {mode === "edit" ? "Edit Role" : "Add New Role"}
        </Typography>
        <IconButton
          onClick={onClose}
          size="small"
          sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}
        >
          <Close fontSize="small" />
        </IconButton>
      </Box>

      {/* ── Body ── */}
      <Box sx={{ p: 3, flex: 1, overflowY: "auto" }}>
        <Stack spacing={3}>
          {/* Role Name */}
          <FormField label="Role Name" required>
            <CustomInput
              placeholder="Enter role name"
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errors.name) setErrors({});
              }}
              error={errors.name}
            />
          </FormField>

          {/* Role Description */}
          <FormField label="Role Description" required>
            <TextField
              multiline
              rows={4}
              placeholder="Enter role description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              fullWidth
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "6px",
                  bgcolor: "background.paper",
                  fontSize: "14px",
                  "& fieldset": { borderColor: "#D9D9D9" },
                },
              }}
            />
          </FormField>

          {/* Permissions Matrix */}
          <Box>
            <Typography variant="subtitle2" sx={{ fontWeight: 700, mb: 2 }}>
              Functional Permissions Matrix
            </Typography>

            <TableContainer
              sx={{ border: "1px solid #E2E8F0", borderRadius: 2 }}
            >
              <Table size="small" sx={{ minWidth: 850 }}>
                {/* ── Header ── */}
                <TableHead sx={{ bgcolor: "light.tableHeaderBg" }}>
                  <TableRow>
                    <TableCell
                      sx={{
                        fontWeight: 600,
                        color: "text.primary",
                        borderBottom: "1px solid #E2E8F0",
                        whiteSpace: "nowrap",
                        width: 180,
                      }}
                    >
                      Module
                    </TableCell>

                    {PERMISSION_KEYS.map((key) => (
                      <TableCell
                        key={key}
                        align="center"
                        sx={{
                          fontWeight: 600,
                          color: "text.primary",
                          borderBottom: "1px solid #E2E8F0",
                          position: "relative",
                          whiteSpace: "nowrap",
                          paddingX: 2,
                          ...(key === "fullControl" ? { width: 140 } : {}),
                          ...(key === "view" ? { width: 100 } : {}),
                          "&::before": {
                            content: '""',
                            position: "absolute",
                            left: 0,
                            top: "50%",
                            transform: "translateY(-50%)",
                            height: "16px",
                            width: "1px",
                            bgcolor: "#E2E8F0",
                          },
                        }}
                      >
                        {COLUMN_LABELS[key]}
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>

                {/* ── Body ── */}
                <TableBody>
                  {moduleList.map((mod) => (
                    <TableRow
                      key={mod.id}
                      sx={{
                        "&:last-child td, &:last-child th": {
                          borderBottom: 0,
                        },
                      }}
                    >
                      {/* Module name */}
                      <TableCell
                        component="th"
                        scope="row"
                        sx={{
                          color: "text.primary",
                          py: 1.5,
                          borderBottom: "1px solid #E2E8F0",
                          borderLeft: "1px solid #E2E8F0",
                          fontSize: "14px",
                          whiteSpace: "nowrap",
                          width: 180,
                        }}
                      >
                        {mod.name}
                      </TableCell>

                      {/* One cell per permission key */}
                      {PERMISSION_KEYS.map((key) => (
                        <TableCell
                          key={key}
                          align="center"
                          sx={{ ...dividerCellSx }}
                        >
                          <Checkbox
                            size="small"
                            sx={{
                              color: "#E2E8F0",
                              "&.Mui-checked": { color: "#00B4D8" },
                            }}
                            checked={permissions[mod.id]?.[key] ?? false}
                            onChange={(e) =>
                              handlePermissionChange(
                                mod.id,
                                key,
                                e.target.checked
                              )
                            }
                          />
                        </TableCell>
                      ))}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>
        </Stack>
      </Box>

      {/* ── Footer ── */}
      <Box
        sx={{
          p: 3,
          borderTop: "1px solid #E2E8F0",
          display: "flex",
          justifyContent: "flex-end",
          gap: 2,
          flexShrink: 0,
        }}
      >
        <CustomButton
          variantType="secondary"
          onClick={onClose}
          sx={{
            border: "none",
            color: "text.secondary",
            fontWeight: 600,
            "&:hover": { bgcolor: "transparent", color: "text.primary" },
          }}
        >
          Cancel
        </CustomButton>

        <CustomButton onClick={handleSave} disabled={submitting}>
          {submitting ? (
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <CircularProgress size={14} color="inherit" />
              <span>Saving…</span>
            </Box>
          ) : mode === "edit" ? (
            "Save Changes"
          ) : (
            "Save Details"
          )}
        </CustomButton>
      </Box>
    </Drawer>
  );
}
