import { s as store_get, a as attr_class, b as stringify, e as ensure_array_like, c as escape_html, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { a as alerts, r as riskScore, d as darkMode } from "../../../chunks/data.js";
import "../../../chunks/ui.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let clientList, clientAlerts;
    let selectedClient = "";
    clientList = [
      ...new Set(store_get($$store_subs ??= {}, "$alerts", alerts).map((a) => a.client))
    ].sort();
    clientAlerts = [];
    clientAlerts.length ? {
      total: clientAlerts.reduce((s, a) => s + a.count, 0),
      critiques: clientAlerts.filter((a) => a.level === "critique").length,
      moyens: clientAlerts.filter((a) => a.level === "moyen").length,
      unblocked: clientAlerts.reduce((s, a) => s + (a.countUnblocked || 0), 0),
      topIP: clientAlerts[0],
      countries: [...new Set(clientAlerts.map((a) => a.country))].length,
      asns: [...new Set(clientAlerts.map((a) => a.asn).filter(Boolean))].length
    } : null;
    store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 8 ? "CRITIQUE" : store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 5 ? "ÉLEVÉ" : store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 3 ? "MODÉRÉ" : "FAIBLE";
    store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 8 ? "#ef4444" : store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 5 ? "#f97316" : store_get($$store_subs ??= {}, "$riskScore", riskScore) >= 3 ? "#f59e0b" : "#22c55e";
    (() => {
      const m = {};
      clientAlerts.forEach((a) => {
        if (!m[a.country]) m[a.country] = { country: a.country, count: 0, critiques: 0, requests: 0 };
        m[a.country].count++;
        m[a.country].requests += a.count;
        if (a.level === "critique") m[a.country].critiques++;
      });
      return Object.values(m).sort((a, b) => b.requests - a.requests).slice(0, 8);
    })();
    $$renderer2.push(`<div class="p-5 space-y-5 print-page"><div class="no-print"><div class="flex items-center justify-between flex-wrap gap-3 mb-5"><div><h1${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Rapports clients PDF</h1> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Rapport de sécurité WAF brandé 1T3R — exportable en PDF via impression</p></div> `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-3`)}>Sélectionner un client</p> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2"><!--[-->`);
    const each_array = ensure_array_like(clientList);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let client = each_array[$$index];
      $$renderer2.push(`<button${attr_class(`text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium ${stringify(selectedClient === client ? store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-indigo-600/20 border-indigo-500/50 text-indigo-300" : "bg-indigo-50 border-indigo-300 text-indigo-700" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-300 hover:border-indigo-500/30" : "bg-slate-50 border-slate-200 text-gray-700 hover:border-slate-300")}`)}><div class="flex items-center gap-2"><span class="text-base">🏢</span> <span class="truncate">${escape_html(client.replace("Client ", "C"))}</span></div> `);
      if (store_get($$store_subs ??= {}, "$alerts", alerts).filter((a) => a.client === client).some((a) => a.level === "critique")) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-xs text-red-400 mt-0.5 block">⚠ Alertes critiques</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} mt-0.5 block`)}>${escape_html(store_get($$store_subs ??= {}, "$alerts", alerts).filter((a) => a.client === client).length)} alertes</span>`);
      }
      $$renderer2.push(`<!--]--></button>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-16 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><p class="text-4xl mb-3">📋</p> <p class="font-semibold">Sélectionnez un client ci-dessus</p> <p class="text-sm mt-1">Le rapport de sécurité sera généré automatiquement</p></div>`);
    }
    $$renderer2.push(`<!--]--></div>  `);
    {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
