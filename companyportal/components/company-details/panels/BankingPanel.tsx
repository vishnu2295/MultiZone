import { companyDetailsContent } from "@/content/companyDetails";
import { BankIcon } from "@/components/home/icons";

function DetailField({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex flex-col gap-0.5">
      <span className="text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
        {label}
      </span>
      <span className="text-[13px] font-bold leading-5 text-[#13537B]">{value}</span>
    </div>
  );
}

export default function BankingPanel() {
  return (
    <div className="flex flex-col gap-2.5">
      {companyDetailsContent.bankingDetails.map((bank) => (
        <div
          key={bank.accountNumber}
          className="flex flex-col gap-6 rounded-xl bg-white px-3 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)]"
        >
          <div className="flex items-center gap-2">
            <BankIcon className="h-4 w-4 shrink-0 text-[#00BBE6]" />
            <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
              {bank.accountHolder}
            </span>
          </div>

          <div className="flex flex-col gap-6">
            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <DetailField label="Account holder" value={bank.accountHolder} />
              <DetailField label="Bank" value={bank.bank} />
              <DetailField label="Account no" value={bank.accountNumber} />
              <DetailField label="Account type" value={bank.accountType} />
            </div>

            <div className="grid grid-cols-2 gap-6 sm:grid-cols-4">
              <DetailField label="Branch" value={bank.branch} />
              <DetailField label="Branch code" value={bank.branchCode} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
