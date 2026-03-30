import { s as store_get, a as attr_class, b as stringify, e as ensure_array_like, c as escape_html, d as attr, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { b as blacklist, a as blacklistStats } from "../../../chunks/blacklist.js";
import { d as darkMode } from "../../../chunks/data.js";
import "../../../chunks/ui.js";
import { L as LevelBadge } from "../../../chunks/LevelBadge.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let all, filtered;
    let newIP = "";
    let newNote = "";
    let search = "";
    let sortCol = "score";
    let sortDir = -1;
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
      "SG": "🇸🇬",
      "MA": "🇲🇦",
      "SN": "🇸🇳",
      "NG": "🇳🇬",
      "VN": "🇻🇳",
      "ID": "🇮🇩",
      "TR": "🇹🇷",
      "DZ": "🇩🇿",
      "TN": "🇹🇳",
      "KR": "🇰🇷"
    };
    function flag(cc) {
      return flagMap[cc] ?? "🏳️";
    }
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    all = Object.values(store_get($$store_subs ??= {}, "$blacklist", blacklist));
    filtered = all.filter((i) => !search).sort((a, b) => {
      let va = a[sortCol], vb = b[sortCol];
      return sortDir * (va > vb ? 1 : va < vb ? -1 : 0);
    });
    $$renderer2.push(`<div class="p-5 space-y-5"><div class="flex items-center justify-between flex-wrap gap-3"><div><h1${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Blacklist 1T3R — IPs malveillantes</h1> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Base propriétaire exportable vers Cloudflare, NGINX, pare-feu</p></div> <div class="flex gap-2"><button class="text-sm px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium">⚡ Import auto (score ≥ 7)</button></div></div> <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3"><!--[-->`);
    const each_array = ensure_array_like([
      {
        label: "Total IPs",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).total,
        color: "text-indigo-400"
      },
      {
        label: "Critiques",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).critique,
        color: "text-red-400"
      },
      {
        label: "Moyens",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).moyen,
        color: "text-amber-400"
      },
      {
        label: "Auto-détectées",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).auto,
        color: "text-blue-400"
      },
      {
        label: "Manuelles",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).manual,
        color: "text-green-400"
      },
      {
        label: "Pays",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).countries,
        color: "text-purple-400"
      },
      {
        label: "ASNs",
        value: store_get($$store_subs ??= {}, "$blacklistStats", blacklistStats).asns,
        color: "text-cyan-400"
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let s = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-3`)}><p class="text-xs text-gray-500 uppercase tracking-wider truncate">${escape_html(s.label)}</p> <p${attr_class(`text-2xl font-bold mt-0.5 ${stringify(s.color)}`)}>${escape_html(s.value)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-3`)}>Exporter la blacklist</p> <div class="flex flex-wrap gap-2"><!--[-->`);
    const each_array_1 = ensure_array_like([
      {
        format: "txt",
        label: "Plain Text",
        icon: "📄",
        desc: "1 IP par ligne"
      },
      {
        format: "csv",
        label: "CSV",
        icon: "📊",
        desc: "Avec métadonnées"
      },
      {
        format: "cf",
        label: "Cloudflare",
        icon: "🔶",
        desc: "Format IP List CF"
      },
      {
        format: "json",
        label: "JSON",
        icon: "📦",
        desc: "Format complet 1T3R"
      }
    ]);
    for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
      let exp = each_array_1[$$index_1];
      $$renderer2.push(`<button${attr_class(`flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-300 hover:bg-[#22263a] hover:text-white" : "border-slate-200 text-gray-600 hover:bg-slate-50")}`)}><span>${escape_html(exp.icon)}</span> <div class="text-left"><p class="font-medium">${escape_html(exp.label)}</p> <p${attr_class(`text-[10px] ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(exp.desc)}</p></div></button>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-3`)}>Ajouter une IP manuellement</p> <div class="flex gap-3 flex-wrap"><input type="text"${attr("value", newIP)} placeholder="Adresse IP (ex: 45.33.12.100)"${attr_class(`flex-1 min-w-48 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-slate-50 border-slate-200")}`)}/> <input type="text"${attr("value", newNote)} placeholder="Note (optionnel)"${attr_class(`flex-1 min-w-48 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-slate-50 border-slate-200")}`)}/> <button${attr("disabled", !newIP.trim(), true)} class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors">Ajouter</button></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl overflow-hidden`)}><div${attr_class(`p-4 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} flex items-center justify-between gap-3`)}><input type="text"${attr("value", search)} placeholder="Rechercher IP, pays, ASN…"${attr_class(`flex-1 max-w-xs px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-slate-50 border-slate-200")}`)}/> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>${escape_html(filtered.length)} IP${escape_html(filtered.length !== 1 ? "s" : "")}</span></div> `);
    if (filtered.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-12 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><p class="text-3xl mb-2">🛡️</p> <p>Blacklist vide — cliquer sur "Import auto" pour commencer</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="overflow-x-auto"><table class="w-full text-sm"><thead><tr${attr_class(`border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#22263a]" : "border-slate-200 bg-slate-50")}`)}><!--[-->`);
      const each_array_2 = ensure_array_like([
        ["ip", "Adresse IP"],
        ["score", "Score"],
        ["level", "Niveau"],
        ["country", "Pays"],
        ["asn", "ASN"],
        ["hits", "Hits"],
        ["source", "Source"],
        ["addedAt", "Ajouté le"]
      ]);
      for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
        let [k, l] = each_array_2[$$index_2];
        $$renderer2.push(`<th${attr_class(`text-left px-3 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")}`)}>${escape_html(l)} ${escape_html(sortCol === k ? "↓" : "↕")}</th>`);
      }
      $$renderer2.push(`<!--]--><th class="px-3 py-3"></th></tr></thead><tbody><!--[-->`);
      const each_array_3 = ensure_array_like(filtered);
      for (let $$index_4 = 0, $$length = each_array_3.length; $$index_4 < $$length; $$index_4++) {
        let ip = each_array_3[$$index_4];
        $$renderer2.push(`<tr${attr_class(`border-b transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] hover:bg-[#22263a]" : "border-slate-100 hover:bg-slate-50")}`)}><td class="px-3 py-2.5"><code${attr_class(`text-xs font-mono font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-800")}`)}>${escape_html(ip.ip)}</code></td><td class="px-3 py-2.5"><div class="flex gap-0.5"><!--[-->`);
        const each_array_4 = ensure_array_like(Array(10));
        for (let j = 0, $$length2 = each_array_4.length; j < $$length2; j++) {
          each_array_4[j];
          $$renderer2.push(`<div${attr_class(`h-2 w-1.5 rounded-sm ${stringify(j < ip.score ? j >= 7 ? "bg-red-500" : j >= 4 ? "bg-amber-500" : "bg-orange-400" : darkMode ? "bg-[#22263a]" : "bg-slate-200")}`)}></div>`);
        }
        $$renderer2.push(`<!--]--> <span${attr_class(`ml-1 text-xs font-bold ${stringify(ip.score >= 8 ? "text-red-400" : ip.score >= 5 ? "text-amber-400" : "text-orange-400")}`)}>${escape_html(ip.score)}</span></div></td><td class="px-3 py-2.5">`);
        LevelBadge($$renderer2, { level: ip.level });
        $$renderer2.push(`<!----></td><td${attr_class(`px-3 py-2.5 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}>${escape_html(flag(ip.country))} ${escape_html(ip.country)}</td><td class="px-3 py-2.5"><code${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-500")}`)}>${escape_html(ip.asn)}</code></td><td${attr_class(`px-3 py-2.5 text-xs font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(fmt(ip.hits))}</td><td class="px-3 py-2.5"><span${attr_class(`text-xs px-2 py-0.5 rounded-full border ${stringify(ip.source === "auto" ? "bg-blue-500/20 text-blue-400 border-blue-500/30" : "bg-green-500/20 text-green-400 border-green-500/30")}`)}>${escape_html(ip.source === "auto" ? "⚡ Auto" : "✍️ Manuel")}</span></td><td${attr_class(`px-3 py-2.5 text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>${escape_html(new Date(ip.addedAt).toLocaleDateString("fr-FR"))}</td><td class="px-3 py-2.5"><button class="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">✕</button></td></tr>`);
      }
      $$renderer2.push(`<!--]--></tbody></table></div>`);
    }
    $$renderer2.push(`<!--]--></div></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
