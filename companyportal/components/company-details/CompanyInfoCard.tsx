import { companyDetailsContent } from "@/content/companyDetails";

const infoRows: Array<{ label: string; value: string }> = [
  { label: "Industry Class", value: companyDetailsContent.company.industryClass },
  { label: "Industry", value: companyDetailsContent.company.industry },
  { label: "VAT Reg. No", value: companyDetailsContent.company.vatRegNo },
  {
    label: "Compensation Fund Ref",
    value: companyDetailsContent.company.compensationFundRef,
  },
  {
    label: "Compensation Fund Reg",
    value: companyDetailsContent.company.compensationFundReg,
  },
  {
    label: "Compensation Fund Status",
    value: companyDetailsContent.company.compensationFundStatus,
  },
  { label: "Nature of Business", value: companyDetailsContent.company.natureOfBusiness },
  { label: "Created Date", value: companyDetailsContent.company.createdDate },
];

export default function CompanyInfoCard() {
  const { company } = companyDetailsContent;

  return (
    <aside className="w-full shrink-0 rounded-xl bg-white p-4 shadow-[0px_4px_29.5px_rgba(0,0,0,0.05)] lg:w-[327px]">
      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        Company Details
      </h2>

      <div className="relative mt-4 overflow-hidden rounded-lg bg-[linear-gradient(135deg,#07C1E9_0%,#008A99_100%)] p-4 shadow-[0px_4px_28.9px_rgba(0,0,0,0.25)]">
        <div className="pointer-events-none absolute -right-10 -top-16 h-64 w-64 rounded-full bg-white/10" />

        <div className="relative flex items-center justify-between">
          <div className="flex h-11 w-[47px] items-center justify-center rounded-lg bg-[#F5B121]">
            <span className="text-[14px] font-bold leading-[17px] text-white">
              {company.code}
            </span>
          </div>
          <span className="rounded-full bg-[#CAE9A4] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-black">
            {company.status}
          </span>
        </div>

        <div className="relative mt-4 flex flex-col gap-2">
          <p className="text-[16px] font-bold leading-[19px] text-white">{company.name}</p>
          <p className="text-[14px] font-normal leading-[17px] text-white">
            Reg No : {company.regNo}
          </p>
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-4">
        {infoRows.map((row, index) => (
          <div key={row.label} className="flex flex-col gap-4">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[12px] font-normal leading-[15px] text-[#13537B]">
                {row.label}
              </span>
              <span className="text-right text-[12px] font-semibold leading-[15px] text-[#13537B]">
                {row.value}
              </span>
            </div>
            {index < infoRows.length - 1 && (
              <span className="h-px w-full bg-black/5" aria-hidden />
            )}
          </div>
        ))}
      </div>
    </aside>
  );
}
