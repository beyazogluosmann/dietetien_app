export function AppleMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M34 14c2-4 6-6 10-6-1 4-4 7-8 8-1 0-2-1-2-2Z" fill="#d7ebe0" />
      <path d="M32 16c2 0 3 2 3 2s2-1 3-1c6 0 12 6 12 14 0 10-6 22-15 22S18 42 18 31c0-8 6-15 14-15Z" fill="#e25b45" />
      <path d="M32 18c-1 6-1 14 0 24" stroke="#f6f1e6" strokeWidth="1.5" fill="none" opacity="0.7" />
    </svg>
  );
}

export function LemonMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M46 12c4 2 7 8 6 12-4-1-8 1-10 4 2-6 1-13 4-16Z" fill="#d7ebe0" />
      <ellipse cx="30" cy="36" rx="16" ry="14" fill="#f3c15b" transform="rotate(-20 30 36)" />
      <ellipse cx="30" cy="36" rx="7" ry="6" fill="#f6f1e6" transform="rotate(-20 30 36)" />
    </svg>
  );
}

export function CarrotMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M30 8c2 6 1 10-2 14 6-2 12-1 16 3-6 1-10 5-12 10 2-8-1-16-2-27Z" fill="#9dce9a" />
      <path d="M24 16c6 2 10 8 12 14-8-2-14 0-18 5 1-8 2-14 6-19Z" fill="#c6e2c4" />
      <path d="M34 28c6 8 8 18 4 28-2 2-6 0-7-2-4-8-2-18 0-26 1 0 2 0 3 0Z" fill="#e38b3a" />
    </svg>
  );
}

export function LeafMark({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" aria-hidden="true" className={className}>
      <path d="M14 40c8-18 24-26 40-26-2 18-12 32-28 36-6 2-12-2-12-10Z" fill="#9dce9a" />
      <path d="M20 40c8-8 16-14 28-18" stroke="#1f4d3a" strokeWidth="1.5" fill="none" opacity="0.45" />
    </svg>
  );
}
