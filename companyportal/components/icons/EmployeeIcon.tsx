import type { SVGProps } from "react";

export default function EmployeeIcon({
  color = "#64748B",
  ...props
}: SVGProps<SVGSVGElement> & { color?: string }) {
  return (
    <svg
      width="13"
      height="13"
      viewBox="0 0 13 13"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M10.2892 11.3725V10.2894C10.2892 9.71483 10.061 9.16382 9.65469 8.75755C9.24843 8.35129 8.69741 8.12305 8.12286 8.12305H4.87336C4.29882 8.12305 3.7478 8.35129 3.34154 8.75755C2.93527 9.16382 2.70703 9.71483 2.70703 10.2894V11.3725"
        stroke={color}
        strokeWidth="1.08317"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M6.49836 5.95767C7.6948 5.95767 8.6647 4.98777 8.6647 3.79133C8.6647 2.5949 7.6948 1.625 6.49836 1.625C5.30193 1.625 4.33203 2.5949 4.33203 3.79133C4.33203 4.98777 5.30193 5.95767 6.49836 5.95767Z"
        stroke={color}
        strokeWidth="1.08317"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
