export type ClaimSection =
  | "Claimant & Injury Details"
  | "Employment"
  | "Beneficiaries"
  | "Earnings"
  | "Requirements"
  | "Medical Records"
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

export type ClaimantTab = "Claimant Details" | "Injury Details" | "ICD 10 Codes";

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
};

export type ClaimUploadDocument = {
  name: string;
  fileName?: string;
  uploadedAt?: string;
};

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

export type ClaimFieldGroup = {
  title: string;
  fields: Array<{ label: string; value: string }>;
};

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
  earnings: Array<Array<{ label: string; value: string }>>;
  earningsDocuments: ClaimUploadDocument[];
  requirements: ClaimUploadDocument[];
  medicalRecords: ClaimMedicalRecords;
  documentGroups: ClaimDocumentGroup[];
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
  "Medical Records",
  "Documents",
  "Letters & Templates",
] as const;

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
    { label: "Brief Description of Injury", value: "Concussion in the Left foot" },
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
  medicalRecords: {
    report: {
      title: "First Medical Report",
      fields: [
        { label: "Received Date", value: "2026/07/10" },
        { label: "HCP Practice Number", value: "1131311" },
        { label: "Healthcare Provider Name", value: "BAFOKENG MINE HOSPITAL" },
        { label: "Medical Report Category", value: "General Report" },
        { label: "Date of Consultation", value: "2026/07/09" },
        { label: "Clinical Description", value: "Contusion left foot" },
        { label: "Mechanism of Injury", value: "Contusion left foot" },
        { label: "Body Side", value: "Left" },
        { label: "Severity", value: "Mild" },
        { label: "Is Next Review Date Applicable?", value: "No" },
        { label: "Treatment Provided", value: "Contusion left foot" },
        { label: "Affected Body Side", value: "Left" },
      ],
    },
    checks: [
      { label: "Is next review date applicable?", checked: false },
      { label: "Is a pre-existing condition?", checked: false },
      { label: "Is the injury mechanism consistent?", checked: false },
      { label: "Is the patient eligible for days off?", checked: false },
    ],
    documents: [
      {
        name: "First medical report",
        documentType: "Acute Medication.pdf",
        uploadedAt: "10 Jan 2024 · 10:32 am",
      },
    ],
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

export function getClaimDetails(claimId: string): ClaimDetails | undefined {
  return claimDetailsById[claimId];
}
