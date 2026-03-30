import { a as attr_class, b as stringify, s as store_get, c as escape_html, e as ensure_array_like, d as attr, u as unsubscribe_stores } from "../../../chunks/index2.js";
import { d as derived } from "../../../chunks/index.js";
import { a as alerts, u as topIPs, d as darkMode } from "../../../chunks/data.js";
import { L as LevelBadge } from "../../../chunks/LevelBadge.js";
const campaigns = derived([alerts, topIPs], ([$alerts, $topIPs]) => {
  const detected = [];
  const ipClientMap = {};
  $alerts.forEach((a) => {
    if (!ipClientMap[a.ip]) ipClientMap[a.ip] = { ip: a.ip, clients: /* @__PURE__ */ new Set(), requests: 0, level: a.level, asn: a.asn, country: a.country, score: a.score, tags: a.tags ?? [], firstSeen: a.firstSeen, lastSeen: a.lastSeen };
    ipClientMap[a.ip].clients.add(a.client);
    ipClientMap[a.ip].requests += a.count;
    if (a.score > ipClientMap[a.ip].score) {
      ipClientMap[a.ip].score = a.score;
      ipClientMap[a.ip].level = a.level;
    }
  });
  Object.values(ipClientMap).forEach((ip) => {
    const clientList = [...ip.clients];
    if (clientList.length >= 4) {
      detected.push({
        id: `ip_${ip.ip}`,
        type: "ip_sweep",
        severity: ip.level === "critique" ? "critique" : "moyen",
        title: `IP transverse multi-clients`,
        description: `L'adresse ${ip.ip} a ciblé ${clientList.length} clients différents (${ip.requests.toLocaleString("fr-FR")} requêtes).`,
        affectedClients: clientList,
        affectedIPs: [ip.ip],
        asn: ip.asn,
        country: ip.country,
        score: ip.score,
        totalRequests: ip.requests,
        tags: ip.tags,
        firstSeen: ip.firstSeen,
        lastSeen: ip.lastSeen,
        icon: "🎯"
      });
    }
  });
  const asnMap = {};
  $alerts.forEach((a) => {
    if (!a.asn) return;
    if (!asnMap[a.asn]) asnMap[a.asn] = { asn: a.asn, ips: /* @__PURE__ */ new Set(), clients: /* @__PURE__ */ new Set(), requests: 0, maxScore: 0, country: a.country };
    asnMap[a.asn].ips.add(a.ip);
    asnMap[a.asn].clients.add(a.client);
    asnMap[a.asn].requests += a.count;
    asnMap[a.asn].maxScore = Math.max(asnMap[a.asn].maxScore, a.score);
  });
  Object.values(asnMap).forEach((asn) => {
    const ipList = [...asn.ips];
    const clientList = [...asn.clients];
    if (ipList.length >= 3 && clientList.length >= 3) {
      detected.push({
        id: `asn_${asn.asn}`,
        type: "asn_campaign",
        severity: asn.maxScore >= 8 ? "critique" : "moyen",
        title: `Campagne ASN coordonnée`,
        description: `${ipList.length} IPs depuis ${asn.asn} ont collectivement ciblé ${clientList.length} clients (${asn.requests.toLocaleString("fr-FR")} requêtes).`,
        affectedClients: clientList,
        affectedIPs: ipList.slice(0, 10),
        asn: asn.asn,
        country: asn.country,
        score: asn.maxScore,
        totalRequests: asn.requests,
        tags: ["coordinated", "asn-sweep"],
        icon: "🔗"
      });
    }
  });
  const countryMap = {};
  $alerts.filter((a) => a.level === "critique").forEach((a) => {
    if (!countryMap[a.country]) countryMap[a.country] = { country: a.country, clients: /* @__PURE__ */ new Set(), ips: /* @__PURE__ */ new Set(), requests: 0 };
    countryMap[a.country].clients.add(a.client);
    countryMap[a.country].ips.add(a.ip);
    countryMap[a.country].requests += a.count;
  });
  Object.values(countryMap).forEach((c) => {
    if ([...c.clients].length >= 5) {
      detected.push({
        id: `country_${c.country}`,
        type: "country_storm",
        severity: "critique",
        title: `Tempête d'attaques — ${c.country}`,
        description: `${[...c.ips].length} IPs depuis ${c.country} ont déclenché des alertes critiques sur ${[...c.clients].length} clients.`,
        affectedClients: [...c.clients],
        affectedIPs: [...c.ips].slice(0, 10),
        country: c.country,
        score: 9,
        totalRequests: c.requests,
        tags: ["country-storm", "critique"],
        icon: "🌩️"
      });
    }
  });
  return detected.sort((a, b) => {
    const sev = (a.severity === "critique" ? 0 : 1) - (b.severity === "critique" ? 0 : 1);
    return sev !== 0 ? sev : b.totalRequests - a.totalRequests;
  });
});
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
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
      "TR": "🇹🇷",
      "DZ": "🇩🇿",
      "TN": "🇹🇳"
    };
    function flag(cc) {
      return flagMap[cc] ?? "🏳️";
    }
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    const typeLabels = {
      ip_sweep: {
        label: "IP Transverse",
        color: "bg-red-500/20 text-red-400 border-red-500/30"
      },
      asn_campaign: {
        label: "Campagne ASN",
        color: "bg-purple-500/20 text-purple-400 border-purple-500/30"
      },
      country_storm: {
        label: "Tempête pays",
        color: "bg-orange-500/20 text-orange-400 border-orange-500/30"
      }
    };
    $$renderer2.push(`<div class="p-5 space-y-5"><div class="flex items-center justify-between"><div><h1${attr_class(`text-lg font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>Détection de campagnes coordonnées</h1> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mt-0.5`)}>Attaques multi-clients détectées automatiquement — impossible à voir dans Cloudflare</p></div> <div class="flex items-center gap-2"><div${attr_class(`px-3 py-1.5 rounded-lg text-sm font-bold ${stringify(store_get($$store_subs ??= {}, "$campaigns", campaigns).filter((c) => c.severity === "critique").length > 0 ? "bg-red-500/20 text-red-400 border border-red-500/30" : "bg-green-500/20 text-green-400 border border-green-500/30")}`)}>${escape_html(store_get($$store_subs ??= {}, "$campaigns", campaigns).filter((c) => c.severity === "critique").length)} campagne${escape_html(store_get($$store_subs ??= {}, "$campaigns", campaigns).filter((c) => c.severity === "critique").length !== 1 ? "s" : "")} critiques</div></div></div> <div class="grid grid-cols-3 gap-4"><!--[-->`);
    const each_array = ensure_array_like([
      {
        label: "Campagnes détectées",
        value: store_get($$store_subs ??= {}, "$campaigns", campaigns).length,
        icon: "🎯",
        color: "text-indigo-400"
      },
      {
        label: "Critiques",
        value: store_get($$store_subs ??= {}, "$campaigns", campaigns).filter((c) => c.severity === "critique").length,
        icon: "🔴",
        color: "text-red-400"
      },
      {
        label: "Clients impactés",
        value: [
          ...new Set(store_get($$store_subs ??= {}, "$campaigns", campaigns).flatMap((c) => c.affectedClients))
        ].length,
        icon: "🏢",
        color: "text-amber-400"
      }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let stat = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><div class="flex items-center justify-between"><p class="text-xs text-gray-500 uppercase tracking-wider">${escape_html(stat.label)}</p> <span class="text-xl">${escape_html(stat.icon)}</span></div> <p${attr_class(`text-3xl font-bold mt-1 ${stringify(stat.color)}`)}>${escape_html(stat.value)}</p></div>`);
    }
    $$renderer2.push(`<!--]--></div> `);
    if (store_get($$store_subs ??= {}, "$campaigns", campaigns).length === 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`text-center py-16 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}><div class="text-5xl mb-3">✅</div> <p class="font-semibold text-lg">Aucune campagne coordonnée détectée</p> <p class="text-sm mt-1">Les seuils actuels n'ont pas identifié d'attaques coordonnées multi-clients.</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
      $$renderer2.push(`<div class="space-y-4"><!--[-->`);
      const each_array_1 = ensure_array_like(store_get($$store_subs ??= {}, "$campaigns", campaigns));
      for (let $$index_4 = 0, $$length = each_array_1.length; $$index_4 < $$length; $$index_4++) {
        let campaign = each_array_1[$$index_4];
        const typeInfo = typeLabels[campaign.type] ?? typeLabels.ip_sweep;
        $$renderer2.push(`<div${attr_class(`border rounded-xl overflow-hidden ${stringify(campaign.severity === "critique" ? store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-red-500/40 bg-red-950/10" : "border-red-200 bg-red-50" : store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-amber-500/30 bg-amber-950/10" : "border-amber-200 bg-amber-50")}`)}><div class="p-4 flex items-start justify-between gap-4"><div class="flex items-start gap-3"><span class="text-3xl">${escape_html(campaign.icon)}</span> <div><div class="flex items-center gap-2 flex-wrap"><h3${attr_class(`font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-white" : "text-gray-900")}`)}>${escape_html(campaign.title)}</h3> <span${attr_class(`text-xs border rounded-full px-2 py-0.5 font-semibold ${stringify(typeInfo.color)}`)}>${escape_html(typeInfo.label)}</span> `);
        LevelBadge($$renderer2, { level: campaign.severity });
        $$renderer2.push(`<!----></div> <p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")} mt-1`)}>${escape_html(campaign.description)}</p></div></div> <div class="text-right shrink-0"><p${attr_class(`text-2xl font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-200" : "text-gray-800")}`)}>${escape_html(fmt(campaign.totalRequests))}</p> <p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>requêtes totales</p> `);
        if (campaign.score) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(`text-sm font-bold ${stringify(campaign.score >= 8 ? "text-red-400" : "text-amber-400")} mt-1`)}>Score ${escape_html(campaign.score)}/10</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div${attr_class(`border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a]" : "border-slate-200")} p-4 grid grid-cols-1 md:grid-cols-3 gap-4`)}><div><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-2`)}>Clients touchés (${escape_html(campaign.affectedClients.length)})</p> <div class="flex flex-wrap gap-1.5"><!--[-->`);
        const each_array_2 = ensure_array_like(campaign.affectedClients);
        for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
          let client = each_array_2[$$index_1];
          $$renderer2.push(`<span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a] text-gray-300 border-[#2a2d3a]" : "bg-slate-100 text-gray-600 border-slate-200")} border rounded px-2 py-0.5`)}>${escape_html(client.replace("Client ", ""))}</span>`);
        }
        $$renderer2.push(`<!--]--></div></div> <div><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-2`)}>IPs impliquées (${escape_html(campaign.affectedIPs.length)}${escape_html(campaign.affectedIPs.length === 10 ? "+" : "")})</p> <div class="flex flex-col gap-1"><!--[-->`);
        const each_array_3 = ensure_array_like(campaign.affectedIPs.slice(0, 5));
        for (let $$index_2 = 0, $$length2 = each_array_3.length; $$index_2 < $$length2; $$index_2++) {
          let ip = each_array_3[$$index_2];
          $$renderer2.push(`<div class="flex items-center gap-1.5">`);
          if (campaign.country) {
            $$renderer2.push("<!--[0-->");
            $$renderer2.push(`<span class="text-xs">${escape_html(flag(campaign.country))}</span>`);
          } else {
            $$renderer2.push("<!--[-1-->");
          }
          $$renderer2.push(`<!--]--> <code${attr_class(`text-xs font-mono ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}`)}>${escape_html(ip)}</code></div>`);
        }
        $$renderer2.push(`<!--]--> `);
        if (campaign.affectedIPs.length > 5) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>+${escape_html(campaign.affectedIPs.length - 5)} autres…</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div></div> <div><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-2`)}>Contexte</p> <div class="space-y-1 text-xs">`);
        if (campaign.asn) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>ASN : <code>${escape_html(campaign.asn)}</code></p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (campaign.country) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>Pays : ${escape_html(flag(campaign.country))} ${escape_html(campaign.country)}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> `);
        if (campaign.firstSeen) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<p${attr_class(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")}>Début : ${escape_html(new Date(campaign.firstSeen).toLocaleString("fr-FR"))}</p>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--> <div class="flex flex-wrap gap-1 mt-1"><!--[-->`);
        const each_array_4 = ensure_array_like((campaign.tags ?? []).slice(0, 4));
        for (let $$index_3 = 0, $$length2 = each_array_4.length; $$index_3 < $$length2; $$index_3++) {
          let tag = each_array_4[$$index_3];
          $$renderer2.push(`<span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-1.5 py-0.5 text-[10px]">${escape_html(tag)}</span>`);
        }
        $$renderer2.push(`<!--]--></div></div></div></div> <div${attr_class(`border-t ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "border-[#2a2d3a] bg-[#22263a]/50" : "border-slate-200 bg-slate-50/50")} px-4 py-2.5 flex items-center justify-between`)}><p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>Détecté automatiquement par l'algorithme 1T3R SOC</p> <div class="flex gap-2"><a${attr("href", `/alerts?q=${stringify(campaign.affectedIPs[0])}`)}${attr_class(`text-xs px-3 py-1.5 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a] text-gray-400 hover:text-gray-200" : "bg-white border-slate-300 text-gray-600 hover:text-gray-900")} border rounded-lg transition-colors`)}>Voir alertes →</a> <a href="/investigations" class="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">Ouvrir investigation</a></div></div></div>`);
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
