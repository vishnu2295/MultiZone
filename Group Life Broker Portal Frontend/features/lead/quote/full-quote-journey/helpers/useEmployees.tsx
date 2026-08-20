import { useRef, useState } from "react";
import { Employee } from "./utils";
import * as XLSX from "xlsx";
import { EmployeeFormData } from "../components/EmployeeForm";
import { Gender, IDType, EmploymentStatus } from "@/lib/enums";

const EMPTY_FORM: EmployeeFormData = {
    employeeRecordId: "",
    firstName: "",
    surname: "",
    gender: "",
    dob: "",
    email: "",
    cellNumber: "",
    startDate: "",
    salary: "",
    idType: "South African ID",
    identification: "",
    passportNumber: "",
    passportExpiry: "",
    nationality: "",
    status: "Active",
};

export const useEmployees = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [employeeList, setEmployeeList] = useState<Employee[]>([]);
  const [fileName, setFileName] = useState("");
  const [employeeFile, setEmployeeFile] = useState<File | null>(null);

  const [showForm, setShowForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const [form, setForm] = useState<EmployeeFormData>(EMPTY_FORM);

  const processFile = (file: File) => {
    setFileName(file.name);
    setEmployeeFile(file);

    const reader = new FileReader();

    reader.onload = (ev) => {
      const buf = ev.target?.result as ArrayBuffer;

      if (!buf) return;

      const workbook = XLSX.read(new Uint8Array(buf), { type: "array" });

      const worksheet = workbook.Sheets[workbook.SheetNames[0]];

      const rows: any[][] = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

      if (!rows.length) return;

      const hasHeader = rows[0].some(
        (cell: any) =>
          typeof cell === "string" &&
          (cell.toLowerCase().includes("name") ||
            cell.toLowerCase().includes("income"))
      );

      const data = hasHeader ? rows.slice(1) : rows;

            const parseExcelDate = (val: any) => {
                if (typeof val === "number") {
                    const jsDate = new Date(Math.round((val - 25569) * 86400 * 1000));
                    return jsDate.toISOString().split('T')[0];
                }
                return String(val || "").trim();
            };

            const employees: Employee[] = data
                .filter(
                    (row) =>
                        row.length >= 4 &&
                        (row[0] || row[1] || row[2])
                )
                .map((row) => ({
                    id: Math.random().toString(36).slice(2),
                    employeeRecordId: String(row[0] || "").trim(),
                    name:
                        `${row[1] || ""} ${row[2] || ""}`.trim() ||
                        "Unknown",
                    firstName: String(row[1] || "").trim(),
                    surname: String(row[2] || "").trim(),
                    gender: String(row[3] || "").trim() as Gender,
                    dob: parseExcelDate(row[4]),
                    age: parseExcelDate(row[4]) ? 
                        (() => {
                            const birthDate = new Date(parseExcelDate(row[4]));
                            const today = new Date();
                            let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                            const m = today.getMonth() - birthDate.getMonth();
                            if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
                                calculatedAge--;
                            }
                            return calculatedAge;
                        })() : undefined,
                    email: String(row[5] || "").trim(),
                    cellNumber: String(row[6] || "").trim(),
                    startDate: parseExcelDate(row[7]),
                    idType: (String(row[8] || "South African ID").trim() === "SA ID" ? "South African ID" : String(row[8] || "South African ID").trim()) as IDType,
                    identification: String(row[9] || "").trim(),
                    passportNumber: String(row[10] || "").trim(),
                    passportExpiry: parseExcelDate(row[11]),
                    salary: String(row[12] || "0").trim(),
                    nationality: String(row[13] || "").trim(),
                    status: String(row[14] || "Active").trim() as EmploymentStatus,
                }));

      setEmployeeList((prev) => [...prev, ...employees]);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (!file) return;

    processFile(file);
  };

  const handleAddEmployee = () => {
    if (!form.firstName || !form.surname) {
      return;
    }

    const employee: Employee = {
      id: Math.random().toString(36).slice(2),
      employeeRecordId: form.employeeRecordId || "",
      name: `${form.firstName} ${form.surname}`.trim(),
      firstName: form.firstName,
      surname: form.surname,
      gender: form.gender as Gender,
      salary: form.salary,
      dob: form.dob,
      age: form.dob ? 
        (() => {
          const birthDate = new Date(form.dob);
          const today = new Date();
          let calculatedAge = today.getFullYear() - birthDate.getFullYear();
          const m = today.getMonth() - birthDate.getMonth();
          if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
          }
          return calculatedAge;
        })() 
        : undefined,
      email: form.email,
      cellNumber: form.cellNumber,
      startDate: form.startDate,
      identification: form.idType === "South African ID" ? form.identification : "",
      idType: form.idType as IDType,
      passportNumber: form.idType === "Passport" ? form.passportNumber : "",
      passportExpiry: form.idType === "Passport" ? form.passportExpiry : "",
      nationality: form.nationality,
      status: (form.status || "Active") as EmploymentStatus,
    };

    setEmployeeList((prev) => [...prev, employee]);
    setForm(EMPTY_FORM);
  };

  const removeEmployee = (id: string) => {
    setEmployeeList((prev) => prev.filter((e) => e.id !== id));
  };

  const clearEmployees = () => {
    setEmployeeList([]);
    setFileName("");
    setEmployeeFile(null);
    setForm(EMPTY_FORM);
  };

  return {
    fileInputRef,
    employeeList,
    setEmployeeList,
    employeeFile,
    fileName,
    setFileName,
    showForm,
    setShowForm,
    showBulkUpload,
    setShowBulkUpload,
    isDragging,
    setIsDragging,
    form,
    setForm,
    processFile,
    handleFileChange,
    handleAddEmployee,
    removeEmployee,
    clearEmployees,
  };
};

export const boolToYesNo = (
  value: boolean | null | undefined
): "Yes" | "No" | "" => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "";
};

export interface QuoteFormState {
  productId: string;
  generateOptions: boolean;
  lifeCover: number;
  occupationalDisability: number;
  funeralCover: number;
  additionalBenefits: {
    gpaClassicCover: boolean;
    gpaComprehensiveCover: boolean;
    gpaComprehensivePlusCover: boolean;
    crimeAndCommutingJourney: boolean;
    riotAndStrike: boolean;
    riotAndStrikePlusCover: boolean;
    augmentation: boolean;
  };
  benefitBreakdown: any[];
  totalMonthlyPremium: number;
  step1Error: string;
}
