const BoxIconWhite = () => {
  return (
    <svg
      width="65"
      height="64"
      viewBox="0 0 65 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <rect x="0.5" width="64" height="64" rx="32" fill="black" />
      <mask
        id="mask0_25_1016"
        // style="mask-type:luminance"
        maskUnits="userSpaceOnUse"
        x="22"
        y="22"
        width="21"
        height="20"
      >
        <path
          fill-rule="evenodd"
          clip-rule="evenodd"
          d="M23.5 27.5H41.5L40.5 41H24.5L23.5 27.5Z"
          fill="white"
          stroke="white"
          stroke-width="2"
          stroke-linejoin="round"
        />
        <path
          d="M28.5 29.5V23H36.5V29.5"
          stroke="white"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        />
        <path
          d="M28.5 37H36.5"
          stroke="black"
          stroke-width="2"
          stroke-linecap="round"
        />
      </mask>
      <g mask="url(#mask0_25_1016)">
        <path d="M20.5 20H44.5V44H20.5V20Z" fill="#F5F5F5" />
      </g>
    </svg>
  );
};

export default BoxIconWhite;
