import { useState } from "react";
import { LAUNCH_TIMELINE, PERMITS_BY_STATE } from "../../data/launch";

export default function LaunchTab() {
  const [checked, setChecked] = useState({});
  const [activeView, setActiveView] = useState("timeline");

  const toggle = (id) => setChecked((prev) => ({ ...prev, [id]: !prev[id] }));

  const allTasks = LAUNCH_TIMELINE.flatMap((week) => week.tasks);
  const completedCount = Object.values(checked).filter(Boolean).length;
  const progress = Math.round((completedCount / allTasks.length) * 100);

  return (
    <div style={{ animation: "fadeUp 0.5s ease" }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <h2 style={{ fontFamily: "'Bebas Neue'", fontSize: "32px", letterSpacing: "4px", color: "#E01010" }}>
          LAUNCH OPS
        </h2>
        <p style={{ color: "#666", fontFamily: "'Space Mono'", fontSize: "9px", letterSpacing: "2px" }}>
          8-WEEK COUNTDOWN · PERMITS · OPENING DAY PLAN
        </p>
      </div>

      {/* progress tracker */}
      <div style={{
        background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "8px", padding: "16px 20px", marginBottom: "24px",
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: "14px", letterSpacing: "2px", color: "white" }}>
            LAUNCH READINESS
          </span>
          <span style={{ fontFamily: "'Bebas Neue'", fontSize: "20px", color: "#E01010" }}>
            {completedCount} / {allTasks.length} TASKS — {progress}%
          </span>
        </div>
        <div style={{ height: "8px", background: "rgba(255,255,255,0.08)", borderRadius: "4px", overflow: "hidden" }}>
          <div style={{
            width: `${progress}%`, height: "100%",
            background: progress === 100
              ? "linear-gradient(90deg, #4CAF50, #76FF03)"
              : "linear-gradient(90deg, #E01010, #FF6B35)",
            borderRadius: "4px", transition: "width 0.4s ease",
            boxShadow: progress > 0 ? "0 0 12px rgba(224,16,16,0.5)" : "none",
          }} />
        </div>
        {progress === 100 && (
          <div style={{ fontFamily: "'Bebas Neue'", fontSize: "14px", color: "#4CAF50", marginTop: "8px", textAlign: "center" }}>
            🔓 ALL SYSTEMS GO — OPEN THE CART
          </div>
        )}
      </div>

      {/* sub-nav */}
      <div style={{ display: "flex", gap: "8px", marginBottom: "24px" }}>
        {[
          { id: "timeline", label: "8-WEEK TIMELINE" },
          { id: "permits", label: "PERMITS & LICENSES" },
        ].map((v) => (
          <button key={v.id} onClick={() => setActiveView(v.id)}
            style={{
              background: activeView === v.id ? "#E01010" : "rgba(255,255,255,0.04)",
              border: activeView === v.id ? "none" : "1px solid rgba(255,255,255,0.1)",
              borderRadius: "6px", padding: "8px 16px",
              color: activeView === v.id ? "white" : "#666",
              fontFamily: "'Bebas Neue'", fontSize: "13px", letterSpacing: "2px",
              cursor: "pointer", transition: "all 0.2s ease",
            }}>
            {v.label}
          </button>
        ))}
      </div>

      {/* TIMELINE */}
      {activeView === "timeline" && (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {LAUNCH_TIMELINE.map((week, wi) => {
            const weekCompleted = week.tasks.filter((t) => checked[t.id]).length;
            return (
              <div key={wi} style={{
                background: "rgba(255,255,255,0.02)",
                border: `1px solid ${week.color}30`,
                borderRadius: "8px", overflow: "hidden",
                animation: `fadeUp 0.4s ease ${wi * 0.08}s both`,
              }}>
                {/* week header */}
                <div style={{
                  background: `${week.color}18`,
                  borderBottom: `1px solid ${week.color}30`,
                  padding: "12px 16px",
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}>
                  <div>
                    <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: week.color, letterSpacing: "2px", marginBottom: "2px" }}>
                      {week.week}
                    </div>
                    <div style={{ fontFamily: "'Bebas Neue'", fontSize: "18px", letterSpacing: "2px", color: "white" }}>
                      {week.label}
                    </div>
                  </div>
                  <div style={{
                    fontFamily: "'Space Mono'", fontSize: "10px", color: week.color,
                    background: `${week.color}20`, borderRadius: "4px", padding: "4px 10px",
                  }}>
                    {weekCompleted}/{week.tasks.length} DONE
                  </div>
                </div>

                {/* tasks */}
                <div style={{ padding: "8px" }}>
                  {week.tasks.map((task) => (
                    <div
                      key={task.id}
                      className={`checklist-item ${checked[task.id] ? "checked" : ""}`}
                      onClick={() => toggle(task.id)}
                      style={{
                        display: "flex", gap: "12px", alignItems: "flex-start",
                        padding: "10px 12px", borderRadius: "6px",
                        background: checked[task.id] ? "rgba(224,16,16,0.06)" : "transparent",
                        marginBottom: "2px",
                      }}
                    >
                      <div className="check-box" style={{
                        width: "18px", height: "18px", borderRadius: "4px", flexShrink: 0,
                        border: checked[task.id] ? "none" : `1.5px solid ${week.color}66`,
                        background: checked[task.id] ? "#E01010" : "transparent",
                        display: "flex", alignItems: "center", justifyContent: "center",
                        marginTop: "1px", transition: "all 0.2s ease",
                      }}>
                        {checked[task.id] && (
                          <svg width="11" height="8" viewBox="0 0 11 8" fill="none">
                            <path d="M1 4L4 7L10 1" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                        )}
                      </div>
                      <div style={{ flex: 1 }}>
                        <span style={{
                          fontFamily: "'Oswald'", fontSize: "13px", fontWeight: 300,
                          color: checked[task.id] ? "#555" : "#CCC",
                          textDecoration: checked[task.id] ? "line-through" : "none",
                          lineHeight: 1.4,
                        }}>
                          {task.text}
                        </span>
                        {task.critical && !checked[task.id] && (
                          <span style={{
                            marginLeft: "8px",
                            fontFamily: "'Space Mono'", fontSize: "7px",
                            color: "#E01010", letterSpacing: "1px",
                          }}>
                            CRITICAL
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* PERMITS */}
      {activeView === "permits" && (
        <div style={{ animation: "fadeUp 0.3s ease" }}>
          <div style={{
            background: "rgba(224,16,16,0.06)", border: "1px solid rgba(224,16,16,0.2)",
            borderRadius: "8px", padding: "14px 18px", marginBottom: "20px",
          }}>
            <p style={{ fontFamily: "'Oswald'", fontSize: "13px", color: "#999", fontWeight: 300, lineHeight: 1.7 }}>
              <strong style={{ color: "white" }}>Requirements vary by city and county.</strong> This is the standard set for most US jurisdictions. Start with your city clerk and county health department — they'll tell you exactly what's required for your specific location.
            </p>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            {PERMITS_BY_STATE.map((p, i) => (
              <div key={i} style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.07)",
                borderRadius: "8px", padding: "16px",
                display: "grid", gridTemplateColumns: "1fr auto", gap: "12px",
                animation: `fadeUp 0.3s ease ${i * 0.06}s both`,
              }}>
                <div>
                  <div style={{ fontFamily: "'Bebas Neue'", fontSize: "15px", letterSpacing: "1px", color: "white", marginBottom: "4px" }}>
                    {p.permit}
                  </div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555", marginBottom: "6px" }}>
                    {p.authority} · {p.timeline}
                  </div>
                  <div style={{ fontFamily: "'Oswald'", fontSize: "11px", color: "#888", fontWeight: 300 }}>
                    {p.notes}
                  </div>
                </div>
                <div style={{ textAlign: "right", flexShrink: 0 }}>
                  <div style={{ fontFamily: "'Teko'", fontSize: "16px", color: "#E01010", fontWeight: 600 }}>{p.cost}</div>
                  <div style={{ fontFamily: "'Space Mono'", fontSize: "8px", color: "#555" }}>cost</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
