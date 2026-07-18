/**
 * Atlas Agricole — custom monoline icon set.
 * Thin 1.5 stroke, currentColor, tuned to match the brand's leaf motif.
 * Stored in-repo (not on any CDN).
 */
import * as React from 'react';

type Props = React.SVGProps<SVGSVGElement> & { size?: number };

const base = (p: Props) => ({
  xmlns: 'http://www.w3.org/2000/svg',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.5,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  width: p.size ?? 24,
  height: p.size ?? 24,
  ...p,
});

export const IconLeaf = (p: Props) => (
  <svg {...base(p)}>
    <path d="M20 4c0 8-5.5 14-13 14-1.7 0-3-.3-4-1 0-8 5.5-14 13-14 1.7 0 3 .3 4 1z" />
    <path d="M4 21c2.5-6 7-10 13-13" />
  </svg>
);

export const IconSprout = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 21v-8" />
    <path d="M12 13c0-4 3-7 8-7 0 4-3 7-8 7z" />
    <path d="M12 15c0-3-2.5-6-7-6 0 3 2.5 6 7 6z" />
    <path d="M8 21h8" />
  </svg>
);

export const IconUsers = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="9" cy="8" r="3.2" />
    <path d="M3 20c0-3.3 2.7-6 6-6s6 2.7 6 6" />
    <circle cx="17" cy="9" r="2.6" />
    <path d="M15 14.2c3.4.3 6 2.8 6 5.8" />
  </svg>
);

export const IconGlobeLeaf = (p: Props) => (
  <svg {...base(p)}>
    <circle cx="12" cy="12" r="9" />
    <path d="M3.5 12h17" />
    <path d="M12 3c2.6 3 2.6 15 0 18" />
    <path d="M12 3c-2.6 3-2.6 15 0 18" />
  </svg>
);

export const IconBadgeCheck = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3l2 1.6 2.5-.3.9 2.4 2.2 1.2-.4 2.5L21 12l-1.8 1.6.4 2.5-2.2 1.2-.9 2.4-2.5-.3L12 21l-2-1.6-2.5.3-.9-2.4-2.2-1.2.4-2.5L3 12l1.8-1.6-.4-2.5 2.2-1.2.9-2.4L10 4.6 12 3z" />
    <path d="M8.8 12.2l2.2 2.2 4.2-4.4" />
  </svg>
);

export const IconShieldLeaf = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3l8 3v5.5c0 4.5-3.3 8.2-8 9.5-4.7-1.3-8-5-8-9.5V6l8-3z" />
    <path d="M9 13c0-3 1.5-5 5-5.5 0 3-1.5 5-5 5.5z" />
    <path d="M8.5 15c1.3-1.8 3-3 5-3.5" />
  </svg>
);

export const IconFlask = (p: Props) => (
  <svg {...base(p)}>
    <path d="M9 3h6" />
    <path d="M10 3v5.5L4.5 18a2 2 0 0 0 1.7 3h11.6a2 2 0 0 0 1.7-3L14 8.5V3" />
    <path d="M7 15h10" />
  </svg>
);

export const IconTractor = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 17h3" />
    <path d="M14 17h2" />
    <circle cx="8" cy="17" r="2.5" />
    <circle cx="18" cy="17" r="3" />
    <path d="M6 14V9h5l2 4h3" />
    <path d="M13 9V6h3v3" />
  </svg>
);

export const IconHandshake = (p: Props) => (
  <svg {...base(p)}>
    <path d="M3 12l4-4 3 2 4-3 4 3 3-1v6l-3 3-4-3-3 2-4-2-4 2z" />
    <path d="M11 10l2 2" />
  </svg>
);

export const IconDrop = (p: Props) => (
  <svg {...base(p)}>
    <path d="M12 3s6 6.5 6 11a6 6 0 1 1-12 0c0-4.5 6-11 6-11z" />
    <path d="M9 14c0 1.7 1.3 3 3 3" />
  </svg>
);

export const IconSend = (p: Props) => (
  <svg {...base(p)}>
    <path d="M21 3L3 10l7 3 3 7 8-17z" />
    <path d="M10 13l5-5" />
  </svg>
);

export const IconMessage = (p: Props) => (
  <svg {...base(p)}>
    <path d="M4 5h16v11H8l-4 4V5z" />
    <path d="M8 10h8M8 13h5" />
  </svg>
);
