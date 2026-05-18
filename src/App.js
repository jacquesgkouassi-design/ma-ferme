import { useState } from "react";

const theme = {
  bg: "#0f1a0e",
  bgCard: "#162314",
  bgCardLight: "#1e2f1c",
  accent: "#7ec850",
  accentDark: "#5a9e35",
  accentMuted: "#3d6b28",
  text: "#e8f0e5",
  textMuted: "#8aaa80",
  danger: "#e05c5c",
  warning: "#e0a84a",
  info: "#4ab8e0",
  border: "#2a3d28",
};

const initialAnimaux = [
  { id: 1, nom: "Rosalie", type: "Truie", age: 24, poids: 180, sante: "Bonne", portee: 3, dateNaissance: "2024-05-10" },
  { id: 2, nom: "Brutus", type: "Verrat", age: 36, poids: 280, sante: "Excellente", portee: null, dateNaissance: "2023-05-18" },
  { id: 3, nom: "Petite", type: "Porcelet", age: 2, poids: 8, sante: "Bonne", portee: null, dateNaissance: "2026-03-14" },
  { id: 4, nom: "Loulou", type: "Truie", age: 18, poids: 160, sante: "À surveiller", portee: 1, dateNaissance: "2024-11-18" },
  { id: 5, nom: "Gros-Dos", type: "Porc", age: 8, poids: 90, sante: "Bonne", portee: null, dateNaissance: "2025-09-18" },
];

const initialVentes = [
  { id: 1, date: "2026-05-10", animal: "Porc engraissé", poids: 110, prixKg: 2.5, total: 275, acheteur: "Boucherie Martin" },
  { id: 2, date: "2026-04-22", animal: "2 porcelets", poids: 20, prixKg: 5, total: 100, acheteur: "Ferme Dupont" },
  { id: 3, date: "2026-03-15", animal: "Porc engraissé", poids: 105, prixKg: 2.5, total: 262.5, acheteur: "Particulier" },
];

const initialPortees = [
  { id: 1, truie: "Rosalie", verrat: "Brutus", dateAccouplement: "2026-02-10", dateMiseBA: "2026-06-05", nbPortelets: 10, statut: "En gestation" },
  { id: 2, truie: "Loulou", verrat: "Brutus", dateAccouplement: "2025-12-01", dateMiseBA: "2026-03-26", nbPortelets: 8, statut: "Sevrée" },
];

const initialAlimentation = [
  { id: 1, date: "2026-05-18", type: "Aliment croissance", quantite: 50, cout: 35, animaux: "Porcelets (lot A)" },
  { id: 2, date: "2026-05-17", type: "Aliment gestation", quantite: 30, cout: 24, animaux: "Truies gestantes" },
  { id: 3, date: "2026-05-16", type: "Aliment engraissement", quantite: 80, cout: 52, animaux: "Porcs lot B" },
];

function Icon({ name, size = 20 }) {
  const icons = {
    pig: "🐷", money: "💰", food: "🌽", heart: "❤️", add: "＋",
    back: "←", calendar: "📅", weight: "⚖️", alert: "⚠️",
    check: "✓", birth: "🐣", stats: "📊", home: "🏠", edit: "✏️",
    trash: "🗑️", leaf: "🌿", tag: "🏷️"
  };
  return <span style={{ fontSize: size }}>{icons[name] || "•"}</span>;
}

function Badge({ label, color }) {
  const colors = {
    "Bonne": theme.accent,
    "Excellente": "#4ae09e",
    "À surveiller": theme.warning,
    "Malade": theme.danger,
    "En gestation": theme.info,
    "Sevrée": theme.textMuted,
    "Allaitante": "#e04ab8",
  };
  const c = colors[label] || color || theme.textMuted;
  return (
    <span style={{
      background: c + "22", color: c, border: `1px solid ${c}55`,
      borderRadius: 20, padding: "2px 10px", fontSize: 11, fontWeight: 700,
      letterSpacing: 0.5
    }}>{label}</span>
  );
}

function Card({ children, style = {}, onClick }) {
  return (
    <div onClick={onClick} style={{
      background: theme.bgCard, border: `1px solid ${theme.border}`,
      borderRadius: 16, padding: "16px", marginBottom: 12,
      cursor: onClick ? "pointer" : "default",
      transition: "transform 0.15s, box-shadow 0.15s",
      ...style
    }}
      onMouseEnter={e => { if (onClick) { e.currentTarget.style.transform = "scale(1.01)"; e.currentTarget.style.boxShadow = `0 4px 24px ${theme.accent}22`; } }}
      onMouseLeave={e => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = ""; }}
    >
      {children}
    </div>
  );
}

function StatBox({ icon, label, value, sub, color }) {
  return (
    <div style={{
      background: theme.bgCardLight, border: `1px solid ${theme.border}`,
      borderRadius: 14, padding: "14px 10px", textAlign: "center", flex: 1,
    }}>
      <div style={{ fontSize: 26, marginBottom: 4 }}>{icon}</div>
      <div style={{ color: color || theme.accent, fontWeight: 800, fontSize: 22 }}>{value}</div>
      <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{label}</div>
      {sub && <div style={{ color: theme.textMuted, fontSize: 10, marginTop: 2 }}>{sub}</div>}
    </div>
  );
}

// ─── TABS ───────────────────────────────────────────────────────────────────

function TabBar({ active, setActive }) {
  const tabs = [
    { id: "home", icon: "🏠", label: "Accueil" },
    { id: "animaux", icon: "🐷", label: "Animaux" },
    { id: "reproduction", icon: "🐣", label: "Repro" },
    { id: "alimentation", icon: "🌽", label: "Aliment." },
    { id: "ventes", icon: "💰", label: "Ventes" },
  ];
  return (
    <div style={{
      display: "flex", justifyContent: "space-around", alignItems: "center",
      background: theme.bgCard, borderTop: `1px solid ${theme.border}`,
      padding: "8px 0 4px", position: "fixed", bottom: 0, left: 0, right: 0,
      maxWidth: 430, margin: "0 auto", zIndex: 100,
    }}>
      {tabs.map(t => (
        <button key={t.id} onClick={() => setActive(t.id)} style={{
          background: "none", border: "none", cursor: "pointer",
          display: "flex", flexDirection: "column", alignItems: "center",
          padding: "4px 8px", gap: 2,
          color: active === t.id ? theme.accent : theme.textMuted,
          transition: "color 0.2s",
        }}>
          <span style={{ fontSize: 20 }}>{t.icon}</span>
          <span style={{ fontSize: 9, fontWeight: active === t.id ? 700 : 400 }}>{t.label}</span>
          {active === t.id && <div style={{ width: 4, height: 4, borderRadius: "50%", background: theme.accent }} />}
        </button>
      ))}
    </div>
  );
}

// ─── HOME ────────────────────────────────────────────────────────────────────

function HomeScreen({ animaux, ventes, portees, alimentation }) {
  const totalAnimaux = animaux.length;
  const gestantes = portees.filter(p => p.statut === "En gestation").length;
  const alertes = animaux.filter(a => a.sante === "À surveiller" || a.sante === "Malade");
  const revenusMois = ventes.filter(v => v.date.startsWith("2026-05")).reduce((s, v) => s + v.total, 0);

  return (
    <div>
      {/* Header */}
      <div style={{
        background: `linear-gradient(135deg, ${theme.accentDark}33, ${theme.bgCard})`,
        borderRadius: 20, padding: "20px", marginBottom: 16,
        border: `1px solid ${theme.accentMuted}55`,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 36 }}>🐷</span>
          <div>
            <div style={{ color: theme.accent, fontWeight: 900, fontSize: 22, letterSpacing: -0.5 }}>Ma Ferme</div>
            <div style={{ color: theme.textMuted, fontSize: 12 }}>Lundi 18 mai 2026</div>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox icon="🐷" label="Animaux" value={totalAnimaux} />
        <StatBox icon="🐣" label="En gestation" value={gestantes} color={theme.info} />
        <StatBox icon="💰" label="Ce mois" value={`${revenusMois}F CFA`} color="#4ae09e" />
      </div>

      {/* Alertes */}
      {alertes.length > 0 && (
        <Card style={{ border: `1px solid ${theme.warning}55`, background: theme.warning + "11" }}>
          <div style={{ color: theme.warning, fontWeight: 700, marginBottom: 8, display: "flex", alignItems: "center", gap: 6 }}>
            <span>⚠️</span> Alertes santé ({alertes.length})
          </div>
          {alertes.map(a => (
            <div key={a.id} style={{ color: theme.text, fontSize: 13, padding: "4px 0", borderBottom: `1px solid ${theme.border}` }}>
              <b>{a.nom}</b> — {a.sante}
            </div>
          ))}
        </Card>
      )}

      {/* Prochaines mises bas */}
      <div style={{ color: theme.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, marginTop: 4 }}>PROCHAINES MISES BAS</div>
      {portees.filter(p => p.statut === "En gestation").map(p => (
        <Card key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <span style={{ fontSize: 18 }}>🐣 </span>
              <span style={{ color: theme.text, fontWeight: 700 }}>{p.truie}</span>
              <span style={{ color: theme.textMuted, fontSize: 12 }}> × {p.verrat}</span>
            </div>
            <div style={{ color: theme.info, fontWeight: 700, fontSize: 13 }}>{p.dateMiseBA}</div>
          </div>
        </Card>
      ))}

      {/* Dernière alimentation */}
      <div style={{ color: theme.textMuted, fontSize: 11, fontWeight: 700, letterSpacing: 1, marginBottom: 8, marginTop: 8 }}>DERNIÈRE ALIMENTATION</div>
      {alimentation.slice(0, 2).map(a => (
        <Card key={a.id}>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <div>
              <div style={{ color: theme.text, fontWeight: 600 }}>{a.type}</div>
              <div style={{ color: theme.textMuted, fontSize: 11 }}>{a.animaux}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: theme.accent, fontWeight: 700 }}>{a.quantite} kg</div>
              <div style={{ color: theme.textMuted, fontSize: 11 }}>{a.cout}F CFA</div>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
}

// ─── ANIMAUX ─────────────────────────────────────────────────────────────────

function AnimauxScreen({ animaux, setAnimaux }) {
  const [selected, setSelected] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ nom: "", type: "Porc", age: "", poids: "", sante: "Bonne", dateNaissance: "" });
  const [filter, setFilter] = useState("Tous");

  const types = ["Tous", "Truie", "Verrat", "Porc", "Porcelet"];
  const filtered = filter === "Tous" ? animaux : animaux.filter(a => a.type === filter);

  const addAnimal = () => {
    if (!form.nom) return;
    setAnimaux([...animaux, { ...form, id: Date.now(), portee: null, age: Number(form.age), poids: Number(form.poids) }]);
    setForm({ nom: "", type: "Porc", age: "", poids: "", sante: "Bonne", dateNaissance: "" });
    setShowForm(false);
  };

  const deleteAnimal = (id) => {
    setAnimaux(animaux.filter(a => a.id !== id));
    setSelected(null);
  };

  if (selected) {
    const a = animaux.find(x => x.id === selected);
    return (
      <div>
        <button onClick={() => setSelected(null)} style={{ background: "none", border: "none", color: theme.accent, cursor: "pointer", fontSize: 16, marginBottom: 12 }}>← Retour</button>
        <Card>
          <div style={{ textAlign: "center", marginBottom: 16 }}>
            <div style={{ fontSize: 60 }}>{a.type === "Truie" ? "🐷" : a.type === "Verrat" ? "🐗" : a.type === "Porcelet" ? "🐽" : "🥩"}</div>
            <div style={{ color: theme.text, fontWeight: 900, fontSize: 24 }}>{a.nom}</div>
            <Badge label={a.sante} />
          </div>
          {[
            ["Type", a.type], ["Âge", `${a.age} mois`], ["Poids", `${a.poids} kg`],
            ["Naissance", a.dateNaissance], ["Portées", a.portee !== null ? a.portee : "—"]
          ].map(([k, v]) => (
            <div key={k} style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: `1px solid ${theme.border}` }}>
              <span style={{ color: theme.textMuted }}>{k}</span>
              <span style={{ color: theme.text, fontWeight: 600 }}>{v}</span>
            </div>
          ))}
          <button onClick={() => deleteAnimal(a.id)} style={{
            marginTop: 16, width: "100%", padding: "10px", borderRadius: 10,
            background: theme.danger + "22", color: theme.danger, border: `1px solid ${theme.danger}55`,
            cursor: "pointer", fontWeight: 700
          }}>🗑️ Supprimer</button>
        </Card>
      </div>
    );
  }

  return (
    <div>
      {/* Filter */}
      <div style={{ display: "flex", gap: 6, overflowX: "auto", marginBottom: 12, paddingBottom: 4 }}>
        {types.map(t => (
          <button key={t} onClick={() => setFilter(t)} style={{
            background: filter === t ? theme.accent : theme.bgCard,
            color: filter === t ? theme.bg : theme.textMuted,
            border: `1px solid ${filter === t ? theme.accent : theme.border}`,
            borderRadius: 20, padding: "5px 14px", cursor: "pointer", fontSize: 12,
            fontWeight: 700, whiteSpace: "nowrap"
          }}>{t}</button>
        ))}
      </div>

      {/* List */}
      {filtered.map(a => (
        <Card key={a.id} onClick={() => setSelected(a.id)}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 28 }}>{a.type === "Truie" ? "🐷" : a.type === "Verrat" ? "🐗" : a.type === "Porcelet" ? "🐽" : "🥩"}</span>
              <div>
                <div style={{ color: theme.text, fontWeight: 700 }}>{a.nom}</div>
                <div style={{ color: theme.textMuted, fontSize: 11 }}>{a.type} · {a.age} mois · {a.poids} kg</div>
              </div>
            </div>
            <Badge label={a.sante} />
          </div>
        </Card>
      ))}

      {/* Add form */}
      {showForm ? (
        <Card style={{ border: `1px solid ${theme.accent}55` }}>
          <div style={{ color: theme.accent, fontWeight: 700, marginBottom: 12 }}>Nouvel animal</div>
          {[
            ["Nom", "nom", "text"],
            ["Date de naissance", "dateNaissance", "date"],
            ["Poids (kg)", "poids", "number"],
            ["Âge (mois)", "age", "number"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>Type</label>
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
              style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14 }}>
              {["Truie", "Verrat", "Porc", "Porcelet"].map(t => <option key={t}>{t}</option>)}
            </select>
          </div>
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>Santé</label>
            <select value={form.sante} onChange={e => setForm({ ...form, sante: e.target.value })}
              style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14 }}>
              {["Excellente", "Bonne", "À surveiller", "Malade"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addAnimal} style={{ flex: 1, background: theme.accent, color: theme.bg, border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", fontWeight: 700 }}>Ajouter</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: theme.bgCardLight, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px", cursor: "pointer" }}>Annuler</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setShowForm(true)} style={{
          width: "100%", padding: "12px", borderRadius: 14, marginTop: 4,
          background: theme.accent + "22", color: theme.accent, border: `1px dashed ${theme.accent}88`,
          cursor: "pointer", fontWeight: 700, fontSize: 15
        }}>＋ Ajouter un animal</button>
      )}
    </div>
  );
}

// ─── REPRODUCTION ────────────────────────────────────────────────────────────

function ReproductionScreen({ portees, setPortees, animaux }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ truie: "", verrat: "", dateAccouplement: "", dateMiseBA: "", nbPortelets: "", statut: "En gestation" });

  const addPortee = () => {
    if (!form.truie || !form.verrat) return;
    setPortees([...portees, { ...form, id: Date.now(), nbPortelets: Number(form.nbPortelets) }]);
    setForm({ truie: "", verrat: "", dateAccouplement: "", dateMiseBA: "", nbPortelets: "", statut: "En gestation" });
    setShowForm(false);
  };

  const truies = animaux.filter(a => a.type === "Truie").map(a => a.nom);
  const verrats = animaux.filter(a => a.type === "Verrat").map(a => a.nom);

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox icon="🤰" label="En gestation" value={portees.filter(p => p.statut === "En gestation").length} color={theme.info} />
        <StatBox icon="🐣" label="Total portées" value={portees.length} />
        <StatBox icon="🐽" label="Nés total" value={portees.reduce((s, p) => s + (p.nbPortelets || 0), 0)} color="#4ae09e" />
      </div>

      {portees.map(p => (
        <Card key={p.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ color: theme.text, fontWeight: 700 }}>
                🐷 {p.truie} <span style={{ color: theme.textMuted }}>×</span> 🐗 {p.verrat}
              </div>
              <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 4 }}>
                Accouplement : {p.dateAccouplement}
              </div>
              <div style={{ color: theme.info, fontSize: 12, marginTop: 2 }}>
                Mise bas prévue : <b>{p.dateMiseBA}</b>
              </div>
              {p.nbPortelets > 0 && (
                <div style={{ color: theme.accent, fontSize: 12, marginTop: 2 }}>
                  🐽 {p.nbPortelets} porcelets
                </div>
              )}
            </div>
            <Badge label={p.statut} />
          </div>
        </Card>
      ))}

      {showForm ? (
        <Card style={{ border: `1px solid ${theme.info}55` }}>
          <div style={{ color: theme.info, fontWeight: 700, marginBottom: 12 }}>Nouvelle portée</div>
          {[
            ["Date accouplement", "dateAccouplement", "date"],
            ["Date mise bas prévue", "dateMiseBA", "date"],
            ["Nb porcelets nés", "nbPortelets", "number"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
          {[["Truie", "truie", truies], ["Verrat", "verrat", verrats]].map(([label, key, opts]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
              <select value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14 }}>
                <option value="">-- Sélectionner --</option>
                {opts.map(o => <option key={o}>{o}</option>)}
              </select>
            </div>
          ))}
          <div style={{ marginBottom: 10 }}>
            <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>Statut</label>
            <select value={form.statut} onChange={e => setForm({ ...form, statut: e.target.value })}
              style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14 }}>
              {["En gestation", "Allaitante", "Sevrée"].map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addPortee} style={{ flex: 1, background: theme.info, color: theme.bg, border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: theme.bgCardLight, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px", cursor: "pointer" }}>Annuler</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setShowForm(true)} style={{
          width: "100%", padding: "12px", borderRadius: 14, marginTop: 4,
          background: theme.info + "22", color: theme.info, border: `1px dashed ${theme.info}88`,
          cursor: "pointer", fontWeight: 700, fontSize: 15
        }}>＋ Enregistrer une portée</button>
      )}
    </div>
  );
}

// ─── ALIMENTATION ─────────────────────────────────────────────────────────────

function AlimentationScreen({ alimentation, setAlimentation }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", type: "", quantite: "", cout: "", animaux: "" });

  const totalKg = alimentation.reduce((s, a) => s + Number(a.quantite), 0);
  const totalCout = alimentation.reduce((s, a) => s + Number(a.cout), 0);

  const addAlim = () => {
    if (!form.type) return;
    setAlimentation([...alimentation, { ...form, id: Date.now(), quantite: Number(form.quantite), cout: Number(form.cout) }]);
    setForm({ date: "", type: "", quantite: "", cout: "", animaux: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox icon="🌽" label="Total kg" value={totalKg} />
        <StatBox icon="💸" label="Coût total" value={`${totalCout}F CFA`} color={theme.warning} />
        <StatBox icon="📋" label="Distributions" value={alimentation.length} />
      </div>

      {alimentation.map(a => (
        <Card key={a.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: theme.text, fontWeight: 700 }}>🌽 {a.type}</div>
              <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>{a.animaux}</div>
              <div style={{ color: theme.textMuted, fontSize: 11 }}>📅 {a.date}</div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ color: theme.accent, fontWeight: 800, fontSize: 18 }}>{a.quantite} <span style={{ fontSize: 11 }}>kg</span></div>
              <div style={{ color: theme.warning, fontSize: 12 }}>{a.cout}F CFA</div>
            </div>
          </div>
        </Card>
      ))}

      {showForm ? (
        <Card style={{ border: `1px solid ${theme.warning}55` }}>
          <div style={{ color: theme.warning, fontWeight: 700, marginBottom: 12 }}>Nouvelle distribution</div>
          {[
            ["Date", "date", "date"],
            ["Type d'aliment", "type", "text"],
            ["Quantité (kg)", "quantite", "number"],
            ["Coût (F CFA)", "cout", "number"],
            ["Animaux concernés", "animaux", "text"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addAlim} style={{ flex: 1, background: theme.warning, color: theme.bg, border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: theme.bgCardLight, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px", cursor: "pointer" }}>Annuler</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setShowForm(true)} style={{
          width: "100%", padding: "12px", borderRadius: 14, marginTop: 4,
          background: theme.warning + "22", color: theme.warning, border: `1px dashed ${theme.warning}88`,
          cursor: "pointer", fontWeight: 700, fontSize: 15
        }}>＋ Enregistrer une distribution</button>
      )}
    </div>
  );
}

// ─── VENTES ──────────────────────────────────────────────────────────────────

function VentesScreen({ ventes, setVentes }) {
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ date: "", animal: "", poids: "", prixKg: "", total: "", acheteur: "" });

  const totalRevenu = ventes.reduce((s, v) => s + Number(v.total), 0);
  const totalKg = ventes.reduce((s, v) => s + Number(v.poids), 0);

  const addVente = () => {
    if (!form.animal) return;
    const total = form.total || (Number(form.poids) * Number(form.prixKg)).toFixed(2);
    setVentes([...ventes, { ...form, id: Date.now(), poids: Number(form.poids), prixKg: Number(form.prixKg), total: Number(total) }]);
    setForm({ date: "", animal: "", poids: "", prixKg: "", total: "", acheteur: "" });
    setShowForm(false);
  };

  return (
    <div>
      <div style={{ display: "flex", gap: 8, marginBottom: 16 }}>
        <StatBox icon="💰" label="Revenus totaux" value={`${totalRevenu}F CFA`} color="#4ae09e" />
        <StatBox icon="⚖️" label="Kg vendus" value={totalKg} />
        <StatBox icon="📦" label="Ventes" value={ventes.length} />
      </div>

      {ventes.map(v => (
        <Card key={v.id}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ color: theme.text, fontWeight: 700 }}>🥩 {v.animal}</div>
              <div style={{ color: theme.textMuted, fontSize: 11, marginTop: 2 }}>🏷️ {v.acheteur}</div>
              <div style={{ color: theme.textMuted, fontSize: 11 }}>📅 {v.date} · {v.poids} kg · {v.prixKg}F CFA/kg</div>
            </div>
            <div style={{ color: "#4ae09e", fontWeight: 900, fontSize: 20 }}>{v.total}F CFA</div>
          </div>
        </Card>
      ))}

      {showForm ? (
        <Card style={{ border: `1px solid #4ae09e55` }}>
          <div style={{ color: "#4ae09e", fontWeight: 700, marginBottom: 12 }}>Nouvelle vente</div>
          {[
            ["Date", "date", "date"],
            ["Animal / Lot", "animal", "text"],
            ["Poids (kg)", "poids", "number"],
            ["Prix/kg (F CFA)", "prixKg", "number"],
            ["Total (F CFA)", "total", "number"],
            ["Acheteur", "acheteur", "text"],
          ].map(([label, key, type]) => (
            <div key={key} style={{ marginBottom: 10 }}>
              <label style={{ color: theme.textMuted, fontSize: 11, display: "block", marginBottom: 4 }}>{label}</label>
              <input type={type} value={form[key]} onChange={e => setForm({ ...form, [key]: e.target.value })}
                style={{ width: "100%", background: theme.bg, border: `1px solid ${theme.border}`, borderRadius: 8, padding: "8px 10px", color: theme.text, fontSize: 14, boxSizing: "border-box" }} />
            </div>
          ))}
          <div style={{ display: "flex", gap: 8 }}>
            <button onClick={addVente} style={{ flex: 1, background: "#4ae09e", color: theme.bg, border: "none", borderRadius: 10, padding: "10px", cursor: "pointer", fontWeight: 700 }}>Enregistrer</button>
            <button onClick={() => setShowForm(false)} style={{ flex: 1, background: theme.bgCardLight, color: theme.textMuted, border: `1px solid ${theme.border}`, borderRadius: 10, padding: "10px", cursor: "pointer" }}>Annuler</button>
          </div>
        </Card>
      ) : (
        <button onClick={() => setShowForm(true)} style={{
          width: "100%", padding: "12px", borderRadius: 14, marginTop: 4,
          background: "#4ae09e22", color: "#4ae09e", border: `1px dashed #4ae09e88`,
          cursor: "pointer", fontWeight: 700, fontSize: 15
        }}>＋ Enregistrer une vente</button>
      )}
    </div>
  );
}

// ─── APP ──────────────────────────────────────────────────────────────────────

export default function App() {
  const [tab, setTab] = useState("home");
  const [animaux, setAnimaux] = useState(initialAnimaux);
  const [portees, setPortees] = useState(initialPortees);
  const [alimentation, setAlimentation] = useState(initialAlimentation);
  const [ventes, setVentes] = useState(initialVentes);

  const titles = {
    home: "🐷 Ma Ferme", animaux: "🐷 Mes Animaux",
    reproduction: "🐣 Reproduction", alimentation: "🌽 Alimentation",
    ventes: "💰 Ventes"
  };

  return (
    <div style={{
      background: theme.bg, minHeight: "100vh",
      fontFamily: "'Georgia', serif",
      display: "flex", justifyContent: "center",
    }}>
      <div style={{ width: "100%", maxWidth: 430, minHeight: "100vh", position: "relative" }}>
        {/* Top bar */}
        <div style={{
          padding: "16px 20px 10px", background: theme.bg,
          borderBottom: `1px solid ${theme.border}`,
          position: "sticky", top: 0, zIndex: 50,
        }}>
          <div style={{ color: theme.accent, fontWeight: 900, fontSize: 18, letterSpacing: -0.5 }}>
            {titles[tab]}
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: "16px 16px 90px" }}>
          {tab === "home" && <HomeScreen animaux={animaux} ventes={ventes} portees={portees} alimentation={alimentation} />}
          {tab === "animaux" && <AnimauxScreen animaux={animaux} setAnimaux={setAnimaux} />}
          {tab === "reproduction" && <ReproductionScreen portees={portees} setPortees={setPortees} animaux={animaux} />}
          {tab === "alimentation" && <AlimentationScreen alimentation={alimentation} setAlimentation={setAlimentation} />}
          {tab === "ventes" && <VentesScreen ventes={ventes} setVentes={setVentes} />}
        </div>

        <TabBar active={tab} setActive={setTab} />
      </div>
    </div>
  );
}