import BandanaMascot from "../mascots/BandanaMascot";
import MaskMascot from "../mascots/MaskMascot";

const BANDANA_COLORWAYS = [
  { color1: "#E01010", iceColor: "#1A1A3E", label: "The Snitch", sub: "Red Bandana", eye: "shifty" },
  { color1: "#E06000", iceColor: "#1E5080", label: "The Setup", sub: "Burnt Orange", eye: "squint" },
  { color1: "#0077B6", iceColor: "#FF6B35", label: "The Getaway", sub: "Ocean Blue", eye: "normal" },
  { color1: "#558B2F", iceColor: "#D4A843", label: "The HOA", sub: "Sage Green", eye: "shifty" },
];

const MASK_COLORWAYS = [
  { maskColor: "#111111", iceColor: "#E01010", label: "The Heist", sub: "Void Black" },
  { maskColor: "#1A237E", iceColor: "#00D4FF", label: "The Getaway", sub: "Navy + Cyan" },
  { maskColor: "#1B5E20", iceColor: "#FFD740", label: "The Job", sub: "Midnight Green" },
  { maskColor: "#4A148C", iceColor: "#E040FB", label: "Incognito", sub: "Deep Purple" },
];

const USAGE_GUIDE = [
  { where: "Cart Wrap", use: "Large Bandana + Mask side by side — the crew" },
  { where: "Cup Branding", use: "Single mascot per cup size — rotate colorways" },
  { where: "Merch Tees", use: "Mask cone chest print — minimal, iconic" },
  { where: "Social Content", use: "Bandana = fun flavor drops / Mask = 'Sus AF' reveals" },
  { where: "Stickers", use: "Individual mascots — give with every order" },
  { where: "Menu Board", use: "Small mascot icon next to each flavor's crime name" },
];

function SectionDivider({ label }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "20px" }}>
      <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
      <span style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "4px", color: "#E01010" }}>
        {label}
      </span>
      <div style={{ height: "1px", flex: 1, background: "rgba(255,255,255,0.08)" }} />
    </div>
  );
}

export default function MascotsTab() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          THE CRIMINAL CREW
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "10px", letterSpacing: "2px" }}>
          BANDANA & MASK MASCOTS — FOUR COLORWAYS EACH
        </p>
      </div>

      {/* BANDANA */}
      <div style={{ marginBottom: "48px" }}>
        <SectionDivider label="BANDANA CONES" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {BANDANA_COLORWAYS.map((m, i) => (
            <div key={i} className="mascot-card" style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${m.color1}44`,
              borderRadius: "12px", padding: "20px 16px",
              textAlign: "center", minWidth: "160px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <BandanaMascot color1={m.color1} iceColor={m.iceColor} size={130} eyeStyle={m.eye} animated />
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "2px", color: m.color1, marginTop: "10px" }}>
                {m.label}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>
                {m.sub}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "10px" }}>
                {[m.color1, m.iceColor, "#D4A843"].map((c, ci) => (
                  <div key={ci} style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: c, border: "1px solid rgba(255,255,255,0.2)",
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* MASK */}
      <div style={{ marginBottom: "40px" }}>
        <SectionDivider label="MASK CONES" />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "16px", justifyContent: "center" }}>
          {MASK_COLORWAYS.map((m, i) => (
            <div key={i} className="mascot-card" style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid ${m.iceColor}33`,
              borderRadius: "12px", padding: "20px 16px",
              textAlign: "center", minWidth: "160px",
              boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
              animation: `fadeUp 0.5s ease ${i * 0.1}s both`,
            }}>
              <MaskMascot maskColor={m.maskColor} iceColor={m.iceColor} size={130} animated />
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "2px", color: m.iceColor, marginTop: "10px" }}>
                {m.label}
              </div>
              <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>
                {m.sub}
              </div>
              <div style={{ display: "flex", justifyContent: "center", gap: "6px", marginTop: "10px" }}>
                {[m.maskColor, m.iceColor, "#D4A843"].map((c, ci) => (
                  <div key={ci} style={{
                    width: "12px", height: "12px", borderRadius: "50%",
                    background: c, border: "1px solid rgba(255,255,255,0.2)",
                  }} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* USAGE GUIDE */}
      <div style={{
        background: "rgba(224,16,16,0.06)",
        border: "1px solid rgba(224,16,16,0.2)",
        borderRadius: "8px", padding: "20px 24px",
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "14px", letterSpacing: "3px", color: "#E01010", marginBottom: "12px" }}>
          MASCOT DEPLOYMENT GUIDE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "12px" }}>
          {USAGE_GUIDE.map(({ where, use }) => (
            <div key={where} style={{ background: "rgba(255,255,255,0.03)", borderRadius: "6px", padding: "12px" }}>
              <div style={{
                fontFamily: "'Teko'", fontSize: "13px", color: "#E01010",
                fontWeight: 600, letterSpacing: "1px", marginBottom: "4px",
              }}>
                {where}
              </div>
              <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{use}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
