import Image from "next/image";
import Link from "next/link";
import HomeNavbar from "@/components/home/HomeNavbar";
import { myClaimsContent } from "@/content/site";
import { BackArrowIcon } from "@/components/home/icons";

export default function MyClaimsPage() {
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <HomeNavbar />

      <div className="relative mx-auto w-full max-w-[1440px] px-4 pb-16 pt-[112px] sm:px-6 lg:px-14">
        <div className="pointer-events-none absolute right-0 top-[2px] h-[clamp(220px,29vw,414px)] w-[65%]">
          <Image
            src="/company/icons/pages_wave.png"
            alt=""
            fill
            quality={100}
            className="object-contain object-top"
          />
        </div>

        <Link
          href="/home"
          className="relative z-10 inline-flex items-center gap-2 text-[14px] font-bold leading-[28px] text-[#13537B]"
        >
          <BackArrowIcon className="h-5 w-5" />
          Back
        </Link>

        <h1 className="relative z-10 mt-6 text-[20px] font-bold leading-6 text-[#13537B]">
          My Claims
        </h1>

        <div className="relative z-10 mt-5 flex flex-wrap items-center gap-2">
          {myClaimsContent.tabs.map((tab, index) => (
            <button
              key={tab}
              type="button"
              className={
                index === 0
                  ? "rounded-md bg-[#F59E0B] cursor-pointer px-4 py-1.5 text-[12px] font-semibold leading-[18px] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                  : "rounded-md border border-black/8 bg-white cursor-pointer px-4 py-1.5 text-[12px] font-semibold leading-[18px] text-[#64748B]"
              }
            >
              {tab}
            </button>
          ))}
        </div>

        <div className="relative z-10 mt-6 flex flex-col gap-4">
          {myClaimsContent.claims.map((claim) => (
            <article
              key={`${claim.reference}-${claim.status}`}
              className="rounded-xl bg-white p-4 shadow-[0px_2px_16px_rgba(0,0,0,0.07)] sm:p-6"
            >
              <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between lg:gap-6">
                <div className="flex-1">
                  <h2 className="text-[18px] font-extrabold leading-[27px] text-[#13537B]">
                    {claim.title}
                  </h2>
                  <p className="mt-1 max-w-[760px] text-[12.5px] leading-[19px] text-[#64748B]">
                    Claim Ref No : {claim.reference} · Event Date :{" "}
                    {claim.eventDate} · Date Reported : {claim.reportedDate}
                  </p>
                  <p className="mt-2 text-[12px] leading-[18px] text-[#64748B]">
                    <span aria-hidden className="mr-1">
                      ◦
                    </span>
                    Employee : {claim.employee}
                  </p>
                </div>

                <div className="flex shrink-0 flex-col items-start lg:items-end">
                  <span className="text-[11px] font-medium leading-4 text-[#64748B]">
                    Status
                  </span>
                  <span className="text-[16px] font-extrabold leading-6 text-[#F59E0B]">
                    {claim.status}
                  </span>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
