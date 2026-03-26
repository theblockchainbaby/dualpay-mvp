import { useState, useEffect } from "react";
import MascotsTab from "./components/tabs/MascotsTab";
import FlavorsTab from "./components/tabs/FlavorsTab";
import MachinesTab from "./components/tabs/MachinesTab";
import ConsistencyTab from "./components/tabs/ConsistencyTab";
import BusinessTab from "./components/tabs/BusinessTab";
import LaunchTab from "./components/tabs/LaunchTab";
import SocialTab from "./components/tabs/SocialTab";
import MenuTab from "./components/tabs/MenuTab";

const TABS = [
  { id: "mascots",     label: "MASCOTS",      icon: "🎭" },
  { id: "flavors",     label: "12 FLAVORS",   icon: "🧊" },
  { id: "menu",        label: "MENU",         icon: "📋" },
  { id: "business",    label: "BUSINESS",     icon: "💰" },
  { id: "launch",      label: "LAUNCH OPS",   icon: "🚀" },
  { id: "social",      label: "SOCIAL",       icon: "📱" },
  { id: "machines",    label: "MACHINES",     icon: "⚙️" },
  { id: "consistency", label: "QUALITY",      icon: "✅" },
];

const TAB_COMPONENTS = {
  mascots:     <MascotsTab />,
  flavors:     <FlavorsTab />,
  menu:        <MenuTab />,
  business:    <BusinessTab />,
  launch:      <LaunchTab />,
  social:      <SocialTab />,
  machines:    <MachinesTab />,
  consistency: <ConsistencyTab />,
};

export default function App() {
  const [tab, setTab] = useState("mascots");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setTimeout(() => setMounted(true), 80);
  }, []);

  return (
    <div style={{ minHeight: "100vh", background: "#060308", color: "white" }}>

      {/* HEADER */}
      <div style={{
        background: "linear-gradient(180deg, #0D0510 0%, #060308 100%)",
        borderBottom: "1px solid rgba(224,16,16,0.2)",
        padding: "32px 20px 20px",
        textAlign: "center",
        opacity: mounted ? 1 : 0,
        transition: "opacity 0.6s ease",
      }}>
        <div style={{
          fontFamily: "'Space Mono'", fontSize: "9px",
          letterSpacing: "6px", color: "#444", marginBottom: "10px",
        }}>
          FULL BRAND SYSTEM — CONCEPT TO CART
        </div>
        <h1 style={{
          fontFamily: "'Bebas Neue'",
          fontSize: "clamp(44px, 8vw, 80px)",
          letterSpacing: "6px", lineHeight: 0.92,
          textShadow: "0 0 60px rgba(224,16,16,0.5)",
          marginBottom: "6px",
        }}>
          CRIMINAL<br />
          <span style={{
            color: "#E01010",
            textShadow: "0 0 30px #E01010aa",
            animation: "flicker 9s infinite",
          }}>
            CONES
          </span>
        </h1>
        <p style={{ fontFamily: "'Space Mono'", fontSize: "9px", color: "#555", letterSpacing: "3px" }}>
          MASCOTS · FLAVORS · MENU · BUSINESS · LAUNCH · SOCIAL · MACHINES · QUALITY
        </p>
      </div>

      {/* TAB BAR */}
      <div style={{
        display: "flex",
        justifyContent: "center",
        gap: "3px",
        padding: "14px 12px 0",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        position: "sticky",
        top: 0,
        background: "#060308",
        zIndex: 10,
        flexWrap: "wrap",
        rowGap: "0",
      }}>
        {TABS.map((t) => (
          <button
            key={t.id}
            className="tab-btn"
            onClick={() => setTab(t.id)}
            style={{
              background: tab === t.id ? "#E01010" : "rgba(255,255,255,0.04)",
              border: tab === t.id ? "none" : "1px solid rgba(255,255,255,0.08)",
              borderBottom: "none",
              borderRadius: "6px 6px 0 0",
              padding: "9px 13px 11px",
              color: tab === t.id ? "white" : "#666",
              fontFamily: "'Bebas Neue'",
              fontSize: "12px",
              letterSpacing: "1.5px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              gap: "5px",
              boxShadow: tab === t.id ? "0 0 20px rgba(224,16,16,0.4)" : "none",
              whiteSpace: "nowrap",
            }}
          >
            <span style={{ fontSize: "13px" }}>{t.icon}</span>
            {t.label}
          </button>
        ))}
      </div>

      {/* TAB CONTENT */}
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "24px 16px 60px" }}>
        {TAB_COMPONENTS[tab]}
      </div>

      {/* FOOTER */}
      <div style={{
        textAlign: "center",
        paddingBottom: "32px",
        fontFamily: "'Space Mono'",
        fontSize: "8px",
        letterSpacing: "4px",
        color: "#1A1A1A",
      }}>
        M-SQUARED × CRIMINAL CONES — FULL BRAND SYSTEM 2026
      </div>
    </div>
  );
}
