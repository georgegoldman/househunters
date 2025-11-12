import React from "react";

interface UploadIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const DownloadIcon: React.FC<UploadIconProps> = ({
  width = 16,
  height = 16,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      viewBox="0 0 16 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M2.37482 10.625C2.37482 11.2063 2.37482 11.4969 2.43871 11.7353C2.61209 12.3823 3.11749 12.8878 3.76454 13.0611C4.00297 13.125 4.29359 13.125 4.87482 13.125H11.1248C11.7061 13.125 11.9967 13.125 12.2351 13.0611C12.8821 12.8878 13.3876 12.3823 13.5609 11.7353C13.6248 11.4969 13.6248 11.2063 13.6248 10.625"
        stroke="black"
        stroke-width="0.9375"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <path
        d="M10.8124 7.18753C10.8124 7.18753 8.74103 10 7.99984 10C7.25872 10 5.18738 7.18753 5.18738 7.18753M7.99984 9.37503V1.875"
        stroke="black"
        stroke-width="0.9375"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default DownloadIcon;
