export default function FlavorCard({ flavor, isOpen, onClick }) {
  return (
    <div
      className="flavor-card"
      onClick={onClick}
      style={{
        background: `linear-gradient(135deg, ${flavor.colors.primary}18, ${flavor.colors.secondary}12)`,
        border: isOpen
          ? `2px solid ${flavor.colors.primary}`
          : `1px solid ${flavor.colors.primary}44`,
        borderRadius: "8px",
        overflow: "hidden",
        boxShadow: isOpen
          ? `0 12px 40px ${flavor.colors.primary}30`
          : "0 4px 16px rgba(0,0,0,0.4)",
      }}
    >
      {/* header */}
      <div style={{
        background: `linear-gradient(135deg, ${flavor.colors.primary}, ${flavor.colors.secondary})`,
        padding: "14px 16px 12px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "flex-start",
      }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "3px" }}>
            <span style={{ fontSize: "20px" }}>{flavor.emoji}</span>
            <span style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "2px", color: "white" }}>
              {flavor.name}
            </span>
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "rgba(255,255,255,0.7)", letterSpacing: "2px" }}>
            {flavor.crime}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "4px" }}>
          <div style={{
            background: "rgba(0,0,0,0.3)", borderRadius: "4px",
            padding: "3px 8px", fontSize: "9px", color: "white",
            fontFamily: "'Space Mono'", letterSpacing: "1px",
          }}>
            🔥 {flavor.viralScore}/10
          </div>
          <div style={{ display: "flex", gap: "3px" }}>
            {[flavor.colors.primary, flavor.colors.secondary, flavor.colors.ice, flavor.colors.accent].map((c, i) => (
              <div key={i} style={{
                width: "10px", height: "10px", borderRadius: "50%",
                background: c, border: "1px solid rgba(255,255,255,0.3)",
              }} />
            ))}
          </div>
        </div>
      </div>

      {/* desc */}
      <div style={{ padding: "10px 14px", borderBottom: `1px solid ${flavor.colors.primary}22` }}>
        <p style={{ color: "#BBB", fontSize: "12px", fontFamily: "'Oswald'", fontWeight: 300, lineHeight: 1.5 }}>
          {flavor.desc}
        </p>
      </div>

      {/* expanded recipe */}
      {isOpen && (
        <div style={{ padding: "14px", animation: "slideIn 0.3s ease" }}>
          {/* color swatches */}
          <div style={{ display: "flex", gap: "8px", marginBottom: "14px", alignItems: "center" }}>
            <span style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", letterSpacing: "1px" }}>COLOR</span>
            {[
              { label: "Primary", c: flavor.colors.primary },
              { label: "Secondary", c: flavor.colors.secondary },
              { label: "Ice", c: flavor.colors.ice },
              { label: "Accent", c: flavor.colors.accent },
            ].map(({ label, c }) => (
              <div key={label} style={{ textAlign: "center" }}>
                <div style={{
                  width: "24px", height: "24px", borderRadius: "50%",
                  background: c, border: "2px solid rgba(255,255,255,0.2)",
                  margin: "0 auto 3px", boxShadow: `0 0 8px ${c}66`,
                }} />
                <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#666" }}>{label}</div>
              </div>
            ))}
            <div style={{ marginLeft: "4px", flex: 1 }}>
              <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#666", lineHeight: 1.5 }}>
                {flavor.recipe.color}
              </div>
            </div>
          </div>

          {/* recipe details */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "8px", marginBottom: "14px" }}>
            {[
              { label: "Ratio", val: flavor.recipe.ratio.split(" per ")[0] },
              { label: "Brix Target", val: flavor.recipe.brix },
              { label: "Shelf Life", val: flavor.recipe.shelfLife },
            ].map(({ label, val }) => (
              <div key={label} style={{
                background: "rgba(255,255,255,0.04)", borderRadius: "4px",
                padding: "8px", textAlign: "center",
              }}>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#555", marginBottom: "3px", letterSpacing: "1px" }}>
                  {label}
                </div>
                <div style={{
                  fontFamily: "'Teko'", fontSize: "13px",
                  color: flavor.colors.primary, fontWeight: 600, lineHeight: 1.2,
                }}>
                  {val}
                </div>
              </div>
            ))}
          </div>

          {/* steps */}
          <div style={{ marginBottom: "12px" }}>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: "12px",
              letterSpacing: "2px", color: flavor.colors.primary, marginBottom: "8px",
            }}>
              RECIPE STEPS
            </div>
            {flavor.recipe.steps.map((step, i) => (
              <div key={i} style={{ display: "flex", gap: "10px", marginBottom: "6px" }}>
                <div style={{
                  width: "18px", height: "18px", borderRadius: "50%", flexShrink: 0,
                  background: flavor.colors.primary,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontFamily: "'Space Mono'", fontSize: "8px", color: "white", fontWeight: 700,
                }}>
                  {i + 1}
                </div>
                <p style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#999", fontWeight: 300, lineHeight: 1.5 }}>
                  {step}
                </p>
              </div>
            ))}
          </div>

          {/* addons */}
          <div>
            <div style={{
              fontFamily: "'Bebas Neue'", fontSize: "11px",
              letterSpacing: "2px", color: "#666", marginBottom: "6px",
            }}>
              ADDONS & GARNISH
            </div>
            <div style={{ display: "flex", gap: "6px", flexWrap: "wrap" }}>
              {flavor.recipe.addons.map((a, i) => (
                <span key={i} style={{
                  background: `${flavor.colors.primary}22`,
                  border: `1px solid ${flavor.colors.primary}44`,
                  borderRadius: "100px", padding: "3px 10px",
                  fontFamily: "'Oswald'", fontSize: "11px",
                  color: flavor.colors.primary, fontWeight: 400,
                }}>
                  {a}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {!isOpen && (
        <div style={{ padding: "8px 14px", textAlign: "right" }}>
          <span style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#444", letterSpacing: "1px" }}>
            TAP FOR RECIPE ▾
          </span>
        </div>
      )}
    </div>
  );
}
