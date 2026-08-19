export type CompanyAddress = {
  type: "Postal" | "Physical" | "Delivery";
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
  documentId: string;
};

export interface CompanyInfo {
  code: string;
  status: string;
  name: string;
  regNo: string;
  industryClass: string;
  industry: string;
  vatRegNo: string;
  compensationFundRef: string;
  compensationFundReg: string;
  compensationFundStatus: string;
  natureOfBusiness: string;
  createdDate: string;
}

export interface ApiEmployerDetails {
  memberNumber: string;
  status: string;
  memberName: string;
  joinDate: string;
  clientType: string;
  medicalBenefitWaitingPeriod: string;
  rolePlayerId: number;
}

export interface ApiCompanyDetails {
  companyName?: string;
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
  isPrimary?: boolean;
}

export interface ApiContactDetails {
  title?: string;
  firstname?: string;
  surname?: string;
  communicationType?: string;
  contactNumber?: string;
  emailAddress?: string;
  contactDesignation?: string;
  contactContext?: string;
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

export interface ApiPagedResponse<T> {
  data: T[];
  rowCount: number;
  page: number;
  pageSize: number;
  pageCount: number;
}

export type ApiInvoicesResponse = ApiPagedResponse<ApiInvoice>;

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

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

function initialsFromName(name: string): string {
  return name
    .split(/\s+/)
    .filter(Boolean)
    .map((word) => word[0].toUpperCase())
    .join("");
}

export function mapApiCompanyDetails(
  res: ApiCompanyDetails & ApiEmployerDetails,
): CompanyInfo {
  return {
    code: res.companyName ? initialsFromName(res.companyName) : "-",
    status: checkValueExists(res.status),
    name: checkValueExists(res.companyName),
    regNo: checkValueExists(res.companyRegistrationNumber),
    industryClass: checkValueExists(res.industryClass),
    industry: checkValueExists(res.industryType),
    vatRegNo: checkValueExists(res.vatRegistrationNumber),
    compensationFundRef: checkValueExists(res.compensationFundReferenceNumber),
    compensationFundReg: checkValueExists(
      res.compensationFundRegistrationNumber,
    ),
    compensationFundStatus: checkValueExists(res.compensationFundStatus),
    natureOfBusiness: checkValueExists(res.natureOfBusiness),
    createdDate: res.joinDate ? res.joinDate.slice(0, 10) : "-",
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
    type:
      api.type === "Physical" || api.type === "Delivery" ? api.type : "Postal",
    line,
    primary: api.isPrimary ?? false,
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

export function mapApiContact(api: ApiContactDetails): CompanyContact & {
  title?: string;
  firstName?: string;
  surname?: string;
  communicationType?: string;
  contactNo?: string;
  designation?: string;
  contractContext?: string;
} {
  const name = [api.title ? `${api.title}.` : "", api.firstname, api.surname]
    .filter(Boolean)
    .join(" ");

  return {
    name: name || "-",
    badge: api.contactDesignation ? api.contactDesignation.split(" ")[0] : "-",
    email: checkValueExists(api.emailAddress),
    phone: checkValueExists(api.contactNumber),
    title: api.title ?? "",
    firstName: api.firstname ?? "",
    surname: api.surname ?? "",
    communicationType: api.communicationType ?? "",
    contactNo: api.contactNumber ?? "",
    designation: api.contactDesignation ?? "",
    contractContext: api.contactContext ?? "",
  };
}

export function mapApiBankDetails(api: ApiBankDetails): CompanyBankingDetail {
  return {
    accountHolder: checkValueExists(api.accountHolder),
    bank: checkValueExists(api.bank),
    accountNumber: checkValueExists(api.accountNumber),
    accountType: checkValueExists(api.accountType),
    branch: checkValueExists(api.branch),
    branchCode: checkValueExists(api.branchCode),
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

  documentTypes: [
    "Acute Medication",
    "Certificate of Good Standing",
    "COIDA Registration Letter",
    "Compensation Fund Confirmation",
  ],
};
