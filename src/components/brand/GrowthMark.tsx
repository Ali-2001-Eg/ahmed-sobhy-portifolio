/**
 * Brand mark: ascending bars (growth), used for the favicon and Apple touch icon.
 * Rendered by satori inside `next/og`, so keep to flexbox + plain divs — no SVG,
 * no CSS satori doesn't implement.
 */
export function GrowthMark({ scale = 1 }: { scale?: number }) {
  const bars = [0.34, 0.58, 0.82, 1];
  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'flex-end',
        justifyContent: 'center',
        gap: 5 * scale,
        padding: `${14 * scale}px ${11 * scale}px`,
        // --primary → --secondary from globals.css
        backgroundImage: 'linear-gradient(135deg, #4D99E6 0%, #75F0F0 100%)',
      }}
    >
      {bars.map((h, i) => (
        <div
          key={i}
          style={{
            display: 'flex',
            width: 7 * scale,
            height: `${h * 100}%`,
            backgroundColor: '#0F1519',
            borderRadius: 3 * scale,
          }}
        />
      ))}
    </div>
  );
}
