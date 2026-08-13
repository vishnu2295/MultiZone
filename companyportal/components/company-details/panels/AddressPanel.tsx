"use client";

import { useState } from "react";
import { companyDetailsContent } from "@/content/companyDetails";
import { EditIcon, PinIcon } from "@/components/home/icons";
import EditAddressModal, {
  type EditableAddress,
} from "@/components/company-details/EditAddressModal";

export default function AddressPanel() {
  const [addresses, setAddresses] = useState<EditableAddress[]>(
    companyDetailsContent.addresses
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const editingAddress = editingIndex !== null ? addresses[editingIndex] : null;

  return (
    <div className="flex flex-col gap-2.5">
      {addresses.map((address, index) => (
        <div
          key={`${address.type}-${index}`}
          className="flex flex-col gap-3 rounded-xl bg-white p-3 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-center gap-3">
            <PinIcon className="mt-0.5 h-[14px] w-[14px] shrink-0 text-[#07C1E9]" />
            <div className="flex flex-col">
              <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                {address.type}
              </span>
              <span className="text-[13.5px] font-normal leading-[22px] text-[#13537B]">
                {address.line}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            {address.primary && (
              <span className="rounded-full bg-[#07C1E9] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-white">
                Primary
              </span>
            )}
            <button
              type="button"
              onClick={() => setEditingIndex(index)}
              className="flex items-center cursor-pointer gap-1.5 rounded-md border border-[#07C1E9]/12 bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#07C1E9]/10"
            >
              <EditIcon className="h-[13px] w-[13px]" />
              Edit
            </button>
          </div>
        </div>
      ))}

      <EditAddressModal
        key={editingIndex ?? "closed"}
        open={editingIndex !== null}
        address={editingAddress}
        onClose={() => setEditingIndex(null)}
        onSave={(updated) => {
          if (editingIndex === null) return;
          setAddresses((prev) =>
            prev.map((item, index) =>
              index === editingIndex ? updated : item,
            ),
          );
          setEditingIndex(null);
        }}
      />
    </div>
  );
}
