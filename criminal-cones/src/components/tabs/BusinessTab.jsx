import { useState } from "react";
import { STARTUP_COSTS, REVENUE_MODEL, SCALE_ROADMAP, BREAK_EVEN } from "../../data/business";

const CATEGORY_COLORS = {
  Equipment: "#E01010",
  Branding: "#FF6D00",
  Supplies: "#F9A825",
  Permits: "#4CAF50",
  Marketing: "#1565C0",
  Buffer: "#7B1FA2",
};

export default function BusinessTab() {
  const [activeSection, setActiveSection] = useState("startup");
  const [activeScenario, setActiveScenario] = useState(1);

  const totalStartup = STARTUP_COSTS.cart1.reduce((sum, item) => sum + item.cost, 0);
  const byCategory = STARTUP_COSTS.cart1.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.cost;
    return acc;
  }, {});

  const sections = [
    { id: "startup", label: "STARTUP COSTS" },
    { id: "revenue", label: "REVENUE MODEL" },
    { id: "roadmap", label: "SCALE ROADMAP" },
  ];

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          THE BUSINESS PLAN
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          COSTS · REVENUE · 4-PHASE SCALE ROADMAP
        </p>
      </div>

      {/* break-even hero */}
      <div style={{
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))",
        gap: "10px", marginBottom: "28px",
      }}>
        {[
          { label: "Total Cart 1 Startup", val: `$${BREAK_EVEN.totalStartup.toLocaleString()}`, color: "#E01010" },
          { label: "Daily Profit (Target)", val: `$${BREAK_EVEN.dailyProfit}`, color: "#FF6D00" },
          { label: "Break-Even (Days)", val: `~${BREAK_EVEN.breakEvenDays}`, color: "#F9A825" },
          { label: "Margin Per $8 Cone", val: "61%", color: "#4CAF50" },
        ].map(({ label, val, color }) => (
          <div key={label} className="stat-card" style={{
            background: `${color}10`, border: `1px solid ${color}33`,
            borderRadius: "8px", padding: "16px", textAlign: "center",
          }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "30px", color, lineHeight: 1 }}>{val}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#666", marginTop: "4px", letterSpacing: "1px" }}>
              {label}
            </div>
          </div>
        ))}
      </div>

      <p style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#666", fontWeight: 300, marginBottom: "24px", lineHeight: 1.6, textAlign: "center" }}>
        {BREAK_EVEN.breakEvenNote}
      </p>

      {/* sub-nav */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px", flexWrap: "wrap" }}>
        {sections.map((s) => (
          <button key={s.id} onClick={() => setActiveSection(s.id)}
            style={{
              background: activeSection === s.id ? "#E01010" : "rgba(255,255,255,0.04)",
              border: activeSection === s.id ? "none" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px", padding: "8px 16px",
              color: activeSection === s.id ? "white" : "#666",
              fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>
            {s.label}
          </button>
        ))}
      </div>

      {/* STARTUP COSTS */}
      {activeSection === "startup" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          {/* category summary */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))", gap: "8px", marginBottom: "20px" }}>
            {Object.entries(byCategory).map(([cat, amt]) => (
              <div key={cat} style={{
                background: `${CATEGORY_COLORS[cat]}15`,
                border: `1px solid ${CATEGORY_COLORS[cat]}33`,
                borderRadius: "6px", padding: "10px", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: "20px", color: CATEGORY_COLORS[cat] }}>
                  ${amt.toLocaleString()}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>{cat}</div>
              </div>
            ))}
          </div>

          {/* line items */}
          <div style={{ display: "flex", flexDirection: "column", gap: "4px", marginBottom: "16px" }}>
            {STARTUP_COSTS.cart1.map((item, i) => (
              <div key={i} style={{
                display: "flex", justifyContent: "space-between", alignItems: "flex-start",
                padding: "10px 12px",
                background: i % 2 === 0 ? "rgba(255,255,255,0.02)" : "transparent",
                borderRadius: "4px", gap: "12px",
              }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
                    <div style={{
                      width: "6px", height: "6px", borderRadius: "50%",
                      background: CATEGORY_COLORS[item.category], flexShrink: 0,
                    }} />
                    <span style={{ fontFamily: "'Oswald'", fontSize: "13px", color: "#CCC", fontWeight: 400 }}>
                      {item.item}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "9px", color: "#555", paddingLeft: "14px" }}>
                    {item.note}
                  </div>
                </div>
                <div style={{ fontFamily: "'Teko'", fontSize: "16px", color: "white", fontWeight: 600, flexShrink: 0 }}>
                  ${item.cost.toLocaleString()}
                </div>
              </div>
            ))}
          </div>

          <div style={{
            display: "flex", justifyContent: "space-between", alignItems: "center",
            borderTop: "2px solid rgba(224,16,16,0.4)", paddingTop: "16px",
          }}>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "2px", color: "white" }}>
              TOTAL CART 1 INVESTMENT
            </span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "28px", color: "#E01010" }}>
              ${totalStartup.toLocaleString()}
            </span>
          </div>
        </div>
      )}

      {/* REVENUE MODEL */}
      {activeSection === "revenue" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          {/* pricing */}
          <div style={{ marginBottom: "24px" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "3px", color: "#E01010", marginBottom: "12px" }}>
              MENU PRICING
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {REVENUE_MODEL.pricing.map(({ item, price, emoji }) => (
                <div key={item} style={{
                  background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "8px", padding: "12px 16px", textAlign: "center", minWidth: "100px",
                }}>
                  <div style={{ fontSize: "18px", marginBottom: "4px" }}>{emoji}</div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: "24px", color: "#E01010" }}>{price}</div>
                  <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{item}</div>
                </div>
              ))}
            </div>
          </div>

          {/* COGS breakdown */}
          <div style={{
            background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
            borderRadius: "8px", padding: "18px", marginBottom: "24px",
          }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "2px", color: "#E01010", marginBottom: "12px" }}>
              COST OF GOODS — STANDARD $8 CONE
            </div>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "12px" }}>
              {[
                { label: "Ice", cost: REVENUE_MODEL.cogs.ice },
                { label: "Syrup", cost: REVENUE_MODEL.cogs.syrup },
                { label: "Cup/Cone", cost: REVENUE_MODEL.cogs.cup },
                { label: "Addons", cost: REVENUE_MODEL.cogs.addons },
                { label: "Labor", cost: REVENUE_MODEL.cogs.labor },
              ].map(({ label, cost }) => (
                <div key={label} style={{
                  flex: 1, minWidth: "70px",
                  background: "rgba(255,255,255,0.04)", borderRadius: "6px", padding: "10px", textAlign: "center",
                }}>
                  <div style={{ fontFamily: "'Teko'", fontSize: "18px", color: "white", fontWeight: 600 }}>
                    ${cost.toFixed(2)}
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555" }}>{label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <span style={{ fontFamily: "'Oswald'", fontSize: "13px", color: "#888" }}>
                Total COGS: <strong style={{ color: "white" }}>${REVENUE_MODEL.cogs.total.toFixed(2)}</strong> — Profit: <strong style={{ color: "white" }}>${(8 - REVENUE_MODEL.cogs.total).toFixed(2)}</strong>
              </span>
              <span style={{ fontFamily: "'Bebas Neue'", fontSize: "24px", color: "#4CAF50" }}>
                {REVENUE_MODEL.cogs.margin} MARGIN
              </span>
            </div>
            <p style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#555", fontWeight: 300, marginTop: "8px" }}>
              {REVENUE_MODEL.cogs.note}
            </p>
          </div>

          {/* scenarios */}
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "2px", color: "#E01010", marginBottom: "12px" }}>
            DAILY REVENUE SCENARIOS
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "16px", flexWrap: "wrap" }}>
            {REVENUE_MODEL.scenarios.map((s, i) => (
              <button key={i} onClick={() => setActiveScenario(i)}
                style={{
                  background: activeScenario === i ? "#E01010" : "rgba(255,255,255,0.04)",
                  border: activeScenario === i ? "none" : "1px solid rgba(255,255,255,0.1)",
                  borderRadius: "6px", padding: "8px 14px",
                  color: activeScenario === i ? "white" : "#666",
                  fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "1px",
                  cursor: "pointer", transition: "all 0.2s ease",
                }}>
                {s.label}
              </button>
            ))}
          </div>
          {REVENUE_MODEL.scenarios.map((s, i) => activeScenario === i && (
            <div key={i} style={{ animation: "fadeUp 0.3s ease" }}>
              <div style={{
                background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
                borderRadius: "8px", padding: "20px",
              }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(100px, 1fr))", gap: "12px", marginBottom: "12px" }}>
                  {[
                    { label: "Units", val: s.units },
                    { label: "Avg Ticket", val: `$${s.avgTicket}` },
                    { label: "Revenue", val: `$${s.revenue}` },
                    { label: "COGS", val: `$${s.cogs}` },
                    { label: "Daily Profit", val: `$${s.profit}`, highlight: true },
                  ].map(({ label, val, highlight }) => (
                    <div key={label} style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Bebas Neue'", fontSize: "26px", color: highlight ? "#4CAF50" : "white" }}>
                        {val}
                      </div>
                      <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555" }}>{label}</div>
                    </div>
                  ))}
                </div>
                <p style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#666", fontWeight: 300 }}>{s.note}</p>
                <div style={{ marginTop: "10px", fontFamily: "'Space Mono'", fontSize: "9px", color: "#555" }}>
                  Monthly (25 operating days): <strong style={{ color: "#E01010" }}>${(s.profit * 25).toLocaleString()}</strong> profit
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SCALE ROADMAP */}
      {activeSection === "roadmap" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {SCALE_ROADMAP.map((phase, i) => (
              <div key={i} style={{
                background: `${phase.color}08`,
                border: `1px solid ${phase.color}30`,
                borderLeft: `4px solid ${phase.color}`,
                borderRadius: "0 8px 8px 0", padding: "20px",
                animation: `fadeUp 0.4s ease ${i * 0.1}s both`,
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", flexWrap: "wrap", gap: "8px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: phase.color, letterSpacing: "3px", marginBottom: "4px" }}>
                      {phase.phase} — {phase.timeline}
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: "22px", letterSpacing: "2px", color: "white" }}>
                      {phase.name}
                    </div>
                  </div>
                </div>
                <p style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#888", fontWeight: 300, marginBottom: "12px" }}>
                  {phase.goal}
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "6px", marginBottom: "12px" }}>
                  {phase.milestones.map((m, mi) => (
                    <div key={mi} style={{ display: "flex", gap: "8px" }}>
                      <span style={{ color: phase.color, fontSize: "12px", flexShrink: 0, marginTop: "2px" }}>◆</span>
                      <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#999", fontWeight: 300 }}>{m}</span>
                    </div>
                  ))}
                </div>
                <div style={{
                  background: `${phase.color}15`,
                  borderRadius: "4px", padding: "8px 12px",
                  fontFamily: "'Space Mono'", fontSize: "9px", color: phase.color, letterSpacing: "1px",
                }}>
                  🔓 UNLOCK: {phase.unlock}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
