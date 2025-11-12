import type { IconProps } from "../types/icon";

const SettingsIcon: React.FC<IconProps> = ({ isActive = false }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_157_56)">
        <path
          d="M7.5 9.375C7.99728 9.375 8.47419 9.17746 8.82583 8.82583C9.17746 8.47419 9.375 7.99728 9.375 7.5C9.375 7.00272 9.17746 6.52581 8.82583 6.17417C8.47419 5.82254 7.99728 5.625 7.5 5.625C7.00272 5.625 6.52581 5.82254 6.17417 6.17417C5.82254 6.52581 5.625 7.00272 5.625 7.5C5.625 7.99728 5.82254 8.47419 6.17417 8.82583C6.52581 9.17746 7.00272 9.375 7.5 9.375Z"
          stroke={isActive ? "black" : "white"}
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M12.2637 6.49688L11.5781 4.84062L12.5 3.75L11.25 2.5L10.1656 3.42687L8.47375 2.73125L8.08438 1.25H6.86312L6.46812 2.75063L4.815 3.4475L3.75 2.5L2.5 3.75L3.40813 4.86813L2.73313 6.52875L1.25 6.875V8.125L2.75063 8.535L3.4475 10.1875L2.5 11.25L3.75 12.5L4.86937 11.5875L6.49813 12.2575L6.875 13.75H8.125L8.5025 12.2581L10.1594 11.5719C10.4356 11.77 11.25 12.5 11.25 12.5L12.5 11.25L11.5725 10.1562L12.2588 8.49875L13.75 8.11125V6.875L12.2637 6.49688Z"
          stroke={isActive ? "black" : "white"}
          strokeOpacity="0.6"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>
      <defs>
        <clipPath id="clip0_157_56">
          <rect width="15" height="15" fill={isActive ? "black" : "white"} />
        </clipPath>
      </defs>
    </svg>
  );
};

export default SettingsIcon;
