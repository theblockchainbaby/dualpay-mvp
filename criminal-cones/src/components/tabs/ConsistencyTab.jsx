import { CONSISTENCY_TIPS } from "../../data/machines";

const CHECKLIST = [
  "Pull ice blocks from freezer 25 min before service",
  "Check blade — inspect edge, no nicks or dullness",
  "Verify all 12 syrups bottled, labeled, at room temp",
  "Brix test one syrup per batch from new bottles",
  "POS loaded, card reader tested, float counted",
  "Social post drafted and queued for opening time",
  "Sus AF mystery squeeze bottle prepped + labeled ????",
  "Addons stocked: chamoy, Tajín, condensed milk, Pop Rocks",
  "Cups, cones, spoons counted for projected volume",
  "Ice packer/dowel cleaned and ready at station",
  "Gloves, napkins, sanitizer at service station",
  "Log opened — batch numbers, blade status, weather note",
];

export default function ConsistencyTab() {
  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          MASTERING CONSISTENCY
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          THE 8 LAWS OF CRIMINAL QUALITY CONTROL
        </p>
      </div>

      {/* tips */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px", marginBottom: "32px" }}>
        {CONSISTENCY_TIPS.map((tip, i) => (
          <div key={i} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderLeft: "3px solid #E01010",
            borderRadius: "0 8px 8px 0", padding: "18px",
            animation: `fadeUp 0.4s ease ${i * 0.06}s both`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
              <div style={{
                width: "26px", height: "26px", borderRadius: "50%", flexShrink: 0,
                background: "#E01010",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontFamily: "'Space Mono'", fontSize: "10px", fontWeight: 700, color: "white",
              }}>
                {String(i + 1).padStart(2, "0")}
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "1px", color: "white" }}>
                {tip.title}
              </div>
            </div>
            <p style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#888", fontWeight: 300, lineHeight: 1.7 }}>
              {tip.body}
            </p>
          </div>
        ))}
      </div>

      {/* daily checklist */}
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px", padding: "22px 24px", marginBottom: "20px",
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "3px", color: "#E01010", marginBottom: "16px" }}>
          PRE-SERVICE CHECKLIST — DAILY
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "6px" }}>
          {CHECKLIST.map((item, i) => (
            <div key={i} style={{
              display: "flex", gap: "10px", padding: "8px 0",
              borderBottom: "1px solid rgba(255,255,255,0.04)",
            }}>
              <div style={{
                width: "16px", height: "16px", borderRadius: "3px", flexShrink: 0,
                border: "1.5px solid rgba(224,16,16,0.5)", marginTop: "1px",
              }} />
              <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#888", fontWeight: 300 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Brix reference */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "10px" }}>
        {[
          {
            label: "✓ OPTIMAL BRIX", val: "45–55°", color: "#4CAF50",
            note: "Syrup soaks into ice evenly, no runoff, full flavor saturation",
            bg: "rgba(76,175,80,0.06)", border: "rgba(76,175,80,0.2)",
          },
          {
            label: "⚠ TOO LOW", val: "Below 40°", color: "#FF9800",
            note: "Watery, runs through ice, weak flavor, customer disappointment",
            bg: "rgba(255,152,0,0.06)", border: "rgba(255,152,0,0.2)",
          },
          {
            label: "✗ TOO HIGH", val: "Above 60°", color: "#E01010",
            note: "Crystallizes in bottle, gummy texture on ice, over-sweet complaint",
            bg: "rgba(224,16,16,0.06)", border: "rgba(224,16,16,0.2)",
          },
        ].map(({ label, val, color, note, bg, border }) => (
          <div key={label} style={{ background: bg, border: `1px solid ${border}`, borderRadius: "8px", padding: "16px" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color, marginBottom: "8px" }}>
              {label}
            </div>
            <div style={{ fontFamily: "'Teko'", fontSize: "28px", color: "white", fontWeight: 700 }}>{val}</div>
            <p style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#666", fontWeight: 300, marginTop: "4px" }}>{note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
