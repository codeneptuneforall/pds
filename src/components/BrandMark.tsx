import React from 'react';

/** Small Vel-inspired brand mark. */
export function BrandMark({ className = 'h-7 w-7' }: {className?: string;}) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden="true">
      <circle cx="16" cy="16" r="15" fill="#541D24" />
      <path d="M16 4.5c3.2 3.4 4.6 6.6 4.6 9.4 0 2.6-1.8 4.4-4.6 5.4-2.8-1-4.6-2.8-4.6-5.4 0-2.8 1.4-6 4.6-9.4Z" fill="#D5AD57" />
      <path d="M16 7.5v10.5" stroke="#541D24" strokeWidth="0.9" strokeLinecap="round" />
      <rect x="15.1" y="19.2" width="1.8" height="8.3" rx="0.9" fill="#D5AD57" />
      <circle cx="16" cy="19.6" r="1.6" fill="#D5AD57" />
    </svg>);

}