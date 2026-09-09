"use client";

import { DownloadIcon } from "@/components/home/icons";
import StatusPill from "@/components/claim-details/panels/StatusPill";
import { dummyPolicyCollections } from "@/content/policyDetails";

export default function PolicyCollectionsPanel() {
  if (dummyPolicyCollections.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(218,218,218,0.08)]">
        There are no collections to display.
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {dummyPolicyCollections.map((collection) => (
        <div
          key={collection.id}
          className="flex flex-col gap-3 rounded-2xl bg-white p-4 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
        >
          <div className="flex flex-col gap-0.5">
            <span className="text-[14px] font-bold leading-[21px] text-[#13537B]">
              {collection.invoiceNumber}
            </span>
            <span className="flex flex-wrap items-center gap-x-3 gap-y-0.5 text-[11.5px] leading-[17px] text-[#64748B]">
              <span>
                Collection Cycle
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.collectionCycle}
                </span>
              </span>
              <span>
                Amount
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.amount}
                </span>
              </span>
              <span>
                Document Date
                <span className="font-semibold text-[#13537B]">
                  {" "}
                  : {collection.documentDate}
                </span>
              </span>
            </span>
          </div>

          <div className="flex shrink-0 items-center gap-3">
            <StatusPill status={collection.status} />
            <button
              type="button"
              aria-label={`Download ${collection.invoiceNumber}`}
              className="flex h-9 w-9 shrink-0 cursor-pointer items-center justify-center rounded-lg border border-black/8 text-[#13537B] transition hover:bg-[#F3F7FA]"
            >
              <DownloadIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
