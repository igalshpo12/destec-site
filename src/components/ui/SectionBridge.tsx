/**
 * Smooth color bridge between two adjacent homepage sections.
 * Eased multi-stop gradient so light↔dark handoffs don't cut sharply.
 */
export default function SectionBridge({
  from,
  to,
  height = 110,
}: {
  from: string;
  to: string;
  height?: number;
}) {
  return (
    <div
      aria-hidden="true"
      style={{
        height,
        background: `linear-gradient(180deg, ${from} 0%, color-mix(in srgb, ${from} 72%, ${to}) 38%, color-mix(in srgb, ${from} 28%, ${to}) 68%, ${to} 100%)`,
      }}
    />
  );
}
