const POINTS: [number, number, number, number, number][] = [
  [8, 18, 10, 3.2, 0], [22, 62, 7, 2.6, 0.8], [36, 12, 12, 3.8, 1.4], [58, 28, 8, 2.9, 0.3],
  [71, 70, 11, 3.5, 1.9], [84, 16, 9, 3, 1.1], [92, 48, 7, 2.4, 0.6], [14, 84, 8, 3.1, 2.2],
  [48, 86, 10, 3.6, 0.9], [66, 8, 7, 2.7, 2.5],
]

/** Kilau emas yang berkedip. Posisi tetap supaya tidak memicu hydration mismatch. */
export function Sparkles({ count = POINTS.length, className = '' }: { count?: number; className?: string }) {
  return (
    <div aria-hidden="true" className={`pointer-events-none absolute inset-0 overflow-hidden ${className}`}>
      {POINTS.slice(0, count).map(([x, y, s, d, delay], i) => (
        <span
          key={i}
          className="gp-sparkle"
          style={{ left: `${x}%`, top: `${y}%`, '--s': `${s}px`, '--d': `${d}s`, '--delay': `${delay}s` } as React.CSSProperties}
        />
      ))}
    </div>
  )
}
