import { f as fallback, e as ensure_array_like, a as attr_class, c as escape_html, b as stringify, j as attr_style, h as bind_props, s as store_get, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { u as topIPs, w as topMethods, x as topStatuses, d as darkMode, y as asnScores, z as topTags, v as topCountries } from "../../../chunks/data.js";
import { L as LevelBadge } from "../../../chunks/LevelBadge.js";
import { T as TagBadge } from "../../../chunks/TagBadge.js";
import { D as DonutChart } from "../../../chunks/DonutChart.js";
import { o as onDestroy } from "../../../chunks/index-server.js";
function AsnScoreChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let maxRequests;
    let data = fallback($$props["data"], () => [], true);
    let darkMode2 = fallback($$props["darkMode"], true);
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    const scoreColor = (score) => {
      if (score >= 8) return {
        bg: "bg-red-500/20",
        text: "text-red-400",
        bar: "#ef4444",
        border: "border-red-500/30"
      };
      if (score >= 5) return {
        bg: "bg-amber-500/20",
        text: "text-amber-400",
        bar: "#f59e0b",
        border: "border-amber-500/30"
      };
      return {
        bg: "bg-orange-500/20",
        text: "text-orange-400",
        bar: "#f97316",
        border: "border-orange-500/30"
      };
    };
    maxRequests = Math.max(...data.map((d) => d.totalRequests), 1);
    $$renderer2.push(`<div class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(data);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let asn = each_array[i];
      const c = scoreColor(asn.avgScore);
      const pct = Math.round(asn.totalRequests / maxRequests * 100);
      $$renderer2.push(`<div${attr_class(`${stringify(darkMode2 ? "bg-[#22263a]" : "bg-slate-50")} rounded-lg p-2.5 hover:${stringify(darkMode2 ? "bg-[#2a2d3a]" : "bg-slate-100")} transition-colors`)}><div class="flex items-center justify-between mb-1.5"><div class="flex items-center gap-2"><span${attr_class(`text-xs ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} w-4 text-right`)}>${escape_html(i + 1)}</span> <code${attr_class(`text-xs font-mono font-bold ${stringify(darkMode2 ? "text-gray-200" : "text-gray-700")}`)}>${escape_html(asn.asn)}</code> `);
      if (asn.critiques > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded px-1.5 py-px font-bold">${escape_html(asn.critiques)} critique${escape_html(asn.critiques > 1 ? "s" : "")}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-3 text-xs"><span${attr_class(darkMode2 ? "text-gray-500" : "text-gray-400")}>${escape_html(asn.count)} alerte${escape_html(asn.count > 1 ? "s" : "")}</span> <span${attr_class(`font-mono ${stringify(darkMode2 ? "text-gray-300" : "text-gray-600")}`)}>${escape_html(fmt(asn.totalRequests))} req.</span> <span${attr_class(`font-bold ${stringify(c.text)} border ${stringify(c.border)} ${stringify(c.bg)} rounded px-1.5 py-px`)}>⌀ ${escape_html(asn.avgScore)}</span></div></div> <div${attr_class(`h-1.5 ${stringify(darkMode2 ? "bg-[#1a1d27]" : "bg-slate-200")} rounded-full overflow-hidden`)}><div class="h-full rounded-full transition-all duration-500"${attr_style(`width:${stringify(pct)}%;background:${stringify(c.bar)}99`)}></div></div> <div class="flex items-center gap-0.5 mt-1.5"><!--[-->`);
      const each_array_1 = ensure_array_like(Array(10));
      for (let j = 0, $$length2 = each_array_1.length; j < $$length2; j++) {
        each_array_1[j];
        $$renderer2.push(`<div${attr_class(`h-1 flex-1 rounded-sm ${stringify(j < asn.maxScore ? j >= 7 ? "bg-red-500" : j >= 4 ? "bg-amber-500" : "bg-orange-500" : darkMode2 ? "bg-[#1a1d27]" : "bg-slate-200")}`)}></div>`);
      }
      $$renderer2.push(`<!--]--> <span${attr_class(`ml-2 text-[10px] ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")}`)}>max ${escape_html(asn.maxScore)}/10</span></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!data.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-8 ${stringify(darkMode2 ? "text-gray-500" : "text-gray-400")} text-sm`)}>Aucune donnée ASN</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, darkMode: darkMode2 });
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let sortedIPs, methodDonut, statusDonut;
    const flagMap = {
      "RU": "🇷🇺",
      "CN": "🇨🇳",
      "US": "🇺🇸",
      "DE": "🇩🇪",
      "FR": "🇫🇷",
      "BR": "🇧🇷",
      "IN": "🇮🇳",
      "NL": "🇳🇱",
      "UA": "🇺🇦",
      "GB": "🇬🇧",
      "KR": "🇰🇷",
      "JP": "🇯🇵",
      "SG": "🇸🇬",
      "CA": "🇨🇦",
      "TR": "🇹🇷",
      "ID": "🇮🇩",
      "VN": "🇻🇳",
      "MA": "🇲🇦",
      "SN": "🇸🇳",
      "NG": "🇳🇬",
      "CI": "🇨🇮",
      "CM": "🇨🇲",
      "TN": "🇹🇳",
      "DZ": "🇩🇿",
      "EG": "🇪🇬",
      "ZA": "🇿🇦"
    };
    function flag(cc) {
      return flagMap[cc] ?? "🏳️";
    }
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    let ipSortCol = "score";
    let ipSortDir = -1;
    function sortIcon(col) {
      if (ipSortCol !== col) return "↕";
      return "↓";
    }
    const METHOD_COLORS = {
      "GET": "#6366f1",
      "POST": "#f59e0b",
      "HEAD": "#3b82f6",
      "PUT": "#f97316",
      "DELETE": "#ef4444",
      "OPTIONS": "#22c55e",
      "PATCH": "#8b5cf6",
      "CONNECT": "#ec4899"
    };
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
    onDestroy(() => {
    });
    sortedIPs = [...store_get($$store_subs ??= {}, "$topIPs", topIPs)].sort((a, b) => {
      let va = a[ipSortCol], vb = b[ipSortCol];
      if (typeof va === "string") {
        va = va.toLowerCase();
        vb = vb?.toLowerCase() ?? "";
      }
      return ipSortDir * (va > vb ? 1 : va < vb ? -1 : 0);
    });
    methodDonut = store_get($$store_subs ??= {}, "$topMethods", topMethods).map((m) => ({
      label: m.method,
      value: m.count,
      color: METHOD_COLORS[m.method] ?? "#6b7280"
    }));
    statusDonut = store_get($$store_subs ??= {}, "$topStatuses", topStatuses).map((s) => ({
      label: `HTTP ${s.status}`,
      value: s.count,
      color: STATUS_COLORS[s.status] ?? "#6b7280"
    }));
    $$renderer2.push(`<div class="p-5 space-y-5"><div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Distribution méthodes HTTP</h2> <div class="flex gap-6 items-start justify-center">`);
    DonutChart($$renderer2, {
      data: methodDonut,
      size: 160,
      showLegend: true,
      centerLabel: String(methodDonut.reduce((s, d) => s + d.value, 0))
    });
    $$renderer2.push(`<!----></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Statuts de réponse HTTP</h2> <div class="flex gap-6 items-start justify-center">`);
    DonutChart($$renderer2, {
      data: statusDonut,
      size: 160,
      showLegend: true,
      centerLabel: String(statusDonut.reduce((s, d) => s + d.value, 0))
    });
    $$renderer2.push(`<!----></div></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><div class="flex items-center justify-between mb-4"><h2${attr_class(`text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Score de menace par ASN</h2> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>Score moyen · max · volume de requêtes</span></div> `);
    AsnScoreChart($$renderer2, {
      data: store_get($$store_subs ??= {}, "$asnScores", asnScores),
      darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
    });
    $$renderer2.push(`<!----></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl overflow-hidden`)}><div${attr_class(`p-4 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} flex items-center justify-between`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Top IPs — Analyse complète</h2> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>${escape_html(store_get($$store_subs ??= {}, "$topIPs", topIPs).length)} adresses</span></div> <div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr${attr_class(`border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#22263a]" : "border-slate-200 bg-slate-50")}`)}><!--[-->`);
    const each_array = ensure_array_like([
      { key: "ip", label: "Adresse IP" },
      { key: "level", label: "Niveau" },
      { key: "score", label: "Score" },
      { key: "count", label: "Requêtes" },
      { key: "country", label: "Pays" },
      { key: "asn", label: "ASN" },
      { key: "clients", label: "Clients touchés" },
      { key: "tags", label: "Tags" }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let col = each_array[$$index];
      $$renderer2.push(`<th${attr_class(`text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`)}>${escape_html(col.label)} <span class="opacity-50">${escape_html(sortIcon(col.key))}</span></th>`);
    }
    $$renderer2.push(`<!--]--></tr></thead><tbody><!--[-->`);
    const each_array_1 = ensure_array_like(sortedIPs);
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let ip = each_array_1[$$index_2];
      $$renderer2.push(`<tr${attr_class(`border-b transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] hover:bg-[#22263a]" : "border-slate-100 hover:bg-slate-50")}`)}><td class="px-3 py-3"><code${attr_class(`text-sm font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-700")}`)}>${escape_html(ip.ip)}</code></td><td class="px-3 py-3">`);
      LevelBadge($$renderer2, { level: ip.level });
      $$renderer2.push(`<!----></td><td class="px-3 py-3"><div class="flex items-center gap-2"><div${attr_class(`w-16 h-2 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a]" : "bg-slate-200")} rounded-full overflow-hidden`)}><div${attr_class(`h-full rounded-full ${stringify(ip.score >= 8 ? "bg-red-500" : ip.score >= 5 ? "bg-amber-500" : "bg-orange-500")}`)}${attr_style(`width:${stringify(ip.score / 10 * 100)}%`)}></div></div> <span${attr_class(`font-bold text-sm ${stringify(ip.score >= 8 ? "text-red-400" : ip.score >= 5 ? "text-amber-400" : "text-orange-400")}`)}>${escape_html(ip.score)}/10</span></div></td><td${attr_class(`px-3 py-3 font-mono text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(fmt(ip.count))}</td><td${attr_class(`px-3 py-3 text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")} whitespace-nowrap`)}>${escape_html(flag(ip.country))} ${escape_html(ip.country)}</td><td class="px-3 py-3"><code${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")}`)}>${escape_html(ip.asn)}</code></td><td class="px-3 py-3">`);
      if (ip.clients?.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-bold">${escape_html(ip.clients.length)} clients</span> <div${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} mt-0.5`)}>${escape_html(ip.clients.slice(0, 2).join(", "))}${escape_html(ip.clients.length > 2 ? "..." : "")}</div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")}`)}>${escape_html(ip.clients?.[0] ?? "—")}</span>`);
      }
      $$renderer2.push(`<!--]--></td><td class="px-3 py-3"><div class="flex flex-wrap gap-1"><!--[-->`);
      const each_array_2 = ensure_array_like((ip.tags ?? []).slice(0, 3));
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let tag = each_array_2[$$index_1];
        TagBadge($$renderer2, { tag });
      }
      $$renderer2.push(`<!--]--></div></td></tr>`);
    }
    $$renderer2.push(`<!--]--></tbody></table></div></div> <div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Distribution des tags de menace</h2> <div class="h-64 relative"><canvas></canvas> `);
    if (!store_get($$store_subs ??= {}, "$topTags", topTags).length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucune donnée</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Volume d'attaques par pays</h2> <div class="h-64 relative"><canvas></canvas> `);
    if (!store_get($$store_subs ??= {}, "$topCountries", topCountries).length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucune donnée</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl overflow-hidden`)}><div${attr_class(`p-4 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} flex items-center justify-between`)}><h2${attr_class(`text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")}`)}>Données brutes JSON</h2> <div class="flex gap-2"><button${attr_class(`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>${escape_html("Afficher")} JSON</button> <button class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Exporter JSON</button></div></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
