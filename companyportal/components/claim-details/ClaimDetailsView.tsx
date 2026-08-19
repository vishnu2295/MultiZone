"use client";

import { useState } from "react";
import ClaimInfoCard from "@/components/claim-details/ClaimInfoCard";
import AuthorizationsPanel from "@/components/claim-details/panels/AuthorizationsPanel";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import FieldGroupsPanel from "@/components/claim-details/panels/FieldGroupsPanel";
import InvoicesPanel from "@/components/claim-details/panels/InvoicesPanel";
import BeneficiariesPanel from "@/components/claim-details/panels/BeneficiariesPanel";
import DocumentUploadList from "@/components/claim-details/panels/DocumentUploadList";
import DocumentsPanel from "@/components/claim-details/panels/DocumentsPanel";
import MedicalRecordsPanel from "@/components/claim-details/panels/MedicalRecordsPanel";
import EarningsPanel from "@/components/claim-details/panels/EarningsPanel";
import ClaimantInjuryPanel from "@/components/claim-details/panels/ClaimantInjuryPanel";
import PaymentsPanel from "@/components/claim-details/panels/PaymentsPanel";
import {
  claimTabs,
  type ClaimDetails,
  type ClaimSection,
  type ClaimTab,
} from "@/content/claimDetails";

const sectionHeadings: Partial<Record<ClaimSection, string>> = {
  Employment: "Employment Details",
  "Letters & Templates": "Letters and Templates",
};

export default function ClaimDetailsView({ claim }: { claim: ClaimDetails }) {
  const [activeSection, setActiveSection] = useState<ClaimSection | null>(null);
  const [activeTab, setActiveTab] = useState<ClaimTab>(claimTabs[0]);

  return (
    <div className="relative z-10 mt-6 flex flex-col gap-6 lg:flex-row lg:items-start">
      <ClaimInfoCard
        claim={claim}
        activeSection={activeSection}
        onSelectSection={setActiveSection}
      />

      <div className="flex-1">
        {activeSection === null ? (
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

              {activeTab === "Invoices" && <InvoicesPanel invoices={claim.invoices} />}
              {activeTab === "Medical Invoices" && (
                <InvoicesPanel invoices={claim.medicalInvoices} />
              )}
              {activeTab === "Authorizations" && (
                <AuthorizationsPanel authorizations={claim.authorizations} />
              )}
              {activeTab === "Payments" && <PaymentsPanel payments={claim.payments} />}
            </div>
          </>
        ) : activeSection === "Beneficiaries" ? (
          <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
              Beneficiaries
            </h2>
            <BeneficiariesPanel beneficiaries={claim.beneficiaries} />
          </div>
        ) : activeSection === "Documents" ? (
          <DocumentsPanel groups={claim.documentGroups} />
        ) : activeSection === "Medical Records" ? (
          <MedicalRecordsPanel
            medicalRecords={claim.medicalRecords}
            icdCodes={claim.icdCodes}
          />
        ) : activeSection === "Requirements" ? (
          <DocumentUploadList title="Claim Requirements" documents={claim.requirements} />
        ) : activeSection === "Earnings" ? (
          <EarningsPanel
            earnings={claim.earnings}
            documents={claim.earningsDocuments}
          />
        ) : activeSection === "Claimant & Injury Details" ? (
          <ClaimantInjuryPanel
            details={claim.claimantDetails}
            injuryDetails={claim.injuryDetails}
            icdCodes={claim.icdCodes}
          />
        ) : (
          <div className="flex flex-col gap-4">
            <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
              {sectionHeadings[activeSection] ?? activeSection}
            </h2>

            {activeSection === "Employment" ? (
              <FieldGroupsPanel groups={claim.employment} />
            ) : (
              claim.letters.map((letter) => (
                <DocumentRow key={letter.name} document={letter} />
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
