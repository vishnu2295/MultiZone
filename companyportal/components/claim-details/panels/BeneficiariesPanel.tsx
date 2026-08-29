"use client";

import { useState } from "react";
import { CloseIcon, MailIcon, PhoneIcon, PinIcon } from "@/components/home/icons";
import type { ClaimBeneficiary } from "@/content/claimDetails";

function FieldGrid({ fields }: { fields: Array<{ label: string; value: string }> }) {
  return (
    <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2 lg:grid-cols-4">
      {fields.map((field) => (
        <div key={field.label} className="flex flex-col">
          <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#24577A99]">
            {field.label}
          </span>
          <span className="pt-0.5 text-[13px] font-bold leading-5 text-[#24577A]">
            {field.value}
          </span>
        </div>
      ))}
    </div>
  );
}

function BeneficiaryDetailsModal({
  beneficiary,
  onClose,
}: {
  beneficiary: ClaimBeneficiary;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onClick={onClose}
    >
      <div
        className="max-h-[90vh] w-full max-w-[960px] overflow-y-auto rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
            Beneficiary Details
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#CB1334CC] transition hover:bg-[#F3F7FA]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-col gap-6 px-6 py-6">
          <section className="flex flex-col gap-5 border-b border-black/5 pb-6">
            <h4 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
              Demographics
            </h4>
            <FieldGrid fields={beneficiary.demographics} />
          </section>

          <section className="flex flex-col gap-5 border-b border-black/5 pb-6">
            <h4 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
              Banking Details
            </h4>
            <FieldGrid fields={beneficiary.banking} />
          </section>

          <section className="flex flex-col gap-5">
            <h4 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
              Address Details
            </h4>

            <div className="flex flex-col gap-3">
              {beneficiary.addresses.map((address, index) => (
                <div
                  key={`${address.type}-${index}`}
                  className="rounded-lg border border-[#E6E6E6] bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
                >
                  <div className="flex items-start gap-2">
                    <PinIcon className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#07C1E9]" />
                    <div className="flex flex-col">
                      <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                        {address.type}
                      </span>
                      <span className="text-[13.5px] font-normal leading-[22px] text-[#13537B]">
                        {address.line}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

export default function BeneficiariesPanel({
  beneficiaries,
}: {
  beneficiaries: ClaimBeneficiary[];
}) {
  const [viewingIndex, setViewingIndex] = useState<number | null>(null);
  const viewing = viewingIndex !== null ? beneficiaries[viewingIndex] : null;

  return (
    <div className="flex flex-col gap-4">
      {beneficiaries.map((beneficiary, index) => (
        <div
          key={`${beneficiary.email}-${index}`}
          className="flex flex-col gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col">
            <span className="text-[13.5px] font-semibold leading-[22px] text-[#24577A]">
              {beneficiary.name}
            </span>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
              <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#24577A]">
                <MailIcon className="h-[13px] w-[13px] shrink-0 text-[#24577A]" />
                {beneficiary.email}
              </span>
              <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#24577A]">
                <PhoneIcon className="h-[13px] w-[13px] shrink-0 text-[#24577A]"/>
                {beneficiary.phone}
              </span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => setViewingIndex(index)}
            className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-[0.625px] border-[rgba(7,193,233,0.12)] bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#24577A] transition hover:bg-[#E4F5FC]"
          >
            View Details
          </button>
        </div>
      ))}

      {viewing && (
        <BeneficiaryDetailsModal
          beneficiary={viewing}
          onClose={() => setViewingIndex(null)}
        />
      )}
    </div>
  );
}
