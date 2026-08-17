"use client";

import { useEffect, useState } from "react";
import {
  policiesContent,
  mapApiPolicy,
  type ApiPolicy,
  type Policy,
} from "@/content/policies";
import PolicyCard from "@/components/policies/PolicyCard";
import apiService from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";

type Tab = (typeof policiesContent.tabs)[number];

const tabStatus: Record<Tab, "active" | "inactive"> = {
  "Active Policies": "active",
  "Inactive Policies": "inactive",
};

export default function PoliciesList() {
  const [activeTab, setActiveTab] = useState<Tab>(policiesContent.tabs[0]);
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setIsLoading(true);

    async function loadPolicies() {
      try {
        const { token, coidId } = await getEmployerCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiPolicy[]>(
          `/employer/${coidId}/policies`,
          { token, params: { isActive: tabStatus[activeTab] === "active" } },
        );

        if (!cancelled) setPolicies(response.map(mapApiPolicy));
      } catch (error) {
        console.error("Failed to load policies:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadPolicies();
    return () => {
      cancelled = true;
    };
  }, [activeTab]);

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
        {isLoading ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
            Loading policies...
          </div>
        ) : policies.length > 0 ? (
          policies.map((policy, index) => (
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
