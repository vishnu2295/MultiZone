"use client";

import React, { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import StepProgress from "@/components/ui/StepProgress";
import { sendOTP, verifyOTP } from "@/lib/api/otp";
import { useThemeToggle } from "@/app/providers";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import CustomButton from "@/components/ui/button";
import CustomInput from "@/components/ui/CustomInput";
import CustomSelect from "@/components/ui/CustomSelect";
import { FormField } from "@/components/ui/FormField";
import { getQuote, saveOnboardingDetails } from "@/lib/api/quotes";
import { BANK_NAME_OPTIONS, BROKER_BANK_ACCOUNT_TYPE_OPTIONS } from "@/lib/enums";
import { validateOnboardingField } from "@/utils/validators";

const formatTime = (seconds: number) => {
  const m = Math.floor(seconds / 60).toString().padStart(2, "0");
  const s = (seconds % 60).toString().padStart(2, "0");
  return `${m}:${s}`;
};

export default function CheckoutPageContent() {
  const router = useRouter();
  const params = useParams();
  const { isDarkMode } = useThemeToggle();

  const quoteId = params.quoteId as string;

  // Step State
  const [activeStep, setActiveStep] = useState(0);

  // Form State - Payment Details
  const [bank, setBank] = useState("African Bank Limited");
  const [accountNumber, setAccountNumber] = useState("");
  const [accountType, setAccountType] = useState<string>("Cheque/Current");
  const [debitDay, setDebitDay] = useState<string>("25");

  const [branchCode, setBranchCode] = useState("");
  const [accountHolderName, setAccountHolderName] = useState("");
  const [idOrRegNumber, setIdOrRegNumber] = useState("");
  const [cellphoneNumber, setCellphoneNumber] = useState("");
  const [emailAddress, setEmailAddress] = useState("");

  // Quote Data
  const [contactEmail, setContactEmail] = useState<string>("");
  const [quoteReference, setQuoteReference] = useState<string>("");

  useEffect(() => {
    if (quoteId) {
      getQuote(quoteId)
        .then((res) => {
          if (res.success && res.data) {
            if (res.data.contactEmail) setContactEmail(res.data.contactEmail);
            if (res.data.quoteReference) setQuoteReference(res.data.quoteReference);
          }
        })
        .catch((err) => console.error("Failed to fetch quote details:", err));
    }
  }, [quoteId]);

  // OTP State
  const [otpSent, setOtpSent] = useState(false);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [countdown, setCountdown] = useState(300);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const handleBlur = (field: string, value: string) => {
    const error = validateOnboardingField(field, value);
    setFieldErrors(prev => {
      const newErrors = { ...prev };
      if (error) newErrors[field] = error;
      else delete newErrors[field];
      return newErrors;
    });
  };

  const handleChange = (field: string, value: string, setter: (val: string) => void) => {
    setter(value);
    if (fieldErrors[field] || value.trim() !== "") {
      const error = validateOnboardingField(field, value);
      setFieldErrors(prev => {
        const newErrors = { ...prev };
        if (error) newErrors[field] = error;
        else delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Countdown timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (otpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [otpSent, countdown]);

  const handleNextStep = async () => {
    if (activeStep === 0) {
      // Run all frontend validations before submitting
      const fieldsToValidate = [
        { field: "account_number", value: accountNumber },
        { field: "branch_code", value: branchCode },
        { field: "account_holder_name", value: accountHolderName },
        { field: "id_or_registration_number", value: idOrRegNumber },
        { field: "cellphone_number", value: cellphoneNumber },
        { field: "email_address", value: emailAddress },
        { field: "debit_day", value: debitDay },
      ];

      const newErrors: Record<string, string> = {};
      let hasFrontendError = false;
      fieldsToValidate.forEach(({ field, value }) => {
        const err = validateOnboardingField(field, value);
        if (err) {
          newErrors[field] = err;
          hasFrontendError = true;
        }
      });

      if (hasFrontendError) {
        setFieldErrors(newErrors);
        return;
      }

      setIsSubmitting(true);
      setGlobalError(null);
      setFieldErrors({});
      try {
        await saveOnboardingDetails(quoteId, {
          bank_name: bank,
          account_number: accountNumber,
          branch_code: branchCode,
          account_type: accountType,
          account_holder_name: accountHolderName,
          id_or_registration_number: idOrRegNumber,
          cellphone_number: cellphoneNumber,
          email_address: emailAddress
        });
        setActiveStep(1);
      } catch (err: any) {
        console.error("Error saving employer details:", err);
        if (err.data && err.data.errors && Array.isArray(err.data.errors)) {
          const errorsObj: Record<string, string> = {};
          let hasGlobal = false;
          err.data.errors.forEach((e: any) => {
            if (e.field) {
              errorsObj[e.field] = e.message;
            } else {
              setGlobalError(e.message || "Validation failed.");
              hasGlobal = true;
            }
          });
          setFieldErrors(errorsObj);
          if (!hasGlobal && Object.keys(errorsObj).length === 0) {
            setGlobalError(err.message || "Failed to save details. Please try again.");
          }
        } else {
          setGlobalError(err.message || "Failed to save details. Please try again.");
        }
      } finally {
        setIsSubmitting(false);
      }
    } else {
      // Accept Quote Logic (Verify OTP)
      const otpValue = otp.join("");
      if (otpValue.length !== 6) {
        setGlobalError("Please enter a valid 6-digit OTP.");
        return;
      }
      setIsSubmitting(true);
      setGlobalError(null);
      try {
        await verifyOTP({ quoteId, otpCode: otpValue });
        router.push("/quotes?tab=onboarding");
      } catch (err: any) {
        console.error("Error verifying OTP:", err);
        setGlobalError(err.message);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  const handleSendOTP = async () => {
    setIsSubmitting(true);
    setGlobalError(null);
    try {
      await sendOTP({ quoteId });
      setOtpSent(true);
      setCountdown(300);
      setOtp(["", "", "", "", "", ""]);
    } catch (err) {
      console.error("Error sending OTP:", err);
      setGlobalError("Failed to send OTP. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value && !/^\d$/.test(value)) return;
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };


  const getInputStyle = (): any => ({
    width: "100%",
    height: "44px",
    padding: "0 12px",
    background: "var(--card-secondary)",
    border: "1px solid var(--border)",
    borderRadius: "8px",
    color: "var(--text-primary)",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box",
    fontFamily: "inherit",
    colorScheme: isDarkMode ? "dark" : "light",
  });

  const getSelectStyle = (): any => ({
    ...getInputStyle(),
    appearance: "auto",
  });

  return (
    <Box sx={{ width: "100%", maxWidth: "1200px", mx: "auto", pt: 4, pb: 12 }}>
      {/* Header */}
      <Box sx={{ mb: 4, px: 2 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: "var(--text-primary)", fontSize: "24px" }}>
          Accept Quote{" "}
          <Typography component="span" sx={{ color: "var(--primary)", fontSize: "24px", fontWeight: 600 }}>
            ({quoteReference || quoteId})
          </Typography>
        </Typography>
      </Box>

      {/* Step Progress */}
      <Box sx={{ px: 2, mb: 4 }}>
        <StepProgress
          steps={["Account Details", "OTP Verification"]}
          currentStep={activeStep}
          variant="continuous"
        />
      </Box>

      {/* Main Form Container */}
      <Box
        sx={{
          mx: 2,
          background: "var(--card-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "16px",
          p: 4,
          display: "flex",
          flexDirection: "column",
          gap: 4,
          minHeight: "400px"
        }}
      >
        {globalError && activeStep === 0 && (
          <Box sx={{ p: 2, background: "var(--error-bg, rgba(239, 68, 68, 0.1))", border: "1px solid var(--error-border, rgba(239, 68, 68, 0.3))", borderRadius: "6px", color: "var(--destructive)", fontSize: "14px", mb: 2 }}>
            {globalError}
          </Box>
        )}
        {activeStep === 0 ? (
          <>
            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              {/* Bank */}
              <FormField label="Bank">
                <CustomSelect
                  value={bank}
                  onChange={(e: any) => setBank(e.target.value as string)}
                  error={fieldErrors.bank_name}
                  sx={getSelectStyle()}
                >
                  <option value="">Select a Bank</option>
                  {BANK_NAME_OPTIONS.map((name) => (
                    <option key={name} value={name}>{name}</option>
                  ))}
                </CustomSelect>
              </FormField>
              <Box sx={{ display: "none", md: "block" }} />
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
              {/* Bank account number */}
              <FormField label="Bank account number">
                <CustomInput
                  type="text"
                  placeholder="Enter account number"
                  value={accountNumber}
                  onChange={(e: any) => handleChange("account_number", e.target.value, setAccountNumber)}
                  onBlur={(e: any) => handleBlur("account_number", e.target.value)}
                  error={fieldErrors.account_number}
                  sx={getInputStyle()}
                />
              </FormField>

              {/* Bank Account Type */}
              <FormField label="Bank account type">
                <CustomSelect
                  value={accountType}
                  onChange={(e: any) => setAccountType(e.target.value as string)}
                  error={fieldErrors.account_type}
                  sx={getSelectStyle()}
                >
                  <option value="">Select Account Type</option>
                  {BROKER_BANK_ACCOUNT_TYPE_OPTIONS.map((type) => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </CustomSelect>
              </FormField>

              {/* Premium debit day of the month */}
              <FormField label="Premium debit day of the month">
                <CustomSelect
                  value={debitDay}
                  onChange={(e: any) => handleChange("debit_day", e.target.value as string, setDebitDay)}
                  onBlur={(e: any) => handleBlur("debit_day", e.target.value)}
                  error={fieldErrors.debit_day}
                  sx={getSelectStyle()}
                >
                  <option value="">Select</option>
                  {Array.from({ length: 31 }, (_, i) => i + 1).map((day) => (
                    <option key={day} value={String(day)}>{day}</option>
                  ))}
                </CustomSelect>
              </FormField>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" }, gap: 4 }}>
              {/* Branch Code */}
              <FormField label="Branch code">
                <CustomInput
                  type="text"
                  placeholder="Enter branch code"
                  value={branchCode}
                  onChange={(e: any) => handleChange("branch_code", e.target.value, setBranchCode)}
                  onBlur={(e: any) => handleBlur("branch_code", e.target.value)}
                  error={fieldErrors.branch_code}
                  sx={getInputStyle()}
                />
              </FormField>

              {/* Account Holder Name */}
              <FormField label="Account holder name">
                <CustomInput
                  type="text"
                  placeholder="Enter account holder name"
                  value={accountHolderName}
                  onChange={(e: any) => handleChange("account_holder_name", e.target.value, setAccountHolderName)}
                  onBlur={(e: any) => handleBlur("account_holder_name", e.target.value)}
                  error={fieldErrors.account_holder_name}
                  sx={getInputStyle()}
                />
              </FormField>
            </Box>

            <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" }, gap: 4 }}>
              {/* ID or Registration Number */}
              <FormField label="ID or Registration number">
                <CustomInput
                  type="text"
                  placeholder="Enter ID / Reg number"
                  value={idOrRegNumber}
                  onChange={(e: any) => handleChange("id_or_registration_number", e.target.value, setIdOrRegNumber)}
                  onBlur={(e: any) => handleBlur("id_or_registration_number", e.target.value)}
                  error={fieldErrors.id_or_registration_number}
                  sx={getInputStyle()}
                />
              </FormField>

              {/* Cellphone Number */}
              <FormField label="Cellphone number">
                <CustomInput
                  type="text"
                  placeholder="Enter cellphone number"
                  value={cellphoneNumber}
                  onChange={(e: any) => handleChange("cellphone_number", e.target.value, setCellphoneNumber)}
                  onBlur={(e: any) => handleBlur("cellphone_number", e.target.value)}
                  error={fieldErrors.cellphone_number}
                  sx={getInputStyle()}
                />
              </FormField>

              {/* Email Address */}
              <FormField label="Email address">
                <CustomInput
                  type="email"
                  placeholder="Enter email address"
                  value={emailAddress}
                  onChange={(e: any) => handleChange("email_address", e.target.value, setEmailAddress)}
                  onBlur={(e: any) => handleBlur("email_address", e.target.value)}
                  error={fieldErrors.email_address}
                  sx={getInputStyle()}
                />
              </FormField>
            </Box>
          </>
        ) : (
          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            <Typography sx={{ color: "var(--text-primary)", fontSize: "16px" }}>
              Enter the 6-digit code sent to<br />
              <strong style={{ fontWeight: 600 }}>{contactEmail || "your email address"}</strong>
            </Typography>

            {globalError && (
              <Box sx={{ p: 2, background: "var(--error-bg, rgba(239, 68, 68, 0.1))", border: "1px solid var(--error-border, rgba(239, 68, 68, 0.3))", borderRadius: "6px", color: "var(--destructive)", fontSize: "14px" }}>
                {globalError}
              </Box>
            )}

            {!otpSent ? (
              <Box>
                <CustomButton
                  onClick={handleSendOTP}
                  disabled={isSubmitting}
                  variant="primary"
                  sx={{
                    width: "120px",
                    height: "44px",
                  }}
                >
                  {isSubmitting ? "Sending..." : "Send OTP"}
                </CustomButton>
              </Box>
            ) : (
              <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
                <Box>
                  <label style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-primary)", display: "block", marginBottom: "12px" }}>Enter OTP</label>
                  <Box sx={{ display: "flex", gap: 2 }}>
                    {otp.map((digit, index) => (
                      <input
                        key={index}
                        id={`otp-${index}`}
                        ref={(el) => {
                          otpRefs.current[index] = el;
                        }}
                        type="text"
                        inputMode="numeric"
                        pattern="[0-9]*"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleOtpChange(index, e.target.value)}
                        onKeyDown={(e) => handleKeyDown(index, e)}
                        disabled={isSubmitting}
                        className="text-center font-bold focus:outline-none"
                        style={{
                          width: "57px",
                          height: "42px",
                          background: "var(--input)",
                          border: "1px solid var(--border)",
                          color: "var(--text-primary)",
                          borderRadius: "8px",
                          opacity: isSubmitting ? 0.6 : 1,
                          fontSize: "16px"
                        }}
                      />
                    ))}
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                  {countdown > 0 ? (
                    <Typography sx={{ color: "var(--text-primary)", fontSize: "13px" }}>
                      Resend OTP in {formatTime(countdown)}
                    </Typography>
                  ) : (
                    <CustomButton
                      onClick={handleSendOTP}
                      disabled={isSubmitting}
                      variant="outlined"
                      sx={{ height: "32px", fontSize: "13px", px: "16px" }}
                    >
                      {isSubmitting ? "Sending..." : "Resend OTP"}
                    </CustomButton>
                  )}
                </Box>

              </Box>
            )}
          </Box>
        )}
      </Box>

      {/* Footer Navigation */}
      <Box sx={{ mt: 6, px: 2, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <CustomButton
          onClick={() => activeStep === 0 ? router.push("/quotes") : setActiveStep(0)}
          variant="outlined"
          sx={{
            minWidth: "120px",
            height: "44px",
            borderRadius: "22px",
          }}
        >
          Back
        </CustomButton>
        <CustomButton
          onClick={handleNextStep}
          disabled={isSubmitting || (activeStep === 1 && (!otpSent || otp.join("").length !== 6))}
          variant="primary"
          sx={{
            minWidth: "140px",
            height: "44px",
            borderRadius: "22px",
          }}
        >
          {isSubmitting ? "Processing..." : activeStep === 0 ? "Next Step" : "Accept Quote"}
        </CustomButton>
      </Box>
    </Box>
  );
}
