import Link from "next/link";

/**
 * Shown in place of the /company routes when the logged-in user has no
 * organization role on their rma_ids claim (e.g. an individual/employee
 * account that navigated here directly).
 */
export default function AccessRestricted() {
  return (
    <main className="min-h-screen bg-[#F3F7FA]">
      <div className="mx-auto flex w-full max-w-[1440px] flex-col items-center px-4 pb-16 pt-[152px] text-center sm:px-6 lg:px-14">
        <div className="w-full max-w-[440px] rounded-2xl bg-white p-10 shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
          <h1 className="text-[22px] font-bold leading-7 text-[#13537B]">
            Access Restricted
          </h1>
          <p className="mt-3 text-[13.5px] leading-[19px] text-[#64748B]">
            Your account isn&apos;t linked to a company profile, so you don&apos;t
            have access to the Company Portal.
          </p>

          <Link
            href="/individual"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#13537B] px-6 py-3 text-[13.5px] font-bold text-white transition hover:opacity-90"
          >
            Go to Individual Portal
          </Link>
        </div>
      </div>
    </main>
  );
}
