"use client";

import React, { useState, useMemo, memo } from "react";
import { useThemeToggle } from "@/app/providers";
import { IconButton, MenuItem, Box } from "@mui/material";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import DateInput from "@/components/ui/DateInput";
import CustomTable, {
  CustomTableRow,
  CustomTableCell,
} from "@/components/ui/CustomTable";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import {
  EMPLOYMENT_STATUS_OPTIONS,
  GENDER_OPTIONS,
  ID_TYPE_OPTIONS,
} from "@/lib/enums";

const formatDate = (date?: string) => {
  if (!date) return "";
  const d = new Date(date);
  return isNaN(d.getTime()) ? date : d.toISOString().split("T")[0];
};

const dateInputStyle = {
  backgroundColor: "transparent",
  border: "1px solid var(--border)",
  borderRadius: "4px",
  boxSizing: "border-box",
  color: "var(--text-primary)",
  fontFamily: "Inter, sans-serif",
  fontSize: "14px",
  fontWeight: 400,
  height: "36px",
  padding: "0 8px",
  width: "100%",
} as const;

const defaultCellTextSx = { color: "var(--text-primary)" };

const TABLE_HEADERS = [
  "Record Id",
  "Name",
  "Gender",
  "DOB",
  "Age",
  "Email",
  "Cell No.",
  "Employment Start Date",
  "IDType",
  "SA ID",
  "Passport No.",
  "Passport expiry",
  "Salary Amount",
  "Nationality",
  "Employment Status",
];

export interface EmployeeRow {
  id: string;
  employeeRecordId?: string;
  name: string;
  gender: string;
  dob: string;
  age?: number;
  email: string;
  cellNumber: string;
  startDate: string;
  idType: string;
  identification: string;
  passportNumber?: string;
  passportExpiry?: string;
  salary: string;
  nationality: string;
  status: string;
}

interface EmployeeListTableProps {
  employees: EmployeeRow[];
  onRemove: (id: string) => void;
  onEdit?: (id: string, data: Omit<EmployeeRow, "id">) => void;
}

interface EditableCellProps {
  className?: string;
  isEditing: boolean;
  value: React.ReactNode;
  editValue?: any;
  onChange?: (val: any) => void;
  type?: "text" | "number" | "date" | "select";
  options?: { label: string; value: string }[];
  inputSx?: any;
  autoFocus?: boolean;
  disabled?: boolean;
  textColor?: string;
}

function EditableCell({
  className,
  isEditing,
  value,
  editValue,
  onChange,
  type = "text",
  options,
  inputSx,
  autoFocus,
  disabled,
  textColor,
}: EditableCellProps) {
  const boxSx = textColor ? { color: textColor } : defaultCellTextSx;

  const renderInput = () => {
    if (disabled) return "—";

    switch (type) {
      case "select":
        return (
          <CustomSelect
            value={editValue || ""}
            onChange={(e: any) => onChange?.(e.target.value)}
            sx={inputSx}
          >
            {options?.map((opt) => (
              <MenuItem key={opt.value} value={opt.value}>
                {opt.label}
              </MenuItem>
            ))}
          </CustomSelect>
        );
      case "date":
        return (
          <DateInput
            value={formatDate(editValue)}
            onChange={(v) => onChange?.(v)}
            inputStyle={dateInputStyle}
          />
        );
      default:
        return (
          <CustomInput
            type={type}
            value={editValue || ""}
            onChange={(e) => onChange?.(e.target.value)}
            sx={inputSx}
            autoFocus={autoFocus}
          />
        );
    }
  };

  return (
    <CustomTableCell className={className}>
      <Box sx={boxSx}>{isEditing ? renderInput() : value}</Box>
    </CustomTableCell>
  );
}

interface ActionCellProps {
  isEditing: boolean;
  onSave: () => void;
  onCancel: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

function ActionCell({
  isEditing,
  onSave,
  onCancel,
  onEdit,
  onDelete,
}: ActionCellProps) {
  const actions = isEditing
    ? [
        {
          label: "Save",
          onClick: onSave,
          icon: <CheckIcon fontSize="small" />,
          color: "var(--success)",
        },
        {
          label: "Cancel",
          onClick: onCancel,
          icon: <CloseIcon fontSize="small" />,
          color: "var(--text-secondary)",
        },
      ]
    : [
        {
          label: "Edit",
          onClick: onEdit,
          icon: <EditIcon fontSize="small" />,
          color: "var(--primary)",
        },
        {
          label: "Delete",
          onClick: onDelete,
          icon: <DeleteIcon fontSize="small" />,
          color: "var(--destructive)",
        },
      ];

  return (
    <CustomTableCell
      className="text-right"
      sx={{
        position: "sticky",
        right: 0,
        background: "inherit",
        zIndex: 1,
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-end",
          gap: "8px",
        }}
      >
        {actions.map(({ label, onClick, icon, color }) => (
          <IconButton
            key={label}
            onClick={onClick}
            title={label}
            size="small"
            sx={{
              color,
              borderRadius: "4px",
            }}
          >
            {icon}
          </IconButton>
        ))}
      </Box>
    </CustomTableCell>
  );
}

interface EmployeeRowComponentProps {
  emp: EmployeeRow;
  isEditing: boolean;
  editForm?: Partial<EmployeeRow>;
  setEditForm: React.Dispatch<React.SetStateAction<Partial<EmployeeRow>>>;
  onRemove: (id: string) => void;
  onEdit?: (id: string, data: Omit<EmployeeRow, "id">) => void;
  setEditingId: (id: string | null) => void;
  inputSx: any;
}

function calculateAge(dob: string) {
  const birthDate = new Date(dob);
  const today = new Date();

  let age = today.getFullYear() - birthDate.getFullYear();

  const monthDifference = today.getMonth() - birthDate.getMonth();

  if (
    monthDifference < 0 ||
    (monthDifference === 0 && today.getDate() < birthDate.getDate())
  ) {
    age--;
  }

  return age;
}

const MemoizedEmployeeRow = memo(function MemoizedEmployeeRow({
  emp,
  isEditing,
  editForm = {},
  setEditForm,
  onRemove,
  onEdit,
  setEditingId,
  inputSx,
}: EmployeeRowComponentProps) {
  const isEmpPassport = emp.idType === "Passport";
  const isEditPassport = editForm.idType === "Passport";

  const handleSave = () => {
    if (!onEdit || !editForm.name?.trim()) {
      setEditingId(null);
      return;
    }

    const isPassport = editForm.idType === "Passport";

    const { id: _id, ...restEmp } = emp;

    let newAge = editForm.age ?? restEmp.age;

    if (editForm.dob) {
      newAge = calculateAge(editForm.dob);
    }

    const updatedEmployee: Omit<EmployeeRow, "id"> = {
      ...restEmp,
      ...editForm,
      age: newAge,
      name: editForm.name.trim(),
      identification: isPassport ? "" : editForm.identification || "",
      passportNumber: isPassport ? editForm.passportNumber || "" : "",
      passportExpiry: isPassport ? editForm.passportExpiry || "" : "",
      salary: editForm.salary || "0",
    };

    onEdit(emp.id, updatedEmployee);
    setEditingId(null);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleSave();
    }

    if (e.key === "Escape") {
      setEditingId(null);
    }
  };

  const handleEditClick = () => {
    setEditingId(emp.id);
    setEditForm({ ...emp });
  };

  const updateField = (field: keyof EmployeeRow) => (value: unknown) => {
    setEditForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const cells = [
    {
      className: "min-w-[120px]",
      value: emp.employeeRecordId || "—",
      editValue: editForm.employeeRecordId,
      field: "employeeRecordId",
    },
    {
      className: "min-w-[180px]",
      value: emp.name,
      editValue: editForm.name,
      field: "name",
      textColor: "var(--text-primary)",
      autoFocus: true,
    },
    {
      className: "min-w-[140px]",
      value: emp.gender || "—",
      editValue: editForm.gender,
      field: "gender",
      type: "select",
      options: GENDER_OPTIONS.map((option) => ({
        label: option,
        value: option,
      })),
    },
    {
      className: "min-w-[140px]",
      value: emp.dob || "—",
      editValue: editForm.dob,
      field: "dob",
      type: "date",
    },
    {
      className: "min-w-[80px]",
      value: emp.age || "—",
      editValue: editForm.age,
      field: "age",
      type: "number",
      disabled: true,
    },
    {
      className: "min-w-[240px]",
      value: emp.email || "—",
      editValue: editForm.email,
      field: "email",
    },
    {
      className: "min-w-[120px]",
      value: emp.cellNumber || "—",
      editValue: editForm.cellNumber,
      field: "cellNumber",
    },
    {
      className: "min-w-[160px]",
      value: emp.startDate || "—",
      editValue: editForm.startDate,
      field: "startDate",
      type: "date",
    },
    {
      className: "min-w-[180px]",
      value: emp.idType || "—",
      editValue: editForm.idType,
      field: "idType",
      type: "select",
      options: ID_TYPE_OPTIONS.map((option) => ({
        label: option,
        value: option,
      })),
    },
    {
      className: "min-w-[140px]",
      value: !isEmpPassport ? emp.identification || "—" : "—",
      editValue: editForm.identification,
      field: "identification",
      disabled: isEditPassport,
    },
    {
      className: "min-w-[140px]",
      value: isEmpPassport
        ? emp.identification || emp.passportNumber || "—"
        : "—",
      editValue: editForm.passportNumber,
      field: "passportNumber",
      disabled: !isEditPassport,
    },
    {
      className: "min-w-[140px]",
      value: isEmpPassport ? emp.passportExpiry || "—" : "—",
      editValue: editForm.passportExpiry,
      field: "passportExpiry",
      type: "date",
      disabled: !isEditPassport,
    },
    {
      className: "min-w-[120px]",
      value: emp.salary || "—",
      editValue: editForm.salary,
      field: "salary",
      type: "number",
    },
    {
      className: "min-w-[140px]",
      value: emp.nationality || "—",
      editValue: editForm.nationality,
      field: "nationality",
    },
    {
      className: "min-w-[140px]",
      value: emp.status || "—",
      editValue: editForm.status,
      field: "status",
      type: "select",
      options: EMPLOYMENT_STATUS_OPTIONS.map((option) => ({
        label: option,
        value: option,
      })),
    },
  ] as const;

  return (
    <CustomTableRow
      sx={{ bgcolor: "var(--card-secondary)" }}
      onKeyDown={handleKeyDown}
    >
      {cells.map((cell: any) => (
        <EditableCell
          key={cell.field}
          className={cell.className}
          isEditing={isEditing}
          value={cell.value as React.ReactNode}
          editValue={cell.editValue}
          onChange={
            cell.disabled
              ? undefined
              : updateField(cell.field as keyof EmployeeRow)
          }
          type={cell.type as any}
          options={cell.options}
          disabled={cell.disabled}
          inputSx={inputSx}
          textColor={cell.textColor}
          autoFocus={cell.autoFocus}
        />
      ))}

      <ActionCell
        isEditing={isEditing}
        onSave={handleSave}
        onCancel={() => setEditingId(null)}
        onEdit={handleEditClick}
        onDelete={() => onRemove(emp.id)}
      />
    </CustomTableRow>
  );
});

export default function EmployeeListTable({
  employees,
  onRemove,
  onEdit,
}: EmployeeListTableProps) {
  const { isDarkMode } = useThemeToggle();
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<Partial<EmployeeRow>>({});

  const inputSx = useMemo(
    () => ({
      width: "100%",
      background: "var(--card-secondary)",
      color: "var(--text-primary)",
      fontSize: "14px",
      height: "36px",
      border: "1px solid var(--border)",
      borderRadius: "4px",
      padding: "0 8px",
      "& .MuiSvgIcon-root": {
        color: "var(--text-primary)",
      },
      "& input": {
        colorScheme: isDarkMode ? "dark" : "light",
      },
    }),
    [isDarkMode]
  );

  if (employees.length === 0) return null;

  return (
    <CustomTable
      data={employees}
      headers={TABLE_HEADERS}
      hasActions
      renderRow={(emp) => (
        <MemoizedEmployeeRow
          key={emp.id}
          emp={emp}
          isEditing={editingId === emp.id}
          editForm={editingId === emp.id ? editForm : undefined}
          setEditForm={setEditForm}
          onRemove={onRemove}
          onEdit={onEdit}
          setEditingId={setEditingId}
          inputSx={inputSx}
        />
      )}
    />
  );
}
