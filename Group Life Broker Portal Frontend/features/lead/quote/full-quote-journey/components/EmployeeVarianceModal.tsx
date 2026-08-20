"use client";

import React from "react";
import CloseIcon from "@mui/icons-material/Close";
import CustomButton from "@/components/ui/button";

interface EmployeeVarianceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAccept: () => void;
  leadCount: number | string;
  uploadedCount: number | string;
}

export default function EmployeeVarianceModal({
  isOpen,
  onClose,
  onAccept,
  leadCount,
  uploadedCount,
}: EmployeeVarianceModalProps) {
  if (!isOpen) return null;

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
        className="flex flex-col gap-5 p-6"
        style={{
          width: "549px",
          height: "305.59765625px",
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
              fontSize: "18px",
              fontWeight: 700,
              lineHeight: "24px",
              color: "var(--text-primary)",
            }}
          >
            Employee Variance
          </h2>
          <button
            onClick={onClose}
            className="flex items-center justify-center w-6 h-6"
          >
            <CloseIcon sx={{ fontSize: 20, color: "var(--text-secondary)" }} />
          </button>
        </div>

        {/* Body */}
        <div
          className="flex flex-col gap-3"
          style={{
            fontSize: "14px",
            color: "var(--text-secondary)",
            lineHeight: "1.5",
          }}
        >
          <p>
            There is a variance of employee count entered during the lead creation and
            the uploaded employees.
          </p>
          <p>This would effect your pricing.</p>
          <p>Do you want to accept this variation?</p>
          
          <p style={{ color: "var(--text-primary)", fontWeight: 500, marginTop: "8px", fontSize: "14px" }}>
            Employees listed in Lead {leadCount} &rarr; Employees listed in bulk upload {uploadedCount}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-start gap-4 mt-auto">
          <CustomButton onClick={onClose} variant="audit" size="md" sx={{ width: "220px", height: "40px" }}>
            Edit Employees
          </CustomButton>
          <CustomButton onClick={onAccept} variant="primary" size="md" sx={{ width: "220px", height: "40px" }}>
            Accept Variation
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
