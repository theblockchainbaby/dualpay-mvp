export default function BandanaMascot({
  color1 = "#E01010",
  iceColor = "#3498DB",
  size = 140,
  eyeStyle = "shifty",
  animated = true,
}) {
  const cx = size / 2;
  const cy = size * 0.52;
  const s = size / 160;
  const anim = animated ? { animation: "bob 2.5s ease-in-out infinite" } : {};
  const coneId = `bd-cone-${size}-${color1.replace("#", "")}`;
  const iceId = `bd-ice-${size}-${iceColor.replace("#", "")}`;
  const shineId = `bd-shine-${size}`;
  const clipId = `bd-iceclip-${size}-${iceColor.replace("#", "")}`;

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
        <radialGradient id={shineId} cx="35%" cy="30%" r="50%">
          <stop offset="0%" stopColor="white" stopOpacity="0.4" />
          <stop offset="100%" stopColor="white" stopOpacity="0" />
        </radialGradient>
        <clipPath id={clipId}>
          <ellipse cx={cx} cy={cy - 20 * s} rx={32 * s} ry={28 * s} />
        </clipPath>
      </defs>

      {/* shadow */}
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
        <line
          key={i}
          x1={cx + i * 14 * s} y1={cy + 5 * s}
          x2={cx + i * 7 * s} y2={cy + 70 * s}
          stroke="#7A4F10" strokeWidth={0.7 * s} opacity="0.45"
        />
      ))}
      {[18, 32, 46, 58].map((d) => (
        <line
          key={d}
          x1={cx - (32 - d * 0.56) * s} y1={cy + d * s}
          x2={cx + (32 - d * 0.56) * s} y2={cy + d * s}
          stroke="#7A4F10" strokeWidth={0.6 * s} opacity="0.38"
        />
      ))}

      {/* ICE SCOOP */}
      <ellipse cx={cx} cy={cy - 20 * s} rx={32 * s} ry={28 * s} fill={`url(#${iceId})`} style={anim} />
      <ellipse cx={cx} cy={cy - 20 * s} rx={32 * s} ry={28 * s} fill={`url(#${shineId})`} />

      {/* EYES */}
      <g style={anim}>
        {eyeStyle === "squint" ? (
          <>
            <line x1={cx - 14 * s} y1={cy - 28 * s} x2={cx - 6 * s} y2={cy - 28 * s} stroke="#1A1A1A" strokeWidth={3 * s} strokeLinecap="round" />
            <line x1={cx + 6 * s} y1={cy - 28 * s} x2={cx + 14 * s} y2={cy - 28 * s} stroke="#1A1A1A" strokeWidth={3 * s} strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx={cx - 10 * s} cy={cy - 28 * s} r={6 * s} fill="white" />
            <circle cx={cx + 10 * s} cy={cy - 28 * s} r={6 * s} fill="white" />
            <circle cx={cx - (eyeStyle === "shifty" ? 8 : 10) * s} cy={cy - 28 * s} r={3.2 * s} fill="#111" />
            <circle cx={cx + (eyeStyle === "shifty" ? 12 : 10) * s} cy={cy - 28 * s} r={3.2 * s} fill="#111" />
            <circle cx={cx - 11.5 * s} cy={cy - 30 * s} r={1.5 * s} fill="white" opacity="0.85" />
            <circle cx={cx + 8.5 * s} cy={cy - 30 * s} r={1.5 * s} fill="white" opacity="0.85" />
          </>
        )}
      </g>

      {/* BANDANA */}
      <g style={anim}>
        <rect
          x={cx - 33 * s} y={cy - 24 * s}
          width={66 * s} height={30 * s}
          rx={4 * s} fill={color1}
          clipPath={`url(#${clipId})`}
        />
        {[[-15, 6], [0, 4], [15, 6], [-8, 14], [8, 14]].map(([dx, dy], i) => (
          <circle key={i} cx={cx + dx * s} cy={cy - 24 * s + dy * s} r={2 * s}
            fill="white" opacity="0.22" clipPath={`url(#${clipId})`} />
        ))}
        {[[-10, 10], [10, 10], [0, 18]].map(([dx, dy], i) => (
          <path key={i}
            d={`M${cx + dx * s},${cy - 24 * s + dy * s - 4 * s} L${cx + dx * s + 4 * s},${cy - 24 * s + dy * s} L${cx + dx * s},${cy - 24 * s + dy * s + 4 * s} L${cx + dx * s - 4 * s},${cy - 24 * s + dy * s} Z`}
            fill="white" opacity="0.15" clipPath={`url(#${clipId})`}
          />
        ))}
        <ellipse cx={cx + 32 * s} cy={cy - 10 * s} rx={7 * s} ry={5 * s} fill={color1} opacity="0.9" />
        <path d={`M${cx - 30 * s},${cy - 15 * s} Q${cx - 42 * s},${cy},${cx - 36 * s},${cy + 10 * s}`}
          fill={color1} opacity="0.75" />
        <path d={`M${cx - 30 * s},${cy - 22 * s} Q${cx},${cy - 30 * s} ${cx + 30 * s},${cy - 22 * s}`}
          fill="none" stroke={color1} strokeWidth={2.5 * s} opacity="0.5" clipPath={`url(#${clipId})`} />
      </g>

      {/* nose */}
      <ellipse cx={cx} cy={cy - 12 * s} rx={3.5 * s} ry={2.5 * s} fill="rgba(0,0,0,0.18)" style={anim} />
    </svg>
  );
}
