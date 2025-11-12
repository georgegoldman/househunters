import React from "react";

interface UploadIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const UploadIcon: React.FC<UploadIconProps> = ({
  width = 24,
  height = 24,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.375 11.125C2.375 11.7063 2.375 11.9969 2.43889 12.2353C2.61226 12.8823 3.11766 13.3878 3.76471 13.5611C4.00315 13.625 4.29376 13.625 4.875 13.625H11.125C11.7062 13.625 11.9968 13.625 12.2353 13.5611C12.8823 13.3878 13.3877 12.8823 13.5611 12.2353C13.625 11.9969 13.625 11.7063 13.625 11.125"
        stroke="#141B34"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.8125 5.18748C10.8125 5.18748 8.74111 2.37501 7.99999 2.375C7.25886 2.37499 5.1875 5.1875 5.1875 5.1875M7.99999 3V10.5"
        stroke="#141B34"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UploadIcon;
