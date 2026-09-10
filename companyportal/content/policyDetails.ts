export const policyDetailsTabs = ["Documents", "Collections"] as const;
export type PolicyDetailsTab = (typeof policyDetailsTabs)[number];

export interface PolicyDetail {
  policyId: number;
  code: string;
  status: string;
  title: string;
  policyNumber: string;
  productOption: string;
  inceptionDate: string;
  expiryDate: string;
  insurer: string;
  paymentFrequency: string;
}

export interface ApiPolicyDetail {
  policyId: number;
  policyNumber: string;
  productName: string;
  productOption?: string;
  status: string;
  annualPremium?: number | null;
  premium?: number | null;
  coverAmount?: number;
  paymentFrequency?: string;
  paymentMethod?: string;
  inceptionDate?: string;
  expiryDate?: string;
  lastReinstateDate?: string | null;
  reinstateReason?: string | null;
  clientReference?: string;
  insurer?: string;
  brokerage?: string;
  representative?: string;
  cancellationInitiationDate?: string | null;
  cancellationInitiationBy?: string | null;
  cancellationReason?: string | null;
  cancellationDate?: string | null;
  complianceStatus?: string;
}

const checkValueExists = (value: string | undefined | null): string =>
  value && value.trim() ? value : "N/A";

/** "BiAnnually" -> "Bi Annually" */
function formatEnumLabel(value: string | undefined | null): string {
  if (!value) return "N/A";
  return value.replace(/([a-z])([A-Z])/g, "$1 $2");
}

export function mapApiPolicyDetail(api: ApiPolicyDetail): PolicyDetail {
  return {
    policyId: api.policyId,
    code: api.productName ? api.productName.toUpperCase() : "-",
    status: checkValueExists(api.complianceStatus ?? api.status),
    title: checkValueExists(api.productOption ?? api.productName),
    policyNumber: checkValueExists(api.policyNumber),
    productOption: checkValueExists(api.productOption ?? api.productName),
    inceptionDate: api.inceptionDate
      ? new Date(api.inceptionDate).toLocaleDateString("en-GB")
      : "-",
    expiryDate: api.expiryDate
      ? new Date(api.expiryDate).toLocaleDateString("en-GB")
      : "-",
    insurer: checkValueExists(api.insurer),
    paymentFrequency: formatEnumLabel(api.paymentFrequency),
  };
}

export interface ApiPolicyInvoiceAttachment {
  fileName: string;
  fileType: string;
  content: string;
}

export interface ApiPolicyInvoice {
  invoiceId: number;
  invoiceNumber: string;
  invoiceDate: string;
  dateSubmitted: string;
  invoiceStatus: string;
  invoiceAmount: number;
  authorisedAmount: number;
  isPreauthorised: boolean;
  claimReferenceNumber: string;
  attachments?: ApiPolicyInvoiceAttachment;
}

export interface PolicyCollection {
  id: string;
  invoiceNumber: string;
  collectionCycle: string;
  amount: string;
  documentDate: string;
  status: string;
  attachment?: ApiPolicyInvoiceAttachment;
}

export function mapApiPolicyInvoice(api: ApiPolicyInvoice): PolicyCollection {
  return {
    id: String(api.invoiceId),
    invoiceNumber: checkValueExists(api.invoiceNumber),
    collectionCycle: api.invoiceDate
      ? new Date(api.invoiceDate).toLocaleDateString("en-GB")
      : "-",
    amount: `R ${api.invoiceAmount.toLocaleString("en-ZA", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`,
    documentDate: api.dateSubmitted
      ? new Date(api.dateSubmitted).toLocaleDateString("en-GB")
      : "-",
    status: checkValueExists(api.invoiceStatus),
    attachment: api.attachments,
  };
}
