"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

import {
  homeContent,
  mapOrganizationProfile,
  type ApiOrganizationProfileResponse,
} from "@/content/site";
import apiService, { API_ROOT_BASE_URL } from "@/lib/api/apiService";
import { getEmployerCoidId } from "@/lib/auth/employerClaims";

export default function HomeGreeting() {
  const [memberName, setMemberName] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    async function loadProfile() {
      try {
        const { token, coidId } = await getEmployerCoidId();
        if (!coidId) return;

        const response = await apiService.get<ApiOrganizationProfileResponse>(
          `${API_ROOT_BASE_URL}/profile/organization/${coidId}`,
          { token },
        );

        if (!cancelled) {
          setMemberName(mapOrganizationProfile(response).memberName);
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadProfile();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <section className="relative overflow-hidden pt-[72px]">
      <div className="pointer-events-none absolute left-[50px] top-[7px] h-[clamp(220px,29vw,414px)] w-full">
        <Image
          src="/company/icons/home_wave(1).png"
          alt=""
          fill
          quality={100}
          className="object-contain object-top"
        />
      </div>

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-4 pb-16 pt-14 sm:px-6 lg:px-14">
        <p className="text-[15.8px] leading-[19px] text-[#13537B]">
          {homeContent.greeting}
        </p>

        <h1 className="mt-2 max-w-[500px] text-[clamp(2.2rem,4.5vw,3rem)] font-normal leading-[1.2] text-[#13537B]">
          {isLoading ? (
            <span
              aria-hidden
              className="shimmer inline-block h-[0.7em] w-56 max-w-full rounded-full align-middle sm:w-72"
            />
          ) : (
            (memberName ?? homeContent.memberName)
          )}
        </h1>

        <p className="mt-6 max-w-[380px] text-[13.15px] leading-[19px] text-[#6B7F8C]">
          {homeContent.welcomeMessage}
        </p>
      </div>
    </section>
  );
}
