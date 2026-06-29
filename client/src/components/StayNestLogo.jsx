import React from 'react';

export default function StayNestLogo({ size = 32, className = '' }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={`inline-block select-none ${className}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        {/* Brand linear gradient */}
        <linearGradient id="nestGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4a383" /> {/* Warm sand brand accent */}
          <stop offset="100%" stopColor="#906956" /> {/* Coffee brand medium */}
        </linearGradient>
        {/* Soft drop shadow for 3D depth */}
        <filter id="logoShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="6" stdDeviation="4" floodColor="#1b100c" floodOpacity="0.12" />
        </filter>
      </defs>
      
      {/* 1. Stylized Nest (Curved strokes layered) */}
      <g filter="url(#logoShadow)">
        {/* Nest Base Branch */}
        <path
          d="M15,55 C15,75 30,85 50,85 C70,85 85,75 85,55 C85,68 70,78 50,78 C30,78 15,68 15,55 Z"
          fill="url(#nestGrad)"
        />
        {/* Nest Layer 2 (Cross Branch strokes) */}
        <path
          d="M20,62 C30,76 70,76 80,62"
          stroke="url(#nestGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          fill="none"
        />
        <path
          d="M10,50 C25,72 75,72 90,50"
          stroke="url(#nestGrad)"
          strokeWidth="4"
          strokeLinecap="round"
          fill="none"
        />
        
        {/* 2. Cozy Home inside the Nest */}
        {/* Roof */}
        <path
          d="M50,22 L26,45 L34,45 L34,68 L66,68 L66,45 L74,45 Z"
          fill="#1b100c" /* Brand dark */
        />
        {/* House Body (Glowing warm sand) */}
        <path
          d="M38,47 L50,36 L62,47 L62,65 L38,65 Z"
          fill="#d4a383"
        />
        {/* Cozy Door */}
        <path
          d="M46,55 L54,55 L54,65 L46,65 Z"
          fill="#1b100c"
        />
        {/* Glowing Chimney */}
        <rect x="58" y="28" width="6" height="12" fill="#906956" />
      </g>
    </svg>
  );
}
