"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Box, Stack, Grid, Typography, Button } from "@mui/material";
import { createLead, updateLead, getLead } from "@/lib/api/leads";
import { SaveDraftButton, BackButton, NextButton } from "@/components/ui/StepButtons";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { FormField } from "@/components/ui/FormField";
import StepProgress from "@/components/ui/StepProgress";
import Toast from "@/components/ui/Toast";
import {
  validateSAMobileNumber,
  validateEmail,
  validateCompanyName,
  validateRequired,
  validatePositiveNumber,
  validateRegistrationNumber,
  validateContactPersonName,
} from "@/utils/validators";
import {
  INDUSTRY_TYPE_OPTIONS,
  PROVINCE_OPTIONS,
  PreferredCommunicationMethod,
} from "@/lib/enums";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STEPS = ["Employer Details", "Contact Details", "Preview"];

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type EmployerForm = {
  employerName: string;
  registrationNumber: string;
  industryType: string;
  numberOfEmployees: string;
  averageSalary: string;
  province: string;
};

type ContactForm = {
  contactFirstName: string;
  contactLastName: string;
  preferredCommunication: string;
  contactEmail: string;
  contactMobile: string;
};

type EmployerErrors = Partial<Record<keyof EmployerForm, string>>;
type ContactErrors = Partial<Record<keyof ContactForm, string>>;

// ---------------------------------------------------------------------------
// Initial state
// ---------------------------------------------------------------------------

const emptyEmployer: EmployerForm = {
  employerName: "",
  registrationNumber: "",
  industryType: "",
  numberOfEmployees: "",
  averageSalary: "",
  province: "",
};

const emptyContact: ContactForm = {
  contactFirstName: "",
  contactLastName: "",
  preferredCommunication: "SMS",
  contactEmail: "",
  contactMobile: "",
};

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

function validateEmployer(f: EmployerForm): EmployerErrors {
  const e: EmployerErrors = {};

  if (!validateRequired(f.employerName)) e.employerName = "Employer name is required";
  else if (!validateCompanyName(f.employerName))
    e.employerName = "Employer name must be between 1 and 100 characters";

  if (!validateRegistrationNumber(f.registrationNumber))
    e.registrationNumber = "Registration number must be between 1 and 50 characters if provided";

  if (!f.industryType) e.industryType = "Please select an industry type";

  if (!validateRequired(f.numberOfEmployees))
    e.numberOfEmployees = "Number of employees is required";
  else if (!validatePositiveNumber(f.numberOfEmployees))
    e.numberOfEmployees = "Must be a valid positive number";
  else if (Number(f.numberOfEmployees) > 100)
    e.numberOfEmployees = "Number of employees cannot be more than 100";

  if (f.averageSalary && !validatePositiveNumber(f.averageSalary))
    e.averageSalary = "Must be a valid positive number";

  if (!f.province) e.province = "Please select a province";

  return e;
}

function validateContact(f: ContactForm): ContactErrors {
  const e: ContactErrors = {};

  if (!validateRequired(f.contactFirstName)) e.contactFirstName = "First name is required";
  else if (!validateContactPersonName(f.contactFirstName))
    e.contactFirstName = "First name cannot start with a number";

  if (!validateRequired(f.contactLastName)) e.contactLastName = "Last name is required";
  else if (!validateContactPersonName(f.contactLastName))
    e.contactLastName = "Last name cannot start with a number";


  if (!validateRequired(f.contactEmail)) e.contactEmail = "Email is required";
  else if (!validateEmail(f.contactEmail)) e.contactEmail = "Enter a valid email address";

  if (!validateRequired(f.contactMobile)) e.contactMobile = "Mobile number is required";
  else if (!validateSAMobileNumber(f.contactMobile))
    e.contactMobile = "Mobile phone number must be 10 digits long and start with 06, 07 or 08";

  return e;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------


function hasErrors(errors: Record<string, string | undefined>): boolean {
  return Object.values(errors).some(Boolean);
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

interface EmployerStepProps {
  employer: EmployerForm;
  errors: EmployerErrors;
  onChange: (field: keyof EmployerForm) => (e: any) => void;
}

function EmployerStep({ employer, errors, onChange }: EmployerStepProps) {
  return (
    <>
      <Stack spacing={3}>
        <FormField label="Employer Name *">
          <CustomInput
            error={errors.employerName}
            value={employer.employerName}
            onChange={onChange("employerName")}
            placeholder="e.g., abc company"
          />
        </FormField>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Registration Number">
              <CustomInput
                error={errors.registrationNumber}
                value={employer.registrationNumber}
                onChange={onChange("registrationNumber")}
                placeholder="e.g., 4782913749213"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Industry Type *">
              <CustomSelect
                error={errors.industryType}
                value={employer.industryType}
                onChange={onChange("industryType")}
                placeholder="Select industry type"
              >
                <option value="" disabled hidden>Select industry type</option>
                {INDUSTRY_TYPE_OPTIONS.map((i) => (
                  <option key={i} value={i}>{i}</option>
                ))}
              </CustomSelect>
            </FormField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Average Salary">
              <CustomInput
                error={errors.averageSalary}
                type="number"
                inputMode="numeric"
                value={employer.averageSalary}
                onChange={onChange("averageSalary")}
                placeholder="e.g., 50000"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Number of Employees *">
              <CustomInput
                error={errors.numberOfEmployees}
                type="number"
                inputMode="numeric"
                value={employer.numberOfEmployees}
                onChange={onChange("numberOfEmployees")}
                placeholder="e.g., 90"
              />
            </FormField>
          </Grid>
        </Grid>

        <FormField label="Province *">
          <CustomSelect
            error={errors.province}
            value={employer.province}
            onChange={onChange("province")}
            placeholder="Select province"
          >
            <option value="" disabled hidden>Select province</option>
            {PROVINCE_OPTIONS.map((p) => (
              <option key={p} value={p}>{p}</option>
            ))}
          </CustomSelect>
        </FormField>
      </Stack>
    </>
  );
}

interface ContactStepProps {
  contact: ContactForm;
  errors: ContactErrors;
  onChange: (field: keyof ContactForm) => (e: any) => void;
}

function ContactStep({ contact, errors, onChange }: ContactStepProps) {
  return (
    <>
      <Stack spacing={3}>
        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Contact First Name *">
              <CustomInput
                error={errors.contactFirstName}
                value={contact.contactFirstName}
                onChange={onChange("contactFirstName")}
                placeholder="e.g., John"
              />
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Contact Last Name *">
              <CustomInput
                error={errors.contactLastName}
                value={contact.contactLastName}
                onChange={onChange("contactLastName")}
                placeholder="e.g., Doe"
              />
            </FormField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Preferred Communication">
              <CustomSelect
                error={errors.preferredCommunication}
                value={contact.preferredCommunication}
                onChange={onChange("preferredCommunication")}
              >
                {Object.values(PreferredCommunicationMethod).map((method) => (
                  <option key={method} value={method}>{method}</option>
                ))}
              </CustomSelect>
            </FormField>
          </Grid>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Contact Email *">
              <CustomInput
                error={errors.contactEmail}
                type="email"
                value={contact.contactEmail}
                onChange={onChange("contactEmail")}
                placeholder="e.g., abc@xyz.com"
              />
            </FormField>
          </Grid>
        </Grid>

        <Grid container spacing={2}>
          <Grid size={{ xs: 12, sm: 6 }}>
            <FormField label="Contact Mobile *">
              <CustomInput
                error={errors.contactMobile}
                type="tel"
                inputMode="numeric"
                value={contact.contactMobile}
                onChange={onChange("contactMobile")}
                placeholder="e.g., 0821234567"
              />
            </FormField>
          </Grid>
        </Grid>
      </Stack>
    </>
  );
}

interface ReviewStepProps {
  employer: EmployerForm;
  contact: ContactForm;
}

function ReviewStep({ employer, contact }: ReviewStepProps) {
  const reviewField = (label: string, value: string) => (
    <Grid size={{ xs: 12, sm: 6 }}>
      <Typography sx={{ color: "var(--muted-foreground)", fontSize: "14px" }}>{label}</Typography>
      <Typography sx={{ color: "var(--foreground)", fontSize: "14px" }}>{value || "—"}</Typography>
    </Grid>
  );

  return (
    <>
      <Typography sx={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--text-heading)", mb: 1.5 }}>
        Employer Details
      </Typography>
      <Grid container spacing={2} sx={{ fontSize: "0.875rem" }}>
        {reviewField("Employer Name", employer.employerName)}
        {reviewField("Registration Number", employer.registrationNumber)}
        {reviewField("Industry Type", employer.industryType)}
        {reviewField("Number of Employees", employer.numberOfEmployees)}
        {reviewField("Province", employer.province)}
      </Grid>

      <Box sx={{ borderTop: "1px solid var(--border)", pt: 3, mt: 3 }}>
        <Typography sx={{ fontSize: "1.125rem", fontWeight: 500, color: "var(--text-heading)", mb: 1.5 }}>
          Contact Details
        </Typography>
        <Grid container spacing={2} sx={{ fontSize: "0.875rem" }}>
          {reviewField("Contact Person", `${contact.contactFirstName} ${contact.contactLastName}`.trim())}
          {reviewField("Preferred Communication", contact.preferredCommunication)}
          {reviewField("Contact Email", contact.contactEmail)}
          {reviewField("Contact Mobile", contact.contactMobile)}
        </Grid>
      </Box>
    </>
  );
}



// ---------------------------------------------------------------------------
// Page content
// ---------------------------------------------------------------------------

function StartNewLeadContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const initialLeadId = searchParams?.get("leadId") ?? "";
  const initialStep = parseInt(searchParams?.get("step") ?? "0", 10);

  const [step, setStep] = useState(initialStep);
  const [employer, setEmployer] = useState<EmployerForm>(emptyEmployer);
  const [contact, setContact] = useState<ContactForm>(emptyContact);
  const [employerErrors, setEmployerErrors] = useState<EmployerErrors>({});
  const [contactErrors, setContactErrors] = useState<ContactErrors>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [mounted, setMounted] = useState(false);
  const [toast, setToast] = useState<string | null>(null);
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  const [leadId, setLeadId] = useState<string>(initialLeadId);
  const [isLoadingLead, setIsLoadingLead] = useState(!!initialLeadId);

  // Load existing lead if editing
  useEffect(() => {
    if (!initialLeadId) return;

    getLead(initialLeadId)
      .then((leadData) => {
        if (!leadData) return;
        setEmployer({
          employerName: leadData.employerName ?? "",
          registrationNumber: leadData.registrationNumber ?? "",
          industryType: leadData.industry ?? "",
          numberOfEmployees: leadData.numberOfEmployees?.toString() ?? "",
          averageSalary: (leadData as any).averageSalary?.toString() ?? "",
          province: leadData.province ?? "",
        });
        if (leadData.contactFirstName || leadData.contactEmail) {
          setContact({
            contactFirstName: leadData.contactFirstName ?? "",
            contactLastName: leadData.contactLastName ?? "",
            preferredCommunication: leadData.preferredCommunicationMethod ?? "",
            contactEmail: leadData.contactEmail ?? "",
            contactMobile: leadData.contactPhone ?? "",
          });
        }
      })
      .catch((err) => console.error("Failed to load lead", err))
      .finally(() => setIsLoadingLead(false));
  }, [initialLeadId]);

  useEffect(() => { setMounted(true); }, []);

  // ---------------------------------------------------------------------------
  // Toast
  // ---------------------------------------------------------------------------

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  // ---------------------------------------------------------------------------
  // Field change handlers
  // ---------------------------------------------------------------------------

  const handleEmployerChange = (field: keyof EmployerForm) => (e: any) => {
    let value = e.target.value;
    if (field === "numberOfEmployees" || field === "averageSalary") {
      value = value.replace(/\D/g, "");
    }
    setEmployer((prev) => ({ ...prev, [field]: value }));
    if (employerErrors[field]) setEmployerErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleContactChange = (field: keyof ContactForm) => (e: any) => {
    let value = e.target.value;
    if (field === "contactMobile") value = value.replace(/\D/g, "").slice(0, 10);
    setContact((prev) => ({ ...prev, [field]: value }));
    if (contactErrors[field]) setContactErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // ---------------------------------------------------------------------------
  // Payload builder
  // ---------------------------------------------------------------------------

  const buildPayload = (targetStep: number, isDraft: boolean = false) => {
    const payload: any = {
      employer: {
        employerName: employer.employerName,
        industryType: employer.industryType,
        numberOfEmployees: employer.numberOfEmployees
          ? Number(employer.numberOfEmployees)
          : undefined,
        averageSalary: employer.averageSalary ? Number(employer.averageSalary) : undefined,
        province: employer.province,
      },
      lastSavedStep: targetStep,
    };

    if (isDraft) {
      payload.leadStatus = "Draft";
    }

    if (employer.registrationNumber) {
      payload.employer.registrationNumber = employer.registrationNumber;
    }

    if (step >= 1 && (contact.contactFirstName || contact.contactLastName || contact.contactEmail || contact.contactMobile)) {
      payload.contact = {};
      if (contact.contactFirstName || contact.contactLastName) {
        payload.contact.contact_first_name = contact.contactFirstName;
        payload.contact.contact_last_name = contact.contactLastName;
      }
      if (contact.contactEmail) payload.contact.contact_email = contact.contactEmail;
      if (contact.contactMobile) payload.contact.contact_mobile = contact.contactMobile;
      if (contact.preferredCommunication)
        payload.contact.preferred_communication_method = contact.preferredCommunication;
    }

    return payload;
  };

  // ---------------------------------------------------------------------------
  // Core save / update
  // ---------------------------------------------------------------------------

  const saveOrUpdateLead = async (targetStep?: number, isDraft = false) => {
    const isInitialCreate = !leadId;
    const finalStep = targetStep ?? step;

    try {
      if (isDraft) setIsSavingDraft(true);
      else setSubmitting(true);
      setSubmitError(null);

      let currentLeadId = leadId;
      let leadRef = "";

      if (isInitialCreate) {
        const createPayload: any = {
          employerName: employer.employerName,
          industryType: employer.industryType,
          numberOfEmployees: employer.numberOfEmployees
            ? Number(employer.numberOfEmployees)
            : undefined,
          averageSalary: employer.averageSalary ? Number(employer.averageSalary) : undefined,
          province: employer.province,
          preferredCommunicationMethod: contact.preferredCommunication || "Email",
          ...(employer.registrationNumber && {
            registrationNumber: employer.registrationNumber,
          }),
          ...((contact.contactFirstName || contact.contactLastName) && {
            contactFirstName: contact.contactFirstName,
            contactLastName: contact.contactLastName,
          }),
          ...(contact.contactEmail && { contactEmail: contact.contactEmail }),
          ...(contact.contactMobile && { contactMobile: contact.contactMobile }),
        };

        const result = await createLead(createPayload);
        currentLeadId = result.data.leadId;
        leadRef = result.data.leadReference;
        setLeadId(currentLeadId);

        if (finalStep > 0 && !isDraft) {
          await updateLead(currentLeadId, buildPayload(finalStep, isDraft));
        }
      } else {
        await updateLead(currentLeadId, buildPayload(finalStep, isDraft));
      }

      if (isDraft) {
        showToast("Draft saved successfully");
        setTimeout(() => router.push("/lead/view"), 1200);
      } else if (targetStep === 2) {
        showToast("Lead submitted successfully");
        setTimeout(
          () =>
            router.push(
              `/quotes/new?leadId=${currentLeadId}&ref=${leadRef}&company=${encodeURIComponent(employer.employerName)}&mode=new&leadEmployeeCount=${employer.numberOfEmployees}`,
            ),
          1200,
        );
      } else {
        setStep((s) => s + 1);
      }
    } catch (err: any) {
      console.error("Operation failed:", err);
      const msg = err.message || "Failed to proceed. Please try again.";
      if (isDraft) showToast(msg);
      else setSubmitError(msg);
    } finally {
      setIsSavingDraft(false);
      setSubmitting(false);
    }
  };

  // ---------------------------------------------------------------------------
  // Action handlers
  // ---------------------------------------------------------------------------

  const handleSaveDraft = async () => {
    if (!employer.employerName)
      return showToast("Please fill in employer name before saving draft");
    if (!employer.industryType)
      return showToast("Please select an industry type before saving draft");
    if (!employer.numberOfEmployees)
      return showToast("Please enter number of employees before saving draft");
    if (!employer.province)
      return showToast("Please select a province before saving draft");

    if (step >= 1) {
      if (!contact.contactFirstName || !contact.contactLastName)
        return showToast("Please enter contact first and last name before saving draft");
      if (!contact.contactEmail) return showToast("Please enter contact email before saving draft");
      if (!contact.contactMobile) return showToast("Please enter contact mobile before saving draft");
    }

    await saveOrUpdateLead(step === 0 ? 1 : step, true);
  };

  const handleNext = () => {
    if (step === 0) {
      const e = validateEmployer(employer);
      setEmployerErrors(e);
      if (hasErrors(e)) return;
      saveOrUpdateLead(1);
    } else if (step === 1) {
      const e = validateContact(contact);
      setContactErrors(e);
      if (hasErrors(e)) return;
      saveOrUpdateLead(step);
    }
  };

  const handleSubmit = () => saveOrUpdateLead(2);

  // ---------------------------------------------------------------------------
  // Render guards
  // ---------------------------------------------------------------------------

  if (!mounted) return null;
  if (isLoadingLead) {
    return (
      <Box sx={{ p: 3, textAlign: "center", color: "var(--muted-foreground)" }}>
        Loading lead data...
      </Box>
    );
  }

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------

  return (
    <>
      <Box sx={{ px: 3, pt: 3, pb: 1, bgcolor: "var(--background)" }}>
        <Box sx={{ maxWidth: 896, mx: "auto" }}>
          <Box sx={{ mb: 3 }}>
            <h1
              style={{
                fontSize: "18px",
                fontWeight: 500,
                color: "var(--text-primary)",
                margin: 0,
              }}
            >
              Add New Lead
            </h1>
          </Box>
          <StepProgress steps={STEPS} currentStep={step} variant="continuous" />
        </Box>
      </Box>

      <Box
        sx={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          px: 3,
          py: 3,
          bgcolor: "var(--background)",
        }}
      >
        <Stack spacing={2} sx={{ width: "100%", maxWidth: 896 }}>
          {/* Step card */}
          <Box
            sx={{
              width: "100%",
              borderRadius: 2,
              p: 3,
              bgcolor: "var(--card)",
              border: "2px solid var(--border)",
            }}
          >
            {step === 0 && (
              <EmployerStep
                employer={employer}
                errors={employerErrors}
                onChange={handleEmployerChange}
              />
            )}
            {step === 1 && (
              <ContactStep
                contact={contact}
                errors={contactErrors}
                onChange={handleContactChange}
              />
            )}
            {step === 2 && <ReviewStep employer={employer} contact={contact} />}
          </Box>

          {/* Navigation */}
          <Stack
            direction="row"
            sx={{ justifyContent: "space-between", alignItems: "center", width: "100%" }}
          >
            <Box>
              {step > 0 && (
                <BackButton onClick={() => setStep((s) => s - 1)} />
              )}
              {step === 0 && (
                <SaveDraftButton
                  onClick={handleSaveDraft}
                  label={isSavingDraft ? "Saving..." : "Save Draft"}
                />
              )}
            </Box>

            <Stack direction="row" spacing={2}>
              {step < 2 ? (
                <NextButton
                  onClick={handleNext}
                  label={step === 0 ? "Next Step" : "Review"}
                />
              ) : (
                <>
                  {submitError && (
                    <Typography
                      sx={{ color: "var(--destructive)", fontSize: "0.75rem", alignSelf: "center", mr: 1.5 }}
                    >
                      {submitError}
                    </Typography>
                  )}
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting}
                    variant="contained"
                    sx={{
                      height: 40,
                      px: 2.5,
                      bgcolor: "var(--primary)",
                      color: "var(--primary-foreground)",
                      borderRadius: 1.5,
                      textTransform: "none",
                    }}
                  >
                    {submitting ? "Submitting..." : "Submit Lead"}
                  </Button>
                </>
              )}
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {toast && <Toast message={toast} />}
    </>
  );
}

// ---------------------------------------------------------------------------
// Page export
// ---------------------------------------------------------------------------

export default function StartNewLeadPage() {
  return (
    <Suspense
      fallback={
        <Box sx={{ p: 3, textAlign: "center", color: "var(--muted-foreground)" }}>
          Loading...
        </Box>
      }
    >
      <StartNewLeadContent />
    </Suspense>
  );
}