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
  uuid: string;
  documentUri: string;
  documentSet: number;
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
  createdDate?: string;
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

export interface ApiDocumentSetDocumentType {
  id: number;
  docTypeId: number;
  documentSet: number;
  required: boolean;
  statusEnabled: boolean;
  templateAvailable: boolean;
  isDeleted: boolean;
  createdBy: string;
  createdDate: string | null;
  modifiedBy: string;
  modifiedDate: string | null;
  documentTypeName: string | null;
}

/**
 * One selectable document type returned by `/employer/documentTypes/{documentSet}`.
 * `id` is the docTypeId to submit with the upload; `name` is its display label
 * (`documentSetDocumentTypes[].documentTypeName` is unreliable/null).
 */
export interface ApiDocumentSet {
  id: number;
  name: string;
  validDays: string | null;
  createdBy: string;
  createdDate: string | null;
  modifiedBy: string;
  modifiedDate: string | null;
  manager: string;
  documentSetDocumentTypes: ApiDocumentSetDocumentType[];
}

export interface ApiEmployerDocument {
  documentId: number;
  uuid: string;
  documentKeySet: string;
  documentKey: string;
  systemName: string;
  documentSet: number;
  documentTypeId: number;
  required: boolean;
  documentType: string;
  fileName: string;
  fileExtension: string;
  documentDescription: string;
  isMemberVisible: boolean;
  documentStatus: number;
  documentUri: string;
  isDeleted: boolean;
  createdBy: string;
  uploadedDate: string;
  createdDate: string;
  modifiedBy: string;
  modifiedDate: string;
  fileContent: string;
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
    .slice(0, 2)
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
    createdDate: res.createdDate ? res.createdDate.slice(0, 10) : "-",
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

export function mapApiEmployerDocuments(
  docs: ApiEmployerDocument[],
): CompanyDocument[] {
  return docs
    .filter((doc) => !doc.isDeleted)
    .map((doc) => ({
      name: doc.fileName,
      documentType: doc.documentType,
      date: `${new Date(doc.uploadedDate).toLocaleDateString("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
      })} · ${doc.fileExtension.split("/").pop()?.toUpperCase() ?? doc.fileExtension}`,
      documentId: String(doc.documentId),
      uuid: doc.uuid,
      documentUri: doc.documentUri,
      documentSet: doc.documentSet,
    }));
}

export function mapApiContact(api: ApiContactDetails): CompanyContact & {
  title?: string;
  firstName?: string;
  surname?: string;
  communicationType?: string;
  contactNo?: string;
  designation?: string;
  contactContext?: string;
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
    contactContext: api.contactContext ?? "",
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
