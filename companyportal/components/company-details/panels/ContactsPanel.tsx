"use client";

import { useState } from "react";
import { companyDetailsContent } from "@/content/companyDetails";
import { UserIcon, MailIcon, PhoneIcon, EditIcon, TrashIcon } from "@/components/home/icons";
import EditContactModal, {
  type EditableContact,
} from "@/components/company-details/EditContactModal";
import DeleteConfirmModal from "@/components/company-details/DeleteConfirmModal";

export default function ContactsPanel() {
  const [contacts, setContacts] = useState<EditableContact[]>(
    companyDetailsContent.contacts
  );
  const [editingIndex, setEditingIndex] = useState<number | null>(null);
  const [deletingIndex, setDeletingIndex] = useState<number | null>(null);

  const editingContact = editingIndex !== null ? contacts[editingIndex] : null;
  const deletingContact = deletingIndex !== null ? contacts[deletingIndex] : null;

  return (
    <div className="flex flex-col gap-2.5">
      {contacts.map((contact, index) => (
        <div
          key={`${contact.email}-${index}`}
          className="flex flex-col gap-3 rounded-xl bg-white px-3 py-2 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex items-start gap-3">
            <UserIcon className="mt-1 h-[14px] w-[14px] shrink-0 text-[#00BBE6]" />
            <div className="flex flex-col gap-1.5">
              <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                {contact.name}
              </span>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-1">
                <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#13537B]">
                  <MailIcon className="h-[13px] w-[13px] shrink-0" />
                  {contact.email}
                </span>
                <span className="flex items-center gap-2.5 text-[12px] font-normal leading-[18px] text-[#13537B]">
                  <PhoneIcon className="h-[13px] w-[13px] shrink-0" />
                  {contact.phone}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <span className="rounded-full bg-[#07C1E9] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-white">
              {contact.badge}
            </span>
            <button
              type="button"
              onClick={() => setEditingIndex(index)}
              className="flex items-center cursor-pointer gap-1.5 rounded-md border border-[#07C1E9]/12 bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#07C1E9]/10"
            >
              <EditIcon className="h-[13px] w-[13px]" />
              Edit
            </button>
            <button
              type="button"
              onClick={() => setDeletingIndex(index)}
              className="flex items-center cursor-pointer gap-1.5 rounded-md border border-[#E90707]/12 bg-[#FFF6F6] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#E90707]/10"
            >
              <TrashIcon className="h-4 w-4 text-[#E77B7B]" />
              Delete
            </button>
          </div>
        </div>
      ))}

      <EditContactModal
        key={editingIndex ?? "closed"}
        open={editingIndex !== null}
        contact={editingContact}
        onClose={() => setEditingIndex(null)}
        onSave={(updated) => {
          if (editingIndex === null) return;
          setContacts((prev) =>
            prev.map((item, index) =>
              index === editingIndex ? updated : item,
            ),
          );
          setEditingIndex(null);
        }}
      />

      <DeleteConfirmModal
        open={deletingIndex !== null}
        title="Delete Contact"
        description={
          deletingContact ? (
            <>
              Are you sure you want to remove{" "}
              <span className="font-semibold text-[#13537B]">
                {deletingContact.name.replace(/^\w+\.?\s+/, "")}
              </span>
              ? This action cannot be undone.
            </>
          ) : null
        }
        onCancel={() => setDeletingIndex(null)}
        onConfirm={() => {
          if (deletingIndex === null) return;
          setContacts((prev) =>
            prev.filter((_, index) => index !== deletingIndex),
          );
          setDeletingIndex(null);
        }}
      />
    </div>
  );
}
