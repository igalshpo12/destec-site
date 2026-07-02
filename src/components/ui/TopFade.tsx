/**
 * Seamless section handoff: the previous section's color bleeds into the top
 * of this section and dissolves behind the content — no visible band or line.
 * Parent section must be `relative`; content should sit above (relative z-10).
 */
export default function TopFade({ from, height = 160 }: { from: string; height?: number }) {
  return (
    <div
      aria-hidden="true"
      className="absolute inset-x-0 top-0 pointer-events-none"
      style={{
        height,
        zIndex: 0,
        background: `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 38%, transparent) 26%, color-mix(in srgb, ${from} 10%, transparent) 55%, transparent 85%)`,
      }}
    />
  );
}
