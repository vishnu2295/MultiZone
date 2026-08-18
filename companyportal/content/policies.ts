export const policiesContent = {
  heading: "Policy Details",
  tabs: ["Active Policies", "Inactive Policies"] as const,
  emptyState: "There are no policies to display in this category.",
  policies: [
    {
      title: "Compensation of the Injury on Duty",
      policyNumber: "POL-2024-001",
      compliant: true,
      productOption: "IOD COID Policy (EMP)",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2024",
      expiryDate: "31 Dec 2024",
      actions: ["Remittance", "Policy Schedule", "Request for Letter of Good Standing"],
      status: "active" as const,
    },
    {
      title: "Value Added Products",
      policyNumber: "POL-2024-001",
      compliant: true,
      productOption: "IOD Augmentation Only",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2024",
      expiryDate: "31 Dec 2024",
      actions: ["Remittance", "Policy Schedule"],
      status: "active" as const,
    },
    {
      title: "Non Statutory Products",
      policyNumber: "POL-2024-001",
      compliant: true,
      productOption: "Riot And Strike Personal Injury",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2024",
      expiryDate: "31 Dec 2024",
      actions: ["Remittance", "Policy Schedule"],
      status: "active" as const,
    },
    {
      title: "Non Statutory Products",
      policyNumber: "POL-2024-001",
      compliant: true,
      productOption: "Riot And Strike Personal Injury",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2024",
      expiryDate: "31 Dec 2024",
      actions: ["Remittance", "Policy Schedule"],
      status: "active" as const,
    },
    {
      title: "Compensation of the Injury on Duty",
      policyNumber: "POL-2023-001",
      compliant: true,
      productOption: "IOD COID Policy (EMP)",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2023",
      expiryDate: "31 Dec 2023",
      actions: ["Remittance", "Policy Schedule", "Request for Letter of Good Standing"],
      status: "inactive" as const,
    },
    {
      title: "Value Added Products",
      policyNumber: "POL-2023-001",
      compliant: true,
      productOption: "IOD Augmentation Only",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2023",
      expiryDate: "31 Dec 2023",
      actions: ["Remittance", "Policy Schedule"],
      status: "inactive" as const,
    },
    {
      title: "Non Statutory Products",
      policyNumber: "POL-2023-001",
      compliant: true,
      productOption: "Riot And Strike Personal Injury",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2023",
      expiryDate: "31 Dec 2023",
      actions: ["Remittance", "Policy Schedule"],
      status: "inactive" as const,
    },
    {
      title: "Non Statutory Products",
      policyNumber: "POL-2023-001",
      compliant: true,
      productOption: "Riot And Strike Personal Injury",
      annualPremium: "R 2,500,000",
      premium: "R 4,250/mo",
      inceptionDate: "01 Jan 2023",
      expiryDate: "31 Dec 2023",
      actions: ["Remittance", "Policy Schedule"],
      status: "inactive" as const,
    },
  ],
};

export type Policy = (typeof policiesContent.policies)[number];

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
}

export interface ApiRemittanceDocument {
  fileName: string;
  contentType: string;
  base64Content: string;
}

const DEFAULT_ACTIONS = ["Remittance", "Policy Schedule"];

export function mapApiPolicy(policy: ApiPolicy): Policy {
  return {
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
    actions: DEFAULT_ACTIONS,
    status: policy.status.toLowerCase() === "active" ? "active" : "inactive",
  };
}
