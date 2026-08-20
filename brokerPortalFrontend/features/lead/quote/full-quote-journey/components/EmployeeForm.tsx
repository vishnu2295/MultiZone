import React from "react";
import Box from "@mui/material/Box";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import DateInput from "@/components/ui/DateInput";
import { FormField } from "@/components/ui/FormField";
import {
  EMPLOYMENT_STATUS_OPTIONS,
  GENDER_OPTIONS,
  ID_TYPE_OPTIONS,
} from "@/lib/enums";
import { validateEmail, validateSAMobileNumber, validateSAIDNumber } from "@/utils/validators";

export interface EmployeeFormData {
  employeeRecordId: string;
  firstName: string;
  surname: string;
  gender: string;
  dob: string;
  email: string;
  cellNumber: string;
  startDate: string;
  idType: string;
  identification: string;
  passportNumber: string;
  passportExpiry: string;
  salary: string;
  nationality: string;
  status: string;
}

interface EmployeeFormProps {
  form: EmployeeFormData;
  setForm: React.Dispatch<React.SetStateAction<EmployeeFormData>>;
  handleAddEmployee: () => void;
}



export default function EmployeeForm({
  form,
  setForm,
  handleAddEmployee,
}: EmployeeFormProps) {
  const updateField = (field: keyof EmployeeFormData, value: string) => {
    setForm((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  return (
    <>
      {/* Row 1: Employee Record ID, First Name, Last Name */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", mb: "12px" }}>
        <FormField label="Employee Record ID">
          <CustomInput type="text" placeholder="Enter record ID" value={form.employeeRecordId}
            onChange={(e: any) => updateField("employeeRecordId", e.target.value)}
          />
        </FormField>
        <FormField label="First Name *">
          <CustomInput type="text" placeholder="Enter first name" value={form.firstName}
            onChange={(e: any) => updateField("firstName", e.target.value)}
          />
        </FormField>
        <FormField label="Last Name *">
          <CustomInput type="text" placeholder="Enter last name" value={form.surname}
            onChange={(e: any) => updateField("surname", e.target.value)}
          />
        </FormField>
      </Box>

      {/* Row 2: Gender, Date of birth */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", mb: "12px" }}>
        <FormField label="Gender">
          <CustomSelect value={form.gender} onChange={(e: any) => updateField("gender", e.target.value)} placeholder="Select gender">
            <option value="">Select</option>
            {GENDER_OPTIONS.map((gOption) => (
              <option key={gOption} value={gOption}>{gOption}</option>
            ))}
          </CustomSelect>
        </FormField>
        <FormField label="Date of birth (dd/mm/yyyy)">
          <DateInput
            value={form.dob}
            onChange={(v: any) => updateField("dob", v)}
          />
        </FormField>
      </Box>

      {/* Row 3: Email, Cell Number, Employment Start Date */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", mb: "12px" }}>
        <FormField label="Email">
          <CustomInput type="email" placeholder="Enter email" value={form.email}
            onChange={(e: any) => updateField("email", e.target.value)}
            error={form.email && !validateEmail(form.email) ? "Invalid email address" : undefined}
          />
        </FormField>
        <FormField label="Cell Number">
          <CustomInput type="tel" placeholder="Enter cell number" value={form.cellNumber}
            onChange={(e: any) => updateField("cellNumber", e.target.value.replace(/\D/g, '').slice(0, 10))}
            inputProps={{ maxLength: 10 }}
            error={form.cellNumber && !validateSAMobileNumber(form.cellNumber) ? "Invalid SA mobile number" : undefined}
          />
        </FormField>
        <FormField label="Employment Start Date">
          <DateInput
            value={form.startDate}
            onChange={(v: any) => updateField("startDate", v)}
          />
        </FormField>
      </Box>

      {/* Row 4: ID Type, ID Number / Passport Details */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", mb: "12px" }}>
        <FormField label="ID Type">
          <CustomSelect value={form.idType} onChange={(e: any) => updateField("idType", e.target.value)} placeholder="Select ID Type">
            {ID_TYPE_OPTIONS.map((idOption) => (
              <option key={idOption} value={idOption}>{idOption}</option>
            ))}
          </CustomSelect>
        </FormField>

        {form.idType === "South African ID" && (
          <FormField label="SA ID Number">
            <CustomInput type="text" placeholder="Enter SA ID" value={form.identification}
              onChange={(e: any) => updateField("identification", e.target.value)}
              error={form.identification && !validateSAIDNumber(form.identification) ? "Invalid SA ID number" : undefined}
            />
          </FormField>
        )}

        {form.idType === "Passport" && (
          <>
            <FormField label="Passport Number">
              <CustomInput type="text" placeholder="Enter Passport Number" value={form.passportNumber}
                onChange={(e: any) => updateField("passportNumber", e.target.value)}
              />
            </FormField>
            <FormField label="Passport Expiry Date">
              <DateInput
                value={form.passportExpiry}
                onChange={(v: any) => updateField("passportExpiry", v)}
              />
            </FormField>
          </>
        )}
      </Box>

      {/* Row 5: Monthly income, Nationality, Employment Status */}
      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px", mb: "16px" }}>
        <FormField label="Monthly income (before tax)">
          <CustomInput type="text" inputMode="decimal" placeholder="R Enter monthly income" value={form.salary}
            onChange={(e: any) => updateField("salary", e.target.value.replace(/[^\d.]/g, ""))}
          />
        </FormField>
        <FormField label="Nationality">
          <CustomInput type="text" placeholder="Enter Nationality" value={form.nationality}
            onChange={(e: any) => updateField("nationality", e.target.value)}
          />
        </FormField>
        <FormField label="Employment Status">
          <CustomSelect value={form.status} onChange={(e: any) => updateField("status", e.target.value)} placeholder="Select Status">
            {EMPLOYMENT_STATUS_OPTIONS.map((statusOption) => (
              <option key={statusOption} value={statusOption}>{statusOption}</option>
            ))}
          </CustomSelect>
        </FormField>
      </Box>
      <button onClick={handleAddEmployee} style={{
        height: "36px", width: "fit-content", padding: "0 20px", fontSize: "0.875rem", fontWeight: 500,
        background: "var(--primary)", color: "var(--button-primary-color)", border: "none", borderRadius: "6px", cursor: "pointer",
      }}>Add Employee</button>
    </>
  );
}
