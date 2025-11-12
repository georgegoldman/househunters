import type { IconProps } from "../types/icon";

const UserIcon: React.FC<IconProps> = ({ isActive = false }) => {
  return (
    <svg
      width="15"
      height="15"
      viewBox="0 0 15 15"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M12.1875 12.8125C11.8906 6.97937 3.10937 6.97937 2.8125 12.8125M9.375 4.6875C9.375 5.18478 9.17746 5.66169 8.82583 6.01333C8.47419 6.36496 7.99728 6.5625 7.5 6.5625C7.00272 6.5625 6.52581 6.36496 6.17417 6.01333C5.82254 5.66169 5.625 5.18478 5.625 4.6875C5.625 4.19022 5.82254 3.71331 6.17417 3.36167C6.52581 3.01004 7.00272 2.8125 7.5 2.8125C7.99728 2.8125 8.47419 3.01004 8.82583 3.36167C9.17746 3.71331 9.375 4.19022 9.375 4.6875Z"
        stroke={isActive ? "black" : "white"}
        stroke-opacity="0.7"
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default UserIcon;
