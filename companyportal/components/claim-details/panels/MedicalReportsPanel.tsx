"use client";

import { useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";
import { CloseIcon } from "@/components/home/icons";
import DocumentRow from "@/components/claim-details/panels/DocumentRow";
import IcdCodeCard from "@/components/claim-details/panels/IcdCodeCard";
import {
  mapApiMedicalReportDetail,
  type ClaimMedicalDocument,
  type ClaimMedicalRecords,
  type ClaimMedicalReport,
  type ClaimMedicalReports,
} from "@/content/claimDetails";

/** Turns an API category key like "sickNoteMedicalReports" into "Sick Note Medical Reports". */
function formatReportCategoryLabel(key: string): string {
  const withSpaces = key.replace(/([a-z0-9])([A-Z])/g, "$1 $2");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

function subscribeNoop() {
  return () => {};
}

/** Reports true only once mounted on the client, so the portal target (document.body) is safe to use. */
function useMounted() {
  return useSyncExternalStore(
    subscribeNoop,
    () => true,
    () => false,
  );
}

function ReportDetailsContent({ details }: { details: ClaimMedicalRecords }) {
  const [checks, setChecks] = useState(details.checks);

  const toggleCheck = (label: string) => {
    setChecks((prev) =>
      prev.map((check) =>
        check.label === label ? { ...check, checked: !check.checked } : check,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6 px-6 py-6">
      <section className="flex flex-col gap-5 border-b border-black/5 pb-6">
        <div className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
          {details.report.fields.map((field) => (
            <div key={field.label} className="flex min-w-0 flex-col">
              <span className="break-words text-[10px] font-semibold uppercase leading-[15px] tracking-[0.6px] text-[#64748B]">
                {field.label}
              </span>
              <span className="break-words pt-0.5 text-[13px] font-bold leading-5 text-[#13537B]">
                {field.value}
              </span>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 border-b border-black/5 pb-6">
        <div className="rounded-xl bg-white px-4 py-3">
          {checks.map((check, index) => (
            <div key={check.label}>
              {index > 0 && index % 2 === 0 && (
                <span
                  className="my-2 block h-px w-full bg-black/5"
                  aria-hidden
                />
              )}
              <label className="flex cursor-pointer items-center gap-3 py-2">
                <input
                  type="checkbox"
                  checked={check.checked}
                  onChange={() => toggleCheck(check.label)}
                  disabled
                  className="h-4 w-4 cursor-not-allowed rounded border-black/20 accent-[#07C1E9]"
                />
                <span className="text-[13.5px] font-semibold leading-[20px] text-[#13537B]">
                  {check.label}
                </span>
              </label>
            </div>
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5 border-b border-black/5 pb-6">
        <h4 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          Documents
        </h4>
        <div className="flex flex-col gap-4">
          {details.documents.map((document) => (
            <DocumentRow key={document.name} document={document} />
          ))}
        </div>
      </section>

      <section className="flex flex-col gap-5">
        <h4 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
          ICD 10 Codes
        </h4>
        <div className="flex flex-col gap-4">
          {details.icdCodes.map((icdCode, index) => (
            <IcdCodeCard key={`${icdCode.code}-${index}`} icdCode={icdCode} />
          ))}
        </div>
      </section>
    </div>
  );
}

function ReportDetailsDrawer({
  report,
  onClose,
}: {
  report: ClaimMedicalReport | null;
  onClose: () => void;
}) {
  const mounted = useMounted();

  const isOpen = report !== null;
  const details = report ? mapApiMedicalReportDetail(report.formDetails) : null;
  const contentKey = report
    ? `${report.healthcareProviderName}-${report.practiceNumber}-${report.consultationDate}`
    : "empty";

  if (!mounted) return null;

  return createPortal(
    <>
      <div
        className={`fixed inset-0 z-40 bg-black/40 transition-opacity ${
          isOpen ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />

      <aside
        className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[560px] flex-col bg-white shadow-xl transition-transform ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!isOpen}
      >
        <div className="flex items-center justify-between border-b border-black/5 px-6 py-5">
          <h3 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            {details?.report.title ?? ""}
          </h3>
          <button
            type="button"
            aria-label="Close"
            onClick={onClose}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-md text-[#64748B] transition hover:bg-[#F3F7FA]"
          >
            <CloseIcon className="h-4 w-4" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {details && (
            <ReportDetailsContent key={contentKey} details={details} />
          )}
        </div>
      </aside>
    </>,
    document.body,
  );
}

export default function MedicalReportsPanel({
  reports,
  documents,
}: {
  reports: ClaimMedicalReports;
  documents: ClaimMedicalDocument[];
}) {
  const tabs = (Object.keys(reports) as Array<keyof ClaimMedicalReports>).map(
    (key) => ({ key, label: formatReportCategoryLabel(key) }),
  );

  const [activeKey, setActiveKey] = useState<keyof ClaimMedicalReports>(
    tabs[0]?.key ?? "firstMedicalReport",
  );
  const [viewingReport, setViewingReport] = useState<ClaimMedicalReport | null>(
    null,
  );

  const activeTab = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];
  const activeReports = reports[activeKey];

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            type="button"
            onClick={() => setActiveKey(tab.key)}
            className={`rounded-md px-4 py-1.5 text-[12px] font-semibold leading-[18px] transition cursor-pointer ${
              activeTab === tab
                ? "bg-[#F59E0B] text-white shadow-[0px_4px_12px_rgba(10,102,255,0.25)]"
                : "border-[0.625px] border-black/8 bg-white text-[#64748B] hover:text-[#13537B]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
        {activeTab.label}
      </h2>

      <div className="flex flex-col gap-4">
        {activeReports.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 text-center text-[13px] font-normal text-[#64748B] shadow-[0px_2px_16px_rgba(0,0,0,0.07)]">
            No {activeTab.label.toLowerCase()} to display.
          </div>
        ) : (
          activeReports.map((report, index) => (
            <div
              key={`${report.healthcareProviderName}-${index}`}
              className="flex flex-col gap-3 rounded-xl bg-white px-4 py-3.5 shadow-[0px_2px_16px_rgba(218,218,218,0.08)] sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col">
                <span className="text-[13.5px] font-semibold leading-[22px] text-[#13537B]">
                  {report.healthcareProviderName}
                </span>

                <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-[12px] leading-[18px] text-[#64748B]">
                  <span>
                    HCP Number
                    <span className="font-semibold text-[#13537B]">
                      {" "}
                      : {report.practiceNumber}
                    </span>
                  </span>
                  <span>
                    Consultation Date
                    <span className="font-semibold text-[#13537B]">
                      {" "}
                      : {report.consultationDate}
                    </span>
                  </span>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-2.5">
                <span className="rounded-full bg-[#07C1E9] px-3 py-1 text-[12px] font-bold italic leading-[15px] text-white">
                  {report.status}
                </span>
                <button
                  type="button"
                  onClick={() => setViewingReport(report)}
                  className="inline-flex shrink-0 cursor-pointer items-center justify-center rounded-md border-[0.625px] border-[rgba(7,193,233,0.12)] bg-[#F0FAFE] px-5 py-2.5 text-[12.5px] font-semibold leading-[19px] text-[#13537B] transition hover:bg-[#E4F5FC]"
                >
                  View Details
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {documents.length > 0 && (
        <>
          <h2 className="text-[16px] font-bold leading-[19px] text-[#13537B]">
            Medical Report Documents
          </h2>
          <div className="flex flex-col gap-4">
            {documents.map((document) => (
              <DocumentRow key={document.name} document={document} />
            ))}
          </div>
        </>
      )}

      <ReportDetailsDrawer
        report={viewingReport}
        onClose={() => setViewingReport(null)}
      />
    </div>
  );
}
