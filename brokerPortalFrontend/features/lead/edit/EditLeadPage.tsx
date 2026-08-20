"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getLead, updateLead } from "@/lib/api/leads";
import {
  validateSAMobileNumber,
  validateEmail,
  validateRequired,
  validatePositiveNumber,
  validateContactPersonName,
} from "@/utils/validators";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { FormField } from "@/components/ui/FormField";
import { INDUSTRY_TYPE_OPTIONS, PROVINCE_OPTIONS } from "@/lib/enums";

interface EditLeadPageProps {
  leadId: string;
}

export default function EditLeadPage({ leadId }: EditLeadPageProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [companyName, setCompanyName] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [industry, setIndustry] = useState("");
  const [numberOfEmployees, setNumberOfEmployees] = useState("");
  const [province, setProvince] = useState("");

  const [contactFirstName, setContactFirstName] = useState("");
  const [contactLastName, setContactLastName] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [contactPhone, setContactPhone] = useState("");

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const lead = await getLead(leadId);
        if (lead) {
          setCompanyName(lead.employerName || "");
          setRegistrationNumber(lead.registrationNumber || "");
          setIndustry(lead.industry || "");
          setNumberOfEmployees(String(lead.numberOfEmployees || ""));
          setProvince(lead.province || "");
          
          setContactFirstName(lead.contactFirstName || "");
          setContactLastName(lead.contactLastName || "");
          setContactEmail(lead.contactEmail || "");
          setContactPhone(lead.contactPhone || "");
        }
      } catch (err: any) {
        setError(err.message || "Failed to load lead details");
      } finally {
        setLoading(false);
      }
    })();
  }, [leadId]);

  const handleSave = async () => {
    const errs: Record<string, string> = {};

    if (!validateRequired(companyName)) errs.companyName = "Company name is required";
    if (!validateRequired(industry)) errs.industry = "Industry is required";
    if (!validateRequired(numberOfEmployees) || !validatePositiveNumber(numberOfEmployees)) {
      errs.numberOfEmployees = "Must be a valid positive number";
    }
    if (!validateRequired(province)) errs.province = "Province is required";

    if (!validateRequired(contactFirstName)) {
      errs.contactFirstName = "First name is required";
    } else if (!validateContactPersonName(contactFirstName)) {
      errs.contactFirstName = "First name cannot start with a number";
    }

    if (!validateRequired(contactLastName)) {
      errs.contactLastName = "Last name is required";
    } else if (!validateContactPersonName(contactLastName)) {
      errs.contactLastName = "Last name cannot start with a number";
    }

    if (!validateRequired(contactEmail) || !validateEmail(contactEmail)) {
      errs.contactEmail = "Enter a valid email address";
    }
    if (!validateRequired(contactPhone) || !validateSAMobileNumber(contactPhone)) {
      errs.contactPhone = "Enter a valid 10-digit SA mobile number";
    }

    if (Object.keys(errs).length > 0) {
      setValidationErrors(errs);
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const payload = {
        employer: {
          employerName: companyName,
          registrationNumber: registrationNumber || undefined,
          industryType: industry,
          numberOfEmployees: Number(numberOfEmployees),
          province: province,
        },
        contact: {
          contact_first_name: contactFirstName.trim(),
          contact_last_name: contactLastName.trim(),
          contact_email: contactEmail,
          contact_mobile: contactPhone,
          preferred_communication_method: "Email",
        }
      };

      await updateLead(leadId, payload);
      router.push("/lead/view");
    } catch (err: any) {
      setError(err.message || "Failed to save lead updates");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <Box sx={{ py: 6, textAlign: "center", color: "var(--text-secondary)" }}>Loading lead details...</Box>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "22px", fontWeight: 600, color: "var(--foreground)", margin: 0 }}>
          Edit Lead
        </h1>
      </div>

      <div style={{
        background: "var(--card)",
        border: "2px solid var(--border)",
        borderRadius: "8px",
        padding: "24px"
      }}>
        {error && (
          <div style={{ padding: "12px", background: "rgba(239,68,68,0.1)", border: "1px solid var(--destructive)", borderRadius: "6px", color: "var(--destructive)", marginBottom: "20px" }}>
            {error}
          </div>
        )}

        <h2 style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--foreground)", marginBottom: "20px" }}>Employer Information</h2>
        <div className="space-y-6">
          <FormField label="Company Name *">
            <CustomInput error={validationErrors.companyName} value={companyName} onChange={e => { setCompanyName(e.target.value); setValidationErrors({ ...validationErrors, companyName: "" }); }} />
          </FormField>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Registration Number">
              <CustomInput error={validationErrors.registrationNumber} value={registrationNumber} onChange={e => setRegistrationNumber(e.target.value.replace(/[^\d/]/g, ""))} placeholder="e.g. 2016/4924343/07" />
            </FormField>
            <FormField label="Industry *">
              <CustomSelect error={validationErrors.industry} value={industry} onChange={(e: any) => { setIndustry(e.target.value); setValidationErrors({ ...validationErrors, industry: "" }); }}>
                <option value="" disabled>Select industry</option>
                {INDUSTRY_TYPE_OPTIONS.map(i => <option key={i} value={i}>{i}</option>)}
              </CustomSelect>
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Number of Employees *">
              <CustomInput error={validationErrors.numberOfEmployees} type="number" inputProps={{ inputMode: "numeric" }} value={numberOfEmployees} onChange={e => { setNumberOfEmployees(e.target.value); setValidationErrors({ ...validationErrors, numberOfEmployees: "" }); }} />
            </FormField>
            <FormField label="Province *">
              <CustomSelect error={validationErrors.province} value={province} onChange={(e: any) => { setProvince(e.target.value); setValidationErrors({ ...validationErrors, province: "" }); }}>
                <option value="" disabled>Select province</option>
                {PROVINCE_OPTIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </CustomSelect>
            </FormField>
          </div>
        </div>

        <div style={{ borderTop: "1px solid var(--border)", margin: "32px 0 24px 0" }} />

        <h2 style={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--foreground)", marginBottom: "20px" }}>Primary Contact Information</h2>
        <div className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <FormField label="Contact First Name *">
              <CustomInput error={validationErrors.contactFirstName} value={contactFirstName} onChange={e => { setContactFirstName(e.target.value); setValidationErrors({ ...validationErrors, contactFirstName: "" }); }} placeholder="e.g., John" />
            </FormField>
            <FormField label="Contact Last Name *">
              <CustomInput error={validationErrors.contactLastName} value={contactLastName} onChange={e => { setContactLastName(e.target.value); setValidationErrors({ ...validationErrors, contactLastName: "" }); }} placeholder="e.g., Doe" />
            </FormField>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <FormField label="Email Address *">
              <CustomInput error={validationErrors.contactEmail} type="email" value={contactEmail} onChange={e => { setContactEmail(e.target.value); setValidationErrors({ ...validationErrors, contactEmail: "" }); }} />
            </FormField>
            <FormField label="Phone Number *">
              <CustomInput error={validationErrors.contactPhone} type="tel" inputProps={{ inputMode: "numeric", maxLength: 10 }} value={contactPhone} onChange={e => { setContactPhone(e.target.value.replace(/\D/g, "").slice(0, 10)); setValidationErrors({ ...validationErrors, contactPhone: "" }); }} />
            </FormField>
          </div>
        </div>
      </div>

      <div style={{ display: "flex", justifyContent: "flex-end", gap: "12px", marginTop: "24px" }}>
        <Button variant="outlined" onClick={() => router.push("/lead/view")} sx={{ borderColor: "var(--border)", color: "var(--text-primary)", textTransform: "none", borderRadius: "8px" }}>
          Cancel
        </Button>
        <Button variant="contained" onClick={handleSave} disabled={saving} sx={{ bgcolor: "#1FC3EB", color: "#0A0A0A", fontWeight: 600, textTransform: "none", borderRadius: "8px", "&:hover": { bgcolor: "#0DB5D8" } }}>
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}
