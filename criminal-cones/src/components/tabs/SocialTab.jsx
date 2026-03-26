import { PLATFORMS, CONTENT_CALENDAR, HASHTAG_BANKS, VIRAL_FORMULAS } from "../../data/social";

const VIRAL_BADGE = { "VERY HIGH": "#E01010", HIGH: "#FF6D00", MEDIUM: "#F9A825" };

export default function SocialTab() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          CONTENT STRATEGY
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          PLATFORM PLAYBOOK · WEEKLY CALENDAR · VIRAL FORMULAS
        </p>
      </div>

      {/* platform cards */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "3px", color: "#E01010", marginBottom: "14px" }}>
          PLATFORM PRIORITIES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "12px" }}>
          {PLATFORMS.map((p, i) => (
            <div key={i} className="social-card" style={{
              background: `${p.accent}08`,
              border: `1px solid ${p.accent}25`,
              borderRadius: "10px", padding: "18px",
              animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "12px" }}>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
                    <span style={{ fontSize: "18px" }}>{p.icon}</span>
                    <span style={{ fontFamily: "'Bebas Neue'", fontSize: "20px", letterSpacing: "2px", color: "white" }}>
                      {p.name}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>
                    {p.handle}
                  </div>
                </div>
                <div style={{
                  background: `${p.accent}20`, borderRadius: "4px",
                  padding: "4px 10px", fontFamily: "'Space Mono'",
                  fontSize: "8px", color: p.accent, letterSpacing: "1px",
                }}>
                  PRIORITY #{p.priority}
                </div>
              </div>

              <div style={{ marginBottom: "10px" }}>
                <div style={{ fontFamily: "'Teko'", fontSize: "14px", color: p.accent, fontWeight: 600, marginBottom: "4px" }}>
                  {p.goal}
                </div>
                <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#777", fontWeight: 300 }}>
                  {p.postFreq}
                </div>
              </div>

              {/* content mix */}
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#444", letterSpacing: "1px", marginBottom: "6px" }}>
                  CONTENT MIX
                </div>
                {p.contentMix.map((c, ci) => (
                  <div key={ci} style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
                    <span style={{ color: p.accent, fontSize: "10px", flexShrink: 0 }}>▸</span>
                    <span style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{c}</span>
                  </div>
                ))}
              </div>

              {/* best times */}
              <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "10px" }}>
                {p.bestTimes.map((t, ti) => (
                  <span key={ti} style={{
                    background: `${p.accent}15`, border: `1px solid ${p.accent}30`,
                    borderRadius: "100px", padding: "2px 10px",
                    fontFamily: "'Space Mono'", fontSize: "8px", color: p.accent,
                  }}>
                    {t}
                  </span>
                ))}
              </div>

              <div style={{
                borderTop: `1px solid ${p.accent}15`, paddingTop: "10px",
                fontFamily: "'Space Mono'", fontSize: "8px", color: "#666",
              }}>
                KPI: <span style={{ color: p.accent }}>{p.kpi}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* content calendar */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "3px", color: "#E01010", marginBottom: "14px" }}>
          WEEKLY CONTENT CALENDAR
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {CONTENT_CALENDAR.map((day, i) => (
            <div key={i} style={{
              display: "grid", gridTemplateColumns: "100px 1fr",
              gap: "0",
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: "6px", overflow: "hidden",
              animation: `slideIn 0.3s ease ${i * 0.05}s both`,
            }}>
              {/* day label */}
              <div style={{
                background: `${VIRAL_BADGE[day.viralPotential]}18`,
                borderRight: `2px solid ${VIRAL_BADGE[day.viralPotential]}40`,
                padding: "12px 10px",
                display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center",
              }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: "14px", letterSpacing: "1px", color: "white", textAlign: "center" }}>
                  {day.day.toUpperCase()}
                </div>
                <div style={{
                  marginTop: "4px",
                  fontFamily: "'Space Mono'", fontSize: "7px",
                  color: VIRAL_BADGE[day.viralPotential], letterSpacing: "1px",
                  background: `${VIRAL_BADGE[day.viralPotential]}20`,
                  borderRadius: "3px", padding: "2px 6px", textAlign: "center",
                }}>
                  {day.viralPotential}
                </div>
              </div>
              {/* content */}
              <div style={{ padding: "12px 14px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "4px" }}>
                  <div style={{ fontFamily: "'Teko'", fontSize: "15px", color: "white", fontWeight: 600, letterSpacing: "0.5px" }}>
                    {day.theme}
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#555", letterSpacing: "1px" }}>
                    {day.platform}
                  </div>
                </div>
                <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300, lineHeight: 1.5 }}>
                  {day.example}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* viral formulas */}
      <div style={{ marginBottom: "32px" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "3px", color: "#E01010", marginBottom: "14px" }}>
          VIRAL CONTENT FORMULAS
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "12px" }}>
          {VIRAL_FORMULAS.map((f, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderTop: "2px solid #E01010",
              borderRadius: "0 0 8px 8px", padding: "16px",
              animation: `fadeUp 0.4s ease ${i * 0.08}s both`,
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "1px", color: "white", marginBottom: "6px" }}>
                {f.name}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: "9px", color: "#E01010", marginBottom: "8px", letterSpacing: "1px" }}>
                HOOK: "{f.hook}"
              </div>
              <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300, marginBottom: "8px" }}>
                {f.format}
              </div>
              <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#666", fontWeight: 300, marginBottom: "8px" }}>
                WHY: {f.why}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555" }}>
                BEST FOR: {f.bestFor}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* hashtag banks */}
      <div>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "3px", color: "#E01010", marginBottom: "14px" }}>
          HASHTAG BANK
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
          {Object.entries(HASHTAG_BANKS).map(([category, tags]) => (
            <div key={category} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.07)",
              borderRadius: "8px", padding: "14px",
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color: "#E01010", marginBottom: "8px" }}>
                {category.toUpperCase()}
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
                {tags.map((tag, ti) => (
                  <span key={ti} style={{
                    background: "rgba(224,16,16,0.1)", border: "1px solid rgba(224,16,16,0.2)",
                    borderRadius: "100px", padding: "2px 8px",
                    fontFamily: "'Space Mono'", fontSize: "8px", color: "#E01010",
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
