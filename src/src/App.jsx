import React, { useState, useCallback } from "react";
import { Compass, Layers, Gauge, Plus, X, RotateCcw } from "lucide-react";

const STORAGE_KEY = "blueprint:plan";

const EMPTY_PLAN = {
  idea: "",
  customer: "",
  problem: "",
  metric: "",
  features: [],
};

const TIERS = [
  { key: "must", label: "MUST HAVE", note: "ships without it, product doesn't work", color: "#E8A33D" },
  { key: "should", label: "SHOULD HAVE", note: "important, not launch-blocking", color: "#7FB3D9" },
  { key: "could", label: "COULD HAVE", note: "nice touch, cut first under pressure", color: "#8FA3B0" },
  { key: "wont", label: "WON'T HAVE (v1)", note: "explicitly out of scope for now", color: "#5C6B76" },
];

function loadPlan() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : EMPTY_PLAN;
  } catch (e) {
    return EMPTY_PLAN;
  }
}

function Field({ label, hint, value, onChange, placeholder, area }) {
  const Comp = area ? "textarea" : "input";
  return (
    <div style={{ marginBottom: 16 }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 5 }}>
        <label className="mono" style={{ fontSize: 11, letterSpacing: 1.5, color: "#7FB3D9" }}>
          {label}
        </label>
        {hint && <span style={{ fontSize: 11, color: "#5C6B76" }}>{hint}</span>}
      </div>
      <Comp
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        rows={area ? 2 : undefined}
        style={{
          width: "100%",
          background: "#0F2740",
          border: "1px solid #274863",
          borderRadius: 6,
          padding: "9px 11px",
          color: "#EAF2F8",
          fontSize: 14,
          fontFamily: "inherit",
          resize: area ? "vertical" : "none",
          boxSizing: "border-box",
        }}
      />
    </div>
  );
}

export default function App() {
  const [plan, setPlan] = useState(loadPlan);
  const [draft, setDraft] = useState("");
  const [tier, setTier] = useState("must");

  const persist = useCallback((next) => {
    setPlan(next);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
    } catch (e) {
      console.error("Storage error", e);
    }
  }, []);

  const setField = (key) => (val) => persist({ ...plan, [key]: val });

  const addFeature = () => {
    const label = draft.trim();
    if (!label) return;
    persist({ ...plan, features: [...plan.features, { id: Date.now(), label, tier }] });
    setDraft("");
  };

  const removeFeature = (id) => persist({ ...plan, features: plan.features.filter((f) => f.id !== id) });

  const reset = () => persist(EMPTY_PLAN);

  const mustCount = plan.features.filter((f) => f.tier === "must").length;
  const totalCount = plan.features.length;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0A1B2E",
        backgroundImage:
          "linear-gradient(#16324C 1px, transparent 1px), linear-gradient(90deg, #16324C 1px, transparent 1px)",
        backgroundSize: "28px 28px",
        color: "#EAF2F8",
        fontFamily: "'IBM Plex Sans', 'Segoe UI', sans-serif",
        padding: "30px 16px 60px",
      }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,500;9..144,700&family=IBM+Plex+Sans:wght@400;500;600&family=IBM+Plex+Mono:wght@400;500&display=swap');
        .mono { font-family: 'IBM Plex Mono', monospace; }
        .serif { font-family: 'Fraunces', serif; }
        input:focus, textarea:focus, button:focus { outline: 2px solid #E8A33D; outline-offset: 2px; }
        @media (prefers-reduced-motion: reduce) { * { transition: none !important; } }
      `}</style>

      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 4 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 9 }}>
            <Compass size={19} color="#E8A33D" />
            <span className="mono" style={{ fontSize: 11, letterSpacing: 3, color: "#7FB3D9" }}>
              MVP BLUEPRINT
            </span>
          </div>
          <button
            onClick={reset}
            style={{ background: "none", border: "none", cursor: "pointer", display: "flex", alignItems: "center", gap: 5, color: "#5C6B76" }}
          >
            <RotateCcw size={13} />
            <span style={{ fontSize: 12 }}>Start over</span>
          </button>
        </div>
        <h1 className="serif" style={{ fontSize: 30, fontWeight: 700, margin: "8px 0 24px" }}>
          Draft your minimum viable product
        </h1>

        <div style={{ border: "1px solid #274863", borderRadius: 10, padding: "20px 22px", marginBottom: 20, background: "rgba(15,39,64,0.5)" }}>
          <Field label="THE IDEA" placeholder="One sentence: what are you building?" value={plan.idea} onChange={setField("idea")} />
          <Field label="TARGET CUSTOMER" placeholder="Who feels this problem most acutely?" value={plan.customer} onChange={setField("customer")} />
          <Field label="THE PROBLEM" hint="be specific" placeholder="What's broken or missing for them today?" value={plan.problem} onChange={setField("problem")} area />
          <Field label="SUCCESS METRIC" hint="how you'll know the MVP worked" placeholder="e.g. 20 signups convert to a paid pilot" value={plan.metric} onChange={setField("metric")} />
        </div>

        <div style={{ border: "1px solid #274863", borderRadius: 10, padding: "20px 22px", marginBottom: 20, background: "rgba(15,39,64,0.5)" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
            <Layers size={16} color="#E8A33D" />
