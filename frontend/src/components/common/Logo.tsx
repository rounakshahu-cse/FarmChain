type LogoProps = {
  className?: string;
  ariaLabel?: string;
};

export function Logo({ className = 'w-10 h-10', ariaLabel = 'Smart Krishi Connect' }: LogoProps) {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      className={className}
      role="img"
      aria-label={ariaLabel}
    >
      <circle cx="24" cy="24" r="22" fill="#557373" />
      <circle cx="24" cy="24" r="18.5" stroke="#f2efea" strokeWidth="1" opacity="0.35" />
      <path d="M24 34V14" stroke="#f2efea" strokeWidth="2" strokeLinecap="round" />
      <path d="M24 13.8V7.5" stroke="#f2efea" strokeWidth="1.4" strokeLinecap="round" />
      <path d="M21.2 12.4Q19 9.5 17.8 7" stroke="#f2efea" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <path d="M26.8 12.4Q29 9.5 30.2 7" stroke="#f2efea" strokeWidth="1.4" strokeLinecap="round" fill="none" />
      <g fill="#f2efea">
        <ellipse cx="20.9" cy="16" rx="2.4" ry="4.3" transform="rotate(-18 20.9 16)" />
        <ellipse cx="27.1" cy="16" rx="2.4" ry="4.3" transform="rotate(18 27.1 16)" />
        <ellipse cx="20.3" cy="21.2" rx="2.4" ry="4.3" transform="rotate(-22 20.3 21.2)" />
        <ellipse cx="27.7" cy="21.2" rx="2.4" ry="4.3" transform="rotate(22 27.7 21.2)" />
        <ellipse cx="20.9" cy="26.4" rx="2.2" ry="4" transform="rotate(-26 20.9 26.4)" />
        <ellipse cx="27.1" cy="26.4" rx="2.2" ry="4" transform="rotate(26 27.1 26.4)" />
        <ellipse cx="21.8" cy="31.2" rx="1.9" ry="3.5" transform="rotate(-30 21.8 31.2)" />
        <ellipse cx="26.2" cy="31.2" rx="1.9" ry="3.5" transform="rotate(30 26.2 31.2)" />
      </g>
      <path d="M23 34Q18.4 35.6 15.8 39" stroke="#f2efea" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M25 34Q29.6 35.6 32.2 39" stroke="#f2efea" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  );
}