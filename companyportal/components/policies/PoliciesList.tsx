"use client";

import { useState } from "react";
import { policiesContent } from "@/content/policies";
import PolicyCard from "@/components/policies/PolicyCard";

type Tab = (typeof policiesContent.tabs)[number];

const tabStatus: Record<Tab, "active" | "inactive"> = {
  "Active Policies": "active",
  "Inactive Policies": "inactive",
};

export default function PoliciesList() {
  const [activeTab, setActiveTab] = useState<Tab>(policiesContent.tabs[0]);
  const visiblePolicies = policiesContent.policies.filter(
    (policy) => policy.status === tabStatus[activeTab]
  );

  return (
    <div>
      <div className="flex flex-wrap items-center gap-2">
        {policiesContent.tabs.map((tab) => (
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

      <div className="mt-6 flex flex-col gap-5">
        {visiblePolicies.length > 0 ? (
          visiblePolicies.map((policy, index) => (
            <PolicyCard key={`${policy.title}-${index}`} policy={policy} />
          ))
        ) : (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
            {policiesContent.emptyState}
          </div>
        )}
      </div>
    </div>
  );
}
