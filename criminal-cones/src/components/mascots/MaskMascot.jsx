export default function MaskMascot({
  maskColor = "#111",
  iceColor = "#E01010",
  size = 140,
  animated = true,
}) {
  const cx = size / 2;
  const cy = size * 0.52;
  const s = size / 160;
  const anim = animated ? { animation: "bob 3s ease-in-out infinite" } : {};
  const coneId = `mk-cone-${size}`;
  const iceId = `mk-ice-${size}-${iceColor.replace("#", "")}`;
  const clipId = `mk-clip-${size}-${iceColor.replace("#", "")}`;

  return (
    <svg viewBox={`0 0 ${size} ${size}`} width={size} height={size}>
      <defs>
        <linearGradient id={coneId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#D4A843" />
          <stop offset="100%" stopColor="#8B6014" />
        </linearGradient>
        <linearGradient id={iceId} x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor={iceColor} />
          <stop offset="100%" stopColor={iceColor} stopOpacity="0.65" />
        </linearGradient>
        <clipPath id={clipId}>
          <ellipse cx={cx} cy={cy - 20 * s} rx={32 * s} ry={28 * s} />
        </clipPath>
      </defs>

      <ellipse cx={cx} cy={size * 0.93} rx={28 * s} ry={5 * s} fill="rgba(0,0,0,0.3)" />

      {/* CONE */}
      <polygon
        points={`${cx - 32 * s},${cy + 5 * s} ${cx + 32 * s},${cy + 5 * s} ${cx},${cy + 72 * s}`}
        fill={`url(#${coneId})`}
        stroke="#7A4F10"
        strokeWidth={1.2 * s}
        style={anim}
      />
      {[-2, -1, 0, 1, 2].map((i) => (
        <line key={i} x1={cx + i * 14 * s} y1={cy + 5 * s} x2={cx + i * 7 * s} y2={cy + 70 * s}
          stroke="#7A4F10" strokeWidth={0.7 * s} opacity="0.45" />
      ))}
      {[18, 32, 46, 58].map((d) => (
        <line key={d}
          x1={cx - (32 - d * 0.56) * s} y1={cy + d * s}
          x2={cx + (32 - d * 0.56) * s} y2={cy + d * s}
          stroke="#7A4F10" strokeWidth={0.6 * s} opacity="0.38"
        />
      ))}

      {/* ICE SCOOP */}
      <ellipse cx={cx} cy={cy - 20 * s} rx={32 * s} ry={28 * s} fill={`url(#${iceId})`} style={anim} />

      {/* SKI MASK */}
      <g style={anim}>
        <ellipse cx={cx} cy={cy - 20 * s} rx={31 * s} ry={27 * s}
          fill={maskColor} opacity="0.9" clipPath={`url(#${clipId})`} />
        {[-20, -12, -4, 4, 12, 20].map((dx, i) => (
          <line key={i}
            x1={cx + dx * s} y1={cy - 46 * s}
            x2={cx + dx * s} y2={cy + 6 * s}
            stroke="white" strokeWidth={0.5 * s} opacity="0.06"
            clipPath={`url(#${clipId})`}
          />
        ))}
        {/* eye holes */}
        <ellipse cx={cx - 10 * s} cy={cy - 28 * s} rx={7.5 * s} ry={5.5 * s} fill={iceColor} opacity="0.95" />
        <ellipse cx={cx + 10 * s} cy={cy - 28 * s} rx={7.5 * s} ry={5.5 * s} fill={iceColor} opacity="0.95" />
        {/* pupils */}
        <circle cx={cx - 11 * s} cy={cy - 28 * s} r={3.5 * s} fill="#111" />
        <circle cx={cx + 9 * s} cy={cy - 28 * s} r={3.5 * s} fill="#111" />
        <circle cx={cx - 12.5 * s} cy={cy - 30 * s} r={1.4 * s} fill="white" opacity="0.9" />
        <circle cx={cx + 7.5 * s} cy={cy - 30 * s} r={1.4 * s} fill="white" opacity="0.9" />
        {/* mouth hole */}
        <path d={`M${cx - 7 * s},${cy - 8 * s} Q${cx + 1 * s},${cy - 4 * s} ${cx + 7 * s},${cy - 8 * s}`}
          fill={iceColor} opacity="0.9" />
        {[-4, -1.5, 1].map((dx, i) => (
          <rect key={i} x={cx + dx * s} y={cy - 9 * s} width={3 * s} height={2.5 * s}
            rx={0.7 * s} fill="white" opacity="0.92" />
        ))}
        <path
          d={`M${cx - 28 * s},${cy - 32 * s} Q${cx},${cy - 50 * s} ${cx + 28 * s},${cy - 32 * s}`}
          fill="none" stroke={maskColor} strokeWidth={3.5 * s}
          clipPath={`url(#${clipId})`}
        />
      </g>
    </svg>
  );
}
