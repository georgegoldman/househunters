import type { IconProps } from "../types/icon";

const HouseIcon: React.FC<IconProps> = ({ isActive = false }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M0.9375 6.5625L7.5 2.34375L14.0625 6.5625M12.6562 5.625V12.6562H2.34375V5.625M6.09375 8.90625H8.90625V12.6562H6.09375V8.90625Z"
        stroke={isActive ? 'black': 'white'}
        stroke-opacity="0.7"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default HouseIcon;
