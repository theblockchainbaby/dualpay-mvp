import { useState } from "react";
import { MACHINES, CONSISTENCY_TIPS } from "../../data/machines";

export default function MachinesTab() {
  const [activeMachine, setActiveMachine] = useState(1);

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          THE HARDWARE
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          COMMERCIAL SHAVED ICE MACHINE BREAKDOWN
        </p>
      </div>

      {/* tier selector */}
      <div style={{ display: "flex", gap: "8px", justifyContent: "center", marginBottom: "28px", flexWrap: "wrap" }}>
        {MACHINES.map((m, i) => (
          <button key={i} className="tab-btn" onClick={() => setActiveMachine(i)}
            style={{
              background: activeMachine === i ? "#E01010" : "rgba(255,255,255,0.04)",
              border: activeMachine === i ? "none" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px", padding: "10px 20px",
              color: activeMachine === i ? "white" : "#666",
              fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "2px",
              cursor: "pointer",
              boxShadow: activeMachine === i ? "0 4px 20px rgba(224,16,16,0.4)" : "none",
            }}>
            {m.tier} Tier
          </button>
        ))}
      </div>

      {/* active machine card */}
      {MACHINES.map((m, i) => activeMachine === i && (
        <div key={i} style={{ animation: "fadeUp 0.4s ease" }}>
          <div style={{
            background: "linear-gradient(135deg, rgba(224,16,16,0.08), rgba(255,255,255,0.02))",
            border: "2px solid rgba(224,16,16,0.3)", borderRadius: "12px",
            padding: "28px", marginBottom: "20px",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "16px", marginBottom: "20px" }}>
              <div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "9px", color: "#E01010", letterSpacing: "3px", marginBottom: "6px" }}>
                  {m.tier.toUpperCase()} TIER
                </div>
                <h3 style={{ fontFamily: "'Bebas Neue'", fontSize: "26px", letterSpacing: "2px", color: "white", marginBottom: "6px" }}>
                  {m.name}
                </h3>
                <div style={{ fontFamily: "'Oswald'", fontSize: "13px", color: "#888", fontWeight: 300 }}>
                  {m.bestFor}
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: "36px", color: "#E01010", lineHeight: 1 }}>
                  {m.price}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>
                  PURCHASE RANGE
                </div>
              </div>
            </div>

            {/* consistency meter */}
            <div style={{ marginBottom: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                <span style={{ fontFamily: "'Space Mono'", fontSize: "9px", color: "#666", letterSpacing: "1px" }}>
                  CONSISTENCY SCORE
                </span>
                <span style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", color: "#E01010" }}>{m.consistency}</span>
              </div>
              <div style={{ height: "6px", background: "rgba(255,255,255,0.08)", borderRadius: "3px", overflow: "hidden" }}>
                <div style={{
                  width: m.consistency, height: "100%",
                  background: "linear-gradient(90deg, #E01010, #FF6B35)",
                  borderRadius: "3px", boxShadow: "0 0 10px rgba(224,16,16,0.5)",
                  transition: "width 0.8s ease",
                }} />
              </div>
              <p style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#666", marginTop: "6px", fontWeight: 300 }}>
                {m.consistencyNote}
              </p>
            </div>

            {/* specs grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: "10px" }}>
              {[
                { label: "Ice Output", val: m.iceOutput },
                { label: "Texture", val: m.shaveQuality },
                { label: "Power", val: m.power },
                { label: "Footprint", val: m.footprint },
                { label: "Warranty", val: m.warranty },
                { label: "Avg Repair", val: m.repairCost },
              ].map(({ label, val }) => (
                <div key={label} style={{
                  background: "rgba(255,255,255,0.04)", borderRadius: "6px",
                  padding: "10px", borderLeft: "2px solid rgba(224,16,16,0.4)",
                }}>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#555", letterSpacing: "1px", marginBottom: "4px" }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "'Teko'", fontSize: "14px", color: "white", fontWeight: 600 }}>{val}</div>
                </div>
              ))}
            </div>
          </div>

          {/* pros/cons */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div style={{ background: "rgba(0,200,0,0.05)", border: "1px solid rgba(0,200,0,0.15)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color: "#4CAF50", marginBottom: "10px" }}>
                ✓ PROS
              </div>
              {m.pros.map((p, pi) => (
                <div key={pi} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: "#4CAF50", flexShrink: 0, fontSize: "12px" }}>▸</span>
                  <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#AAA", fontWeight: 300 }}>{p}</span>
                </div>
              ))}
            </div>
            <div style={{ background: "rgba(224,16,16,0.05)", border: "1px solid rgba(224,16,16,0.15)", borderRadius: "8px", padding: "16px" }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color: "#E01010", marginBottom: "10px" }}>
                ✗ CONS
              </div>
              {m.cons.map((c, ci) => (
                <div key={ci} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
                  <span style={{ color: "#E01010", flexShrink: 0, fontSize: "12px" }}>▸</span>
                  <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#AAA", fontWeight: 300 }}>{c}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}

      {/* recommendation */}
      <div style={{
        marginTop: "24px",
        background: "linear-gradient(135deg, rgba(224,16,16,0.08), rgba(224,96,0,0.04))",
        border: "1px solid rgba(224,96,0,0.3)",
        borderRadius: "8px", padding: "18px 22px",
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "14px", letterSpacing: "3px", color: "#E06000", marginBottom: "8px" }}>
          ◆ RECOMMENDATION FOR CRIMINAL CONES
        </div>
        <p style={{ fontFamily: "'Oswald'", fontSize: "13px", color: "#999", fontWeight: 300, lineHeight: 1.7 }}>
          <strong style={{ color: "white" }}>Start with the Pro Tier (Hatsuyuki HAB-450A or Southern Snow equivalent).</strong> The entry tier will frustrate you on a busy day and the texture inconsistency shows in the product. The commercial tier is the 3-cart endgame — buy it when Cart 2 is funded. The Pro tier hits the 92% consistency threshold needed to protect your brand and your margin at $8/cone.
        </p>
      </div>

      {/* consistency tips preview */}
      <div style={{ marginTop: "28px" }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "3px", color: "#E01010", marginBottom: "16px" }}>
          QUALITY CONTROL QUICK REFERENCE
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "10px" }}>
          {CONSISTENCY_TIPS.slice(0, 4).map((tip, i) => (
            <div key={i} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderLeft: "3px solid #E01010",
              borderRadius: "0 8px 8px 0", padding: "14px",
            }}>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "1px", color: "white", marginBottom: "6px" }}>
                {tip.title}
              </div>
              <p style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300, lineHeight: 1.6 }}>
                {tip.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
