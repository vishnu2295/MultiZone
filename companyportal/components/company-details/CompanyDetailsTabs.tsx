"use client";

import { useState } from "react";
import { companyDetailsContent } from "@/content/companyDetails";
import AddressPanel from "@/components/company-details/panels/AddressPanel";
import ContactsPanel from "@/components/company-details/panels/ContactsPanel";
import BankingPanel from "@/components/company-details/panels/BankingPanel";
import InvoicesPanel from "@/components/company-details/panels/InvoicesPanel";
import DocumentsPanel from "@/components/company-details/panels/DocumentsPanel";

type Tab = (typeof companyDetailsContent.tabs)[number];

const panels: Record<Tab, () => React.JSX.Element> = {
  "Address Details": AddressPanel,
  Contacts: ContactsPanel,
  "Banking Details": BankingPanel,
  Invoices: InvoicesPanel,
  Documents: DocumentsPanel,
};

export default function CompanyDetailsTabs() {
  const [activeTab, setActiveTab] = useState<Tab>(companyDetailsContent.tabs[0]);
  const ActivePanel = panels[activeTab];

  return (
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-2">
        {companyDetailsContent.tabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {activeTab !== "Documents" && (
          <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {activeTab}
          </h2>
        )}
        <ActivePanel />
      </div>
    </div>
  );
}
