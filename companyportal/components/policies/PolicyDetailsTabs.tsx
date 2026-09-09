"use client";

import { useState } from "react";
import { policyDetailsTabs, type PolicyDetailsTab } from "@/content/policyDetails";
import PolicyDocumentsPanel from "@/components/policies/panels/PolicyDocumentsPanel";
import PolicyCollectionsPanel from "@/components/policies/panels/PolicyCollectionsPanel";

const panels: Record<PolicyDetailsTab, () => React.JSX.Element> = {
  Documents: PolicyDocumentsPanel,
  Collections: PolicyCollectionsPanel,
};

export default function PolicyDetailsTabs() {
  const [activeTab, setActiveTab] = useState<PolicyDetailsTab>(
    policyDetailsTabs[0],
  );
  const ActivePanel = panels[activeTab];

  return (
    <div className="flex-1">
      <div className="flex flex-wrap items-center gap-2 lg:sticky lg:top-18 lg:z-20 lg:bg-[#F3F7FA] lg:py-2">
        {policyDetailsTabs.map((tab) => (
          <button
            key={tab}
            type="button"
            onClick={() => setActiveTab(tab)}
            className={`rounded-md cursor-pointer px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition ${
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
        <h2 className="text-[16px] font-bold leading-[19px] text-[#24577A]">
          {activeTab}
        </h2>
        <ActivePanel />
      </div>
    </div>
  );
}
