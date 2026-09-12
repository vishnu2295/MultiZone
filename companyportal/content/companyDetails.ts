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
  policyNumber: string;
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
  rolePlayerAddressId?: number;
  rolePlayerId?: number;
  addressType?: string | null;
  addressLine1?: string | null;
  addressLine2?: string | null;
  postalCode?: string | null;
  city?: string | null;
  province?: string | null;
  country?: string | null;
  isPrimary?: boolean;
  effectiveDate?: string | null;
  isDeleted?: boolean;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  /**
   * Tolerate any field the backend sends that this app doesn't otherwise
   * know about, so `mapApiAddress` → `toApiAddressDetails` round-trips it
   * back unchanged on save instead of silently dropping it.
   */
  [key: string]: unknown;
}

/**
 * One selected "contact context" (`ContactContextEnum` value) linked to a
 * contact. The full set for a contact is round-tripped on every save: an
 * entry is added when its context is selected, and flagged `isDeleted` (never
 * removed outright once persisted) when deselected.
 */
export interface ApiRolePlayerContactInformation {
  rolePlayerContactInformationId: number;
  rolePlayerContactId: number;
  /** `ContactContextEnum` key, e.g. "IntermediaryAssistant" — a string field, not numeric. */
  contactInformationType: string | null;
  isDeleted: boolean;
  modifiedBy?: string | null;
  modifiedDate?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  /** Tolerate any field the backend sends that this app doesn't otherwise know about. */
  [key: string]: unknown;
}

export interface ApiContactDetails {
  rolePlayerContactId?: number;
  rolePlayerId?: number;
  title?: string | null;
  firstname?: string | null;
  surname?: string | null;
  emailAddress?: string | null;
  telephoneNumber?: string | null;
  contactNumber?: string | null;
  communicationType?: string | null;
  contactDesignationType?: string | null;
  isConfirmed?: boolean;
  isDeleted?: boolean;
  rolePlayerContactInformations?: ApiRolePlayerContactInformation[];
  modifiedBy?: string | null;
  modifiedDate?: string | null;
  createdBy?: string | null;
  createdDate?: string | null;
  /**
   * Tolerate any field the backend sends that this app doesn't otherwise
   * know about, so `mapApiContact` → `toApiContactDetails` round-trips it
   * back unchanged on save instead of silently dropping it.
   */
  [key: string]: unknown;
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
  policyNumber: string;
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
  raw: ApiAddressDetails;
  rolePlayerAddressId?: number;
  rolePlayerId?: number;
  effectiveFrom: string;
  addressLine1: string;
  addressLine2: string;
  city: string;
  stateProvince: string;
  postalCode: string;
  country: string;
  isDeleted: boolean;
} {
  const line =
    [api.addressLine1, api.addressLine2, api.city, api.province, api.postalCode]
      .filter(Boolean)
      .join(", ") || "-";

  return {
    raw: api,
    rolePlayerAddressId: api.rolePlayerAddressId,
    rolePlayerId: api.rolePlayerId,
    type:
      api.addressType === "Physical" || api.addressType === "Delivery"
        ? api.addressType
        : "Postal",
    line,
    primary: api.isPrimary ?? false,
    effectiveFrom: api.effectiveDate ? api.effectiveDate.slice(0, 10) : "-",
    addressLine1: api.addressLine1 ?? "",
    addressLine2: api.addressLine2 ?? "",
    city: api.city ?? "",
    stateProvince: api.province ?? "",
    postalCode: api.postalCode ?? "",
    country: api.country ?? "",
    isDeleted: api.isDeleted ?? false,
  };
}

export function mapApiInvoice(api: ApiInvoice): CompanyInvoice {
  return {
    invoiceNumber: api.invoiceNumber,
    policyNumber: checkValueExists(api.policyNumber),
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

/** "PrimaryContact" -> "Primary Contact", matching the space-separated designation options the UI presents. */
function humanizeDesignation(value: string): string {
  return value.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
}

export function mapApiContact(api: ApiContactDetails): CompanyContact & {
  raw: ApiContactDetails;
  rolePlayerContactId?: number;
  title?: string;
  firstName?: string;
  surname?: string;
  communicationType?: string;
  contactNo?: string;
  designation?: string;
  contactContext: string[];
  rolePlayerContactInformations: ApiRolePlayerContactInformation[];
  isDeleted: boolean;
} {
  const name = [api.title ? `${api.title}.` : "", api.firstname, api.surname]
    .filter(Boolean)
    .join(" ");

  const rolePlayerContactInformations = api.rolePlayerContactInformations ?? [];
  const contactContext = rolePlayerContactInformations
    .filter((info) => !info.isDeleted && info.contactInformationType != null)
    .map((info) => info.contactInformationType as string);

  const designation = api.contactDesignationType
    ? humanizeDesignation(api.contactDesignationType)
    : "";
  // `telephoneNumber` is the populated field in practice; `contactNumber` is
  // kept around (and always round-tripped via `raw`) but falls back here.
  const phone = api.telephoneNumber || api.contactNumber || "";

  return {
    // The full original record, so a save can spread it and override only
    // the fields this form actually edits — nothing the backend sends
    // (audit fields, ids, flags this UI doesn't know about) gets dropped.
    raw: api,
    name: name || "-",
    badge: designation ? designation.split(" ")[0] : "-",
    email: checkValueExists(api.emailAddress),
    phone: checkValueExists(phone),
    rolePlayerContactId: api.rolePlayerContactId,
    title: api.title ?? "",
    firstName: api.firstname ?? "",
    surname: api.surname ?? "",
    communicationType: api.communicationType ?? "",
    contactNo: phone,
    designation,
    contactContext,
    rolePlayerContactInformations,
    isDeleted: api.isDeleted ?? false,
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
