export type ClaimSection =
  | "Claimant & Injury Details"
  | "Employment"
  | "Beneficiaries"
  | "Earnings"
  | "Requirements"
  | "Medical Reports"
  | "Documents"
  | "Letters & Templates";

export type ClaimTab =
  | "Invoices"
  | "Medical Invoices"
  | "Authorizations"
  | "Payments";

export type ClaimInvoice = {
  invoiceNumber: string;
  provider: string;
  serviceDate: string;
  amount: string;
  status: string;
};

export type ClaimAuthorization = {
  authorizationNumber: string;
  treatmentType: string;
  provider: string;
  validUntil: string;
  status: string;
};

export type ClaimPayment = {
  paymentNumber: string;
  paidTo: string;
  paymentDate: string;
  method: string;
  amount: string;
  status: string;
};

export type ClaimantTab =
  | "Claimant Details"
  | "Injury Details"
  | "ICD 10 Codes";

export type ClaimContact = {
  name: string;
  email: string;
  phone: string;
  primary?: boolean;
};

export type ClaimAddress = {
  type: string;
  line: string;
  primary?: boolean;
};

export type ClaimMedicalDocument = {
  name: string;
  /** Defaults to "Document Type" when omitted. */
  metaLabel?: string;
  documentType?: string;
  uploadedAt?: string;
};

export type ClaimDocumentGroup = {
  title: string;
  documents: ClaimMedicalDocument[];
};

export type ClaimMedicalRecords = {
  report: {
    title: string;
    fields: Array<{ label: string; value: string }>;
  };
  checks: Array<{ label: string; checked: boolean }>;
  documents: ClaimMedicalDocument[];
  icdCodes: ClaimIcdCode[];
};

export type ApiMedicalReportDocument = {
  documentId: number;
  documentType: string;
  fileName: string;
  uploadedDate: string;
  fileContent?: string;
};

export type ApiMedicalReport = {
  receivedDate: string;
  hcpPracticeNumber: string;
  healthcareProviderName: string;
  medicalReportCategory: string;
  dateOfConsultation: string;
  clinicalDescription: string;
  mechanismOfInjury: string;
  bodySide: string;
  severity: string;
  isNextReviewDateApplicable: boolean;
  isPreExistingCondition: boolean;
  isInjuryMechanismConsistent: boolean;
  isPatientEligibleForDaysOff: boolean;
  medicalDocuments: ApiMedicalReportDocument[];
  icd10Codes?: ApiIcdCode[];
};

export type ClaimMedicalReport = {
  healthcareProviderName: string;
  practiceNumber: string;
  ICD10Code: string;
  consultationDate: string;
  status: string;
  updatedBy: string;
  formDetails: ApiMedicalReport;
};

export type ClaimMedicalReports = {
  firstMedicalReport: ClaimMedicalReport[];
  progressMedicalReports: ClaimMedicalReport[];
  finalMedicalReports: ClaimMedicalReport[];
  sickNoteMedicalReports: ClaimMedicalReport[];
};

export type ApiMedicalReportListItem = {
  healthcareProviderName: string;
  practiceNumber: string;
  icd10Code: string;
  consultationDate: string;
  status: string;
  updatedBy: string;
  formDetails: ApiMedicalReport;
};

export type ApiMedicalReportsResponse = {
  firstMedicalReport: ApiMedicalReportListItem[];
  progressMedicalReports: ApiMedicalReportListItem[];
  finalMedicalReports: ApiMedicalReportListItem[];
  sickNoteMedicalReports: ApiMedicalReportListItem[];
};

function formatMedicalReportDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-ZA", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function mapMedicalReportSummary(report: ApiMedicalReportListItem): ClaimMedicalReport {
  return {
    healthcareProviderName: report.healthcareProviderName,
    practiceNumber: report.practiceNumber,
    ICD10Code: report.icd10Code,
    consultationDate: formatMedicalReportDate(report.consultationDate),
    status: report.status,
    updatedBy: report.updatedBy,
    formDetails: report.formDetails,
  };
}

export function mapApiMedicalReports(
  response: ApiMedicalReportsResponse,
): ClaimMedicalReports {
  return {
    firstMedicalReport: (response.firstMedicalReport ?? []).map(
      mapMedicalReportSummary,
    ),
    progressMedicalReports: (response.progressMedicalReports ?? []).map(
      mapMedicalReportSummary,
    ),
    finalMedicalReports: (response.finalMedicalReports ?? []).map(
      mapMedicalReportSummary,
    ),
    sickNoteMedicalReports: (response.sickNoteMedicalReports ?? []).map(
      mapMedicalReportSummary,
    ),
  };
}

export function mapApiMedicalReportDetail(
  report: ApiMedicalReport,
): ClaimMedicalRecords {
  return {
    report: {
      title: report.medicalReportCategory || "Medical Report Details",
      fields: [
        { label: "Received Date", value: report.receivedDate },
        { label: "HCP Practice Number", value: report.hcpPracticeNumber },
        {
          label: "Healthcare Provider Name",
          value: report.healthcareProviderName,
        },
        {
          label: "Medical Report Category",
          value: report.medicalReportCategory,
        },
        { label: "Date of Consultation", value: report.dateOfConsultation },
        { label: "Clinical Description", value: report.clinicalDescription },
        { label: "Mechanism of Injury", value: report.mechanismOfInjury },
        { label: "Body Side", value: report.bodySide },
        { label: "Severity", value: report.severity },
      ],
    },
    checks: [
      {
        label: "Is next review date applicable?",
        checked: report.isNextReviewDateApplicable === true,
      },
      {
        label: "Is a pre-existing condition?",
        checked: report.isPreExistingCondition === true,
      },
      {
        label: "Is the injury mechanism consistent?",
        checked: report.isInjuryMechanismConsistent === true,
      },
      {
        label: "Is the patient eligible for days off?",
        checked: report.isPatientEligibleForDaysOff === true,
      },
    ],
    documents: report.medicalDocuments.map((document) => ({
      name: formatDocumentLabel(document.documentType),
      documentType: document.fileName,
      uploadedAt: formatDocumentTimestamp(document.uploadedDate),
    })),
    icdCodes: mapApiIcdCodes(report.icd10Codes ?? []),
  };
}

export type ClaimUploadDocument = {
  name: string;
  fileName?: string;
  uploadedAt?: string;
};

export type ApiClaimDocument = {
  documentId: number;
  documentKeySet: string;
  documentKey: string;
  documentType: string;
  fileName: string;
  uploadedDate: string;
  fileContent?: string;
};

function formatDocumentLabel(documentType: string): string {
  return documentType.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

function formatDocumentTimestamp(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";

  const datePart = date.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
  const timePart = date
    .toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    })
    .toLowerCase();

  return `${datePart} · ${timePart}`;
}

const REQUIREMENTS_DOCUMENT_KEY_SET = "Claim Requirements";
const CLAIM_DOCUMENT_KEY_SET = "Claim";
const INVOICES_DOCUMENT_KEY_SET = "Invoices";
const MEDICAL_REPORTS_DOCUMENT_KEY_SET = "Medical Reports";

export type MappedClaimDocuments = {
  requirements: ClaimUploadDocument[];
  documentGroups: ClaimDocumentGroup[];
  invoiceDocuments: ClaimMedicalDocument[];
  medicalReportDocuments: ClaimMedicalDocument[];
};

/**
 * Routes the flat document list by `documentKeySet` to the section that
 * displays it: "Claim Requirements" -> Requirements, "Claim" -> the
 * Documents section, "Invoices" -> the Invoices tab, "Medical Reports" ->
 * the Medical Reports section. Any other keySet is currently unhandled.
 */
export function mapApiDocuments(response: ApiClaimDocument[]): MappedClaimDocuments {
  const requirements: ClaimUploadDocument[] = [];
  const claimDocuments: ClaimMedicalDocument[] = [];
  const invoiceDocuments: ClaimMedicalDocument[] = [];
  const medicalReportDocuments: ClaimMedicalDocument[] = [];

  for (const doc of response) {
    const document = {
      name: formatDocumentLabel(doc.documentType),
      fileName: doc.fileName,
      documentType: doc.fileName,
      uploadedAt: formatDocumentTimestamp(doc.uploadedDate),
    };

    switch (doc.documentKeySet) {
      case REQUIREMENTS_DOCUMENT_KEY_SET:
        requirements.push(document);
        break;
      case CLAIM_DOCUMENT_KEY_SET:
        claimDocuments.push(document);
        break;
      case INVOICES_DOCUMENT_KEY_SET:
        invoiceDocuments.push(document);
        break;
      case MEDICAL_REPORTS_DOCUMENT_KEY_SET:
        medicalReportDocuments.push(document);
        break;
      default:
        break;
    }
  }

  return {
    requirements,
    documentGroups: claimDocuments.length
      ? [{ title: CLAIM_DOCUMENT_KEY_SET, documents: claimDocuments }]
      : [],
    invoiceDocuments,
    medicalReportDocuments,
  };
}

export type ClaimBeneficiary = {
  name: string;
  email: string;
  phone: string;
  demographics: Array<{ label: string; value: string }>;
  banking: Array<{ label: string; value: string }>;
  addresses: ClaimAddress[];
};

export type ClaimIcdCode = {
  description: string;
  code: string;
  expiryDate: string;
  severity: string;
  mmiDays: string;
  bodySide: string;
};

export type ClaimantDetails = {
  demographics: Array<{ label: string; value: string }>;
  contacts: ClaimContact[];
  addresses: ClaimAddress[];
};

export type ApiClaimantPersonalDetails = {
  title: string;
  firstname: string;
  surname: string;
  idType: string;
  idNumber: string;
  dateOfBirth: string;
  gender: string;
  maritalStatus: string;
  nationality: string;
  country: string;
};

export type ApiClaimantContact = {
  title: string;
  firstname: string;
  surname: string;
  communicationType: string;
  contactNumber: string;
  emailAddress: string;
  contactDesignation: string;
  contactContext: string;
  isContactConfirmed: boolean;
  isPrimary: boolean;
  rolePlayerId: number;
  rolePlayerContactId: number;
};

export type ApiClaimantAddress = {
  type: string;
  effectiveFrom: string;
  addressLine1: string;
  addressLine2?: string;
  province: string;
  city: string;
  postalCode: string;
  country: string;
  isPrimary: boolean;
  isPostalSameAsPhysical?: boolean;
  rolePlayerId: number;
};

export type ApiClaimantDetailsResponse = {
  personalDetails: ApiClaimantPersonalDetails;
  contacts: ApiClaimantContact[];
  addressDetails: ApiClaimantAddress[];
};

export function mapApiClaimantDetails(
  response: ApiClaimantDetailsResponse,
): ClaimantDetails {
  const { personalDetails, contacts, addressDetails } = response;

  return {
    demographics: [
      { label: "ID Type", value: personalDetails.idType },
      { label: "ID/ Passport number", value: personalDetails.idNumber },
      { label: "Date of Birth", value: personalDetails.dateOfBirth },
      { label: "Gender", value: personalDetails.gender },
      { label: "Marital Status", value: personalDetails.maritalStatus },
      { label: "Nationality", value: personalDetails.nationality },
      { label: "Country", value: personalDetails.country },
    ],
    contacts: contacts.map((contact) => ({
      name: [contact.title, contact.firstname, contact.surname]
        .filter(Boolean)
        .join(" "),
      email: contact.emailAddress,
      phone: contact.contactNumber,
      primary: contact.isPrimary,
    })),
    addresses: addressDetails.map((address) => ({
      type: address.type,
      line: [
        address.addressLine1,
        address.addressLine2,
        address.city,
        address.province,
        address.postalCode,
        address.country,
      ]
        .filter(Boolean)
        .join(", "),
      primary: address.isPrimary,
    })),
  };
}

export function getClaimantFullName(
  personalDetails: ApiClaimantPersonalDetails,
): string {
  return [
    personalDetails.title,
    personalDetails.firstname,
    personalDetails.surname,
  ]
    .filter(Boolean)
    .join(" ");
}

export function getClaimantInitials(
  personalDetails: ApiClaimantPersonalDetails,
): string {
  return `${personalDetails.firstname?.[0] ?? ""}${personalDetails.surname?.[0] ?? ""}`.toUpperCase();
}

export type ApiBeneficiaryPersonalDetails = ApiClaimantPersonalDetails & {
  relation: string;
};

export type ApiBeneficiaryBankingDetails = {
  accountHolder: string;
  bank: string;
  accountType: string;
  accountNumber: string;
  branch: string;
  branchCode: string;
};

export type ApiBeneficiary = {
  personalDetails: ApiBeneficiaryPersonalDetails;
  contacts: ApiClaimantContact[];
  addressDetails: ApiClaimantAddress[];
  bankingDetails: ApiBeneficiaryBankingDetails;
};

export function mapApiBeneficiaries(
  response: ApiBeneficiary[],
): ClaimBeneficiary[] {
  return response.map((beneficiary) => {
    const { personalDetails, contacts, addressDetails, bankingDetails } =
      beneficiary;
    const primaryContact =
      contacts.find((contact) => contact.isPrimary) ?? contacts[0];

    return {
      name: primaryContact
        ? [
            primaryContact.title,
            primaryContact.firstname,
            primaryContact.surname,
          ]
            .filter(Boolean)
            .join(" ")
        : getClaimantFullName(personalDetails),
      email: primaryContact?.emailAddress ?? "",
      phone: primaryContact?.contactNumber ?? "",
      demographics: [
        { label: "ID Type", value: personalDetails.idType },
        { label: "ID/ Passport number", value: personalDetails.idNumber },
        { label: "Date of Birth", value: personalDetails.dateOfBirth },
        { label: "Gender", value: personalDetails.gender },
        { label: "Relation", value: personalDetails.relation },
        { label: "Marital Status", value: personalDetails.maritalStatus },
        { label: "Nationality", value: personalDetails.nationality },
        { label: "Country", value: personalDetails.country },
      ],
      banking: [
        { label: "Account Holder", value: bankingDetails.accountHolder },
        { label: "Bank", value: bankingDetails.bank },
        { label: "Account Type", value: bankingDetails.accountType },
        { label: "Account No", value: bankingDetails.accountNumber },
        { label: "Branch", value: bankingDetails.branch },
        { label: "Branch Code", value: bankingDetails.branchCode },
      ],
      addresses: addressDetails.map((address) => ({
        type: address.type,
        line: [
          address.addressLine1,
          address.addressLine2,
          address.city,
          address.province,
          address.postalCode,
          address.country,
        ]
          .filter(Boolean)
          .join(", "),
        primary: address.isPrimary,
      })),
    };
  });
}

export type ApiInjuryDetails = {
  insuranceType: string;
  dateNotified: string;
  dateOfIncident: string;
  claimType: string;
  benefits: string;
  primaryInjuryDiagnosticGroup: string;
  injuryDescription: string;
  bodySide: string;
  severity: string;
};

export type ApiInjuryDetailsResponse = {
  injuryDetails: ApiInjuryDetails;
};

export function mapApiInjuryDetails(
  response: ApiInjuryDetailsResponse,
): Array<{ label: string; value: string }> {
  const { injuryDetails } = response;

  return [
    { label: "Insurance Type", value: injuryDetails.insuranceType },
    { label: "Date Notified", value: injuryDetails.dateNotified },
    { label: "Date of Incident", value: injuryDetails.dateOfIncident },
    { label: "Claim Type", value: injuryDetails.claimType },
    { label: "Benefits", value: injuryDetails.benefits },
    {
      label: "Primary Injury Diagnostic Group",
      value: injuryDetails.primaryInjuryDiagnosticGroup,
    },
    {
      label: "Brief Description of Injury",
      value: injuryDetails.injuryDescription,
    },
    { label: "Severity", value: injuryDetails.severity },
    { label: "Body Side", value: injuryDetails.bodySide },
  ];
}

export type ApiIcdCode = {
  code: string;
  description: string;
  expiryDate: string;
  severity: string;
  mmiDays: string;
  bodySide: string;
};

export function mapApiIcdCodes(response: ApiIcdCode[]): ClaimIcdCode[] {
  return response.map((icdCode) => ({
    description: icdCode.description,
    code: icdCode.code,
    expiryDate: icdCode.expiryDate,
    severity: icdCode.severity,
    mmiDays: icdCode.mmiDays,
    bodySide: icdCode.bodySide,
  }));
}

export type ClaimEarningsRecord = Array<
  Array<{ label: string; value: string }>
>;

export type ApiEarningsRecord = {
  variableSubtotal: number | null;
  nonVariableSubtotal: number | null;
  totalEarnings: number;
  createdBy: string;
  createdDate: string;
  isVerified: boolean;
  isEstimated: boolean;
  earningType: string;
};

function formatEarningsAmount(value: number | null | undefined): string {
  if (value === null || value === undefined) return "N/A";
  return value.toLocaleString("en-ZA", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function formatEarningsDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "-";
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}-${month}-${date.getFullYear()}`;
}

export function mapApiEarnings(
  response: ApiEarningsRecord[],
): ClaimEarningsRecord[] {
  return response.map((record) => [
    [
      {
        label: "Variable Subtotal",
        value: formatEarningsAmount(record.variableSubtotal),
      },
      {
        label: "Non-Variable Subtotal",
        value: formatEarningsAmount(record.nonVariableSubtotal),
      },
    ],
    [
      {
        label: "Total Earnings",
        value: formatEarningsAmount(record.totalEarnings),
      },
    ],
    [
      { label: "Created By", value: record.createdBy },
      { label: "Created Date", value: formatEarningsDate(record.createdDate) },
    ],
    [
      { label: "Is Verified", value: record.isVerified ? "Yes" : "No" },
      { label: "Is Estimated", value: record.isEstimated ? "Yes" : "No" },
      { label: "Earning Type", value: record.earningType },
    ],
  ]);
}

export type ClaimFieldGroup = {
  title: string;
  fields: Array<{ label: string; value: string }>;
};

export type ApiEmploymentDetails = {
  isSkilled: boolean;
  isTrainee: boolean;
  startDate: string;
  patersonGrading: string;
  rmaEmployeeRefNumber: string;
  employeeNumber: string;
  employeeIndustryNumber: string;
  occupation: string;
};

export function mapApiEmploymentDetails(
  response: ApiEmploymentDetails,
): ClaimFieldGroup[] {
  return [
    {
      title: "Person Employment",
      fields: [
        {
          label: "Skilled / Unskilled",
          value: response.isSkilled ? "Skilled" : "Unskilled",
        },
        {
          label: "Trainee/Learner/Apprentice?",
          value: response.isTrainee ? "Yes" : "No",
        },
        { label: "Start Date with Employer", value: response.startDate },
        { label: "Paterson Grading", value: response.patersonGrading },
        {
          label: "RMA Employee Ref Number",
          value: response.rmaEmployeeRefNumber,
        },
        { label: "Employee Number", value: response.employeeNumber },
        {
          label: "Employee Industry Number",
          value: response.employeeIndustryNumber,
        },
        { label: "Occupation", value: response.occupation },
      ],
    },
  ];
}

export type ClaimDetails = {
  id: string;
  claimantName: string;
  initials: string;
  claimRef: string;
  status: string;
  claimType: string;
  eventDate: string;
  reportedDate: string;
  amountClaimed: string;
  description: string;
  invoices: ClaimInvoice[];
  medicalInvoices: ClaimInvoice[];
  authorizations: ClaimAuthorization[];
  payments: ClaimPayment[];
  claimantDetails: ClaimantDetails;
  injuryDetails: Array<{ label: string; value: string }>;
  icdCodes: ClaimIcdCode[];
  beneficiaries: ClaimBeneficiary[];
  earnings: ClaimEarningsRecord[];
  earningsDocuments: ClaimUploadDocument[];
  requirements: ClaimUploadDocument[];
  medicalReports: ClaimMedicalReports;
  medicalReportDocuments: ClaimMedicalDocument[];
  documentGroups: ClaimDocumentGroup[];
  invoiceDocuments: ClaimMedicalDocument[];
  letters: ClaimMedicalDocument[];
  employment: ClaimFieldGroup[];
};

export const claimantTabs: readonly ClaimantTab[] = [
  "Claimant Details",
  "Injury Details",
  "ICD 10 Codes",
] as const;

export const claimTabs: readonly ClaimTab[] = [
  "Invoices",
  "Medical Invoices",
  "Authorizations",
  "Payments",
] as const;

export const claimSections: readonly ClaimSection[] = [
  "Claimant & Injury Details",
  "Employment",
  "Beneficiaries",
  "Earnings",
  "Requirements",
  "Medical Reports",
  "Documents",
  "Letters & Templates",
] as const;

/** Route segment each section lives under, e.g. `/company/claims/1/beneficiaries`. */
export const claimSectionSlugs: Record<ClaimSection, string> = {
  "Claimant & Injury Details": "claimant-injury",
  Employment: "employment",
  Beneficiaries: "beneficiaries",
  Earnings: "earnings",
  Requirements: "requirements",
  "Medical Reports": "medical-reports",
  Documents: "documents",
  "Letters & Templates": "letters",
};

const pendingClaim: ClaimDetails = {
  id: "CLM-2024-003",
  claimantName: "John Andrew Doe",
  initials: "JD",
  claimRef: "M/2006053/1/340A/26",
  status: "Active",
  claimType: "Workplace Accident Claim",
  eventDate: "Mar 10, 2024",
  reportedDate: "Jul 10, 2026",
  amountClaimed: "R 48,750.00",
  description:
    "Employee slipped on a wet surface in the packaging area and sustained a fracture to the left wrist. First aid was administered on site and the employee was transported to Milpark Hospital for further treatment.",
  invoices: [
    {
      invoiceNumber: "INV-2024-10021",
      provider: "Milpark Hospital",
      serviceDate: "Mar 11, 2024",
      amount: "R 18,420.00",
      status: "Paid",
    },
    {
      invoiceNumber: "INV-2024-10088",
      provider: "Gauteng Radiology Partners",
      serviceDate: "Mar 14, 2024",
      amount: "R 3,150.00",
      status: "Pending",
    },
    {
      invoiceNumber: "INV-2024-10154",
      provider: "Sandton Physio Centre",
      serviceDate: "Apr 02, 2024",
      amount: "R 2,860.00",
      status: "Overdue",
    },
  ],
  medicalInvoices: [
    {
      invoiceNumber: "MED-2024-4471",
      provider: "Dr. L. Naidoo (Orthopaedic Surgeon)",
      serviceDate: "Mar 12, 2024",
      amount: "R 9,600.00",
      status: "Paid",
    },
    {
      invoiceNumber: "MED-2024-4589",
      provider: "Clicks Pharmacy - Rivonia",
      serviceDate: "Mar 15, 2024",
      amount: "R 1,245.50",
      status: "Paid",
    },
    {
      invoiceNumber: "MED-2024-4702",
      provider: "Sandton Physio Centre",
      serviceDate: "Apr 18, 2024",
      amount: "R 2,860.00",
      status: "Pending",
    },
  ],
  authorizations: [
    {
      authorizationNumber: "AUTH-2024-0912",
      treatmentType: "Orthopaedic Surgery",
      provider: "Milpark Hospital",
      validUntil: "Jun 30, 2024",
      status: "Approved",
    },
    {
      authorizationNumber: "AUTH-2024-1033",
      treatmentType: "Physiotherapy (12 sessions)",
      provider: "Sandton Physio Centre",
      validUntil: "Aug 15, 2024",
      status: "Approved",
    },
    {
      authorizationNumber: "AUTH-2024-1187",
      treatmentType: "Occupational Therapy",
      provider: "Rehab Works Johannesburg",
      validUntil: "Sep 01, 2024",
      status: "Pending",
    },
  ],
  payments: [
    {
      paymentNumber: "PAY-2024-7781",
      paidTo: "Milpark Hospital",
      paymentDate: "Apr 05, 2024",
      method: "EFT",
      amount: "R 18,420.00",
      status: "Paid",
    },
    {
      paymentNumber: "PAY-2024-7802",
      paidTo: "Dr. L. Naidoo",
      paymentDate: "Apr 05, 2024",
      method: "EFT",
      amount: "R 9,600.00",
      status: "Paid",
    },
    {
      paymentNumber: "PAY-2024-7930",
      paidTo: "John Andrew Doe",
      paymentDate: "Apr 26, 2024",
      method: "EFT",
      amount: "R 6,180.00",
      status: "Processing",
    },
  ],
  claimantDetails: {
    demographics: [
      { label: "ID Type", value: "SA ID" },
      { label: "ID/ Passport number", value: "987538947523545" },
      { label: "Date of Birth", value: "1972-06-28" },
      { label: "Gender", value: "Male" },
      { label: "Marital Status", value: "Single" },
      { label: "Nationality", value: "South African" },
      { label: "Country", value: "South Africa" },
    ],
    contacts: [
      {
        name: "Mr. Sarah Johnsontal",
        email: "sarah.johnson@insuretech.co.za",
        phone: "011 555 0101",
        primary: true,
      },
    ],
    addresses: [
      {
        type: "Postal",
        line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
        primary: true,
      },
      {
        type: "Postal",
        line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
        primary: true,
      },
    ],
  },
  injuryDetails: [
    { label: "Insurance Type", value: "IOD" },
    { label: "Date Notified", value: "2026/07/10" },
    { label: "Date of Incident", value: "2026/07/10" },
    { label: "Claim Type", value: "IOD-COID" },
    { label: "Benefits", value: "Days > 14" },
    {
      label: "Primary Injury Diagnostic Group",
      value: "DRG 16 : Injuries to Anke and Foot",
    },
    {
      label: "Brief Description of Injury",
      value: "Concussion in the Left foot",
    },
    { label: "Severity", value: "Mild" },
    { label: "Body Side", value: "Left" },
  ],
  icdCodes: [
    {
      description: "Contusion other parts of foot",
      code: "S90.3",
      expiryDate: "2026-07-18",
      severity: "Mild",
      mmiDays: "09",
      bodySide: "Left",
    },
    {
      description: "Sprain and strain of ankle",
      code: "S93.4",
      expiryDate: "2026-07-18",
      severity: "Mild",
      mmiDays: "09",
      bodySide: "Left",
    },
    {
      description: "Superficial injury of ankle and foot",
      code: "S90.9",
      expiryDate: "2026-07-18",
      severity: "Mild",
      mmiDays: "09",
      bodySide: "Left",
    },
  ],
  beneficiaries: [
    {
      name: "Mr. Sarah Johnsontal",
      email: "sarah.johnson@insuretech.co.za",
      phone: "011 555 0101",
      demographics: [
        { label: "ID Type", value: "SA ID" },
        { label: "ID/ Passport number", value: "987538947523545" },
        { label: "Date of Birth", value: "1972-06-28" },
        { label: "Gender", value: "Male" },
        { label: "Relation", value: "Spouse" },
        { label: "Marital Status", value: "Single" },
        { label: "Nationality", value: "South African" },
        { label: "Country", value: "South Africa" },
      ],
      banking: [
        { label: "Account Holder", value: "Impala Platinum Limited" },
        { label: "Bank", value: "FNB" },
        { label: "Account Type", value: "Current" },
        { label: "Account No", value: "32798423898452" },
        { label: "Branch", value: "Universal" },
        { label: "Branch Code", value: "49344" },
      ],
      addresses: [
        {
          type: "Postal",
          line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
        },
      ],
    },
    {
      name: "Mr. Liam Johnsontal",
      email: "liam.johnson@insuretech.co.za",
      phone: "011 555 0102",
      demographics: [
        { label: "ID Type", value: "SA ID" },
        { label: "ID/ Passport number", value: "1409225155081" },
        { label: "Date of Birth", value: "2014-09-22" },
        { label: "Gender", value: "Male" },
        { label: "Relation", value: "Son" },
        { label: "Marital Status", value: "Single" },
        { label: "Nationality", value: "South African" },
        { label: "Country", value: "South Africa" },
      ],
      banking: [
        { label: "Account Holder", value: "Impala Platinum Limited" },
        { label: "Bank", value: "Standard Bank" },
        { label: "Account Type", value: "Savings" },
        { label: "Account No", value: "10298423891140" },
        { label: "Branch", value: "Universal" },
        { label: "Branch Code", value: "51001" },
      ],
      addresses: [
        {
          type: "Postal",
          line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
        },
      ],
    },
  ],
  earnings: [
    [
      [
        { label: "Variable Subtotal", value: "N/A" },
        { label: "Non-Variable Subtotal", value: "15,820.00" },
      ],
      [{ label: "Total Earnings", value: "15,820.00" }],
      [
        { label: "Created By", value: "John Doe" },
        { label: "Created Date", value: "12-03-2026" },
      ],
      [
        { label: "Is Verified", value: "Yes" },
        { label: "Is Estimated", value: "Yes" },
        { label: "Earning Type", value: "Accident" },
      ],
    ],
  ],
  earningsDocuments: [
    {
      name: "Statement of Earnings",
      fileName: "STATEMENT_EARNINGS.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    { name: "Current Earnings" },
    { name: "Section 51" },
    { name: "Section 51 Confirmation Letter" },
    { name: "RMA Formula Sheet" },
    { name: "Payslips" },
    { name: "Contract of Agreement" },
    { name: "TPE" },
  ],
  requirements: [
    {
      name: "Final Medical Report Outstanding",
      fileName: "STATEMENT_EARNINGS.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Passport Document Outstanding",
      fileName: "STATEMENT_EARNINGS.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "First Medical Report Outstanding",
      fileName: "STATEMENT_EARNINGS.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Progress Medical Report Outstanding",
      fileName: "STATEMENT_EARNINGS.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
  ],
  medicalReports: {
    firstMedicalReport: [
      {
        healthcareProviderName: "BAFOKENG MINE HOSPITAL",
        practiceNumber: "1131311",
        ICD10Code: "S90.3",
        consultationDate: "10 Jan 2024",
        status: "Accepted",
        updatedBy: "John Doe",
        formDetails: {
          receivedDate: "2026/07/10",
          hcpPracticeNumber: "1131311",
          healthcareProviderName: "BAFOKENG MINE HOSPITAL",
          medicalReportCategory: "General Report",
          dateOfConsultation: "2026/07/09",
          clinicalDescription: "Contusion left foot",
          mechanismOfInjury: "Contusion left foot",
          bodySide: "Left",
          severity: "Mild",
          isNextReviewDateApplicable: false,
          isPreExistingCondition: false,
          isInjuryMechanismConsistent: false,
          isPatientEligibleForDaysOff: false,
          medicalDocuments: [
            {
              documentId: 1,
              documentType: "FirstMedicalReport",
              fileName: "Acute Medication.pdf",
              uploadedDate: "2024-01-10T10:32:00Z",
            },
          ],
          icd10Codes: [
            {
              description: "Contusion other parts of foot",
              code: "S90.3",
              expiryDate: "2026-07-18",
              severity: "Mild",
              mmiDays: "09",
              bodySide: "Left",
            },
          ],
        },
      },
    ],
    progressMedicalReports: [],
    finalMedicalReports: [],
    sickNoteMedicalReports: [],
  },
  documentGroups: [
    {
      title: "Claim Medical Documents",
      documents: [
        {
          name: "First medical report",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "Progress medical report",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "Final medical report",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "Sick medical report",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
      ],
    },
    {
      title: "Common Personal Documents",
      documents: [
        {
          name: "Passport Document",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "ID Copy",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "Banking Details",
          documentType: "Acute Medication.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        { name: "Death Certificate" },
        {
          name: "Marriage Certificate",
          documentType: "Marriage Certificate.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
        {
          name: "Employee ID copy",
          documentType: "Employee ID copy.pdf",
          uploadedAt: "10 Jan 2024 · 10:32 am",
        },
      ],
    },
  ],
  invoiceDocuments: [
    {
      name: "Hospital Invoice",
      documentType: "Hospital Invoice.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Pharmacy Invoice",
      documentType: "Pharmacy Invoice.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
  ],
  medicalReportDocuments: [
    {
      name: "Specialist Report",
      documentType: "Specialist Report.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Radiology Report",
      documentType: "Radiology Report.pdf",
      uploadedAt: "10 Jan 2024 · 10:32 am",
    },
  ],
  letters: [
    {
      name: "RMA Claim form",
      metaLabel: "Last updated on",
      documentType: "10 Jan 2024 · 10:32 am",
    },
  ],
  employment: [
    {
      title: "Person Employment",
      fields: [
        { label: "Skilled / Unskilled", value: "Unskilled" },
        { label: "Trainee/Learner/Apprentice?", value: "No" },
        { label: "Start Date with Employer", value: "2001-03-30" },
        { label: "Paterson Grading", value: "N/A" },
        { label: "RMA Employee Ref Number", value: "N/A" },
        { label: "Employee Number", value: "34534636" },
        { label: "Employee Industry Number", value: "45435345" },
        { label: "Occupation", value: "Mine Worker" },
      ],
    },
  ],
};

const completedClaim: ClaimDetails = {
  ...pendingClaim,
  id: "CLM-2024-004",
  claimRef: "M/2006053/1/341B/26",
  status: "Closed",
  amountClaimed: "R 21,300.00",
  description:
    "Employee sustained a lower back strain while lifting stock during a night shift. The claim has been assessed, all invoices settled and the claim finalised.",
  invoices: pendingClaim.invoices.map((invoice) => ({
    ...invoice,
    status: "Paid",
  })),
  medicalInvoices: pendingClaim.medicalInvoices.map((invoice) => ({
    ...invoice,
    status: "Paid",
  })),
  payments: pendingClaim.payments.map((payment) => ({
    ...payment,
    status: "Paid",
  })),
};

export const claimDetailsById: Record<string, ClaimDetails> = {
  [pendingClaim.id]: pendingClaim,
  [completedClaim.id]: completedClaim,
};

export function getClaimDetails(claimId: string): ClaimDetails {
  return claimDetailsById[claimId] ?? pendingClaim;
}
