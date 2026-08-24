"use client";

import { useState } from "react";
import AuthorizationsPanel from "@/components/claim-details/panels/AuthorizationsPanel";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import InvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";
import PaymentsPanel from "@/components/claim-details/panels/PaymentsPanel";
import {
  claimTabs,
  type ClaimAuthorization,
  type ClaimInvoice,
  type ClaimMedicalDocument,
  type ClaimPayment,
  type ClaimTab,
} from "@/content/claimDetails";

export default function ClaimTabsPanel({
  invoiceDocuments,
  medicalInvoices,
  authorizations,
  payments,
}: {
  invoiceDocuments: ClaimMedicalDocument[];
  medicalInvoices: ClaimInvoice[];
  authorizations: ClaimAuthorization[];
  payments: ClaimPayment[];
}) {
  const [activeTab, setActiveTab] = useState<ClaimTab>(claimTabs[0]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2">
        {claimTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
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
        <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          {activeTab}
        </h2>

        {activeTab === "Invoices" && (
          <div className="flex flex-col gap-4">
            {invoiceDocuments.map((document) => (
              <DocumentRow key={document.name} document={document} />
            ))}
          </div>
        )}
        {activeTab === "Medical Invoices" && (
          <InvoicesPanel invoices={medicalInvoices} />
        )}
        {activeTab === "Authorizations" && (
          <AuthorizationsPanel authorizations={authorizations} />
        )}
        {activeTab === "Payments" && <PaymentsPanel payments={payments} />}
      </div>
    </>
  );
}
