import { g as getContext, e as ensure_array_like, s as store_get, a as attr_class, b as stringify, c as escape_html, u as unsubscribe_stores, d as attr, f as fallback, h as bind_props, i as slot } from "../../chunks/index2.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { g as goto } from "../../chunks/client.js";
import "clsx";
import "@sveltejs/kit/internal";
import "../../chunks/exports.js";
import "../../chunks/utils.js";
import "@sveltejs/kit/internal/server";
import "../../chunks/root.js";
import "../../chunks/state.svelte.js";
import { d as darkMode, a as alerts, s as socData, f as formatNumber, l as loadData, b as loading, e as error, c as dateLabel, g as generatedAt } from "../../chunks/data.js";
import { t as toasts, s as showShortcuts, a as activeClient, b as autoRefreshInterval, c as autoRefreshCountdown, d as addToast, e as sidebarCollapsed } from "../../chunks/ui.js";
import { d as derived } from "../../chunks/index.js";
import { L as LevelBadge } from "../../chunks/LevelBadge.js";
import { T as TagBadge } from "../../chunks/TagBadge.js";
const getStores = () => {
  const stores$1 = getContext("__svelte__");
  return {
    /** @type {typeof page} */
    page: {
      subscribe: stores$1.page.subscribe
    },
    /** @type {typeof navigating} */
    navigating: {
      subscribe: stores$1.navigating.subscribe
    },
    /** @type {typeof updated} */
    updated: stores$1.updated
  };
};
const page = {
  subscribe(fn) {
    const store = getStores().page;
    return store.subscribe(fn);
  }
};
function Toast($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const icons = { success: "✅", error: "❌", warning: "⚠️", info: "ℹ️" };
    const colors = {
      success: "border-green-500/40 bg-green-950/60",
      error: "border-red-500/40 bg-red-950/60",
      warning: "border-amber-500/40 bg-amber-950/60",
      info: "border-indigo-500/40 bg-indigo-950/60"
    };
    $$renderer2.push(`<div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none"><!--[-->`);
    const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$toasts", toasts));
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let toast = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-sm text-sm font-medium text-white min-w-64 max-w-sm animate-[slideIn_0.2s_ease-out] ${stringify(colors[toast.type] ?? colors.info)}`)} style="animation: slideIn 0.2s ease-out;"><span class="text-base shrink-0">${escape_html(icons[toast.type] ?? icons.info)}</span> <span class="flex-1 text-gray-200">${escape_html(toast.message)}</span> <button class="text-gray-500 hover:text-white transition-colors shrink-0 text-lg leading-none">×</button></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function KeyboardShortcuts($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    const shortcuts = [
      {
        keys: ["G", "O"],
        label: "Aller → Vue d'ensemble",
        group: "Navigation"
      },
      {
        keys: ["G", "A"],
        label: "Aller → Alertes",
        group: "Navigation"
      },
      {
        keys: ["G", "T"],
        label: "Aller → Threat Intel",
        group: "Navigation"
      },
      {
        keys: ["G", "C"],
        label: "Aller → Campagnes",
        group: "Navigation"
      },
      {
        keys: ["G", "I"],
        label: "Aller → Investigations",
        group: "Navigation"
      },
      {
        keys: ["G", "H"],
        label: "Aller → Historique",
        group: "Navigation"
      },
      {
        keys: ["G", "P"],
        label: "Aller → Rapports PDF",
        group: "Navigation"
      },
      {
        keys: ["R"],
        label: "Rafraîchir les données",
        group: "Actions"
      },
      {
        keys: ["B"],
        label: "Réduire / Étendre sidebar",
        group: "Actions"
      },
      {
        keys: ["?"],
        label: "Afficher ces raccourcis",
        group: "Actions"
      },
      { keys: ["Esc"], label: "Fermer les modals", group: "Actions" }
    ];
    const groups = [...new Set(shortcuts.map((s) => s.group))];
    if (store_get($$store_subs ??= {}, "$showShortcuts", showShortcuts)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-50 flex items-center justify-center p-4" role="dialog" tabindex="-1"><div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div> <div${attr_class(`relative z-10 w-full max-w-md ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-2xl shadow-2xl p-6`)}><div class="flex items-center justify-between mb-5"><div><h2${attr_class(`font-bold text-base ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Raccourcis clavier</h2> <p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Naviguez plus vite dans 1T3R SOC</p></div> <button${attr_class(`w-8 h-8 flex items-center justify-center rounded-lg ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] text-gray-400 hover:text-white" : "bg-slate-100 text-gray-500 hover:text-gray-900")} transition-colors text-lg`)}>×</button></div> <div class="space-y-4"><!--[-->`);
      const each_array = ensure_array_like(groups);
      for (let $$index_2 = 0, $$length = each_array.length; $$index_2 < $$length; $$index_2++) {
        let group = each_array[$$index_2];
        $$renderer2.push(`<div><p${attr_class(`text-[10px] font-bold uppercase tracking-widest ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} mb-2`)}>${escape_html(group)}</p> <div class="space-y-1"><!--[-->`);
        const each_array_1 = ensure_array_like(shortcuts.filter((s) => s.group === group));
        for (let $$index_1 = 0, $$length2 = each_array_1.length; $$index_1 < $$length2; $$index_1++) {
          let sc = each_array_1[$$index_1];
          $$renderer2.push(`<div${attr_class(`flex items-center justify-between py-1 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#22263a]" : "border-slate-100")} last:border-0`)}><span${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(sc.label)}</span> <div class="flex items-center gap-1"><!--[-->`);
          const each_array_2 = ensure_array_like(sc.keys);
          for (let i = 0, $$length3 = each_array_2.length; i < $$length3; i++) {
            let key = each_array_2[i];
            if (i > 0) {
              $$renderer2.push("<!--[0-->");
              $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>puis</span>`);
            } else {
              $$renderer2.push("<!--[-1-->");
            }
            $$renderer2.push(`<!--]--> <kbd${attr_class(`px-2 py-0.5 text-xs font-mono font-bold rounded border ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] text-gray-300" : "bg-slate-100 border-slate-300 text-gray-700")}`)}>${escape_html(key)}</kbd>`);
          }
          $$renderer2.push(`<!--]--></div></div>`);
        }
        $$renderer2.push(`<!--]--></div></div>`);
      }
      $$renderer2.push(`<!--]--></div> <p${attr_class(`text-center text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} mt-4`)}>Appuie sur <kbd${attr_class(`px-1.5 py-0.5 rounded border text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a]" : "bg-slate-100 border-slate-300")}`)}>?</kbd> pour afficher ce panneau</p></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function ClientDrawer($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let client, clientAlerts;
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    function fmtDate(iso) {
      if (!iso) return "—";
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
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
      "SG": "🇸🇬",
      "MA": "🇲🇦",
      "SN": "🇸🇳",
      "NG": "🇳🇬",
      "CI": "🇨🇮",
      "CM": "🇨🇲",
      "VN": "🇻🇳",
      "ID": "🇮🇩",
      "TR": "🇹🇷"
    };
    function flag(cc) {
      return flagMap[cc] ?? "🏳️";
    }
    client = store_get($$store_subs ??= {}, "$activeClient", activeClient);
    clientAlerts = client ? store_get($$store_subs ??= {}, "$alerts", alerts).filter((a) => a.client === client.client).sort((a, b) => b.score - a.score) : [];
    if (client) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm" role="button" tabindex="-1"></div> <div${attr_class(`fixed right-0 top-0 h-full z-50 w-[520px] max-w-[95vw] flex flex-col shadow-2xl ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-l border-[#2a2d3a]" : "bg-white border-l border-slate-200")} translate-x-0 transition-transform duration-300`)}><div${attr_class(`p-5 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} shrink-0`)}><div class="flex items-start justify-between"><div><h2${attr_class(`font-bold text-lg ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>${escape_html(client.client)}</h2> <p${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} text-sm font-mono`)}>${escape_html(client.domain)}</p></div> <button${attr_class(`w-8 h-8 flex items-center justify-center rounded-lg ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] text-gray-400 hover:text-white" : "bg-slate-100 text-gray-500 hover:text-gray-900")} transition-colors text-xl`)}>×</button></div> <div class="grid grid-cols-4 gap-3 mt-4"><!--[-->`);
      const each_array = ensure_array_like([
        {
          label: "Total",
          value: client.totalEvents,
          color: "text-gray-300"
        },
        {
          label: "Critiques",
          value: client.critiques,
          color: "text-red-400"
        },
        {
          label: "Moyens",
          value: client.moyens,
          color: "text-amber-400"
        },
        {
          label: "Non-bloqués",
          value: client.totalUnblocked,
          color: client.totalUnblocked > 0 ? "text-red-300" : "text-green-400"
        }
      ]);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let stat = each_array[$$index];
        $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a]" : "bg-slate-50")} rounded-lg p-2.5 text-center`)}><p${attr_class(`text-xl font-bold ${stringify(stat.color)}`)}>${escape_html(fmt(stat.value))}</p> <p${attr_class(`text-[10px] ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} uppercase tracking-wide`)}>${escape_html(stat.label)}</p></div>`);
      }
      $$renderer2.push(`<!--]--></div></div> <div class="flex-1 overflow-y-auto p-4 space-y-2"><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-3`)}>${escape_html(clientAlerts.length)} alerte${escape_html(clientAlerts.length !== 1 ? "s" : "")} associée${escape_html(clientAlerts.length !== 1 ? "s" : "")}</p> <!--[-->`);
      const each_array_1 = ensure_array_like(clientAlerts);
      for (let $$index_3 = 0, $$length = each_array_1.length; $$index_3 < $$length; $$index_3++) {
        let alert = each_array_1[$$index_3];
        const unblocked = alert.countUnblocked > 0;
        $$renderer2.push(`<div${attr_class(`rounded-lg p-3 border text-sm transition-colors ${stringify(unblocked ? store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-red-950/30 border-red-500/30" : "bg-red-50 border-red-200" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a] hover:border-[#3a3d4a]" : "bg-slate-50 border-slate-200")}`)}><div class="flex items-center justify-between gap-2 mb-2"><div class="flex items-center gap-2">`);
        LevelBadge($$renderer2, { level: alert.level });
        $$renderer2.push(`<!----> <code${attr_class(`text-xs font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")}`)}>${escape_html(alert.ip)}</code> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>${escape_html(flag(alert.country))} ${escape_html(alert.country)}</span></div> <div class="flex items-center gap-2 shrink-0">`);
        if (unblocked) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-xs text-red-400 font-bold">⚠ ${escape_html(alert.countUnblocked)} passé${escape_html(alert.countUnblocked > 1 ? "s" : "")}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <span${attr_class(`text-xs font-bold ${stringify(alert.score >= 8 ? "text-red-400" : "text-amber-400")}`)}>Score ${escape_html(alert.score)}</span></div></div> <div class="flex flex-wrap gap-1 mb-2"><!--[-->`);
        const each_array_2 = ensure_array_like(alert.tags ?? []);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let tag = each_array_2[$$index_1];
          TagBadge($$renderer2, { tag });
        }
        $$renderer2.push(`<!--]--></div> <div${attr_class(`flex items-center justify-between text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><div class="flex gap-2"><!--[-->`);
        const each_array_3 = ensure_array_like((alert.paths ?? []).slice(0, 2));
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let path = each_array_3[$$index_2];
          $$renderer2.push(`<code>${escape_html(path)}</code>`);
        }
        $$renderer2.push(`<!--]--> `);
        if ((alert.paths ?? []).length > 2) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>+${escape_html(alert.paths.length - 2)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <span class="font-mono">${escape_html(fmt(alert.count))} req.</span></div> <div${attr_class(`flex items-center justify-between text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} mt-1.5`)}><span>1ère vue : ${escape_html(fmtDate(alert.firstSeen))}</span> <span>Dernière : ${escape_html(fmtDate(alert.lastSeen))}</span></div></div>`);
      }
      $$renderer2.push(`<!--]--> `);
      if (!clientAlerts.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div${attr_class(`text-center py-12 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><div class="text-3xl mb-2">✅</div> <p class="font-medium">Aucune alerte pour ce client</p></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div${attr_class(`p-4 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} shrink-0`)}><a${attr("href", `/alerts?client=${stringify(encodeURIComponent(client.client))}`)} class="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">Voir toutes les alertes →</a></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function SkeletonDashboard($$renderer, $$props) {
  let darkMode2 = fallback($$props["darkMode"], true);
  const pulse = "animate-pulse rounded";
  const bg = darkMode2 ? "bg-[#22263a]" : "bg-slate-200";
  const card = darkMode2 ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200";
  $$renderer.push(`<div class="p-5 space-y-5"><div class="grid grid-cols-6 gap-3"><!--[-->`);
  const each_array = ensure_array_like(Array(6));
  for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
    each_array[$$index];
    $$renderer.push(`<div${attr_class(`border ${stringify(card)} rounded-xl p-4 space-y-3`)}><div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-24`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-8 w-20`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-full`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-10 w-full opacity-40`)}></div></div>`);
  }
  $$renderer.push(`<!--]--></div> <div class="grid grid-cols-5 gap-3"><!--[-->`);
  const each_array_1 = ensure_array_like(Array(14));
  for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
    each_array_1[$$index_1];
    $$renderer.push(`<div${attr_class(`border ${stringify(card)} rounded-xl p-3 space-y-2`)}><div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-16`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-4 w-28`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-20 opacity-60`)}></div> <div class="grid grid-cols-2 gap-1 mt-1"><div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-6`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-6`)}></div></div></div>`);
  }
  $$renderer.push(`<!--]--></div> <div class="grid grid-cols-3 gap-5"><div${attr_class(`col-span-2 border ${stringify(card)} rounded-xl p-4 space-y-3`)}><div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-40`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-56 w-full`)}></div></div> <div${attr_class(`border ${stringify(card)} rounded-xl p-4 space-y-3`)}><div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-32`)}></div> <div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-44 w-44 rounded-full mx-auto`)}></div> <div class="space-y-1.5"><!--[-->`);
  const each_array_2 = ensure_array_like(Array(3));
  for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
    each_array_2[$$index_2];
    $$renderer.push(`<div${attr_class(`${stringify(pulse)} ${stringify(bg)} h-3 w-full`)}></div>`);
  }
  $$renderer.push(`<!--]--></div></div></div></div>`);
  bind_props($$props, { darkMode: darkMode2 });
}
function _layout($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let currentPath;
    const totalEvents = derived(socData, ($d) => $d?.summary?.totalEvents ?? 0);
    const totalUnblocked = derived(socData, ($d) => $d?.summary?.totalUnblocked ?? 0);
    onDestroy(() => {
      window.removeEventListener("keydown", handleKey);
      stopAutoRefresh();
    });
    let countdownTimer = null;
    function startAutoRefresh(seconds) {
      stopAutoRefresh();
      if (!seconds) return;
      autoRefreshCountdown.set(seconds);
      countdownTimer = setInterval(
        () => {
          autoRefreshCountdown.update((c) => {
            if (c <= 1) {
              doRefresh();
              return seconds;
            }
            return c - 1;
          });
        },
        1e3
      );
    }
    function stopAutoRefresh() {
      clearInterval(countdownTimer);
      countdownTimer = null;
      autoRefreshCountdown.set(0);
    }
    autoRefreshInterval.subscribe((v) => {
      v ? startAutoRefresh(v) : stopAutoRefresh();
    });
    async function doRefresh() {
      await loadData();
      addToast("Données actualisées", "success", 2e3);
      updateFavicon();
    }
    function updateFavicon() {
      const canvas = document.createElement("canvas");
      canvas.width = canvas.height = 32;
      const ctx = canvas.getContext("2d");
      ctx.fillStyle = "#1a1d27";
      ctx.roundRect(0, 0, 32, 32, 6);
      ctx.fill();
      ctx.fillStyle = "#6366f1";
      ctx.font = "bold 20px sans-serif";
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText("S", 16, 17);
      const link = document.querySelector('link[rel~="icon"]') || document.createElement("link");
      link.type = "image/x-icon";
      link.rel = "shortcut icon";
      link.href = canvas.toDataURL();
      document.head.appendChild(link);
    }
    let gPressed = false;
    let gTimer = null;
    function handleKey(e) {
      const tag = e.target.tagName;
      const inInput = tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT" || e.target.isContentEditable;
      if (e.key === "Escape") {
        showShortcuts.set(false);
        return;
      }
      if (inInput) return;
      if (e.key === "?") {
        showShortcuts.update((v) => !v);
        return;
      }
      if (e.key === "r" || e.key === "R") {
        doRefresh();
        return;
      }
      if (e.key === "b" || e.key === "B") {
        sidebarCollapsed.update((v) => !v);
        return;
      }
      if (e.key === "g" || e.key === "G") {
        gPressed = true;
        clearTimeout(gTimer);
        gTimer = setTimeout(
          () => {
            gPressed = false;
          },
          1500
        );
        return;
      }
      if (gPressed) {
        gPressed = false;
        clearTimeout(gTimer);
        if (e.key === "o" || e.key === "O") {
          goto();
          return;
        }
        if (e.key === "a" || e.key === "A") {
          goto();
          return;
        }
        if (e.key === "t" || e.key === "T") {
          goto();
          return;
        }
        if (e.key === "c" || e.key === "C") {
          goto();
          return;
        }
        if (e.key === "i" || e.key === "I") {
          goto();
          return;
        }
        if (e.key === "h" || e.key === "H") {
          goto();
          return;
        }
        if (e.key === "p" || e.key === "P") {
          goto();
          return;
        }
      }
    }
    const navGroups = [
      {
        label: "Supervision",
        items: [
          {
            href: "/",
            label: "Vue d'ensemble",
            icon: "📊",
            desc: "Manager"
          },
          {
            href: "/alerts",
            label: "Alertes",
            icon: "🔔",
            desc: "Analyste"
          },
          {
            href: "/threat",
            label: "Threat Intel",
            icon: "🎯",
            desc: "Red Team"
          }
        ]
      },
      {
        label: "Différentiateurs",
        items: [
          {
            href: "/campaigns",
            label: "Campagnes",
            icon: "🎯",
            desc: "Multi-clients"
          },
          {
            href: "/investigations",
            label: "Investigations",
            icon: "🔍",
            desc: "Workflow SLA"
          },
          {
            href: "/blacklist",
            label: "Blacklist",
            icon: "🛡️",
            desc: "Export CF/NGINX"
          },
          {
            href: "/history",
            label: "Historique",
            icon: "📅",
            desc: "Multi-jours"
          },
          {
            href: "/reports",
            label: "Rapports PDF",
            icon: "📋",
            desc: "Clients"
          }
        ]
      }
    ];
    function formatDateShort(iso) {
      if (!iso) return "—";
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    const REFRESH_OPTIONS = [
      { label: "Off", value: 0 },
      { label: "30s", value: 30 },
      { label: "1 min", value: 60 },
      { label: "5 min", value: 300 }
    ];
    currentPath = store_get($$store_subs ??= {}, "$page", page).url.pathname;
    $$renderer2.push(`<div${attr_class(`flex h-screen overflow-hidden ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#0f1117] text-gray-100" : "bg-slate-100 text-gray-900")}`)}><aside${attr_class(`shrink-0 flex flex-col border-r transition-all duration-300 ${stringify(store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed) ? "w-16" : "w-64")} ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")}`)}><div${attr_class(`p-3 border-b ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} shrink-0`)}><div class="flex items-center gap-3 overflow-hidden"><div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50"><svg viewBox="0 0 24 24" class="w-5 h-5 text-white fill-none stroke-white stroke-2"><path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg></div> `);
    if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="min-w-0 transition-opacity duration-200"><p${attr_class(`font-bold text-sm tracking-wide ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>1T3R SOC</p> <p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-indigo-400" : "text-indigo-600")}`)}>Security Operations</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> <nav class="flex-1 p-2 overflow-y-auto space-y-3"><!--[-->`);
    const each_array = ensure_array_like(navGroups);
    for (let $$index_1 = 0, $$length = each_array.length; $$index_1 < $$length; $$index_1++) {
      let group = each_array[$$index_1];
      $$renderer2.push(`<div>`);
      if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p${attr_class(`text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(group.label)}</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
        $$renderer2.push(`<div${attr_class(`border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-100")} my-1`)}></div>`);
      }
      $$renderer2.push(`<!--]--> <!--[-->`);
      const each_array_1 = ensure_array_like(group.items);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let item = each_array_1[$$index];
        const active = currentPath === item.href;
        $$renderer2.push(`<a${attr("href", item.href)}${attr("title", store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed) ? item.label : "")}${attr_class(`flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline ${stringify(active ? store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-indigo-600/20 text-indigo-400 border border-indigo-500/30" : "bg-indigo-50 text-indigo-600 border border-indigo-200" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:bg-[#22263a] hover:text-gray-200" : "text-gray-600 hover:bg-slate-100 hover:text-gray-900")}`)}><span class="text-base shrink-0">${escape_html(item.icon)}</span> `);
        if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="min-w-0 flex-1"><p class="truncate text-xs">${escape_html(item.label)}</p> <p${attr_class(`text-[10px] ${stringify(active ? "opacity-70" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(item.desc)}</p></div> `);
          if (active) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<div class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]-->`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></a>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked) > 0 && !store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mx-2 mt-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2"><div class="flex items-center gap-2"><span class="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span> <span class="text-xs text-red-400 font-semibold">${escape_html(store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked))} non-bloqué${escape_html(store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked) > 1 ? "s" : "")}</span></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></nav> <div${attr_class(`p-2 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} shrink-0 space-y-1`)}><button${attr_class(`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500 hover:bg-[#22263a] hover:text-gray-300" : "text-gray-400 hover:bg-slate-100 hover:text-gray-600")}`)}><span class="text-base shrink-0">⌨️</span> `);
    if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>Raccourcis clavier</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button${attr_class(`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500 hover:bg-[#22263a] hover:text-gray-300" : "text-gray-400 hover:bg-slate-100 hover:text-gray-600")}`)}><span class="text-base shrink-0">${escape_html(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "☀️" : "🌙")}</span> `);
    if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>${escape_html(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "Mode clair" : "Mode sombre")}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> <button${attr_class(`w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600 hover:bg-[#22263a] hover:text-gray-400" : "text-gray-400 hover:bg-slate-100")}`)}><span${attr_class(`text-base shrink-0 transition-transform duration-300 ${stringify(store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed) ? "rotate-180" : "")}`)}>◀</span> `);
    if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span>Réduire la sidebar</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></button> `);
    if (!store_get($$store_subs ??= {}, "$sidebarCollapsed", sidebarCollapsed)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="px-2 pt-1"><div class="flex items-center gap-1.5"><div${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(store_get($$store_subs ??= {}, "$loading", loading) ? "bg-amber-400 animate-pulse" : store_get($$store_subs ??= {}, "$error", error) ? "bg-red-400" : "bg-green-400")}`)}></div> <span${attr_class(`text-[10px] ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(store_get($$store_subs ??= {}, "$loading", loading) ? "Chargement…" : store_get($$store_subs ??= {}, "$error", error) ? "Erreur" : "Connecté")}</span></div> <p${attr_class(`text-[10px] ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-700" : "text-gray-400")} mt-0.5`)}>Cloudflare WAF Monitor · v1.0</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></aside> <div class="flex-1 flex flex-col min-w-0 overflow-hidden"><header${attr_class(`h-14 shrink-0 flex items-center justify-between px-5 border-b gap-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")}`)}><div class="flex items-center gap-3 min-w-0"><h1${attr_class(`font-semibold text-sm truncate ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-800")}`)}>`);
    if (currentPath === "/") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`Vue d'ensemble — Sécurité WAF`);
    } else if (currentPath === "/alerts") {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`Alertes de Sécurité`);
    } else if (currentPath === "/threat") {
      $$renderer2.push("<!--[2-->");
      $$renderer2.push(`Threat Intelligence`);
    } else if (currentPath === "/campaigns") {
      $$renderer2.push("<!--[3-->");
      $$renderer2.push(`Campagnes coordonnées`);
    } else if (currentPath === "/investigations") {
      $$renderer2.push("<!--[4-->");
      $$renderer2.push(`Workflow d'investigation`);
    } else if (currentPath === "/blacklist") {
      $$renderer2.push("<!--[5-->");
      $$renderer2.push(`Blacklist propriétaire 1T3R`);
    } else if (currentPath === "/history") {
      $$renderer2.push("<!--[6-->");
      $$renderer2.push(`Historique multi-jours`);
    } else if (currentPath === "/reports") {
      $$renderer2.push("<!--[7-->");
      $$renderer2.push(`Rapports clients PDF`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`SOC Dashboard`);
    }
    $$renderer2.push(`<!--]--></h1> `);
    if (store_get($$store_subs ??= {}, "$dateLabel", dateLabel) !== "—") {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} shrink-0`)}>· ${escape_html(store_get($$store_subs ??= {}, "$dateLabel", dateLabel))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex items-center gap-2 shrink-0">`);
    if (store_get($$store_subs ??= {}, "$generatedAt", generatedAt)) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")} hidden lg:block`)}>🕐 ${escape_html(formatDateShort(store_get($$store_subs ??= {}, "$generatedAt", generatedAt)))}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`flex items-center gap-1 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] border-[#2a2d3a]" : "bg-slate-100 border-slate-200")} border rounded-lg px-2 py-1`)}><span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>`);
    if (store_get($$store_subs ??= {}, "$autoRefreshCountdown", autoRefreshCountdown) > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-indigo-400 font-mono font-bold">${escape_html(store_get($$store_subs ??= {}, "$autoRefreshCountdown", autoRefreshCountdown))}s</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`🔄`);
    }
    $$renderer2.push(`<!--]--></span> `);
    $$renderer2.select(
      {
        value: store_get($$store_subs ??= {}, "$autoRefreshInterval", autoRefreshInterval),
        class: `text-xs bg-transparent ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")} focus:outline-none cursor-pointer`
      },
      ($$renderer3) => {
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(REFRESH_OPTIONS);
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let opt = each_array_2[$$index_2];
          $$renderer3.option({ value: opt.value }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(opt.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> <button title="Rafraîchir (R)"${attr_class(
      `px-2.5 py-1.5 rounded-lg text-xs border transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`,
      void 0,
      {
        "animate-spin": store_get($$store_subs ??= {}, "$loading", loading)
      }
    )}>↺</button> `);
    if (!store_get($$store_subs ??= {}, "$loading", loading) && store_get($$store_subs ??= {}, "$totalEvents", totalEvents) > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-full px-3 py-1 text-xs font-semibold"><span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span> ${escape_html(formatNumber(store_get($$store_subs ??= {}, "$totalEvents", totalEvents)))} événements</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked) > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full px-3 py-1 text-xs font-bold animate-pulse">⚠ ${escape_html(store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked))} non-bloqué${escape_html(store_get($$store_subs ??= {}, "$totalUnblocked", totalUnblocked) > 1 ? "s" : "")}</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></header> <main class="flex-1 overflow-y-auto">`);
    if (store_get($$store_subs ??= {}, "$loading", loading)) {
      $$renderer2.push("<!--[0-->");
      SkeletonDashboard($$renderer2, {
        darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
      });
    } else if (store_get($$store_subs ??= {}, "$error", error)) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div class="flex flex-col items-center justify-center h-full gap-4"><div class="text-5xl">⚠️</div> <p class="text-red-400 font-semibold">Erreur de chargement</p> <p${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} text-sm`)}>${escape_html(store_get($$store_subs ??= {}, "$error", error))}</p> <button class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">Réessayer</button></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<!--[-->`);
      slot($$renderer2, $$props, "default", {});
      $$renderer2.push(`<!--]-->`);
    }
    $$renderer2.push(`<!--]--></main></div></div> `);
    Toast($$renderer2);
    $$renderer2.push(`<!----> `);
    KeyboardShortcuts($$renderer2);
    $$renderer2.push(`<!----> `);
    ClientDrawer($$renderer2);
    $$renderer2.push(`<!---->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _layout as default
};
