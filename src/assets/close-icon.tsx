interface CloseIconProps {
  width?: number;
  height?: number;
  className?: string;
}

const CloseIcon: React.FC<CloseIconProps> = ({
  width = 40,
  height = 40,
  className = "",
}) => {
  return (
    <svg
      width={width}
      height={height}
      className={className}
      viewBox="0 0 40 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M30 10L20 20M20 20L10 30M20 20L30 30M20 20L10 10"
        stroke="#141B34"
        stroke-width="2.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
  );
};

export default CloseIcon;
