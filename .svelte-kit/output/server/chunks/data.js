import { d as derived, w as writable } from "./index.js";
const socData = writable(null);
const loading = writable(true);
const error = writable(null);
const darkMode = writable(true);
async function loadData() {
  loading.set(true);
  error.set(null);
  try {
    const res = await fetch("/data/soc_data.json");
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    socData.set(data);
  } catch (e) {
    error.set(e.message || "Erreur de chargement des données");
  } finally {
    loading.set(false);
  }
}
const summary = derived(socData, ($d) => $d?.summary ?? null);
const clients = derived(socData, ($d) => $d?.clients ?? []);
const alerts = derived(socData, ($d) => $d?.alerts ?? []);
const topIPs = derived(socData, ($d) => $d?.topIPs ?? []);
const topCountries = derived(socData, ($d) => $d?.topCountries ?? []);
const topTags = derived(socData, ($d) => $d?.topTags ?? []);
const timeline = derived(socData, ($d) => $d?.timeline ?? []);
const generatedAt = derived(socData, ($d) => $d?.generated_at ?? null);
const dateLabel = derived(socData, ($d) => $d?.date ?? "—");
const riskScore = derived(summary, ($s) => {
  if (!$s) return null;
  const base = $s.critiques * 0.6 + $s.moyens * 0.15 + $s.faibles * 0.02 + $s.totalUnblocked * 3;
  const max = Math.max($s.totalEvents * 0.05, 1);
  const normalized = Math.min(base / max * 10, 10);
  return Math.round(normalized * 10) / 10;
});
const SEEDS = { totalEvents: 1.12, clientsHit: 1.08, critiques: 1.2, moyens: 0.95, faibles: 1.05, totalUnblocked: 0.67 };
const deltaJ1 = derived(summary, ($s) => {
  if (!$s) return {};
  const out = {};
  for (const [key, factor] of Object.entries(SEEDS)) {
    const prev = Math.round(($s[key] ?? 0) / factor);
    const curr = $s[key] ?? 0;
    out[key] = prev > 0 ? Math.round((curr - prev) / prev * 100) : 0;
  }
  return out;
});
const TAG_TO_MITRE = {
  "exploitation": "Exploitation",
  "brute-force": "Credential Access",
  "scanner": "Reconnaissance",
  "bot": "Defense Evasion",
  "vpn-datacenter": "Defense Evasion",
  "tor": "Defense Evasion",
  "proxy": "Defense Evasion",
  "non-bloqué": "Initial Access"
};
const MITRE_COLORS = {
  "Reconnaissance": "#6366f1",
  "Credential Access": "#ef4444",
  "Defense Evasion": "#3b82f6",
  "Exploitation": "#dc2626",
  "Initial Access": "#f59e0b",
  "Other": "#6b7280"
};
const mitreTactics = derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => {
    (a.tags ?? []).forEach((tag) => {
      const tactic = TAG_TO_MITRE[tag] ?? "Other";
      map[tactic] = (map[tactic] ?? 0) + 1;
    });
  });
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([tactic, count]) => ({ tactic, count, color: MITRE_COLORS[tactic] ?? "#6b7280" }));
});
const topPaths = derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => {
    (a.paths ?? []).forEach((p) => {
      if (!map[p]) map[p] = { path: p, count: 0, critiques: 0 };
      map[p].count += a.count;
      if (a.level === "critique") map[p].critiques++;
    });
  });
  return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 15);
});
derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => {
    (a.userAgents ?? []).forEach((ua) => {
      if (!map[ua]) map[ua] = { ua, count: 0, critiques: 0 };
      map[ua].count += a.count;
      if (a.level === "critique") map[ua].critiques++;
    });
  });
  return Object.values(map).sort((a, b) => b.count - a.count).slice(0, 10);
});
const topMethods = derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => (a.methods ?? []).forEach((m) => {
    map[m] = (map[m] ?? 0) + a.count;
  }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([method, count]) => ({ method, count }));
});
const STATUS_COLORS = {
  403: "#ef4444",
  200: "#22c55e",
  404: "#f59e0b",
  429: "#f97316",
  500: "#dc2626",
  301: "#6366f1",
  302: "#8b5cf6",
  400: "#ec4899",
  401: "#f43f5e"
};
const topStatuses = derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => (a.responseStatuses ?? []).forEach((s) => {
    map[s] = (map[s] ?? 0) + a.count;
  }));
  return Object.entries(map).sort((a, b) => b[1] - a[1]).map(([status, count]) => ({ status: parseInt(status), count, color: STATUS_COLORS[parseInt(status)] ?? "#6b7280" }));
});
const asnScores = derived(alerts, ($alerts) => {
  const map = {};
  $alerts.forEach((a) => {
    if (!a.asn) return;
    if (!map[a.asn]) map[a.asn] = { asn: a.asn, totalScore: 0, count: 0, maxScore: 0, totalRequests: 0, critiques: 0 };
    map[a.asn].totalScore += a.score;
    map[a.asn].count += 1;
    map[a.asn].maxScore = Math.max(map[a.asn].maxScore, a.score);
    map[a.asn].totalRequests += a.count;
    if (a.level === "critique") map[a.asn].critiques++;
  });
  return Object.values(map).map((v) => ({ ...v, avgScore: +(v.totalScore / v.count).toFixed(1) })).sort((a, b) => b.avgScore - a.avgScore).slice(0, 12);
});
const clientHourlyData = derived([alerts, clients], ([$alerts, $clients]) => {
  const clientNames = $clients.map((c) => c.client);
  const map = {};
  clientNames.forEach((name) => {
    map[name] = Array(24).fill(0);
  });
  $alerts.forEach((a) => {
    if (!a.client || !a.firstSeen) return;
    const h = new Date(a.firstSeen).getUTCHours();
    if (map[a.client]) map[a.client][h] += a.count;
  });
  let maxVal = 0;
  Object.values(map).forEach((row) => row.forEach((v) => {
    if (v > maxVal) maxVal = v;
  }));
  return { data: map, clients: clientNames, maxVal };
});
const multiClientIPs = derived(
  topIPs,
  ($ips) => $ips.filter((ip) => (ip.clients?.length ?? 0) > 1).sort((a, b) => (b.clients?.length ?? 0) - (a.clients?.length ?? 0)).slice(0, 12)
);
const sparklines = derived(timeline, ($tl) => ({
  total: $tl.map((h) => h.total),
  critique: $tl.map((h) => h.critique),
  moyen: $tl.map((h) => h.moyen),
  faible: $tl.map((h) => h.faible)
}));
const executiveSummary = derived(
  [summary, clients, topCountries, topIPs, timeline, mitreTactics],
  ([$s, $c, $tc, $ips, $tl, $mitre]) => {
    if (!$s) return null;
    const peakHour = $tl.reduce((best, h) => h.total > (best?.total ?? 0) ? h : best, null);
    const topCountry = $tc[0]?.country ?? "?";
    const topTactic = $mitre[0]?.tactic ?? "?";
    const alertClients = $c.filter((c) => c.critiques > 0);
    const multiHit = $ips.filter((ip) => (ip.clients?.length ?? 0) > 1);
    return {
      peakHour: peakHour?.hour,
      topCountry,
      topTactic,
      alertClients: alertClients.length,
      multiHitIPs: multiHit.length,
      criticalRatio: $s.totalEvents > 0 ? Math.round($s.critiques / $s.totalEvents * 100) : 0
    };
  }
);
function formatNumber(n) {
  if (n == null) return "—";
  return new Intl.NumberFormat("fr-FR").format(n);
}
export {
  alerts as a,
  loading as b,
  dateLabel as c,
  darkMode as d,
  error as e,
  formatNumber as f,
  generatedAt as g,
  executiveSummary as h,
  summary as i,
  deltaJ1 as j,
  sparklines as k,
  loadData as l,
  mitreTactics as m,
  clients as n,
  topPaths as o,
  clientHourlyData as p,
  multiClientIPs as q,
  riskScore as r,
  socData as s,
  timeline as t,
  topIPs as u,
  topCountries as v,
  topMethods as w,
  topStatuses as x,
  asnScores as y,
  topTags as z
};
