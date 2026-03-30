import { w as writable, d as derived } from "./index.js";
const STORAGE_KEY = "1t3r_investigations";
function loadFromStorage() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}
function saveToStorage(data) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch {
  }
}
const investigations = writable(typeof window !== "undefined" ? loadFromStorage() : {});
investigations.subscribe(saveToStorage);
const STATUS = {
  new: { label: "Nouveau", color: "bg-blue-500/20 text-blue-400 border-blue-500/30", icon: "🔵" },
  investigating: { label: "En cours", color: "bg-amber-500/20 text-amber-400 border-amber-500/30", icon: "🔍" },
  resolved: { label: "Résolu", color: "bg-green-500/20 text-green-400 border-green-500/30", icon: "✅" },
  false_positive: { label: "Faux positif", color: "bg-gray-500/20 text-gray-400 border-gray-500/30", icon: "⬜" },
  escalated: { label: "Escaladé", color: "bg-red-500/20 text-red-400 border-red-500/30", icon: "🚨" }
};
const PRIORITY = {
  critical: { label: "Critique", color: "text-red-400", bg: "bg-red-500/20", border: "border-red-500/30" },
  high: { label: "Haute", color: "text-orange-400", bg: "bg-orange-500/20", border: "border-orange-500/30" },
  medium: { label: "Moyenne", color: "text-amber-400", bg: "bg-amber-500/20", border: "border-amber-500/30" },
  low: { label: "Faible", color: "text-blue-400", bg: "bg-blue-500/20", border: "border-blue-500/30" }
};
const investigationStats = derived(investigations, ($inv) => {
  const all = Object.values($inv);
  const now = Date.now();
  return {
    total: all.length,
    new: all.filter((i) => i.status === "new").length,
    inProgress: all.filter((i) => i.status === "investigating").length,
    resolved: all.filter((i) => i.status === "resolved").length,
    escalated: all.filter((i) => i.status === "escalated").length,
    overdue: all.filter((i) => {
      if (i.status === "resolved" || i.status === "false_positive") return false;
      const deadline = new Date(i.createdAt).getTime() + i.slaDurationH * 36e5;
      return now > deadline;
    }).length,
    avgResolutionH: (() => {
      const resolved = all.filter((i) => i.resolvedAt);
      if (!resolved.length) return null;
      const avg = resolved.reduce((s, i) => {
        return s + (new Date(i.resolvedAt) - new Date(i.createdAt)) / 36e5;
      }, 0) / resolved.length;
      return Math.round(avg * 10) / 10;
    })()
  };
});
function getSLAStatus(inv) {
  if (inv.status === "resolved" || inv.status === "false_positive") return "ok";
  const deadline = new Date(inv.createdAt).getTime() + inv.slaDurationH * 36e5;
  const now = Date.now();
  const remaining = deadline - now;
  if (remaining < 0) return "overdue";
  if (remaining < inv.slaDurationH * 36e5 * 0.25) return "warning";
  return "ok";
}
function getSLARemaining(inv) {
  const deadline = new Date(inv.createdAt).getTime() + inv.slaDurationH * 36e5;
  const diff = deadline - Date.now();
  if (diff <= 0) return "Dépassé";
  const h = Math.floor(diff / 36e5);
  const m = Math.floor(diff % 36e5 / 6e4);
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
export {
  PRIORITY as P,
  STATUS as S,
  getSLARemaining as a,
  investigationStats as b,
  getSLAStatus as g,
  investigations as i
};
