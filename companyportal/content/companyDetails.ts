export type CompanyAddress = {
  type: "Postal" | "Physical";
  line: string;
  primary?: boolean;
};

export type CompanyContact = {
  name: string;
  badge: string;
  email: string;
  phone: string;
};

export type CompanyBankingDetail = {
  accountHolder: string;
  bank: string;
  accountNumber: string;
  accountType: string;
  branch: string;
  branchCode: string;
};

export interface ApiInvoiceAttachment {
  fileName: string;
  fileType: string;
  content: string;
}

export type CompanyInvoice = {
  invoiceNumber: string;
  invoiceNumberFull: string;
  collectionCycle: string;
  amount: string;
  status: string;
  attachment?: ApiInvoiceAttachment;
};

export type CompanyDocument = {
  name: string;
  documentType: string;
  date: string;
  documentId?: string;
};

export type CompanyInfo = typeof companyDetailsContent.company;

export interface ApiCompanyDetails {
  industryClass?: string;
  industryType?: string;
  registrationType?: string;
  companyRegistrationNumber?: string;
  compensationFundReferenceNumber?: string;
  compensationFundRegistrationNumber?: string;
  vatRegistrationNumber?: string;
  compensationFundStatus?: string;
  companyLevel?: string;
  natureOfBusiness?: string;
}

export interface ApiAddressDetails {
  type: string;
  effectiveFrom?: string;
  addressLine1?: string;
  addressLine2?: string;
  province?: string;
  city?: string;
  postalCode?: string;
  country?: string;
}

export interface ApiBankDetails {
  purpose?: string;
  bank?: string;
  branch?: string;
  accountType?: string;
  branchCode?: string;
  accountHolder?: string;
  accountNumber?: string;
  effectiveFrom?: string;
}

export interface ApiInvoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dateSubmitted: string;
  invoiceStatus: number;
  invoiceAmount: number;
  authorisedAmount: number;
  isPreauthorised: boolean;
  claimReferenceNumber: string;
  attachments?: ApiInvoiceAttachment;
}

export interface ApiInvoicesResponse {
  data: ApiInvoice[];
  rowCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export interface ApiDocument {
  documentId: string;
  documentName: string;
  uploadDate: string;
  fileType: string;
}

export interface ApiDocumentSet {
  setName: string;
  documents: ApiDocument[];
}

const INVOICE_STATUS_LABEL: Record<number, string> = {
  0: "Pending",
  1: "Approved",
  2: "Paid",
};

const orDash = (value: string | undefined | null): string =>
  value && value.trim() ? value : "-";

export function mapApiCompanyDetails(api: ApiCompanyDetails): CompanyInfo {
  return {
    code: "-",
    status: "-",
    name: "-",
    regNo: orDash(api.companyRegistrationNumber),
    industryClass: orDash(api.industryClass),
    industry: orDash(api.industryType),
    vatRegNo: orDash(api.vatRegistrationNumber),
    compensationFundRef: orDash(api.compensationFundReferenceNumber),
    compensationFundReg: orDash(api.compensationFundRegistrationNumber),
    compensationFundStatus: orDash(api.compensationFundStatus),
    natureOfBusiness: orDash(api.natureOfBusiness),
    createdDate: "-",
  };
}

export function mapApiAddress(api: ApiAddressDetails): CompanyAddress & {
  effectiveFrom: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
} {
  const line =
    [api.addressLine1, api.addressLine2, api.city, api.province, api.postalCode]
      .filter(Boolean)
      .join(", ") || "-";

  return {
    type: api.type === "Physical" ? "Physical" : "Postal",
    line,
    primary: true,
    effectiveFrom: api.effectiveFrom ? api.effectiveFrom.slice(0, 10) : "-",
    addressLine1: api.addressLine1 ?? "",
    addressLine2: api.addressLine2 ?? "",
    city: api.city ?? "",
    stateProvince: api.province ?? "",
    postalCode: api.postalCode ?? "",
    country: api.country ?? "",
  };
}

export function mapApiInvoice(api: ApiInvoice): CompanyInvoice {
  return {
    invoiceNumber: api.invoiceNumber,
    invoiceNumberFull: api.claimReferenceNumber,
    collectionCycle: new Date(api.invoiceDate).toLocaleDateString("en-GB"),
    amount: `R ${api.invoiceAmount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    status: INVOICE_STATUS_LABEL[api.invoiceStatus] ?? "Pending",
    attachment: api.attachments,
  };
}

export function mapApiDocumentSets(sets: ApiDocumentSet[]): CompanyDocument[] {
  return sets.flatMap((set) =>
    set.documents.map((doc) => ({
      name: doc.documentName,
      documentType: set.setName,
      date: `${new Date(doc.uploadDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} · ${doc.fileType}`,
      documentId: doc.documentId,
    })),
  );
}

export function mapApiBankDetails(api: ApiBankDetails): CompanyBankingDetail {
  return {
    accountHolder: orDash(api.accountHolder),
    bank: orDash(api.bank),
    accountNumber: orDash(api.accountNumber),
    accountType: orDash(api.accountType),
    branch: orDash(api.branch),
    branchCode: orDash(api.branchCode),
  };
}

export const companyDetailsContent = {
  tabs: [
    "Address Details",
    "Contacts",
    "Banking Details",
    "Invoices",
    "Documents",
  ] as const,

  company: {
    code: "IP",
    status: "Active",
    name: "Impala Platinum Limited",
    regNo: "1952/071942/06",
    industryClass: "Mining",
    industry: "Deep Under Ground Other",
    vatRegNo: "3842395",
    compensationFundRef: "12-03-2026",
    compensationFundReg: "12-03-2026",
    compensationFundStatus: "Confirmed",
    natureOfBusiness: "N/A",
    createdDate: "2026-04-23",
  },

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
    {
      type: "Physical",
      line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
    },
    {
      type: "Physical",
      line: "57 Sloane Street,Bryanston, Sandton, Gauteng, 2191",
    },
  ] satisfies CompanyAddress[],

  contacts: [
    {
      name: "Mr. Sarah Johnson",
      badge: "Primary",
      email: "sarah.johnson@insuretech.co.za",
      phone: "011 555 0101",
    },
    {
      name: "Mr. Thabo Ngobeni",
      badge: "Primary",
      email: "sarah.johnson@insuretech.co.za",
      phone: "011 555 0101",
    },
    {
      name: "Miss. Lindiwe Masoke",
      badge: "HR",
      email: "sarah.johnson@insuretech.co.za",
      phone: "011 555 0101",
    },
  ] satisfies CompanyContact[],

  bankingDetails: [
    {
      accountHolder: "Impala Platinum Limited",
      bank: "FNB",
      accountNumber: "32798423898452",
      accountType: "Current",
      branch: "Universal",
      branchCode: "49344",
    },
  ] satisfies CompanyBankingDetail[],

  documentTypes: [
    "Acute Medication",
    "Certificate of Good Standing",
    "COIDA Registration Letter",
    "Compensation Fund Confirmation",
  ],

  documents: [
    {
      name: "Compensation Fund Certificate.pdf",
      documentType: "Acute Medication",
      date: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Compensation Fund Certificate.pdf",
      documentType: "Acute Medication",
      date: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Compensation Fund Certificate.pdf",
      documentType: "Acute Medication",
      date: "10 Jan 2024 · 10:32 am",
    },
    {
      name: "Compensation Fund Certificate.pdf",
      documentType: "Acute Medication",
      date: "10 Jan 2024 · 10:32 am",
    },
  ] satisfies CompanyDocument[],
};
