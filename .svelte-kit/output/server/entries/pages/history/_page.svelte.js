import { s as store_get, a as attr_class, b as stringify, c as escape_html, e as ensure_array_like, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
import { d as derived, w as writable } from "../../../chunks/index.js";
import { d as darkMode } from "../../../chunks/data.js";
const historicalDays = writable([]);
const historyLoading = writable(false);
const trendData = derived(historicalDays, ($days) => {
  if (!$days.length) return null;
  return {
    labels: $days.map((d) => d._label),
    totalEvents: $days.map((d) => d.summary?.totalEvents ?? 0),
    critiques: $days.map((d) => d.summary?.critiques ?? 0),
    moyens: $days.map((d) => d.summary?.moyens ?? 0),
    faibles: $days.map((d) => d.summary?.faibles ?? 0),
    unblocked: $days.map((d) => d.summary?.totalUnblocked ?? 0),
    clientsHit: $days.map((d) => d.summary?.clientsHit ?? 0),
    riskScores: $days.map((d) => {
      const s = d.summary;
      if (!s) return 0;
      const base = s.critiques * 0.6 + s.moyens * 0.15 + s.faibles * 0.02 + (s.totalUnblocked ?? 0) * 3;
      const max = Math.max(s.totalEvents * 0.05, 1);
      return Math.round(Math.min(base / max * 10, 10) * 10) / 10;
    })
  };
});
const clientTrend = derived(historicalDays, ($days) => {
  if (!$days.length) return {};
  const clientMap = {};
  $days.forEach((day) => {
    (day.clients ?? []).forEach((c) => {
      if (!clientMap[c.client]) clientMap[c.client] = [];
      clientMap[c.client].push({
        date: day._label,
        totalEvents: c.totalEvents,
        critiques: c.critiques,
        unblocked: c.totalUnblocked ?? 0
      });
    });
  });
  return clientMap;
});
derived(historicalDays, ($days) => {
  const seenIPs = /* @__PURE__ */ new Set();
  return $days.map((day) => {
    const dayIPs = (day.topIPs ?? []).map((ip) => ip.ip);
    const newCount = dayIPs.filter((ip) => !seenIPs.has(ip)).length;
    dayIPs.forEach((ip) => seenIPs.add(ip));
    return { date: day._label, new: newCount, total: dayIPs.length };
  });
});
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let clientList, clientData;
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    let trendCanvas;
    let charts = [];
    onDestroy(() => charts.forEach((c) => c?.destroy()));
    let selectedClient = "";
    if (store_get($$store_subs ??= {}, "$trendData", trendData) && trendCanvas) ;
    clientList = Object.keys(store_get($$store_subs ??= {}, "$clientTrend", clientTrend)).sort();
    clientData = [];
    $$renderer2.push(`<div class="p-5 space-y-5"><div><h1${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Historique multi-jours</h1> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Tendances sur ${escape_html(store_get($$store_subs ??= {}, "$historicalDays", historicalDays).length)} jours — Impossible sur Cloudflare Free (rétention 24h)</p></div> `);
    if (store_get($$store_subs ??= {}, "$historyLoading", historyLoading)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center justify-center py-16"><div class="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div></div>`);
    } else if (!store_get($$store_subs ??= {}, "$historicalDays", historicalDays).length) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div${attr_class(`text-center py-16 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><p class="text-4xl mb-3">📅</p> <p class="font-semibold">Aucune donnée historique disponible</p> <p class="text-sm mt-1">Placez des fichiers <code>soc_data_YYYY-MM-DD.json</code> dans <code>/static/data/</code></p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-4 gap-3"><!--[-->`);
      const each_array = ensure_array_like([
        {
          label: "Jours analysés",
          value: store_get($$store_subs ??= {}, "$historicalDays", historicalDays).length,
          color: "text-indigo-400",
          icon: "📅"
        },
        {
          label: "Total événements",
          value: store_get($$store_subs ??= {}, "$trendData", trendData)?.totalEvents.reduce((s, v) => s + v, 0),
          color: "text-blue-400",
          icon: "📡"
        },
        {
          label: "Total critiques",
          value: store_get($$store_subs ??= {}, "$trendData", trendData)?.critiques.reduce((s, v) => s + v, 0),
          color: "text-red-400",
          icon: "🔴"
        },
        {
          label: "Pic journalier",
          value: Math.max(...store_get($$store_subs ??= {}, "$trendData", trendData)?.totalEvents ?? [0]),
          color: "text-amber-400",
          icon: "⚡"
        }
      ]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let s = each_array[$$index];
        $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><div class="flex items-center justify-between"><p class="text-xs text-gray-500 uppercase tracking-wider">${escape_html(s.label)}</p> <span>${escape_html(s.icon)}</span></div> <p${attr_class(`text-2xl font-bold mt-1 ${stringify(s.color)}`)}>${escape_html(fmt(s.value))}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-4`)}>Volume total &amp; clients touchés</p> <div class="h-52"><canvas></canvas></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-4`)}>Alertes par niveau</p> <div class="h-52"><canvas></canvas></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-4`)}>Évolution du score de risque global</p> <div class="h-52"><canvas></canvas></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-4`)}>Nouvelles IPs vs récurrentes</p> <div class="h-52"><canvas></canvas></div></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><div class="flex items-center justify-between mb-4"><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Évolution par client</p> `);
      $$renderer2.select(
        {
          value: selectedClient,
          class: `text-sm px-3 py-1.5 border rounded-lg focus:outline-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200" : "bg-slate-50 border-slate-200")}`
        },
        ($$renderer3) => {
          $$renderer3.option({ value: "" }, ($$renderer4) => {
            $$renderer4.push(`— Choisir un client —`);
          });
          $$renderer3.push(`<!--[-->`);
          const each_array_1 = ensure_array_like(clientList);
          for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
            let c = each_array_1[$$index_1];
            $$renderer3.option({ value: c }, ($$renderer4) => {
              $$renderer4.push(`${escape_html(c)}`);
            });
          }
          $$renderer3.push(`<!--]-->`);
        }
      );
      $$renderer2.push(`</div> `);
      if (clientData.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr${attr_class(`border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")}`)}><!--[-->`);
        const each_array_2 = ensure_array_like(["Date", "Total événements", "Critiques", "Non bloqués"]);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let h = each_array_2[$$index_2];
          $$renderer2.push(`<th${attr_class(`text-left px-3 py-2 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>${escape_html(h)}</th>`);
        }
        $$renderer2.push(`<!--]--></tr></thead><tbody><!--[-->`);
        const each_array_3 = ensure_array_like(clientData);
        for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
          let d = each_array_3[$$index_3];
          $$renderer2.push(`<tr${attr_class(`border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] hover:bg-[#22263a]" : "border-slate-100 hover:bg-slate-50")}`)}><td${attr_class(`px-3 py-2 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}>${escape_html(d.date)}</td><td${attr_class(`px-3 py-2 font-mono text-xs font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(fmt(d.totalEvents))}</td><td${attr_class(`px-3 py-2 text-xs font-bold ${stringify(d.critiques > 0 ? "text-red-400" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>${escape_html(d.critiques)}</td><td${attr_class(`px-3 py-2 text-xs font-bold ${stringify(d.unblocked > 0 ? "text-red-300" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(d.unblocked || "—")}</td></tr>`);
        }
        $$renderer2.push(`<!--]--></tbody></table></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<p${attr_class(`text-center py-6 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} text-sm`)}>Sélectionner un client ci-dessus</p>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
