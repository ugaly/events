'use client'

/**
 * Human-style cartoon courier with subtle 3D feel.
 * Pure SVG + CSS so it always renders (no external asset dependency).
 */
export function OrderComingAnimation({ className }: { className?: string }) {
  return (
    <div className={`order-coming-wrap mx-auto w-full max-w-[320px] ${className ?? ''}`}>
      <div className="order-coming-shadow" />
      <svg
        viewBox="0 0 320 260"
        className="order-coming-character"
        role="img"
        aria-label="Cartoon server carrying drinks"
      >
        <defs>
          <linearGradient id="skin" x1="0" x2="1">
            <stop offset="0%" stopColor="#ffd2b3" />
            <stop offset="100%" stopColor="#f5b18a" />
          </linearGradient>
          <linearGradient id="shirt" x1="0" x2="1">
            <stop offset="0%" stopColor="#1ed760" />
            <stop offset="100%" stopColor="#17b851" />
          </linearGradient>
          <linearGradient id="tray" x1="0" x2="1">
            <stop offset="0%" stopColor="#9aa0a6" />
            <stop offset="100%" stopColor="#717680" />
          </linearGradient>
        </defs>

        {/* soft backdrop */}
        <ellipse cx="160" cy="222" rx="98" ry="26" fill="rgba(30,215,96,0.12)" />

        {/* legs */}
        <rect x="128" y="176" width="24" height="54" rx="10" fill="#242a33" />
        <rect x="168" y="176" width="24" height="54" rx="10" fill="#242a33" />
        <ellipse cx="139" cy="234" rx="20" ry="8" fill="#11151d" />
        <ellipse cx="180" cy="234" rx="20" ry="8" fill="#11151d" />

        {/* torso */}
        <rect x="112" y="92" width="96" height="92" rx="28" fill="url(#shirt)" />
        <circle cx="160" cy="134" r="12" fill="rgba(0,0,0,0.15)" />
        <circle cx="160" cy="134" r="6" fill="rgba(255,255,255,0.35)" />

        {/* neck + head */}
        <rect x="147" y="78" width="26" height="20" rx="10" fill="url(#skin)" />
        <circle cx="160" cy="56" r="28" fill="url(#skin)" />
        <path d="M132 52c5-20 49-24 58 0v8h-58z" fill="#1d232f" />
        <circle cx="150" cy="58" r="3.2" fill="#1d232f" />
        <circle cx="170" cy="58" r="3.2" fill="#1d232f" />
        <path d="M150 69c6 5 14 5 20 0" stroke="#1d232f" strokeWidth="3" strokeLinecap="round" fill="none" />

        {/* left arm */}
        <rect x="92" y="108" width="28" height="68" rx="14" fill="url(#skin)" transform="rotate(12 92 108)" />
        {/* right arm holding tray */}
        <rect x="195" y="103" width="30" height="75" rx="14" fill="url(#skin)" transform="rotate(-28 195 103)" />

        {/* tray + drinks */}
        <ellipse cx="238" cy="94" rx="58" ry="14" fill="url(#tray)" />
        <ellipse cx="238" cy="90" rx="58" ry="12" fill="#c4c8cf" />

        <rect x="214" y="56" width="16" height="30" rx="4" fill="#f6b01a" />
        <rect x="233" y="52" width="16" height="34" rx="4" fill="#34c759" />
        <rect x="252" y="58" width="16" height="28" rx="4" fill="#4aa3ff" />
        <rect x="214" y="50" width="16" height="6" rx="3" fill="#f9d27d" />
        <rect x="233" y="46" width="16" height="6" rx="3" fill="#91e7ae" />
        <rect x="252" y="52" width="16" height="6" rx="3" fill="#95c8ff" />

        {/* sparkles */}
        <g className="order-coming-stars" fill="#1ed760">
          <path d="M78 88l4 8 8 4-8 4-4 8-4-8-8-4 8-4z" />
          <path d="M263 28l3 6 6 3-6 3-3 6-3-6-6-3 6-3z" />
          <path d="M284 120l2.5 5 5 2.5-5 2.5-2.5 5-2.5-5-5-2.5 5-2.5z" />
        </g>
      </svg>
    </div>
  )
}
