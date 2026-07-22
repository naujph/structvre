"use client";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 160 44"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="Strucvre"
    >
      <defs>
        <linearGradient id="chrome-gradient" x1="0" y1="0" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a5f3fc" />
          <stop offset="30%" stopColor="#22d3ee" />
          <stop offset="60%" stopColor="#818cf8" />
          <stop offset="100%" stopColor="#c4b5fd" />
        </linearGradient>
        <filter id="logo-glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>
      <text
        x="48"
        y="32"
        fill="url(#chrome-gradient)"
        fontFamily="Inter, system-ui, sans-serif"
        fontSize="26"
        fontWeight="700"
        letterSpacing="-0.5"
        filter="url(#logo-glow)"
      >
        Strucvre
      </text>
      <path
        className="logo-s"
        d="M32.8 6.4c2.7 0 5.1 1.1 6.9 2.8l-3.4 4.2c-1-.9-2.3-1.4-3.7-1.4-1.5 0-2.8.6-3.8 1.6-.9 1-1.5 2.3-1.5 3.8 0 2.3 1.4 4.1 3.6 4.8l5.2 1.7c4.2 1.4 6.9 5 6.9 9.4 0 5.6-4.6 10.1-10.3 10.1-3.6 0-6.8-1.6-8.9-4.2l3.8-3.8c1.2 1.6 3.1 2.6 5.2 2.6 2.8 0 5.1-2.2 5.1-5.1 0-2.4-1.5-4.3-3.9-5.1l-5.1-1.7C21.1 23.6 19 19.7 19 15.4 19 9.4 24.4 5 30.4 5c.8 0 1.6.1 2.4.2v1.2z"
        fill="url(#chrome-gradient)"
        filter="url(#logo-glow)"
      />
    </svg>
  );
}
