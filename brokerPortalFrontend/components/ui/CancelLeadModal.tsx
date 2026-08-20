"use client";

import { useState } from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomInput from "./CustomInput";
import { FormField } from "./FormField";
import CustomButton from "./button";

interface CancelLeadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (reason: string) => void;
}

export default function CancelLeadModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelLeadModalProps) {
  const [reason, setReason] = useState("");
  const [error, setError] = useState("");

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (!reason.trim()) {
      setError("Cancellation reason is required");
      return;
    }
    if (reason.trim().length < 5) {
      setError("Reason must be at least 5 characters");
      return;
    }
    setError("");
    onConfirm(reason);
    // Reset state on successful confirm
    setReason("");
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      style={{
        background: "var(--overlay-bg)",
        backdropFilter: "blur(10.5px)",
      }}
      onClick={onClose}
    >
      {/* Modal Container */}
      <div
        className="flex flex-col gap-6 p-6"
        style={{
          width: "549px",
          background: "var(--card-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "10px",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2
            style={{
              fontSize: "24px",
              fontWeight: 700,
              lineHeight: "30px",
              letterSpacing: "-0.449219px",
              color: "var(--text-primary)",
            }}
          >
            Cancel Lead
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6"
          >
            <CloseIcon sx={{ fontSize: 24, color: 'var(--text-secondary)' }} />
          </button>
        </div>

        {/* Form Fields */}
        <div className="flex flex-col gap-4">
          <p
            style={{
              fontSize: "15px",
              fontWeight: "400",
              color: "var(--foreground)",
              marginBottom: "4px",
            }}
          >
            Are you sure you want to cancel the lead?
          </p>
          <FormField label="Reason *">
            <textarea
              value={reason}
              onChange={(e) => {
                setReason(e.target.value);
                if (e.target.value) setError("");
              }}
              placeholder="Enter reason"
              className="w-full p-3 outline-none resize-none"
              rows={4}
              style={{
                background: "var(--input)",
                border: error ? "1.88px solid var(--destructive)" : "1.88px solid var(--input-border)",
                borderRadius: "6px",
                color: "var(--text-primary)",
              }}
            />
            {error && (
              <span className="text-red-500 text-sm mt-1">{error}</span>
            )}
          </FormField>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-2">
          <CustomButton
            onClick={() => {
              setReason("");
              setError("");
              onClose();
            }}
            variant="audit"
            size="md"
          >
            No, Go Back
          </CustomButton>
          <CustomButton
            onClick={handleConfirm}
            variant="primary"
            size="md"
          >
            Yes, Cancel
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
