import { s as store_get, a as attr_class, b as stringify, e as ensure_array_like, c as escape_html, d as attr, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { g as getSLAStatus, a as getSLARemaining, S as STATUS, P as PRIORITY, i as investigations, b as investigationStats } from "../../../chunks/investigations.js";
import { d as darkMode } from "../../../chunks/data.js";
import "../../../chunks/ui.js";
import { L as LevelBadge } from "../../../chunks/LevelBadge.js";
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let all, filtered;
    let filterStatus = "all";
    let filterPriority = "all";
    let editingId = null;
    let editNote = "";
    let editAssigned = "";
    let editStatus = "";
    let editPriority = "";
    function fmtDate(iso) {
      if (!iso) return "—";
      return new Date(iso).toLocaleString("fr-FR", {
        day: "2-digit",
        month: "2-digit",
        hour: "2-digit",
        minute: "2-digit"
      });
    }
    const slaColors = {
      ok: "text-green-400",
      warning: "text-amber-400 font-bold animate-pulse",
      overdue: "text-red-400 font-bold"
    };
    all = Object.values(store_get($$store_subs ??= {}, "$investigations", investigations));
    filtered = all.filter((i) => {
      return true;
    }).sort((a, b) => {
      const sa = getSLAStatus(a), sb = getSLAStatus(b);
      if (sa === "overdue" && sb !== "overdue") return -1;
      if (sb === "overdue" && sa !== "overdue") return 1;
      const pOrder = { critical: 0, high: 1, medium: 2, low: 3 };
      return (pOrder[a.priority] ?? 4) - (pOrder[b.priority] ?? 4);
    });
    $$renderer2.push(`<div class="p-5 space-y-5"><div class="flex items-center justify-between flex-wrap gap-3"><div><h1${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Workflow d'investigation</h1> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Suivi des alertes en cours d'analyse — SLA temps réel</p></div> <a href="/alerts" class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">+ Nouvelle depuis alertes</a></div> <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3"><!--[-->`);
    const each_array = ensure_array_like([
      {
        label: "Total",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).total,
        color: "text-indigo-400"
      },
      {
        label: "Nouveaux",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).new,
        color: "text-blue-400"
      },
      {
        label: "En cours",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).inProgress,
        color: "text-amber-400"
      },
      {
        label: "Résolus",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).resolved,
        color: "text-green-400"
      },
      {
        label: "Escaladés",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).escalated,
        color: "text-red-400"
      },
      {
        label: "SLA dépassé",
        value: store_get($$store_subs ??= {}, "$investigationStats", investigationStats).overdue,
        color: "text-red-400"
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let kpi = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-3 ${stringify(kpi.label === "SLA dépassé" && store_get($$store_subs ??= {}, "$investigationStats", investigationStats).overdue > 0 ? "border-red-500/50" : "")}`)}><p class="text-xs text-gray-500 uppercase tracking-wider">${escape_html(kpi.label)}</p> <p${attr_class(`text-2xl font-bold mt-0.5 ${stringify(kpi.color)}`)}>${escape_html(kpi.value)}</p> `);
      if (kpi.label === "Résolus" && store_get($$store_subs ??= {}, "$investigationStats", investigationStats).avgResolutionH !== null) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<p class="text-[10px] text-gray-600 mt-0.5">moy. ${escape_html(store_get($$store_subs ??= {}, "$investigationStats", investigationStats).avgResolutionH)}h</p>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-3 flex-wrap">`);
    $$renderer2.select(
      {
        value: filterStatus,
        class: `px-3 py-2 rounded-lg text-sm border focus:outline-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200" : "bg-white border-slate-200 text-gray-800")}`
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`Tous les statuts`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_1 = ensure_array_like(Object.entries(STATUS));
        for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
          let [k, v] = each_array_1[$$index_1];
          $$renderer3.option({ value: k }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(v.icon)} ${escape_html(v.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(` `);
    $$renderer2.select(
      {
        value: filterPriority,
        class: `px-3 py-2 rounded-lg text-sm border focus:outline-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200" : "bg-white border-slate-200 text-gray-800")}`
      },
      ($$renderer3) => {
        $$renderer3.option({ value: "all" }, ($$renderer4) => {
          $$renderer4.push(`Toutes priorités`);
        });
        $$renderer3.push(`<!--[-->`);
        const each_array_2 = ensure_array_like(Object.entries(PRIORITY));
        for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
          let [k, v] = each_array_2[$$index_2];
          $$renderer3.option({ value: k }, ($$renderer4) => {
            $$renderer4.push(`${escape_html(v.label)}`);
          });
        }
        $$renderer3.push(`<!--]-->`);
      }
    );
    $$renderer2.push(`</div> `);
    if (all.length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-16 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><div class="text-5xl mb-3">🔍</div> <p class="font-semibold text-lg">Aucune investigation ouverte</p> <p class="text-sm mt-1">Allez sur la page <a href="/alerts" class="text-indigo-400 underline">Alertes</a> et cliquez sur "Investiguer" pour commencer.</p></div>`);
    } else if (filtered.length === 0) {
      $$renderer2.push("<!--[1-->");
      $$renderer2.push(`<div${attr_class(`text-center py-10 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><p>Aucune investigation ne correspond aux filtres.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-3"><!--[-->`);
      const each_array_3 = ensure_array_like(filtered);
      for (let $$index_5 = 0, $$length = each_array_3.length; $$index_5 < $$length; $$index_5++) {
        let inv = each_array_3[$$index_5];
        const slaStatus = getSLAStatus(inv);
        const slaRemaining = getSLARemaining(inv);
        const statusInfo = STATUS[inv.status] ?? STATUS.new;
        const priorityInfo = PRIORITY[inv.priority] ?? PRIORITY.medium;
        $$renderer2.push(`<div${attr_class(`border rounded-xl overflow-hidden ${stringify(slaStatus === "overdue" && inv.status !== "resolved" && inv.status !== "false_positive" ? store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-red-500/50 bg-red-950/10" : "border-red-300 bg-red-50" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#1a1d27]" : "border-slate-200 bg-white")}`)}><div class="p-4"><div class="flex items-start justify-between gap-3 flex-wrap"><div class="flex items-start gap-3"><div><div class="flex items-center gap-2 flex-wrap mb-1"><code${attr_class(`text-sm font-mono font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-800")}`)}>${escape_html(inv.ip)}</code> `);
        LevelBadge($$renderer2, { level: inv.level });
        $$renderer2.push(`<!----> <span${attr_class(`text-xs border rounded-full px-2 py-0.5 font-semibold ${stringify(statusInfo.color)}`)}>${escape_html(statusInfo.icon)} ${escape_html(statusInfo.label)}</span> <span${attr_class(`text-xs border rounded-full px-2 py-0.5 font-semibold ${stringify(priorityInfo.color)} ${stringify(priorityInfo.bg)} ${stringify(priorityInfo.border)}`)}>${escape_html(priorityInfo.label)}</span></div> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}>${escape_html(inv.client)} · ${escape_html(inv.domain)}</p> `);
        if (inv.assignedTo) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>👤 ${escape_html(inv.assignedTo)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div class="flex flex-col items-end gap-2 shrink-0"><div${attr_class(`text-xs ${stringify(slaColors[slaStatus] ?? "text-gray-500")}`)}>`);
        if (inv.status === "resolved" || inv.status === "false_positive") {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="text-green-400">✅ Clôturé</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`⏱ SLA : ${escape_html(slaRemaining)}`);
        }
        $$renderer2.push(`<!--]--></div> <div${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>Ouvert le ${escape_html(fmtDate(inv.createdAt))}</div> <div class="flex gap-1.5"><button${attr_class(`text-xs px-2.5 py-1 rounded border transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200" : "border-slate-200 text-gray-500 hover:bg-slate-50")}`)}>✏️ Modifier</button> <button class="text-xs px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">🗑</button></div></div></div> `);
        if (inv.notes) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div${attr_class(`mt-3 pt-3 border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#22263a]" : "border-slate-100")}`)}><p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} font-semibold uppercase tracking-wider mb-1`)}>Notes</p> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")} whitespace-pre-wrap`)}>${escape_html(inv.notes)}</p></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> `);
        if (editingId === inv.id) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div${attr_class(`border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#22263a]/60" : "border-slate-200 bg-slate-50")} p-4 space-y-3`)}><div class="grid grid-cols-2 gap-3"><div><label${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>Statut</label> `);
          $$renderer2.select(
            {
              value: editStatus,
              class: `w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200" : "bg-white border-slate-200")}`
            },
            ($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              const each_array_4 = ensure_array_like(Object.entries(STATUS));
              for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
                let [k, v] = each_array_4[$$index_3];
                $$renderer3.option({ value: k }, ($$renderer4) => {
                  $$renderer4.push(`${escape_html(v.icon)} ${escape_html(v.label)}`);
                });
              }
              $$renderer3.push(`<!--]-->`);
            }
          );
          $$renderer2.push(`</div> <div><label${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>Priorité</label> `);
          $$renderer2.select(
            {
              value: editPriority,
              class: `w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200" : "bg-white border-slate-200")}`
            },
            ($$renderer3) => {
              $$renderer3.push(`<!--[-->`);
              const each_array_5 = ensure_array_like(Object.entries(PRIORITY));
              for (let $$index_4 = 0, $$length2 = each_array_5.length; $$index_4 < $$length2; $$index_4++) {
                let [k, v] = each_array_5[$$index_4];
                $$renderer3.option({ value: k }, ($$renderer4) => {
                  $$renderer4.push(`${escape_html(v.label)}`);
                });
              }
              $$renderer3.push(`<!--]-->`);
            }
          );
          $$renderer2.push(`</div></div> <div><label${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>Assigné à</label> <input type="text"${attr("value", editAssigned)} placeholder="Nom de l'analyste"${attr_class(`w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-white border-slate-200")}`)}/></div> <div><label${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} uppercase tracking-wider`)}>Notes d'investigation</label> <textarea rows="3" placeholder="Observations, actions prises, recommandations…"${attr_class(`w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-200 placeholder-gray-600" : "bg-white border-slate-200")}`)}>`);
          const $$body = escape_html(editNote);
          if ($$body) {
            $$renderer2.push(`${$$body}`);
          }
          $$renderer2.push(`</textarea></div> <div class="flex gap-2 justify-end"><button${attr_class(`text-sm px-4 py-2 border rounded-lg transition-colors ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]" : "border-slate-200 text-gray-500 hover:bg-slate-100")}`)}>Annuler</button> <button class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">Enregistrer</button></div></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
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
