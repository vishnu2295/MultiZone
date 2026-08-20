import React, { useState } from "react";
import { validateQuickQuoteField } from "@/utils/validators";
import { BackButton, NextButton, SaveDraftButton } from "@/components/ui/StepButtons";
import StepProgress from "@/components/ui/StepProgress";
import OptionToggleGroup from "@/components/ui/OptionToggleGroup";
import { INDUSTRY_TYPE_OPTIONS, PROVINCE_OPTIONS } from "@/lib/enums";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";

const QUICK_STEPS = ["Quote Details", "Adjust Cover Amounts"];

interface FormData {
  employees: string;
  genderSplit: string;
  averageAge: string;
  averageIncome: string;
  province: string;
  industry: string;
  cellphone: string;
}

interface QuickQuoteInputsProps {
  formData: FormData;
  onFormChange: (data: FormData) => void;
  onBack: () => void;
  onGenerateQuote?: (quoteData?: any) => void;
  onDraftSaved?: () => void;
  leadId: string;
  quoteId?: string;
}


const labelStyle: React.CSSProperties = {
  fontSize: "0.8125rem",
  fontWeight: 400,
  color: "var(--text-secondary)",
  display: "block",
  marginBottom: "6px",
};

export default function QuickQuoteInputs({ formData, onFormChange, onBack, onGenerateQuote, onDraftSaved, leadId, quoteId }: QuickQuoteInputsProps) {
  const { employees, genderSplit, averageAge, averageIncome, province, industry } = formData;
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSavingDraft, setIsSavingDraft] = useState(false);

  const handleChange = (field: keyof FormData, val: string) => {
    onFormChange({ ...formData, [field]: val });
    if (errors[field] || val !== "") {
      const error = validateQuickQuoteField(field, val);
      setErrors(prev => ({ ...prev, [field]: error }));
    }
  };

  const handleBlur = (field: keyof FormData, val: string) => {
    const error = validateQuickQuoteField(field, val);
    setErrors(prev => ({ ...prev, [field]: error }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    const empErr = validateQuickQuoteField("employees", employees);
    if (empErr) e.employees = empErr;
    
    const genErr = validateQuickQuoteField("genderSplit", genderSplit);
    if (genErr) e.genderSplit = genErr;
    
    const ageErr = validateQuickQuoteField("averageAge", averageAge);
    if (ageErr) e.averageAge = ageErr;
    
    const incErr = validateQuickQuoteField("averageIncome", averageIncome);
    if (incErr) e.averageIncome = incErr;
    
    const provErr = validateQuickQuoteField("province", province);
    if (provErr) e.province = provErr;
    
    const indErr = validateQuickQuoteField("industry", industry);
    if (indErr) e.industry = indErr;

    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!validate()) return;

    let newQuoteData: any = null;
    setIsGenerating(true);
    try {
      const { updateQuote, createQuickQuote } = await import("@/lib/api/quotes");
      if (quoteId) {
        const res = await updateQuote(quoteId, {
          quote_type: "Quick",
          workforce_count: parseInt(employees, 10),
          average_age: parseInt(averageAge, 10),
          average_salary: parseFloat(averageIncome),
          province: province,
          industry: industry,
          gender_split: genderSplit,
        });
        newQuoteData = res.data;
      } else {
        const res = await createQuickQuote({
          lead_id: leadId,
          workforce_count: parseInt(employees, 10),
          average_age: parseInt(averageAge, 10),
          average_salary: parseFloat(averageIncome),
          province: province,
          industry: industry,
          gender_split: genderSplit,
          benefits: [
            { benefit_type: "Life Cover", cover_amount: 100000 },
            { benefit_type: "Funeral Cover", cover_amount: 50000 },
            { benefit_type: "Occupational Disability", cover_amount: 100000 },
          ],
          quote_status: "Draft",
        });
        newQuoteData = res.data;
      }
    } catch (err) {
      console.error("Failed to save/update quote on next", err);
    } finally {
      setIsGenerating(false);
    }

    if (onGenerateQuote) {
      onGenerateQuote(newQuoteData);
    }
  };

  const handleSaveDraft = async () => {
    if (!validate()) {
      alert("Please fill in all required fields before saving.");
      return;
    }

    setIsSavingDraft(true);
    try {
      const { createQuickQuote, updateQuote } = await import("@/lib/api/quotes");

      if (quoteId) {
        await updateQuote(quoteId, {
          quote_status: "Draft",
          quote_type: "Quick",
          workforce_count: parseInt(employees, 10),
          average_age: parseInt(averageAge, 10),
          average_salary: parseFloat(averageIncome),
          province: province,
          industry: industry,
          gender_split: genderSplit,
        });
      } else {
        await createQuickQuote({
          lead_id: leadId,
          workforce_count: parseInt(employees, 10),
          average_age: parseInt(averageAge, 10),
          average_salary: parseFloat(averageIncome),
          province: province,
          industry: industry,
          gender_split: genderSplit,
          benefits: [
            { benefit_type: "Life Cover", cover_amount: 100000 },
            { benefit_type: "Funeral Cover", cover_amount: 50000 },
            { benefit_type: "Occupational Disability", cover_amount: 100000 },
          ],
          quote_status: "Draft", // Our backend change will now respect this
        });
      }

      if (onDraftSaved) {
        onDraftSaved();
      }
    } catch (err: any) {
      console.error("Failed to save draft:", err);
      alert("Failed to save draft: " + (err.message || "Unknown error"));
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <>
      <StepProgress steps={QUICK_STEPS} currentStep={0} variant="continuous" />

      <div style={{
        background: "var(--card-secondary)",
        border: "1px solid var(--border)",
        borderRadius: "12px",
        padding: "24px",
        display: "flex",
        flexDirection: "column",
        gap: "20px",
        flex: 1,
      }}>

        {/* Employees — full width */}
        <div>
          <label style={labelStyle}>How many employees do you plan to cover? *</label>
          <CustomInput
            type="text"
            inputMode="numeric"
            value={employees}
            placeholder="85"
            onChange={e => handleChange("employees", e.target.value.replace(/\D/g, ""))}
            onBlur={e => handleBlur("employees", e.target.value)}
            error={errors.employees}
          />
        </div>

        {/* Gender split — horizontal pill toggles */}
        <div>
          <label style={labelStyle}>Are they... *</label>
          <OptionToggleGroup
            options={["Mostly male", "Mostly female", "Even split"]}
            value={genderSplit}
            onChange={val => {
              onFormChange({ ...formData, genderSplit: val });
              setErrors(prev => ({ ...prev, genderSplit: validateQuickQuoteField("genderSplit", val) }));
            }}
            error={errors.genderSplit}
          />
        </div>

        {/* Age + Income — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>What is their average age? *</label>
            <CustomInput
              type="text"
              inputMode="numeric"
              value={averageAge}
              placeholder="e.g., 24"
              onChange={e => handleChange("averageAge", e.target.value.replace(/\D/g, ""))}
              onBlur={e => handleBlur("averageAge", e.target.value)}
              error={errors.averageAge}
            />
          </div>
          <div>
            <label style={labelStyle}>What is their average monthly income (before tax)? *</label>
            <CustomInput
              type="text"
              inputMode="decimal"
              value={averageIncome}
              placeholder="e.g., R50,000"
              onChange={e => {
                let v = e.target.value.replace(/[^\d.]/g, "");
                if ((v.match(/\./g) || []).length > 1) v = v.replace(/\.$/, "");
                handleChange("averageIncome", v);
              }}
              onBlur={e => handleBlur("averageIncome", e.target.value)}
              error={errors.averageIncome}
            />
          </div>
        </div>

        {/* Province + Industry — side by side */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div>
            <label style={labelStyle}>In which province are most of the employees based? *</label>
            <CustomSelect
              value={province}
              placeholder="Select province"
              onChange={(e: any) => handleChange("province", e.target.value)}
              onBlur={(e: any) => handleBlur("province", e.target.value)}
              error={errors.province}
            >
              <option value="" disabled hidden>Select province</option>
              {PROVINCE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
            </CustomSelect>
          </div>
          <div>
            <label style={labelStyle}>Which industry is your organisation primarily in? *</label>
            <CustomSelect
              value={industry}
              placeholder="Select industry"
              onChange={(e: any) => handleChange("industry", e.target.value)}
              onBlur={(e: any) => handleBlur("industry", e.target.value)}
              error={errors.industry}
            >
              <option value="" disabled hidden>Select industry</option>
              {INDUSTRY_TYPE_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
            </CustomSelect>
          </div>
        </div>

      </div>

      {/* Back + Generate Quote — outside the card, bottom of outer frame */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: "24px" }}>
        <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <BackButton onClick={onBack} />
          <SaveDraftButton 
            onClick={handleSaveDraft} 
            disabled={isSavingDraft} 
            label={isSavingDraft ? "Saving..." : "Save Draft"} 
          />
        </div>
        <NextButton label={isGenerating ? "Processing..." : "Next Step"} onClick={handleGenerate} />
      </div>
    </>
  );
}

