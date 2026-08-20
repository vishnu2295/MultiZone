import { toDbFormat } from "@/utils/date";
import ExcelJS from "exceljs";
import { saveAs } from "file-saver";
import { Gender, IDType, EmploymentStatus } from "@/lib/enums";

export interface Employee {
  id: string;
  employeeRecordId?: string;
  name: string;
  firstName: string;
  surname: string;
  gender: Gender;
  salary: string;
  dob: string;
  age?: number;
  email: string;
  cellNumber: string;
  startDate: string;
  idType: IDType;
  identification: string;
  passportNumber?: string;
  passportExpiry: string;
  nationality: string;
  status: EmploymentStatus;
}

export interface QuoteFormState {
  employees: string;
  genderSplit: string;
  averageAge: string;
  averageIncome: string;
  industry: string;
  permanentlyEmployed: "Yes" | "No" | "";
  activelyAtWork: "Yes" | "No" | "";
  existingPolicy: "Yes" | "No" | "";
  replacedPolicyIncludesDisability: "Yes" | "No" | "";
  isPolicyOlderThan6Months: "Yes" | "No" | "";
  replacedPolicyStartDate: string;
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
  step0Errors: Record<string, string>;
  step1Error: string;
}

export interface FullQuoteCaptureProps {
  companyName?: string;
  leadReference?: string;
  quickQuoteData?: any;
  draftQuoteData?: any;
  quoteReference?: string;
  leadId: string;
  initialStep?: number;
  onBack: () => void;
  onGenerate: (data: any) => Promise<any>;
  onDraftSaved?: () => void;
  isRepriceMode?: boolean;
}
const mapGender = (gender?: string): string => {
  const g = (gender || "").trim().toLowerCase();

  if (g.startsWith("m")) return "Male";
  if (g.startsWith("f")) return "Female";

  return "";
};

const formatDate = (date?: string): string =>
  date ? toDbFormat(date) : "";

const toNumberOrNull = (value?: string): number | null => {
  if (!value?.trim()) return null;
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
};

export const formatEmployeesToApi = (employees: Employee[]) => {
  return employees.map((employee) => {
    const [derivedFirstName = "Unknown", ...rest] = (employee.name || "")
      .trim()
      .split(" ");

    const derivedSurname = rest.join(" ") || "Unknown";

    const isSAID = !employee.idType || employee.idType === IDType.SA_ID;
    const isPassport = employee.idType === IDType.PASSPORT;

    return {
      employeeRecordId: employee.employeeRecordId || employee.id,
      employeeFirstName: employee.firstName || derivedFirstName,
      employeeSurname: employee.surname || derivedSurname,
      gender: mapGender(employee.gender),
      dateOfBirth: formatDate(employee.dob),
      email: employee.email || "",
      cellNumber: employee.cellNumber || "",
      employmentStartDate: formatDate(employee.startDate),
      idType: isSAID ? IDType.SA_ID : employee.idType,
      idNumber: isSAID && employee.identification && employee.identification !== "N/A"
        ? employee.identification
        : null,
      passportNumber: isPassport && employee.passportNumber && employee.passportNumber !== "N/A"
        ? employee.passportNumber
        : null,
      passportExpiryDate: formatDate(employee.passportExpiry),
      salaryAmount: toNumberOrNull(employee.salary),
      nationality: employee.nationality || "",
      employmentStatus: employee.status || "Active"
    };
  });
};

export const boolToYesNo = (
  value: boolean | null | undefined
): "Yes" | "No" | "" => {
  if (value === true) return "Yes";
  if (value === false) return "No";
  return "";
};

const listValidation = (formulae: any[], promptTitle: string, prompt: string, errorTitle: string, error: string): any => ({
  type: "list", allowBlank: true, formulae,
  showInputMessage: true, promptTitle, prompt,
  showErrorMessage: true, errorStyle: "error", errorTitle, error
});

const customValidation = (formulae: any[], promptTitle: string, prompt: string, errorTitle?: string, error?: string, allowBlank = true): any => ({
  type: "custom", allowBlank, formulae,
  showInputMessage: true, promptTitle, prompt,
  ...(errorTitle ? { showErrorMessage: true, errorStyle: "error", errorTitle, error } : {})
});

const dateValidation = (formulae: any[], promptTitle: string, prompt: string, errorTitle: string, error: string): any => ({
  type: "date", operator: "lessThanOrEqual", allowBlank: true, formulae,
  showInputMessage: true, promptTitle, prompt,
  showErrorMessage: true, errorStyle: "error", errorTitle, error
});

const decimalValidation = (formulae: any[], promptTitle: string, prompt: string, errorTitle: string, error: string): any => ({
  type: "decimal", operator: "greaterThanOrEqual", allowBlank: true, formulae,
  showInputMessage: true, promptTitle, prompt,
  showErrorMessage: true, errorStyle: "error", errorTitle, error
});

export const downloadEmployeeTemplate = async () => {
  const workbook = new ExcelJS.Workbook();
  const sheet = workbook.addWorksheet("Template");

  const headers = [
    "Employee Record ID", "Employee FirstName", "Employee Surname", "Gender",
    "DOB", "Email", "Cell Number", "Employment Start Date",
    "IDType", "IDNumber", "Passport Number", "Passport Expiry",
    "Salary Amount", "Nationality", "Employment Status"
  ];

  sheet.addRow(headers);
  sheet.getRow(1).font = { bold: true };

  const today = new Date();

  const dv = (sheet as any).dataValidations;

  dv.add("A2:A101", customValidation(['TRUE'], "Employee ID", "Enter your employeeid (e.g., EMP1001)"));
  dv.add("B2:B101", customValidation(['TRUE'], "First Name", "Enter first name (e.g., John)"));
  dv.add("C2:C101", customValidation(['TRUE'], "Surname", "Enter surname (e.g., Doe)"));
  
  dv.add("D2:D101", listValidation([`"${Object.values(Gender).join(",")}"`], "Gender", "Please select gender from the options", "Invalid Gender", "Please select a valid gender from the list."));
  dv.add("E2:E101", dateValidation([today], "Date of Birth", "Please enter a valid date (e.g., YYYY-MM-DD)", "Invalid DOB", "Please enter a valid date of birth."));
  
  dv.add("F2:F101", customValidation(['=AND(ISNUMBER(SEARCH("@",F2)), ISNUMBER(SEARCH(".",F2)))'], "Email Format", "Please enter a valid email address (e.g. user@domain.com)", "Invalid Email", "Email must contain an '@' and a '.'"));
  dv.add("G2:G101", customValidation(['=AND(LEN(G2)=10, ISNUMBER(VALUE(G2)), LEFT(G2,1)="0", OR(MID(G2,2,1)="6", MID(G2,2,1)="7", MID(G2,2,1)="8"))'], "Phone Number", "Please enter a valid 10-digit mobile number starting with 06, 07, or 08.", "Invalid Phone Number", "Must be a valid 10-digit SA mobile number starting with 06, 07, or 08."));
  
  dv.add("H2:H101", dateValidation([today], "Employment Start Date", "Please enter a valid date (e.g., YYYY-MM-DD)", "Invalid Start Date", "Please enter a valid employment start date."));
  dv.add("I2:I101", listValidation([`"${Object.values(IDType).join(",")}"`], "ID Type", "Please select ID type from the options", "Invalid ID Type", "Please select a valid ID type."));
  
  dv.add("J2:J101", customValidation(['=IF(I2="South African ID", AND(LEN(J2)=13, ISNUMBER(J2*1)), J2="")'], "ID Number", "Enter 13-digit SA ID Number (only if ID Type is South African ID).", "Invalid ID Number", "Must be a 13-digit number. Only applicable if ID Type is 'South African ID'.", false));
  dv.add("K2:K101", customValidation(['=IF(I2="Passport", TRUE, K2="")'], "Passport Number", "Enter Passport Number (only if ID Type is Passport).", "Not Applicable", "You can only enter a Passport Number if ID Type is 'Passport'.", false));
  dv.add("L2:L101", customValidation(['=IF(I2="Passport", AND(ISNUMBER(L2), L2>TODAY()), L2="")'], "Passport Expiry", "Enter a valid future date (only if ID Type is Passport).", "Invalid Input", "Only applicable if ID Type is Passport, and must be a valid date in the future.", false));
  
  dv.add("M2:M101", decimalValidation([0], "Salary", "Enter annual salary amount (e.g., 50000)", "Invalid Salary", "Salary must be a positive number."));
  dv.add("N2:N101", customValidation(['TRUE'], "Nationality", "Enter nationality (e.g., South African)"));
  
  dv.add("O2:O101", listValidation([`"${Object.values(EmploymentStatus).join(",")}"`], "Employment Status", "Please select employment status from the options", "Invalid Status", "Please select a valid employment status."));

  (sheet as any).dataValidations.add("A102:O1000", {
    type: "custom", allowBlank: false, formulae: ['1=0'],
    showErrorMessage: true, errorStyle: "stop", errorTitle: "Limit Reached", error: "A maximum of 100 employees are allowed per upload."
  });

  sheet.columns.forEach(column => { column.width = 20; });

  sheet.getColumn("G").numFmt = "@"; 
  sheet.getColumn("J").numFmt = "@"; 
  sheet.getColumn("K").numFmt = "@"; 

  const buffer = await workbook.xlsx.writeBuffer();
  const blob = new Blob([buffer], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet" });
  saveAs(blob, "employee_upload_template.xlsx");
};
