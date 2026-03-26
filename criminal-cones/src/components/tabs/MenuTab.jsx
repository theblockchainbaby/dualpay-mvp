import { FLAVORS } from "../../data/flavors";

const ADDONS = [
  { name: "Chamoy Drizzle", price: null, note: "Included" },
  { name: "Tajín Dusting", price: null, note: "Included" },
  { name: "Condensed Milk", price: 1, note: "Upcharge" },
  { name: "Pop Rocks", price: 1, note: "Upcharge" },
  { name: "Double Syrup", price: 1, note: "Upcharge" },
];

export default function MenuTab() {
  const standard = FLAVORS.filter((f) => f.id !== 10 && f.id !== 12);
  const susAF = FLAVORS.find((f) => f.id === 10);
  const thePlug = FLAVORS.find((f) => f.id === 12);

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          THE MENU BOARD
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          DISPLAY-READY · PRINT-READY · POINT OF SALE
        </p>
      </div>

      {/* MENU BOARD */}
      <div style={{
        background: "linear-gradient(160deg, #0a0006 0%, #060308 100%)",
        border: "2px solid rgba(224,16,16,0.3)",
        borderRadius: "12px", padding: "28px 24px",
        boxShadow: "0 0 60px rgba(224,16,16,0.1) inset, 0 20px 60px rgba(0,0,0,0.6)",
        marginBottom: "24px",
      }}>
        {/* board header */}
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#444", letterSpacing: "6px", marginBottom: "6px" }}>
            EST. 2026 · HANDCRAFTED SYRUPS · REAL ICE
          </div>
          <div style={{
            fontFamily: "'Bebas Neue'",
            fontSize: "clamp(36px, 6vw, 64px)",
            letterSpacing: "8px", lineHeight: 0.9, color: "white",
            textShadow: "0 0 40px rgba(224,16,16,0.4)",
          }}>
            CRIMINAL<br />
            <span style={{ color: "#E01010", animation: "flicker 9s infinite" }}>CONES</span>
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#333", letterSpacing: "4px", marginTop: "6px" }}>
            SHAVED ICE · MADE ILLEGAL ON PURPOSE
          </div>
        </div>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(224,16,16,0.3)" }} />
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: "11px", letterSpacing: "4px", color: "#E01010" }}>THE 12 CRIMES</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(224,16,16,0.3)" }} />
        </div>

        {/* flavor grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "6px", marginBottom: "20px" }}>
          {standard.map((f) => (
            <div key={f.id} style={{
              display: "flex", justifyContent: "space-between", alignItems: "center",
              padding: "8px 12px",
              background: `${f.colors.primary}0c`,
              border: `1px solid ${f.colors.primary}20`,
              borderRadius: "4px",
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{
                  width: "8px", height: "8px", borderRadius: "50%",
                  background: f.colors.primary, flexShrink: 0,
                  boxShadow: `0 0 6px ${f.colors.primary}`,
                }} />
                <div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "1px", color: "white" }}>
                    {f.emoji} {f.name}
                  </div>
                  <div style={{ fontFamily: "'Oswald'", fontSize: "9px", color: "#555", fontWeight: 300 }}>
                    {f.desc.split(".")[0]}
                  </div>
                </div>
              </div>
              <div style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", color: f.colors.primary, flexShrink: 0 }}>
                $8
              </div>
            </div>
          ))}
        </div>

        {/* divider */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: "11px", letterSpacing: "4px", color: "#666" }}>SPECIALS</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        </div>

        {/* Sus AF + The Plug */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", marginBottom: "20px" }}>
          {[susAF, thePlug].filter(Boolean).map((f) => (
            <div key={f.id} style={{
              padding: "12px 14px",
              background: `${f.colors.primary}12`,
              border: `1px solid ${f.colors.primary}30`,
              borderRadius: "6px",
              display: "flex", justifyContent: "space-between", alignItems: "center",
            }}>
              <div>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: "16px", letterSpacing: "1px", color: "white" }}>
                  {f.emoji} {f.name}
                </div>
                <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: f.colors.primary, letterSpacing: "1px" }}>
                  {f.crime}
                </div>
                <div style={{ fontFamily: "'Oswald'", fontSize: "10px", color: "#666", fontWeight: 300, marginTop: "2px" }}>
                  {f.id === 10 ? "Changes weekly. No further info." : "Pick 2 flavors + 1 addon. No questions asked."}
                </div>
              </div>
              <div style={{ textAlign: "right", flexShrink: 0, paddingLeft: "10px" }}>
                <div style={{ fontFamily: "'Bebas Neue'", fontSize: "20px", color: f.colors.primary }}>
                  {f.id === 12 ? "$11" : "$8"}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* sizes */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "14px" }}>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: "11px", letterSpacing: "4px", color: "#666" }}>SIZES & ADDONS</span>
          <div style={{ flex: 1, height: "1px", background: "rgba(255,255,255,0.06)" }} />
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "20px" }}>
          {/* sizes */}
          <div>
            {[
              { size: "Standard", price: "$8", note: "8 oz shaved ice" },
              { size: "Large", price: "$10", note: "+2 oz extra" },
              { size: "Kids Cup", price: "$5", note: "Half size, any flavor" },
              { size: "The Plug", price: "$11", note: "Custom 2-flavor" },
            ].map(({ size, price, note }) => (
              <div key={size} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#AAA", fontWeight: 400 }}>
                  {size} <span style={{ color: "#555", fontWeight: 300, fontSize: "10px" }}>— {note}</span>
                </span>
                <span style={{ fontFamily: "'Teko'", fontSize: "14px", color: "white", fontWeight: 600 }}>{price}</span>
              </div>
            ))}
          </div>
          {/* addons */}
          <div>
            {ADDONS.map(({ name, price, note }) => (
              <div key={name} style={{
                display: "flex", justifyContent: "space-between",
                padding: "5px 0", borderBottom: "1px solid rgba(255,255,255,0.04)",
              }}>
                <span style={{ fontFamily: "'Oswald'", fontSize: "12px", color: "#AAA", fontWeight: 400 }}>
                  {name}
                </span>
                <span style={{ fontFamily: "'Teko'", fontSize: "14px", color: price ? "#FF6D00" : "#555", fontWeight: 600 }}>
                  {price ? `+$${price}` : note}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* footer tagline */}
        <div style={{ textAlign: "center" }}>
          <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#333", letterSpacing: "4px" }}>
            ◆ HANDCRAFTED SYRUPS · REAL BLOCK ICE · FRESH GARNISH ◆
          </div>
          <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#222", letterSpacing: "2px", marginTop: "4px" }}>
            CASH · CARD · VENMO · CASHAPP · ALL CRIMES ACCEPTED
          </div>
        </div>
      </div>

      {/* POS quick ref */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "10px", marginBottom: "20px" }}>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "16px" }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color: "#E01010", marginBottom: "8px" }}>
            POS SETUP (SQUARE)
          </div>
          {[
            "Category: CONES — items priced at $8",
            "Category: SPECIALS — Sus AF $8, Plug $11",
            "Category: SIZES — Large $10, Kids $5",
            "Modifier: ADDONS — each addon at +$1",
            "Modifier: DOUBLE SYRUP — +$1",
            "Enable tipping at checkout — 15/20/25% presets",
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "5px" }}>
              <span style={{ color: "#E01010", fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>▸</span>
              <span style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{item}</span>
            </div>
          ))}
        </div>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: "8px", padding: "16px" }}>
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px", color: "#FF6D00", marginBottom: "8px" }}>
            UPSELL SCRIPT
          </div>
          {[
            '"Want to make that a Large for $2 more?" — say it every time',
            '"Do you want condensed milk or Pop Rocks on that?" — offer the addon before cone is built',
            '"First time here? The Crime Scene and Unhinged are the most popular" — steer toward viral items',
            '"The Plug lets you do any 2 flavors — only $3 more" — pitch it on repeat visits',
            '"Follow us on TikTok to find out the Sus AF flavor before everyone else"',
          ].map((item, i) => (
            <div key={i} style={{ display: "flex", gap: "8px", marginBottom: "8px" }}>
              <span style={{ color: "#FF6D00", fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>▸</span>
              <span style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{item}</span>
            </div>
          ))}
        </div>
      </div>

      {/* operational notes */}
      <div style={{
        background: "rgba(224,16,16,0.04)",
        border: "1px solid rgba(224,16,16,0.15)",
        borderRadius: "8px", padding: "16px 20px",
      }}>
        <div style={{ fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "3px", color: "#E01010", marginBottom: "10px" }}>
          MENU BOARD DISPLAY NOTES
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "6px" }}>
          {[
            { note: "Print at 24×36 for standard outdoor menu board frame" },
            { note: "Update Sus AF weekly — use dry-erase insert or chalkboard section for mystery reveal" },
            { note: "Rotate 3–4 flavor descriptions seasonally to keep the board fresh" },
            { note: "LED backlit board preferred — sunlight washes out non-lit boards at peak afternoon hours" },
            { note: "Add QR code bottom-right linking to TikTok — 'See the crimes in action'" },
            { note: "Keep The Plug at the bottom — customers read top to bottom, buy standard, then discover custom" },
          ].map(({ note }, i) => (
            <div key={i} style={{ display: "flex", gap: "8px" }}>
              <span style={{ color: "#E01010", fontSize: "10px", flexShrink: 0, marginTop: "2px" }}>◆</span>
              <span style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>{note}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
