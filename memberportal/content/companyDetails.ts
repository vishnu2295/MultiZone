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

export type CompanyInvoice = {
  invoiceNumber: string;
  invoiceNumberFull: string;
  collectionCycle: string;
  amount: string;
  status: string;
};

export type CompanyDocument = {
  name: string;
  documentType: string;
  date: string;
};

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

  invoices: [
    {
      invoiceNumber: "INV-2024-001",
      invoiceNumberFull: "58934503495",
      collectionCycle: "26/07/2026",
      amount: "R 4,250.00",
      status: "Paid",
    },
    {
      invoiceNumber: "INV-2024-002",
      invoiceNumberFull: "58934503495",
      collectionCycle: "26/07/2026",
      amount: "R 4,250.00",
      status: "Paid",
    },
    {
      invoiceNumber: "INV-2024-003",
      invoiceNumberFull: "58934503812",
      collectionCycle: "26/06/2026",
      amount: "R 3,980.00",
      status: "Overdue",
    },
  ] satisfies CompanyInvoice[],

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
