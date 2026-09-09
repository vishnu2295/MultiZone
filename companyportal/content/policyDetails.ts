export const policyDetailsTabs = ["Documents", "Collections"] as const;
export type PolicyDetailsTab = (typeof policyDetailsTabs)[number];

export interface PolicyDetail {
  policyId: string;
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

export interface PolicyDetailDocument {
  id: string;
  name: string;
  year?: string;
}

export interface PolicyCollection {
  id: string;
  invoiceNumber: string;
  collectionCycle: string;
  amount: string;
  documentDate: string;
  status: "Paid" | "Pending";
}

// Dummy data until the policy details endpoints are available.
export function getDummyPolicyDetail(policyId: string): PolicyDetail {
  return {
    policyId,
    code: "COID",
    status: "Compliant",
    title: "Compensation of the injury on Duty (COID)",
    policyNumber: "POL-1952/071942/06",
    productOption: "IOD COID Policy",
    inceptionDate: "2003-01-01",
    expiryDate: "2027-01-01",
    insurer: "RAND MUTUAL ADMIN SERVICES (PTY) LTD FSP (46113)",
    paymentFrequency: "Bi Anually",
  };
}

export const dummyPolicyDocuments: PolicyDetailDocument[] = [
  { id: "policy-schedule", name: "Policy Schedule" },
  { id: "letter-of-good-standing", name: "Letter of Good Standing", year: "2026" },
];

export const dummyPolicyCollections: PolicyCollection[] = [
  {
    id: "1",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2026/01/01",
    status: "Pending",
  },
  {
    id: "2",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2025/01/01",
    status: "Paid",
  },
  {
    id: "3",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2024/01/01",
    status: "Paid",
  },
  {
    id: "4",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2023/01/01",
    status: "Paid",
  },
  {
    id: "5",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2022/01/01",
    status: "Paid",
  },
  {
    id: "6",
    invoiceNumber: "INV847222",
    collectionCycle: "2026/01/01",
    amount: "R 71,516,840.04",
    documentDate: "2021/01/01",
    status: "Paid",
  },
];
