export const policiesContent = {
  heading: "Policy Details",
  tabs: ["Active Policies", "Inactive Policies"] as const,
  emptyState: "There are no policies to display in this category.",
};

export interface Policy {
  policyId: number;
  title: string;
  policyNumber: string;
  compliant: boolean;
  productOption: string;
  annualPremium: string;
  premium: string;
  inceptionDate: string;
  expiryDate: string;
  actions: string[];
  productStatus?: string;
  status: "active" | "inactive";
}

export interface ApiPolicy {
  policyId: number;
  policyNumber: string;
  productName: string;
  productOption?: string;
  annualPremium: number;
  premium: number;
  coverAmount: number;
  status: string;
  inceptionDate?: string;
  expiryDate?: string;
  productStatus?: string;
}

export interface ApiRemittanceDocument {
  fileName: string;
  contentType: string;
  base64Content: string;
}

export interface ApiLetterOfGoodStanding {
  letterOfGoodStandingId: number;
  rolePlayerId: number;
  issueDate: string;
  expiryDate: string;
  certificateNo: string;
  memberName: string;
  memberEmail: string;
  policyId: number;
  attachments: {
    fileName: string;
    fileType: string;
    content: string;
  };
}

const DEFAULT_ACTIONS = [
  "Remittance",
  "Policy Schedule",
  "Letter of Good Standing",
];

export function mapApiPolicy(policy: ApiPolicy): Policy {
  return {
    policyId: policy.policyId,
    title: policy.productName,
    policyNumber: policy.policyNumber,
    compliant: true,
    productOption: policy.productOption ?? policy.productName,
    annualPremium: `R ${policy.annualPremium.toLocaleString("en-ZA")}`,
    premium: `R ${policy.premium.toLocaleString("en-ZA")}/mo`,
    inceptionDate: policy?.inceptionDate
      ? new Date(policy.inceptionDate).toLocaleDateString("en-GB")
      : "-",
    expiryDate: policy?.expiryDate
      ? new Date(policy.expiryDate).toLocaleDateString("en-GB")
      : "-",
    productStatus: policy.productStatus,
    actions: DEFAULT_ACTIONS,
    status: policy.status.toLowerCase() === "active" ? "active" : "inactive",
  };
}
