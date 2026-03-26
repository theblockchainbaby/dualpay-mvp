import { useState } from "react";
import { FLAVORS } from "../../data/flavors";
import FlavorCard from "../shared/FlavorCard";

const CATEGORIES = ["all", "sweet", "spicy", "savory", "floral", "fresh", "mystery", "custom"];

export default function FlavorsTab() {
  const [activeFlavor, setActiveFlavor] = useState(null);
  const [activeCategory, setActiveCategory] = useState("all");

  const filtered = activeCategory === "all"
    ? FLAVORS
    : FLAVORS.filter((f) => f.category === activeCategory);

  const topViral = [...FLAVORS].sort((a, b) => b.viralScore - a.viralScore).slice(0, 5);

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "24px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          THE 12 CRIMES
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          TAP ANY FLAVOR FOR FULL RECIPE + COLOR SYSTEM
        </p>
      </div>

      {/* viral ranking strip */}
      <div style={{
        display: "flex", gap: "6px", overflowX: "auto",
        paddingBottom: "8px", marginBottom: "16px", scrollbarWidth: "none",
      }}>
        {topViral.map((f, i) => (
          <div key={f.id} onClick={() => setActiveFlavor(activeFlavor === f.id ? null : f.id)}
            style={{
              flexShrink: 0, cursor: "pointer",
              background: `${f.colors.primary}22`,
              border: `1px solid ${f.colors.primary}55`,
              borderRadius: "6px", padding: "6px 12px",
              textAlign: "center", minWidth: "100px",
              transition: "all 0.2s ease",
            }}>
            <div style={{ fontFamily: "'Space Mono'", fontSize: "7px", color: "#555", marginBottom: "3px" }}>
              #{i + 1} VIRAL
            </div>
            <div style={{ fontSize: "14px", marginBottom: "2px" }}>{f.emoji}</div>
            <div style={{ fontFamily: "'Teko'", fontSize: "11px", color: f.colors.primary, letterSpacing: "1px", fontWeight: 600 }}>
              {f.name}
            </div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#E01010" }}>🔥{f.viralScore}</div>
          </div>
        ))}
      </div>

      {/* category filter */}
      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "20px" }}>
        {CATEGORIES.map((cat) => (
          <button key={cat} onClick={() => setActiveCategory(cat)}
            style={{
              background: activeCategory === cat ? "#E01010" : "rgba(255,255,255,0.04)",
              border: activeCategory === cat ? "none" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "100px", padding: "5px 14px",
              color: activeCategory === cat ? "white" : "#666",
              fontFamily: "'Bebas Neue'", fontSize: "12px", letterSpacing: "2px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>
            {cat.toUpperCase()}
          </button>
        ))}
      </div>

      {/* flavor grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "12px" }}>
        {filtered.map((f, i) => (
          <div key={f.id} style={{ animation: `fadeUp 0.4s ease ${i * 0.05}s both` }}>
            <FlavorCard
              flavor={f}
              isOpen={activeFlavor === f.id}
              onClick={() => setActiveFlavor(activeFlavor === f.id ? null : f.id)}
            />
          </div>
        ))}
      </div>

      {/* price legend */}
      <div style={{
        marginTop: "24px", display: "flex", gap: "12px", flexWrap: "wrap",
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: "8px", padding: "16px",
      }}>
        {[
          { label: "Standard Cone", price: "$8", note: "Any 1 flavor" },
          { label: "Large Cone", price: "$10", note: "+2 oz, any flavor" },
          { label: "The Plug", price: "$11", note: "Custom 2-flavor" },
          { label: "Kids Cup", price: "$5", note: "Half size" },
          { label: "Double Addon", price: "+$1", note: "Any upcharge" },
        ].map(({ label, price, note }) => (
          <div key={label} style={{ textAlign: "center", flex: 1, minWidth: "80px" }}>
            <div style={{ fontFamily: "'Bebas Neue'", fontSize: "22px", color: "#E01010" }}>{price}</div>
            <div style={{ fontFamily: "'Teko'", fontSize: "12px", color: "white", fontWeight: 600 }}>{label}</div>
            <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555" }}>{note}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
