"use client";

import React, { useState, useEffect, useCallback } from "react";
import { CheckCircle, ChevronDown, ChevronUp } from "lucide-react";
import UploadFileIcon from "@mui/icons-material/UploadFile";
import KeyboardIcon from "@mui/icons-material/Keyboard";
import EmployeeListTable from "./components/EmployeeListTable";
import EmployeeForm from "./components/EmployeeForm";
import BulkUpload from "./components/BulkUpload";
import {
  BackButton,
  NextButton,
  SaveDraftButton,
} from "@/components/ui/StepButtons";
import DownloadQuoteModal from "@/components/ui/DownloadQuoteModal";
import StepProgress from "@/components/ui/StepProgress";
import AdjustFullCoverStep from "./AdjustFullCoverStep";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import EmployeeVarianceModal from "./components/EmployeeVarianceModal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import DashboardCard from "@/components/ui/DashboardCard";
import { saveEmployees } from "@/lib/api/employees";
import { updateLead } from "@/lib/api/leads";
import { formatEmployeesToApi } from "./helpers/utils";
import { downloadEmployeeTemplate } from "./helpers/utils";
import { useEmployees, QuoteFormState } from "./helpers/useEmployees";

interface FullQuoteCaptureProps {
  companyName?: string;
  leadReference?: string;
  draftQuoteData?: any;
  quoteReference?: string;
  leadId: string;
  initialStep?: number;
  onBack: () => void;
  onGenerate: (data: any) => Promise<any>;
  onDraftSaved?: () => void;
  isRepriceMode?: boolean;
  initialMode?: string;
}

const STEPS = ["Employee Information", "Cover Adjustments"];

export default function FullQuoteCapture({
  draftQuoteData,
  leadId,
  initialStep = 0,
  onBack,
  onGenerate,
  onDraftSaved,
  isRepriceMode = false,
  initialMode,
}: FullQuoteCaptureProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const leadEmployeeCount = searchParams.get("leadEmployeeCount") || "";
  const [showVarianceModal, setShowVarianceModal] = useState(false);
  const lastCheckedFileRef = React.useRef<File | null>(null);
  const [currentStep, setCurrentStep] = useState(initialStep);
  const [showModal, setShowModal] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [coverMode, setCoverMode] = useState<"multiple" | "equal">("multiple");
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const MINIMUM_EMPLOYEE_COUNT = 1; // Minimum number of employees required to proceed to the next step

  const {
    fileInputRef,
    employeeList,
    setEmployeeList,
    employeeFile,
    fileName,
    setFileName,
    showForm,
    setShowForm,
    showBulkUpload,
    setShowBulkUpload,
    isDragging,
    setIsDragging,
    form,
    setForm,
    processFile,
    handleFileChange,
    handleAddEmployee,
    clearEmployees,
  } = useEmployees();

  const handleDownloadTemplate = async () => {
    await downloadEmployeeTemplate();
  };

  useEffect(() => {
    if (
      employeeFile &&
      employeeFile !== lastCheckedFileRef.current &&
      employeeList.length > 0
    ) {
      lastCheckedFileRef.current = employeeFile;
      const expected = Number(leadEmployeeCount);
      if (expected > 0 && employeeList.length !== expected) {
        setShowVarianceModal(true);
      }
    }
  }, [employeeFile, employeeList.length, leadEmployeeCount]);

  const initialState: QuoteFormState = {
    productId: draftQuoteData?.productId || "",
    generateOptions:
      draftQuoteData?.generateOptions !== undefined
        ? draftQuoteData.generateOptions
        : false,
    lifeCover: 0.5,
    occupationalDisability: 0.5,
    funeralCover: 5000,
    additionalBenefits: {
      gpaClassicCover: true,
      gpaComprehensiveCover: true,
      gpaComprehensivePlusCover: true,
      crimeAndCommutingJourney: true,
      riotAndStrike: true,
      riotAndStrikePlusCover: true,
      augmentation: true,
    },
    benefitBreakdown: [],
    totalMonthlyPremium: 0,
    step1Error: "",
  };

  const [quoteForm, setQuoteForm] = useState<QuoteFormState>(initialState);
  const [isManualCollapsed, setIsManualCollapsed] = useState(false);

  const updateQuoteForm = useCallback(
    <K extends keyof QuoteFormState>(
      key: K,
      value:
        QuoteFormState[K] | ((prev: QuoteFormState[K]) => QuoteFormState[K])
    ) => {
      setQuoteForm((prev) => ({
        ...prev,
        [key]: typeof value === "function" ? (value as any)(prev[key]) : value,
      }));
    },
    []
  );

  const handleSetLifeCover = useCallback(
    (v: number) => updateQuoteForm("lifeCover", v),
    [updateQuoteForm]
  );
  const handleSetOccupationalDisability = useCallback(
    (v: number) => updateQuoteForm("occupationalDisability", v),
    [updateQuoteForm]
  );
  const handleSetFuneralCover = useCallback(
    (v: number) => updateQuoteForm("funeralCover", v),
    [updateQuoteForm]
  );
  const handleSetAdditionalBenefits = useCallback(
    (v: any) => updateQuoteForm("additionalBenefits", v),
    [updateQuoteForm]
  );
  const handleSetProductId = useCallback(
    (id: string) => updateQuoteForm("productId", id),
    [updateQuoteForm]
  );
  const handleSetBenefitBreakdown = useCallback(
    (v: any[]) => updateQuoteForm("benefitBreakdown", v),
    [updateQuoteForm]
  );
  const handleSetTotalMonthlyPremium = useCallback(
    (v: number) => updateQuoteForm("totalMonthlyPremium", v),
    [updateQuoteForm]
  );

  const {
    productId,
    generateOptions,
    lifeCover,
    occupationalDisability,
    funeralCover,
    additionalBenefits,
    benefitBreakdown,
    totalMonthlyPremium,
    step1Error,
  } = quoteForm;

  const fetchAndSetEmployees = useCallback(async () => {
    try {
      const { getEmployees } = await import("@/lib/api/employees");
      const empRes = await getEmployees(leadId);
      if (empRes.success && empRes.data) {
        const mapped = empRes.data.map((e: any) => ({
          id: e.employee_id || Math.random().toString(36).slice(2),
          employeeRecordId: e.employee_record_id || "",
          name:
            `${e.first_name || ""} ${e.last_name || ""}`.trim() || "Unknown",
          firstName: e.first_name || "",
          surname: e.last_name || "",
          gender: e.gender || "",
          salary: e.salary || "0",
          dob: e.date_of_birth || "",
          age: e.age,
          email: e.email || "",
          cellNumber: e.cell_number || "",
          startDate: e.employment_start_date || "",
          idType: e.id_type || "SA ID",
          identification: e.id_number || "",
          passportNumber: e.passport_number || "",
          passportExpiry: e.passport_expiry_date || "",
          nationality: e.nationality || "",
          status: e.employment_status || "Active",
        }));
        if (mapped.length > 0) {
          setEmployeeList(mapped);
        }
      }
    } catch (err) {
      console.error("Failed to fetch employees for lead:", err);
    }
  }, [leadId, setEmployeeList]);

  useEffect(() => {
    if (leadId && employeeList.length === 0 && initialMode !== "new") {
      fetchAndSetEmployees();
    }
  }, [leadId, employeeList.length, initialMode, fetchAndSetEmployees]);

  useEffect(() => {
    if (draftQuoteData) {
      const updates: Partial<typeof quoteForm> = {};

      if (draftQuoteData.productId) {
        updates.productId = draftQuoteData.productId;
      }
      if (draftQuoteData.generateOptions !== undefined) {
        updates.generateOptions = draftQuoteData.generateOptions;
      }
      // Parse existing benefits
      if (
        draftQuoteData.benefitBreakdown &&
        draftQuoteData.benefitBreakdown.length > 0
      ) {
        let isMultiple = true;

        const newVaps = {
          gpaClassicCover: false,
          gpaComprehensiveCover: false,
          gpaComprehensivePlusCover: false,
          crimeAndCommutingJourney: false,
          riotAndStrike: false,
          riotAndStrikePlusCover: false,
          augmentation: false,
        };

        draftQuoteData.benefitBreakdown.forEach((b: any) => {
          const type = b.benefit_type?.toUpperCase() || "";
          const name = b.benefit_name?.toUpperCase() || "";
          const amount = b.cover_amount;

          if (type === "LIFE") {
            if (amount != null && !Number.isNaN(Number(amount))) {
              updates.lifeCover = Number(amount);
              if (Number(amount) > 5) {
                isMultiple = false;
              }
            }
          } else if (
            type === "ACCIDENT" ||
            type === "OCCUPATIONAL DISABILITY"
          ) {
            if (amount != null && !Number.isNaN(Number(amount))) {
              updates.occupationalDisability = Number(amount);
              if (Number(amount) > 5) {
                isMultiple = false;
              }
            }
          } else if (type === "FUNERAL") {
            if (amount != null && !Number.isNaN(Number(amount))) {
              updates.funeralCover = Number(amount);
            }
          } else {
            const searchStr = `${type} ${name}`;
            if (searchStr.includes("AUGMENTATION") || searchStr.includes("AUG"))
              newVaps.augmentation = true;
            if (
              searchStr.includes("COMMUTING") ||
              searchStr.includes("CICJP") ||
              searchStr.includes("CRIME")
            ) {
              newVaps.crimeAndCommutingJourney = true;
            }
            if (searchStr.includes("RIOT")) {
              if (searchStr.includes("PLUS"))
                newVaps.riotAndStrikePlusCover = true;
              else newVaps.riotAndStrike = true;
            }
            if (
              searchStr.includes("GPA") ||
              searchStr.includes("PERSONAL ACCIDENT")
            ) {
              if (searchStr.includes("PLUS"))
                newVaps.gpaComprehensivePlusCover = true;
              else if (searchStr.includes("COMPREHENSIVE"))
                newVaps.gpaComprehensiveCover = true;
              else newVaps.gpaClassicCover = true;
            }
          }
        });

        updates.additionalBenefits = newVaps;
        setCoverMode(isMultiple ? "multiple" : "equal");
      }

      setQuoteForm((prev) => ({ ...prev, ...updates }));
    }
  }, [draftQuoteData]);

  const buildQuotePayload = (overrides: Record<string, any> = {}) => {
    const getBenefitData = (keywords: string[], fallbackVal: number) => {
      const item = benefitBreakdown.find((b: any) =>
        keywords.some(
          (k) =>
            b.benefit_name?.toUpperCase().includes(k.toUpperCase()) ||
            b.benefit_type?.toUpperCase().includes(k.toUpperCase())
        )
      );
      return {
        premium_amount: item?.premium_amount || 0,
        premium_rate: item?.premium_rate || 0,
        cover_amount: item?.cover_amount || item?.total_cover || fallbackVal,
      };
    };

    return {
      product_id: productId || undefined,
      // industry: industry || null,
      generate_options: generateOptions,
      total_premium: totalMonthlyPremium,
      benefits: [
        ...(lifeCover > 0
          ? [
              {
                benefit_type: "Life Cover",
                ...(coverMode === "multiple" ? { multiple: lifeCover } : {}),
                ...getBenefitData(["Life"], lifeCover),
              },
            ]
          : []),
        ...(funeralCover > 0
          ? [
              {
                benefit_type: "Funeral Cover",
                ...getBenefitData(["Funeral"], funeralCover),
              },
            ]
          : []),
        ...(occupationalDisability > 0
          ? [
              {
                benefit_type: "Occupational Disability",
                ...(coverMode === "multiple"
                  ? { multiple: occupationalDisability }
                  : {}),
                ...getBenefitData(
                  ["Disability", "Occupational"],
                  occupationalDisability
                ),
              },
            ]
          : []),
        ...(additionalBenefits.gpaClassicCover
          ? [
              {
                benefit_type: "GPA Classic Cover",
                ...getBenefitData(["Classic", "GPA"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.gpaComprehensiveCover
          ? [
              {
                benefit_type: "GPA Comprehensive Cover",
                ...getBenefitData(["Comprehensive", "GPA"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.gpaComprehensivePlusCover
          ? [
              {
                benefit_type: "GPA Comprehensive Plus Cover",
                ...getBenefitData(["Plus", "GPA"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.crimeAndCommutingJourney
          ? [
              {
                benefit_type: "CICJP Cover",
                ...getBenefitData(["Commuting", "CICJP", "Crime"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.riotAndStrike
          ? [
              {
                benefit_type: "Riot and Strike",
                ...getBenefitData(["Riot"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.riotAndStrikePlusCover
          ? [
              {
                benefit_type: "Riot and Strike Plus",
                ...getBenefitData(["Riot", "Plus"], 0),
              },
            ]
          : []),
        ...(additionalBenefits.augmentation
          ? [
              {
                benefit_type: "Augmentation",
                ...getBenefitData(["Augmentation", "AUG"], 0),
              },
            ]
          : []),
      ],
      employees: employeeList,
      employeeFile: employeeFile,
      ...overrides,
    };
  };

  const proceedToNextStepFromEmployeeList = async () => {
    updateQuoteForm("step1Error", "");
    setIsImporting(true);
    try {
      const newEmployees = employeeList.filter(
        (e) => !e.id || !e.id.includes("-") || e.id.length < 20
      );
      if (newEmployees.length > 0) {
        const formattedEmployees = formatEmployeesToApi(employeeList);
        try {
          await saveEmployees({
            lead_id: leadId,
            employees: formattedEmployees,
          });
          await fetchAndSetEmployees();
        } catch (error: any) {
          console.error("Save Employees Error:", error);
          if (error.data && error.data.errors && error.data.errors.length > 0) {
            setToastMessage(
              error.data.errors[0].message || "Validation failed on server"
            );
          } else {
            setToastMessage(
              error.message || "Failed to save employees to server."
            );
          }
          setIsImporting(false);
          return;
        }
      }
      setIsImporting(false);

      const data = buildQuotePayload({
        step: 1,
        quote_status: "Draft",
      });

      try {
        await onGenerate(data);
      } catch (err) {
        console.error("Failed to quietly save draft on Next:", err);
      }

      setCurrentStep((s) => s + 1);
    } catch (err: any) {
      setIsImporting(false);
      console.error("Employee import failed:", err);
      const errMsg =
        err.message || JSON.stringify(err.errors) || "Unknown error";
      alert("Failed to import employees: " + errMsg);
      return;
    }
  };

  const handleNext = async () => {
    if (currentStep === 0) {
      if (employeeList.length < MINIMUM_EMPLOYEE_COUNT) {
        updateQuoteForm(
          "step1Error",
          "Please enter a minimum of 1 employees before proceeding."
        );
        return;
      }

      const expected = Number(leadEmployeeCount);
      if (expected > 0 && employeeList.length !== expected) {
        setShowVarianceModal(true);
        return;
      }

      await proceedToNextStepFromEmployeeList();
    } else if (currentStep < STEPS.length - 1) {
      setCurrentStep((s) => s + 1);
    } else {
      const data = buildQuotePayload({
        quote_status: isRepriceMode ? "Revised" : "Generated",
      });
      try {
        await onGenerate(data);
        setShowModal(true);
      } catch {
        // Error is handled in the parent component
      }
    }
  };

  const handleBack = () => {
    if (currentStep === 0 && showForm) {
      setShowForm(false);
      clearEmployees();
      return;
    }
    if (currentStep === 0 && showBulkUpload) {
      setShowBulkUpload(false);
      setFileName("");
      setEmployeeList([]);
      return;
    }
    if (currentStep === 0) onBack();
    else setCurrentStep((s) => s - 1);
  };

  const handleSaveDraft = async () => {
    setIsSavingDraft(true);
    try {
      if (currentStep === 0 && employeeList.length > 0) {
        if (employeeList.length < 5) {
          setIsSavingDraft(false);
          updateQuoteForm(
            "step1Error",
            "Please enter a minimum of 5 employees before saving."
          );
          return;
        }
        updateQuoteForm("step1Error", "");
        const newEmployees = employeeList.filter(
          (e) => !e.id || !e.id.includes("-") || e.id.length < 20
        );

        if (newEmployees.length > 0) {
          const formattedEmployees = formatEmployeesToApi(employeeList);
          try {
            await saveEmployees({
              lead_id: leadId,
              employees: formattedEmployees,
            });
            await fetchAndSetEmployees();
          } catch (error: any) {
            console.error("Save Employees Error (Draft):", error);
            if (
              error.data &&
              error.data.errors &&
              error.data.errors.length > 0
            ) {
              setToastMessage(
                error.data.errors[0].message || "Validation failed on server"
              );
            } else {
              setToastMessage(
                error.message || "Failed to save employees to server."
              );
            }
            setIsSavingDraft(false);
            return;
          }
        }
      }
      const data = buildQuotePayload({
        step: currentStep < 1 ? currentStep + 1 : currentStep,
        quote_status: "Draft",
      });

      await onGenerate(data);
      if (onDraftSaved) {
        onDraftSaved();
      } else {
        alert("Draft saved successfully!");
      }
    } catch (err: any) {
      console.error("Failed to save draft:", err);
      const errMsg =
        err.message || JSON.stringify(err.errors) || "Unknown error";
      alert("Failed to save draft: " + errMsg);
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <Box
      sx={{
        width: "100%",
        boxSizing: "border-box",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Stepper */}
      <StepProgress
        steps={STEPS}
        currentStep={currentStep}
        variant="continuous"
      />

      {/* Inner card — all steps */}
      {currentStep < STEPS.length && (
        <>
          {/* ── STEP 0: Employee Information ── */}
          {currentStep === 0 && (
            <div
              style={{ display: "flex", flexDirection: "column", gap: "20px" }}
            >
              {/* Selection cards — hidden while manual form, bulk upload is open, or employees exist */}
              {!showForm && !showBulkUpload && employeeList.length === 0 && (
                <Box
                  sx={{
                    bgcolor: "var(--card-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    p: "20px",
                    width: "100%",
                  }}
                >
                  <Box
                    sx={{
                      display: "grid",
                      gridTemplateColumns: "271px 271px",
                      gap: "16px",
                    }}
                  >
                    {/* Enter manually */}
                    <Box sx={{ width: "271px", height: "225px" }}>
                      <DashboardCard
                        title="Enter manually"
                        description="You will need their name, monthly income and date of birth."
                        onClick={() => setShowForm(true)}
                        icon={KeyboardIcon}
                        style={{
                          borderTop: "0.63px solid rgba(31,195,235,0.4)",
                          background: "var(--dashboard-card-bg)",
                        }}
                        iconWrapperStyle={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "16px",
                          background: "var(--border)",
                          color: "var(--dashboard-card-icon-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Box>

                    {/* Bulk Upload */}
                    <Box sx={{ width: "271px", height: "225px" }}>
                      <DashboardCard
                        title="Bulk Upload"
                        description="Use our spreadsheet wizard to upload your employees."
                        onClick={() => {
                          setShowBulkUpload(true);
                          setFileName("");
                          setEmployeeList([]);
                          setIsManualCollapsed(false);
                        }}
                        icon={UploadFileIcon}
                        style={{
                          borderTop: "0.63px solid rgba(31,195,235,0.4)",
                          background: "var(--dashboard-card-bg)",
                        }}
                        iconWrapperStyle={{
                          width: "48px",
                          height: "48px",
                          borderRadius: "16px",
                          background: "var(--border)",
                          color: "var(--dashboard-card-icon-color)",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      />
                    </Box>
                  </Box>
                </Box>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept=".csv,.xlsx,.xls"
                style={{ display: "none" }}
                onChange={handleFileChange}
              />

              {/* Bulk upload view */}
              {showBulkUpload && (
                <BulkUpload
                  fileName={fileName}
                  setFileName={setFileName}
                  setEmployeeList={setEmployeeList}
                  fileInputRef={fileInputRef}
                  isDragging={isDragging}
                  setIsDragging={setIsDragging}
                  processFile={processFile}
                  handleDownloadTemplate={handleDownloadTemplate}
                />
              )}

              {/* Manual entry form card */}
              {(showForm || showBulkUpload || employeeList.length > 0) && (
                <Box
                  sx={{
                    bgcolor: "var(--card-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    p: "20px",
                    display: "flex",
                    flexDirection: "column",
                    gap: "16px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                      marginBottom:
                        !(showBulkUpload || employeeList.length > 0) ||
                        !isManualCollapsed
                          ? "16px"
                          : "0",
                    }}
                  >
                    <Typography
                      sx={{
                        fontSize: "0.9375rem",
                        fontWeight: 600,
                        color: "var(--text-primary)",
                        m: 0,
                      }}
                    >
                      Manually add employees
                    </Typography>
                    {(showBulkUpload || employeeList.length > 0) && (
                      <button
                        onClick={() => setIsManualCollapsed(!isManualCollapsed)}
                        style={{
                          background: "transparent",
                          border: "none",
                          cursor: "pointer",
                          color: "var(--text-secondary)",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        {isManualCollapsed ? (
                          <ChevronDown size={20} />
                        ) : (
                          <ChevronUp size={20} />
                        )}
                      </button>
                    )}
                  </div>

                  {(!(showBulkUpload || employeeList.length > 0) ||
                    !isManualCollapsed) && (
                    <EmployeeForm
                      form={form}
                      setForm={setForm}
                      handleAddEmployee={handleAddEmployee}
                    />
                  )}
                </Box>
              )}

              {/* List of Employees card */}
              {(showForm || employeeList.length > 0) && (
                <Box
                  sx={{
                    bgcolor: "var(--card-secondary)",
                    border: "1px solid var(--border)",
                    borderRadius: "12px",
                    p: "20px",
                  }}
                >
                  <Typography
                    sx={{
                      fontSize: "0.9375rem",
                      fontWeight: 600,
                      color: "var(--text-primary)",
                      mb: "4px",
                    }}
                  >
                    List of Employees
                  </Typography>
                  <Typography
                    sx={{
                      fontSize: "0.8125rem",
                      color: "var(--text-secondary)",
                      mb: "16px",
                    }}
                  >
                    You have a total of {employeeList.length} employee
                    {employeeList.length !== 1 ? "s" : ""}.
                  </Typography>

                  {employeeList.length > 0 && (
                    <EmployeeListTable
                      employees={employeeList.map((e) => ({
                        id: e.id,
                        employeeRecordId: e.employeeRecordId,
                        name: e.name,
                        gender: e.gender,
                        dob: e.dob,
                        age: e.age,
                        email: e.email,
                        cellNumber: e.cellNumber,
                        startDate: e.startDate,
                        idType: e.idType,
                        identification: e.identification,
                        passportNumber: e.passportNumber,
                        passportExpiry: e.passportExpiry,
                        salary: e.salary,
                        nationality: e.nationality,
                        status: e.status,
                      }))}
                      onRemove={async (id) => {
                        if (id && id.includes("-") && id.length > 20) {
                          try {
                            const { deleteEmployee } =
                              await import("@/lib/api/employees");
                            await deleteEmployee(leadId, id);
                          } catch (err) {
                            console.error(
                              "Failed to delete employee from server",
                              err
                            );
                          }
                        }
                        setEmployeeList((prev) =>
                          prev.filter((e) => e.id !== id)
                        );
                      }}
                      onEdit={async (id, newData) => {
                        const parts = newData.name.trim().split(" ");
                        const firstName = parts[0] || "";
                        const surname =
                          parts.slice(1).join(" ") || parts[0] || "";

                        const updatePayload = {
                          firstName,
                          surname,
                          gender: newData.gender,
                          salary: newData.salary
                            ? Number(newData.salary)
                            : undefined,
                          dateOfBirth: newData.dob,
                        };

                        if (id && id.includes("-") && id.length > 20) {
                          try {
                            const { updateEmployee } =
                              await import("@/lib/api/employees");
                            await updateEmployee(leadId, id, updatePayload);
                          } catch (err) {
                            console.error(
                              "Failed to update employee on server",
                              err
                            );
                          }
                        }

                        setEmployeeList((prev) =>
                          prev.map((e) => {
                            if (e.id === id) {
                              return {
                                ...e,
                                ...newData,
                                firstName,
                                surname,
                              } as any;
                            }
                            return e;
                          })
                        );
                      }}
                    />
                  )}
                </Box>
              )}

              {fileName && employeeList.length > 0 && (
                <div
                  style={{
                    background: "rgba(34,197,94,0.1)",
                    border: "1px solid rgba(34,197,94,0.2)",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <CheckCircle
                    size={16}
                    style={{ color: "var(--success)", flexShrink: 0 }}
                  />
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--success)",
                      margin: 0,
                    }}
                  >
                    {fileName} — {employeeList.length} employees extracted
                  </p>
                </div>
              )}

              {step1Error && (
                <div
                  style={{
                    background: "rgba(239,68,68,0.1)",
                    border: "1px solid rgba(239,68,68,0.2)",
                    borderRadius: "8px",
                    padding: "12px",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                  }}
                >
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="var(--destructive)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    style={{ flexShrink: 0 }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="8" x2="12" y2="12" />
                    <line x1="12" y1="16" x2="12.01" y2="16" />
                  </svg>
                  <p
                    style={{
                      fontSize: "0.8125rem",
                      color: "var(--destructive)",
                      margin: 0,
                    }}
                  >
                    {step1Error}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 1: Adjust ── */}
          {currentStep === 1 && (
            <AdjustFullCoverStep
              employeeList={employeeList}
              employeeCount={employeeList.length}
              lifeCover={lifeCover}
              setLifeCover={handleSetLifeCover}
              occupationalDisability={occupationalDisability}
              setOccupationalDisability={handleSetOccupationalDisability}
              funeralCover={funeralCover}
              setFuneralCover={handleSetFuneralCover}
              additionalBenefits={additionalBenefits}
              setAdditionalBenefits={handleSetAdditionalBenefits}
              setProductId={handleSetProductId}
              coverMode={coverMode}
              setCoverMode={setCoverMode}
              setBenefitBreakdown={handleSetBenefitBreakdown}
              setTotalMonthlyPremium={handleSetTotalMonthlyPremium}
            />
          )}
        </>
      )}

      {/* Back + Generate Quote */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginTop: "24px",
        }}
      >
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <BackButton onClick={handleBack} />
          {currentStep < 1 &&
            !isRepriceMode &&
            (showForm || showBulkUpload || employeeList.length > 0) && (
              <SaveDraftButton
                onClick={handleSaveDraft}
                label={isSavingDraft ? "Saving..." : "Save Draft"}
                disabled={employeeList.length < MINIMUM_EMPLOYEE_COUNT}
              />
            )}
        </div>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          {currentStep < STEPS.length - 1 ? (
            (showForm || showBulkUpload || employeeList.length > 0) && (
              <NextButton
                label={isImporting ? "Uploading..." : "Next Step"}
                onClick={handleNext}
                disabled={
                  isImporting ||
                  (currentStep === 0 && employeeList.length === 0)
                }
              />
            )
          ) : (
            <NextButton label="Generate Quote" onClick={handleNext} />
          )}
        </div>
      </div>

      {showModal && (
        <DownloadQuoteModal
          onClose={() => {
            setShowModal(false);
            router.push("/lead/view");
          }}
        />
      )}

      <Snackbar
        open={!!toastMessage}
        autoHideDuration={6000}
        onClose={() => setToastMessage(null)}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          onClose={() => setToastMessage(null)}
          severity="error"
          sx={{ width: "100%" }}
        >
          {toastMessage}
        </Alert>
      </Snackbar>

      <EmployeeVarianceModal
        isOpen={showVarianceModal}
        onClose={() => setShowVarianceModal(false)}
        onAccept={async () => {
          try {
            await updateLead(leadId, {
              employer: { numberOfEmployees: employeeList.length },
            });
            const params = new URLSearchParams(searchParams.toString());
            params.set("leadEmployeeCount", employeeList.length.toString());
            router.replace(`${pathname}?${params.toString()}`, {
              scroll: false,
            });
            setShowVarianceModal(false);
          } catch (err) {
            console.error("Failed to update lead employee count", err);
            setToastMessage("Failed to update lead employee count");
          }
        }}
        leadCount={leadEmployeeCount}
        uploadedCount={employeeList.length}
      />
    </Box>
  );
}
