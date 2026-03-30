import { s as store_get, a as attr_class, b as stringify, d as attr, e as ensure_array_like, c as escape_html, j as attr_style, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { a as alerts, d as darkMode } from "../../../chunks/data.js";
import "../../../chunks/ui.js";
import "../../../chunks/investigations.js";
import "../../../chunks/blacklist.js";
import { L as LevelBadge } from "../../../chunks/LevelBadge.js";
import { T as TagBadge } from "../../../chunks/TagBadge.js";
import "@sveltejs/kit/internal";
import "../../../chunks/exports.js";
import "../../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../../chunks/root.js";
import "../../../chunks/state.svelte.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let allClients, filtered, totalPages, paged, pageStart, pageEnd, activeFilters;
    let filterClient = "all";
    let filterLevel = "all";
    let filterTags = [];
    let filterUnblocked = false;
    let searchQuery = "";
    let sortCol = "score";
    let sortDir = -1;
    let currentPage = 1;
    const PAGE_SIZE = 25;
    let expandedRows = /* @__PURE__ */ new Set();
    const allTags = [
      "scanner",
      "bot",
      "exploitation",
      "vpn-datacenter",
      "brute-force",
      "tor",
      "proxy",
      "non-bloqué"
    ];
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
      "ZA": "🇿🇦",
      "KE": "🇰🇪",
      "GH": "🇬🇭",
      "ET": "🇪🇹",
      "TZ": "🇹🇿"
    };
    function flag(cc) {
      return flagMap[cc] ?? "🏳️";
    }
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    function formatDate(iso) {
      if (!iso) return "—";
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    function sortIcon(col) {
      if (sortCol !== col) return "↕";
      return "↓";
    }
    function getPageNumbers() {
      const pages = [];
      const delta = 2;
      for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
        pages.push(i);
      }
      return pages;
    }
    allClients = [
      ...new Set(store_get($$store_subs ??= {}, "$alerts", alerts).map((a) => a.client))
    ].sort();
    filtered = store_get($$store_subs ??= {}, "$alerts", alerts).filter((a) => {
      if (filterTags.length > 0 && !filterTags.some((t) => a.tags?.includes(t))) return false;
      return true;
    }).sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      if (typeof va === "string") va = va.toLowerCase(), vb = vb?.toLowerCase() ?? "";
      return sortDir * (va > vb ? 1 : va < vb ? -1 : 0);
    });
    {
      currentPage = 1;
    }
    totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
    paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
    pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
    pageEnd = Math.min(currentPage * PAGE_SIZE, filtered.length);
    activeFilters = [
      ...[],
      ...[],
      ...[],
      ...filterTags.map((t) => ({ key: `tag:${t}`, label: `Tag: ${t}` })),
      ...[]
    ];
    $$renderer2.push(`<div class="p-5 space-y-4"><div${attr_class(`${stringify(
      // ── Investigation workflow ────────────────────────────────────────────
      // ── Blacklist action ──────────────────────────────────────────────────
      // ── Highlight search term ─────────────────────────────────────────────
      // ── Pagination helpers ────────────────────────────────────────────────
      store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200"
    )} border rounded-xl p-4`)}><div class="flex flex-wrap gap-3 items-center"><div class="relative flex-1 min-w-48"><svg${attr_class(`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg> <input type="text"${attr("value", searchQuery)} placeholder="Rechercher IP, domaine, client, ASN..."${attr_class(`w-full pl-9 pr-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-slate-50 border-slate-200 text-gray-800 placeholder-gray-400")}`)}/></div> `);
    $$renderer2.select(
      {
        value: filterClient,
        class: `px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200" : "bg-slate-50 border-slate-200 text-gray-800")}`
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`Tous les clients`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array = ensure_array_like(allClients);
        for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
          let c = each_array[$$index];
          $$renderer3.option({ value: c }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(c)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` `);
    $$renderer2.select(
      {
        value: filterLevel,
        class: `px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200" : "bg-slate-50 border-slate-200 text-gray-800")}`
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`Tous les niveaux`);
        });
        $$renderer3.option({ value: "critique" }, ($$renderer4) => {
          $$renderer4.push(`🔴 Critique`);
        });
        $$renderer3.option({ value: "moyen" }, ($$renderer4) => {
          $$renderer4.push(`🟡 Moyen`);
        });
        $$renderer3.option({ value: "faible" }, ($$renderer4) => {
          $$renderer4.push(`🟠 Faible`);
        });
      }
    );
    $$renderer2.push(` <label class="flex items-center gap-2 cursor-pointer select-none"><div class="relative"><input type="checkbox"${attr("checked", filterUnblocked, true)} class="sr-only"/> <div${attr_class(`w-10 h-5 rounded-full transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a]" : "bg-slate-200")} border ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-300")}`)}></div> <div${attr_class(`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform ${stringify("")}`)}></div></div> <span${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}>Non bloqués seuls</span></label> `);
    if (activeFilters.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<button${attr_class(`px-3 py-2 rounded-lg text-sm border transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>Réinitialiser</button>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <button class="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors"><svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"></path></svg> Export CSV</button></div> <div${attr_class(`flex flex-wrap gap-2 mt-3 pt-3 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-100")}`)}><span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} self-center`)}>Tags :</span> <!--[-->`);
    const each_array_1 = ensure_array_like(allTags);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let tag = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class(`px-2 py-0.5 rounded-full text-xs font-medium border transition-all ${stringify(filterTags.includes(tag) ? "bg-indigo-600/30 text-indigo-300 border-indigo-500/50" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] text-gray-500 border-[#2a2d3a] hover:text-gray-300" : "bg-slate-100 text-gray-500 border-slate-200 hover:text-gray-700")}`)}>${escape_html(tag)}</button>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (activeFilters.length > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-wrap gap-2 items-center"><span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Filtres actifs :</span> <!--[-->`);
      const each_array_2 = ensure_array_like(activeFilters);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let f = each_array_2[$$index_2];
        $$renderer2.push(`<button class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40">${escape_html(f.label)} <span class="text-xs opacity-70">✕</span></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="flex items-center justify-between flex-wrap gap-2"><p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}><span${attr_class(`font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-800")}`)}>${escape_html(filtered.length)}</span> alerte${escape_html(filtered.length !== 1 ? "s" : "")} affichée${escape_html(filtered.length !== 1 ? "s" : "")} `);
    if (filtered.length !== store_get($$store_subs ??= {}, "$alerts", alerts).length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}>/ ${escape_html(store_get($$store_subs ??= {}, "$alerts", alerts).length)} total</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></p> `);
    if (filtered.length > PAGE_SIZE) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Affichage ${escape_html(pageStart)}–${escape_html(pageEnd)} sur ${escape_html(filtered.length)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (filtered.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-16 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><div class="text-4xl mb-3">🔍</div> <p class="font-semibold">Aucune alerte ne correspond aux filtres</p> <p class="text-sm mt-1">Essayez de modifier vos critères de recherche</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl overflow-hidden`)}><div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr${attr_class(`border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#22263a]" : "border-slate-200 bg-slate-50")}`)}><!--[-->`);
      const each_array_3 = ensure_array_like([
        { key: "level", label: "Niveau" },
        { key: "ip", label: "IP" },
        { key: "client", label: "Client" },
        { key: "country", label: "Pays" },
        { key: "score", label: "Score" },
        { key: "count", label: "Requêtes" },
        { key: "tags", label: "Tags" },
        { key: "paths", label: "Chemins" },
        { key: "firstSeen", label: "Première vue" },
        { key: "lastSeen", label: "Dernière vue" }
      ]);
      for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
        let col = each_array_3[$$index_3];
        $$renderer2.push(`<th${attr_class(`text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`)}>${escape_html(col.label)} <span class="ml-1 opacity-50">${escape_html(sortIcon(col.key))}</span></th>`);
      }
      $$renderer2.push(`<!--]--><th${attr_class(`px-3 py-3 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>Actions</th></tr></thead><tbody><!--[-->`);
      const each_array_4 = ensure_array_like(paged);
      for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
        let alert = each_array_4[i];
        const unblocked = alert.countUnblocked > 0;
        $$renderer2.push(`<tr${attr_class(`border-b cursor-pointer transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? unblocked ? "border-[#2a2d3a] bg-red-950/20 hover:bg-red-950/30" : "border-[#2a2d3a] hover:bg-[#22263a]" : unblocked ? "border-slate-100 bg-red-50 hover:bg-red-100/50" : "border-slate-100 hover:bg-slate-50")}`)}><td class="px-3 py-2.5">`);
        LevelBadge($$renderer2, { level: alert.level });
        $$renderer2.push(`<!----></td><td class="px-3 py-2.5"><code${attr_class(`text-xs font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>`);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(alert.ip)}`);
        }
        $$renderer2.push(`<!--]--></code> `);
        if (unblocked) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="ml-1 text-xs text-red-400 font-bold">⚠</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="px-3 py-2.5"><div${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")} font-medium`)}>`);
        {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`${escape_html(alert.client)}`);
        }
        $$renderer2.push(`<!--]--></div> <div${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(alert.domain)}</div></td><td${attr_class(`px-3 py-2.5 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")} whitespace-nowrap`)}>${escape_html(flag(alert.country))} ${escape_html(alert.country)}</td><td class="px-3 py-2.5"><div class="flex items-center gap-1"><div${attr_class(`w-8 h-1.5 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a]" : "bg-slate-200")} rounded-full overflow-hidden`)}><div${attr_class(`h-full rounded-full ${stringify(alert.score >= 8 ? "bg-red-500" : alert.score >= 5 ? "bg-amber-500" : "bg-orange-500")}`)}${attr_style(`width: ${stringify(alert.score / 10 * 100)}%`)}></div></div> <span${attr_class(`text-xs font-bold ${stringify(alert.score >= 8 ? "text-red-400" : alert.score >= 5 ? "text-amber-400" : "text-orange-400")}`)}>${escape_html(alert.score)}</span></div></td><td${attr_class(`px-3 py-2.5 text-xs font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(fmt(alert.count))} `);
        if (alert.countUnblocked > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="text-red-400 font-bold">${escape_html(alert.countUnblocked)} passés</div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></td><td class="px-3 py-2.5"><div class="flex flex-wrap gap-1 max-w-[160px]"><!--[-->`);
        const each_array_5 = ensure_array_like((alert.tags ?? []).slice(0, 2));
        for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
          let tag = each_array_5[$$index_4];
          TagBadge($$renderer2, { tag });
        }
        $$renderer2.push(`<!--]--> `);
        if ((alert.tags ?? []).length > 2) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>+${escape_html(alert.tags.length - 2)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td class="px-3 py-2.5"><div class="flex flex-col gap-0.5 max-w-[140px]"><!--[-->`);
        const each_array_6 = ensure_array_like((alert.paths ?? []).slice(0, 2));
        for (let $$index_5 = 0, $$length2 = each_array_6.length; $$index_5 < $$length2; $$index_5++) {
          let path = each_array_6[$$index_5];
          $$renderer2.push(`<code${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")} truncate`)}>${escape_html(path)}</code>`);
        }
        $$renderer2.push(`<!--]--> `);
        if ((alert.paths ?? []).length > 2) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>+${escape_html(alert.paths.length - 2)} autres</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></td><td${attr_class(`px-3 py-2.5 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")} whitespace-nowrap`)}>${escape_html(formatDate(alert.firstSeen))}</td><td${attr_class(`px-3 py-2.5 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")} whitespace-nowrap`)}>${escape_html(formatDate(alert.lastSeen))}</td><td class="px-3 py-2.5"><div class="flex gap-1"><button title="Ouvrir une investigation"${attr_class(`text-xs px-2 py-1 rounded border transition-colors whitespace-nowrap ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/20" : "border-indigo-300 text-indigo-600 hover:bg-indigo-50")}`)}>🔍</button> <button title="Ajouter à la blacklist"${attr_class(`text-xs px-2 py-1 rounded border transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-red-500/40 text-red-400 hover:bg-red-500/20" : "border-red-300 text-red-500 hover:bg-red-50")}`)}>🛡</button></div></td></tr> `);
        if (expandedRows.has(i)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<tr${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a]" : "bg-slate-50 border-slate-200")} border-b`)}><td colspan="11" class="px-4 py-4"><div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs"><div><p${attr_class(`font-semibold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")} uppercase tracking-wider mb-2`)}>Chemins ciblés</p> <!--[-->`);
          const each_array_7 = ensure_array_like(alert.paths ?? []);
          for (let $$index_6 = 0, $$length2 = each_array_7.length; $$index_6 < $$length2; $$index_6++) {
            let path = each_array_7[$$index_6];
            $$renderer2.push(`<code${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-600")} block`)}>${escape_html(path)}</code>`);
          }
          $$renderer2.push(`<!--]--></div> <div><p${attr_class(`font-semibold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")} uppercase tracking-wider mb-2`)}>Raisons WAF</p> <!--[-->`);
          const each_array_8 = ensure_array_like(alert.reasons ?? []);
          for (let $$index_7 = 0, $$length2 = each_array_8.length; $$index_7 < $$length2; $$index_7++) {
            let reason = each_array_8[$$index_7];
            $$renderer2.push(`<p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>${escape_html(reason)}</p>`);
          }
          $$renderer2.push(`<!--]--></div> <div><p${attr_class(`font-semibold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")} uppercase tracking-wider mb-2`)}>User Agents</p> <!--[-->`);
          const each_array_9 = ensure_array_like(alert.userAgents ?? []);
          for (let $$index_8 = 0, $$length2 = each_array_9.length; $$index_8 < $$length2; $$index_8++) {
            let ua = each_array_9[$$index_8];
            $$renderer2.push(`<code${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")} block text-xs break-all`)}>${escape_html(ua)}</code>`);
          }
          $$renderer2.push(`<!--]--></div> <div><p${attr_class(`font-semibold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-500")} uppercase tracking-wider mb-2`)}>Détails</p> <p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>ASN: <code>${escape_html(alert.asn)}</code></p> <p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>Actions: ${escape_html((alert.actions ?? []).join(", "))}</p> <p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>Méthodes: ${escape_html((alert.methods ?? []).join(", "))}</p> <p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>Status HTTP: ${escape_html((alert.responseStatuses ?? []).join(", "))}</p> `);
          if (alert.countUnblocked > 0) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<p class="text-red-400 font-bold mt-1">⚠ ${escape_html(alert.countUnblocked)} requête${escape_html(alert.countUnblocked > 1 ? "s" : "")} non bloquée${escape_html(alert.countUnblocked > 1 ? "s" : "")}</p>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--></div></div> `);
          if ((alert.tags ?? []).length) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div${attr_class(`mt-3 pt-3 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} flex gap-1.5 flex-wrap`)}><!--[-->`);
            const each_array_10 = ensure_array_like(alert.tags);
            for (let $$index_9 = 0, $$length2 = each_array_10.length; $$index_9 < $$length2; $$index_9++) {
              let tag = each_array_10[$$index_9];
              TagBadge($$renderer2, { tag });
            }
            $$renderer2.push(`<!--]--></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <div${attr_class(`mt-3 pt-3 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} flex gap-2`)}><button${attr_class(`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/20" : "border-indigo-300 text-indigo-600 hover:bg-indigo-50")}`)}>🔍 Ouvrir investigation</button> <button${attr_class(`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-red-500/40 text-red-400 hover:bg-red-500/20" : "border-red-300 text-red-500 hover:bg-red-50")}`)}>🛡 Blacklister</button> <a${attr("href", `/reports?client=${stringify(encodeURIComponent(alert.client))}`)}${attr_class(`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>📋 Rapport client</a></div></td></tr>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]-->`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div></div> `);
      if (totalPages > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex items-center justify-between flex-wrap gap-3"><p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Page ${escape_html(currentPage)}/${escape_html(totalPages)} · ${escape_html(pageStart)}–${escape_html(pageEnd)} sur ${escape_html(filtered.length)} alertes</p> <div class="flex items-center gap-1"><button${attr("disabled", currentPage === 1, true)}${attr_class(`px-2 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>«</button> <button${attr("disabled", currentPage === 1, true)}${attr_class(`px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>‹</button> `);
        if (currentPage > 3) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`px-1 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>…</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <!--[-->`);
        const each_array_11 = ensure_array_like(getPageNumbers());
        for (let $$index_11 = 0, $$length = each_array_11.length; $$index_11 < $$length; $$index_11++) {
          let p = each_array_11[$$index_11];
          $$renderer2.push(`<button${attr_class(`w-8 h-8 rounded-lg text-xs border transition-colors font-medium ${stringify(currentPage === p ? "bg-indigo-600 border-indigo-600 text-white" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]" : "border-slate-200 text-gray-600 hover:bg-slate-100")}`)}>${escape_html(p)}</button>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (currentPage < totalPages - 2) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span${attr_class(`px-1 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>…</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <button${attr("disabled", currentPage === totalPages, true)}${attr_class(`px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>›</button> <button${attr("disabled", currentPage === totalPages, true)}${attr_class(`px-2 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>»</button></div> <p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>25 lignes/page</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
