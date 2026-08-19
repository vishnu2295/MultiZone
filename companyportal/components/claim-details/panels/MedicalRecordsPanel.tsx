"use client";

import { useState } from "react";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import IcdCodeCard from "@/components/claim-details/panels/IcdCodeCard";
import type { ClaimIcdCode, ClaimMedicalRecords } from "@/content/claimDetails";

export default function MedicalRecordsPanel({
  medicalRecords,
  icdCodes,
}: {
  medicalRecords: ClaimMedicalRecords;
  icdCodes: ClaimIcdCode[];
}) {
  const [checks, setChecks] = useState(medicalRecords.checks);

  const toggleCheck = (label: string) => {
    setChecks((prev) =>
      prev.map((check) =>
        check.label === label ? { ...check, checked: !check.checked } : check,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Medical Records
      </h2>

      <section className="rounded-xl bg-white px-4 py-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:px-5">
        <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          {medicalRecords.report.title}
        </h3>

        <div className="mt-5 grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
          {medicalRecords.report.fields.map((field) => (
            <div key={field.label} className="flex flex-col">
              <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
                {field.label}
              </span>
              <span className="pt-0.5 text-[13px] font-bold leading-5 text-[#13537B]">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Medical Records
      </h2>

      <div className="w-full max-w-[455px] rounded-xl bg-white px-4 py-3 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
        {checks.map((check, index) => (
          <div key={check.label}>
            {index > 0 && index % 2 === 0 && (
              <span className="my-2 block h-px w-full bg-black/5" aria-hidden />
            )}

            <label className="flex cursor-pointer items-center gap-3 py-2">
              <input
                type="checkbox"
                checked={check.checked}
                onChange={() => toggleCheck(check.label)}
                className="h-4 w-4 cursor-pointer rounded border-black/20 accent-[#07C1E9]"
              />
              <span className="text-[13.5px] font-semibold leading-[20px] text-[#13537B]">
                {check.label}
              </span>
            </label>
          </div>
        ))}
      </div>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Claim Medical Documents
      </h2>

      <div className="flex flex-col gap-4">
        {medicalRecords.documents.map((document) => (
          <DocumentRow key={document.name} document={document} />
        ))}
      </div>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">ICD 10 Codes</h2>

      <div className="flex flex-col gap-4">
        {icdCodes.map((icdCode, index) => (
          <IcdCodeCard key={`${icdCode.code}-${index}`} icdCode={icdCode} />
        ))}
      </div>
    </div>
  );
}
