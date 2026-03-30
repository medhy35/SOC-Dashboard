import { f as fallback, a as attr_class, c as escape_html, j as attr_style, d as attr, b as stringify, h as bind_props, e as ensure_array_like, s as store_get, u as unsubscribe_stores } from "../../chunks/index2.js";
import { o as onDestroy } from "../../chunks/index-server.js";
import { L as LevelBadge } from "../../chunks/LevelBadge.js";
import { T as TagBadge } from "../../chunks/TagBadge.js";
import { D as DonutChart } from "../../chunks/DonutChart.js";
import { h as executiveSummary, i as summary, c as dateLabel, d as darkMode, m as mitreTactics, j as deltaJ1, k as sparklines, r as riskScore, n as clients, t as timeline, o as topPaths, p as clientHourlyData, q as multiClientIPs, u as topIPs, v as topCountries } from "../../chunks/data.js";
import { f as sections } from "../../chunks/ui.js";
function SparklineKPI($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let linePath, areaPath, trend;
    let label = fallback($$props["label"], "");
    let value = fallback($$props["value"], 0);
    let color = fallback($$props["color"], "#6366f1");
    let icon = fallback($$props["icon"], "");
    let warning = fallback($$props["warning"], false);
    let subtitle = fallback($$props["subtitle"], "");
    let sparkData = fallback($$props["sparkData"], () => [], true);
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    function buildPath(data, w, h, pad = 3) {
      if (!data || data.length < 2) return "";
      const min = Math.min(...data);
      const max = Math.max(...data);
      const range = max - min || 1;
      const xStep = (w - pad * 2) / (data.length - 1);
      const points = data.map((v, i) => {
        const x = pad + i * xStep;
        const y = h - pad - (v - min) / range * (h - pad * 2);
        return `${x},${y}`;
      });
      return `M ${points.join(" L ")}`;
    }
    function buildArea(data, w, h, pad = 3) {
      if (!data || data.length < 2) return "";
      const path = buildPath(data, w, h, pad);
      const lastX = pad + (data.length - 1) * ((w - pad * 2) / (data.length - 1));
      return `${path} L ${lastX},${h} L ${pad},${h} Z`;
    }
    const W = 120;
    const H = 36;
    linePath = buildPath(sparkData, W, H);
    areaPath = buildArea(sparkData, W, H);
    trend = sparkData.length >= 12 ? (() => {
      const mid = Math.floor(sparkData.length / 2);
      const first = sparkData.slice(0, mid).reduce((s, v) => s + v, 0);
      const last = sparkData.slice(mid).reduce((s, v) => s + v, 0);
      if (first === 0) return 0;
      return Math.round((last - first) / first * 100);
    })() : 0;
    $$renderer2.push(`<div${attr_class(`relative overflow-hidden rounded-xl p-4 border flex flex-col gap-1 group hover:border-opacity-60 transition-all ${stringify(warning && value > 0 ? "bg-red-950/20 border-red-500/50" : "bg-[#1a1d27] border-[#2a2d3a] hover:border-indigo-500/30")}`)}><div class="flex items-start justify-between"><div class="flex-1 min-w-0"><p class="text-xs text-gray-500 uppercase tracking-wider font-medium truncate">${escape_html(label)}</p> <p class="text-3xl font-bold mt-0.5"${attr_style(`color: ${stringify(warning && value > 0 ? "#f87171" : color)}`)}>${escape_html(fmt(value))}</p> `);
    if (subtitle) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs text-gray-500 mt-0.5">${escape_html(subtitle)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div class="flex flex-col items-end gap-1">`);
    if (icon) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span class="text-xl opacity-60 group-hover:opacity-100 transition-opacity">${escape_html(icon)}</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (trend !== 0 && sparkData.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<span${attr_class(`text-xs font-semibold ${stringify(trend > 0 ? "text-red-400" : "text-green-400")}`)}>${escape_html(trend > 0 ? "▲" : "▼")} ${escape_html(Math.abs(trend))}%</span>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (sparkData.length >= 2) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="mt-2"><svg${attr("width", W)}${attr("height", H)} class="w-full overflow-visible"${attr("viewBox", `0 0 ${stringify(W)} ${stringify(H)}`)} preserveAspectRatio="none"><defs><linearGradient${attr("id", `sg-${stringify(label.replace(/\s/g, ""))}`)} x1="0" y1="0" x2="0" y2="1"><stop offset="0%"${attr("stop-color", warning && value > 0 ? "#ef4444" : color)} stop-opacity="0.3"></stop><stop offset="100%"${attr("stop-color", warning && value > 0 ? "#ef4444" : color)} stop-opacity="0"></stop></linearGradient></defs><path${attr("d", areaPath)}${attr("fill", `url(#sg-${stringify(label.replace(/\s/g, ""))})`)}></path><path${attr("d", linePath)} fill="none"${attr("stroke", warning && value > 0 ? "#ef4444" : color)} stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"></path>`);
      if (sparkData.length) {
        $$renderer2.push("<!--[0-->");
        const lv = sparkData[sparkData.length - 1];
        const min = Math.min(...sparkData);
        const max = Math.max(...sparkData);
        const range = max - min || 1;
        const lx = 120 - 3;
        const ly = H - 3 - (lv - min) / range * (H - 6);
        $$renderer2.push(`<circle${attr("cx", lx)}${attr("cy", ly)} r="2.5"${attr("fill", warning && value > 0 ? "#ef4444" : color)} stroke="#1a1d27" stroke-width="1"></circle>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></svg> <p class="text-[10px] text-gray-600 mt-0.5">Dernières 24h</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (warning && value > 0) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute top-0 right-0 w-1 h-full bg-red-500/60 rounded-r-xl"></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { label, value, color, icon, warning, subtitle, sparkData });
  });
}
function Timeline($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = fallback($$props["data"], () => [], true);
    onDestroy(() => {
    });
    $$renderer2.push(`<div class="relative h-64"><canvas></canvas> `);
    if (!data.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucune donnée temporelle disponible</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data });
  });
}
function TopIPs($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let ips = fallback($$props["ips"], () => [], true);
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
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
    $$renderer2.push(`<div class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(ips.slice(0, 10));
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let ip = each_array[i];
      $$renderer2.push(`<div class="flex items-center gap-3 bg-[#22263a] rounded-lg px-3 py-2 hover:bg-[#2a2d3a] transition-colors"><span class="text-xs text-gray-600 w-4 text-right shrink-0">${escape_html(i + 1)}</span> <div class="flex-1 min-w-0"><div class="flex items-center gap-2 flex-wrap"><code class="text-sm font-mono text-gray-200">${escape_html(ip.ip)}</code> `);
      LevelBadge($$renderer2, { level: ip.level });
      $$renderer2.push(`<!----></div> <div class="flex items-center gap-2 mt-0.5 flex-wrap"><span class="text-xs text-gray-500">${escape_html(flag(ip.country))} ${escape_html(ip.country)}</span> <span class="text-xs text-gray-600">·</span> <span class="text-xs text-gray-500 font-mono">${escape_html(ip.asn)}</span> `);
      if (ip.clients?.length > 1) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-1">${escape_html(ip.clients.length)} clients</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> `);
      if (ip.tags?.length) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<div class="flex gap-1 mt-1 flex-wrap"><!--[-->`);
        const each_array_1 = ensure_array_like(ip.tags.slice(0, 3));
        for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
          let tag = each_array_1[$$index];
          TagBadge($$renderer2, { tag });
        }
        $$renderer2.push(`<!--]--></div>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--></div> <div class="text-right shrink-0"><p class="text-sm font-bold text-gray-200">${escape_html(fmt(ip.count))}</p> <p class="text-xs text-gray-500">req.</p> <div class="text-xs font-bold text-indigo-400">Score: ${escape_html(ip.score)}</div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!ips.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-center text-gray-500 text-sm py-8">Aucune donnée disponible</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { ips });
  });
}
function TopCountries($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let max, top10;
    let countries = fallback($$props["countries"], () => [], true);
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
    max = countries[0]?.count ?? 1;
    top10 = countries.slice(0, 10);
    $$renderer2.push(`<div class="space-y-2"><!--[-->`);
    const each_array = ensure_array_like(top10);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let c = each_array[i];
      const pct = Math.round(c.count / max * 100);
      $$renderer2.push(`<div class="flex items-center gap-3"><span class="text-xs text-gray-600 w-4 text-right shrink-0">${escape_html(i + 1)}</span> <span class="text-lg w-7 shrink-0">${escape_html(flag(c.country))}</span> <div class="flex-1 min-w-0"><div class="flex items-center justify-between mb-1"><span class="text-sm font-medium text-gray-300">${escape_html(c.country)}</span> <div class="flex items-center gap-2">`);
      if (c.critiques > 0) {
        $$renderer2.push("<!--[0-->");
        $$renderer2.push(`<span class="text-xs text-red-400 font-semibold">⚠ ${escape_html(c.critiques)}</span>`);
      } else {
        $$renderer2.push("<!--[-1-->");
      }
      $$renderer2.push(`<!--]--> <span class="text-xs font-bold text-gray-300">${escape_html(fmt(c.count))}</span></div></div> <div class="h-1.5 bg-[#22263a] rounded-full overflow-hidden"><div${attr_class(`h-full rounded-full transition-all duration-500 ${stringify(c.critiques > 0 ? "bg-red-500/70" : "bg-indigo-500/60")}`)}${attr_style(`width: ${stringify(pct)}%`)}></div></div></div></div>`);
    }
    $$renderer2.push(`<!--]--> `);
    if (!countries.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-center text-gray-500 text-sm py-8">Aucune donnée disponible</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { countries });
  });
}
function TopPathsChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = fallback($$props["data"], () => [], true);
    let darkMode2 = fallback($$props["darkMode"], true);
    let chart;
    onDestroy(() => chart?.destroy());
    $$renderer2.push(`<div class="relative"${attr_style(`height: ${stringify(Math.max(data.length * 28, 200))}px; max-height: 360px`)}><canvas></canvas> `);
    if (!data.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucun chemin disponible</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <div${attr_class(`flex flex-wrap gap-3 mt-3 pt-3 border-t ${stringify(darkMode2 ? "border-[#2a2d3a]" : "border-slate-200")}`)}><!--[-->`);
    const each_array = ensure_array_like([
      { label: "Admin/Panel", color: "#ef4444" },
      { label: "Config/Secrets", color: "#f59e0b" },
      { label: "Auth", color: "#f97316" },
      { label: "Autres", color: "#6366f1" }
    ]);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let l = each_array[$$index];
      $$renderer2.push(`<div class="flex items-center gap-1.5 text-xs"><span class="w-3 h-3 rounded"${attr_style(`background:${stringify(l.color)}cc;border:1px solid ${stringify(l.color)}`)}></span> <span${attr_class(darkMode2 ? "text-gray-500" : "text-gray-500")}>${escape_html(l.label)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, darkMode: darkMode2 });
  });
}
function MultiClientGraph($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let allClients, maxCount;
    let ips = fallback($$props["ips"], () => [], true);
    let darkMode2 = fallback($$props["darkMode"], true);
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
    function clientShort(name) {
      return name.replace("Client ", "").slice(0, 10);
    }
    const levelColor = { critique: "#ef4444", moyen: "#f59e0b", faible: "#f97316" };
    allClients = [...new Set(ips.flatMap((ip) => ip.clients ?? []))].sort();
    maxCount = Math.max(...ips.map((ip) => ip.count), 1);
    $$renderer2.push(`<div class="overflow-x-auto"><div class="min-w-max"><div class="space-y-1.5"><!--[-->`);
    const each_array = ensure_array_like(ips);
    for (let i = 0, $$length = each_array.length; i < $$length; i++) {
      let ip = each_array[i];
      ip.count / maxCount;
      $$renderer2.push(`<div class="flex items-center gap-2"><div${attr_class(`w-52 shrink-0 flex items-center gap-2 ${stringify(darkMode2 ? "bg-[#22263a]" : "bg-slate-100")} rounded-lg px-2.5 py-1.5`)}><span class="text-xs">${escape_html(flag(ip.country))}</span> <div class="min-w-0 flex-1"><code${attr_class(`text-xs font-mono ${stringify(darkMode2 ? "text-gray-200" : "text-gray-700")} block truncate`)}>${escape_html(ip.ip)}</code> <div class="flex items-center gap-1 mt-0.5"><span class="w-1.5 h-1.5 rounded-full"${attr_style(`background:${stringify(levelColor[ip.level] ?? "#6b7280")}`)}></span> <span class="text-[10px] font-bold text-gray-500">${escape_html(fmt(ip.count))} req · score ${escape_html(ip.score)}</span></div></div></div> <div class="flex gap-1 flex-wrap"><!--[-->`);
      const each_array_1 = ensure_array_like(allClients);
      for (let $$index = 0, $$length2 = each_array_1.length; $$index < $$length2; $$index++) {
        let client = each_array_1[$$index];
        const hit = (ip.clients ?? []).includes(client);
        $$renderer2.push(`<div${attr_class(`w-20 h-8 rounded flex items-center justify-center text-[10px] font-medium transition-all ${stringify(hit ? "border" : darkMode2 ? "bg-[#1a1d27] border border-[#2a2d3a]" : "bg-slate-50 border border-slate-100")}`)}${attr_style(hit ? `background:${levelColor[ip.level]}22;border-color:${levelColor[ip.level]}66;color:${levelColor[ip.level]}` : "")}${attr("title", hit ? `${ip.ip} → ${client}` : "")}>`);
        if (hit) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span>✓ ${escape_html(clientShort(client))}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
          $$renderer2.push(`<span${attr_class(darkMode2 ? "text-gray-700" : "text-gray-300")}>—</span>`);
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--></div> <span${attr_class(`text-xs font-bold px-2 py-0.5 rounded-full border ${stringify(ip.level === "critique" ? "bg-red-500/20 text-red-400 border-red-500/30" : "bg-amber-500/20 text-amber-400 border-amber-500/30")}`)}>${escape_html(ip.clients?.length)} clients</span></div>`);
    }
    $$renderer2.push(`<!--]--></div> <div class="flex gap-1 mt-2 ml-[216px]"><!--[-->`);
    const each_array_2 = ensure_array_like(allClients);
    for (let $$index_2 = 0, $$length = each_array_2.length; $$index_2 < $$length; $$index_2++) {
      let client = each_array_2[$$index_2];
      $$renderer2.push(`<div${attr_class(`w-20 text-[10px] text-center ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} truncate px-0.5`)}${attr("title", client)}>${escape_html(clientShort(client))}</div>`);
    }
    $$renderer2.push(`<!--]--></div></div> `);
    if (!ips.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="text-center py-8 text-gray-500 text-sm">Aucune IP ne touche plusieurs clients</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { ips, darkMode: darkMode2 });
  });
}
function ClientHeatmapHourly($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let clientList, maxVal;
    let heatmapData = fallback($$props["heatmapData"], () => ({ data: {}, clients: [], maxVal: 1 }), true);
    let darkMode2 = fallback($$props["darkMode"], true);
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    function cellColor(value, maxVal2) {
      if (value === 0) return darkMode2 ? "rgba(26,29,39,1)" : "rgba(241,245,249,1)";
      const ratio = Math.min(value / maxVal2, 1);
      if (ratio > 0.7) return `rgba(239,68,68,${0.4 + ratio * 0.6})`;
      if (ratio > 0.3) return `rgba(245,158,11,${0.3 + ratio * 0.5})`;
      return `rgba(99,102,241,${0.15 + ratio * 0.5})`;
    }
    function textColor(value, maxVal2) {
      if (value === 0) return darkMode2 ? "#374151" : "#d1d5db";
      const ratio = value / maxVal2;
      return ratio > 0.3 ? "#fff" : darkMode2 ? "#9ca3af" : "#6b7280";
    }
    const hours = Array.from({ length: 24 }, (_, i) => i);
    function shortName(name) {
      return name.replace("Client ", "").slice(0, 8);
    }
    clientList = heatmapData.clients ?? [];
    maxVal = heatmapData.maxVal ?? 1;
    $$renderer2.push(`<div class="overflow-x-auto"><div class="min-w-max text-xs"><div class="flex"><div class="w-28 shrink-0"></div> <!--[-->`);
    const each_array = ensure_array_like(hours);
    for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
      let h = each_array[$$index];
      $$renderer2.push(`<div${attr_class(`w-9 text-center ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} py-1 font-mono text-[10px]`)}>${escape_html(String(h).padStart(2, "0"))}</div>`);
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`w-16 text-right ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} py-1 px-1 text-[10px]`)}>Total</div></div> <!--[-->`);
    const each_array_1 = ensure_array_like(clientList);
    for (let $$index_2 = 0, $$length = each_array_1.length; $$index_2 < $$length; $$index_2++) {
      let client = each_array_1[$$index_2];
      const row = heatmapData.data[client] ?? Array(24).fill(0);
      const rowTotal = row.reduce((s, v) => s + v, 0);
      $$renderer2.push(`<div class="flex items-center mb-0.5"><div class="w-28 shrink-0 pr-2 text-right"><span${attr_class(`${stringify(darkMode2 ? "text-gray-400" : "text-gray-600")} font-medium truncate block`)}${attr("title", client)}>${escape_html(shortName(client))}</span></div> <!--[-->`);
      const each_array_2 = ensure_array_like(hours);
      for (let $$index_1 = 0, $$length2 = each_array_2.length; $$index_1 < $$length2; $$index_1++) {
        let h = each_array_2[$$index_1];
        const val = row[h] ?? 0;
        $$renderer2.push(`<div class="w-9 h-7 flex items-center justify-center rounded-sm mx-px cursor-default transition-all hover:scale-110 hover:z-10 relative"${attr_style(`background:${stringify(cellColor(val, maxVal))};color:${stringify(textColor(val, maxVal))}`)}${attr("title", `${stringify(client)} — ${stringify(String(h).padStart(2, "0"))}h : ${stringify(fmt(val))} req.`)}>`);
        if (val > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<span class="font-bold text-[9px] leading-none select-none">${escape_html(val >= 1e3 ? Math.round(val / 1e3) + "k" : val)}</span>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div>`);
      }
      $$renderer2.push(`<!--]--> <div${attr_class(`w-16 text-right px-1 font-bold ${stringify(darkMode2 ? "text-gray-400" : "text-gray-600")} font-mono text-[10px]`)}>${escape_html(fmt(rowTotal))}</div></div>`);
    }
    $$renderer2.push(`<!--]--> <div${attr_class(`flex mt-1 pt-1 border-t ${stringify(darkMode2 ? "border-[#2a2d3a]" : "border-slate-200")}`)}><div${attr_class(`w-28 shrink-0 pr-2 text-right ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} text-[10px] font-semibold self-center`)}>TOTAL</div> <!--[-->`);
    const each_array_3 = ensure_array_like(hours);
    for (let $$index_3 = 0, $$length = each_array_3.length; $$index_3 < $$length; $$index_3++) {
      let h = each_array_3[$$index_3];
      const colTotal = clientList.reduce((s, c) => s + (heatmapData.data[c]?.[h] ?? 0), 0);
      $$renderer2.push(`<div${attr_class(`w-9 h-6 flex items-center justify-center text-[9px] font-bold ${stringify(darkMode2 ? "text-gray-500" : "text-gray-500")} font-mono`)}>${escape_html(colTotal >= 1e3 ? Math.round(colTotal / 1e3) + "k" : colTotal || "")}</div>`);
    }
    $$renderer2.push(`<!--]--></div></div> <div${attr_class(`flex items-center gap-3 mt-3 pt-3 border-t ${stringify(darkMode2 ? "border-[#2a2d3a]" : "border-slate-200")}`)}><span${attr_class(`text-[10px] ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} uppercase tracking-wider`)}>Intensité :</span> <div class="flex items-center gap-1"><!--[-->`);
    const each_array_4 = ensure_array_like(["Nulle", "Faible", "Modérée", "Élevée", "Critique"]);
    for (let i = 0, $$length = each_array_4.length; i < $$length; i++) {
      let label = each_array_4[i];
      $$renderer2.push(`<div class="flex items-center gap-1"><div class="w-5 h-3 rounded-sm"${attr_style(`background:${stringify([
        "rgba(26,29,39,1)",
        "rgba(99,102,241,0.4)",
        "rgba(245,158,11,0.5)",
        "rgba(239,68,68,0.7)",
        "rgba(239,68,68,1)"
      ][i])}`)}></div> <span${attr_class(`text-[10px] ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(label)}</span></div>`);
    }
    $$renderer2.push(`<!--]--></div></div></div>`);
    bind_props($$props, { heatmapData, darkMode: darkMode2 });
  });
}
function RiskScoreGauge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let pct, fillArc, dashArray, rotation, color, label, labelColor;
    let score = fallback($$props["score"], 0);
    let darkMode2 = fallback($$props["darkMode"], true);
    const R = 54;
    const CX = 70;
    const CY = 70;
    const FULL = 2 * Math.PI * R;
    const ARC = FULL * 0.75;
    pct = Math.min(score / 10, 1);
    fillArc = ARC * pct;
    dashArray = `${fillArc} ${FULL}`;
    rotation = "rotate(135, 70, 70)";
    color = score >= 8 ? "#ef4444" : score >= 5 ? "#f59e0b" : score >= 3 ? "#f97316" : "#22c55e";
    label = score >= 8 ? "CRITIQUE" : score >= 5 ? "ÉLEVÉ" : score >= 3 ? "MODÉRÉ" : "FAIBLE";
    labelColor = score >= 8 ? "text-red-400" : score >= 5 ? "text-amber-400" : score >= 3 ? "text-orange-400" : "text-green-400";
    $$renderer2.push(`<div class="flex flex-col items-center gap-1"><div class="relative"><svg width="140" height="100" viewBox="0 0 140 100"><circle${attr("cx", CX)}${attr("cy", CY)}${attr("r", R)} fill="none"${attr("stroke", darkMode2 ? "#22263a" : "#e2e8f0")} stroke-width="10"${attr("stroke-dasharray", `${stringify(ARC)} ${stringify(FULL)}`)} stroke-dashoffset="0" stroke-linecap="round"${attr("transform", rotation)}></circle><circle${attr("cx", CX)}${attr("cy", CY)}${attr("r", R)} fill="none"${attr("stroke", color)} stroke-width="10"${attr("stroke-dasharray", dashArray)} stroke-dashoffset="0" stroke-linecap="round"${attr("transform", rotation)} style="transition: stroke-dasharray 0.8s ease, stroke 0.4s ease;"></circle><text${attr("x", CX)}${attr("y", CY - 4)} text-anchor="middle" dominant-baseline="middle" font-size="24" font-weight="bold"${attr("fill", color)}>${escape_html(score?.toFixed(1))}</text><text${attr("x", CX)}${attr("y", CY + 16)} text-anchor="middle" font-size="9"${attr("fill", darkMode2 ? "#6b7280" : "#9ca3af")} font-weight="600" letter-spacing="1">/10</text></svg></div> <div class="text-center -mt-2"><span${attr_class(`text-xs font-bold tracking-widest ${stringify(labelColor)} uppercase`)}>${escape_html(label)}</span> <p${attr_class(`text-[10px] ${stringify(darkMode2 ? "text-gray-600" : "text-gray-400")} mt-0.5`)}>Score de risque global</p></div></div>`);
    bind_props($$props, { score, darkMode: darkMode2 });
  });
}
function ExecutiveSummary($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let s, sm, lines;
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n ?? 0);
    }
    s = store_get($$store_subs ??= {}, "$executiveSummary", executiveSummary);
    sm = store_get($$store_subs ??= {}, "$summary", summary);
    lines = s && sm ? [
      `📅 Rapport du ${store_get($$store_subs ??= {}, "$dateLabel", dateLabel)} — ${fmt(sm.totalEvents)} événements analysés sur ${sm.totalClients} clients Cloudflare WAF.`,
      `🔴 ${fmt(sm.critiques)} alertes critiques détectées sur ${s.alertClients} client${s.alertClients > 1 ? "s" : ""}, soit ${s.criticalRatio}% du volume total.`,
      `🕐 Pic d'activité observé à ${String(s.peakHour).padStart(2, "0")}h00 UTC. Tactique MITRE dominante : ${s.topTactic}.`,
      `🌍 Pays d'origine principal : ${s.topCountry}. ${s.multiHitIPs} IP${s.multiHitIPs > 1 ? "s identifiées ciblant" : " identifiée ciblant"} plusieurs clients simultanément.`,
      sm.totalUnblocked > 0 ? `⚠️ ATTENTION : ${fmt(sm.totalUnblocked)} requête${sm.totalUnblocked > 1 ? "s" : ""} non bloquée${sm.totalUnblocked > 1 ? "s" : ""} — investigation immédiate requise.` : `✅ Aucune requête malveillante n'a franchi les règles WAF sur cette période.`
    ] : [];
    if (lines.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`relative ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-indigo-950/30 border-indigo-500/20" : "bg-indigo-50 border-indigo-200")} border rounded-xl p-4`)}><div class="flex items-start justify-between gap-3 mb-3"><div class="flex items-center gap-2"><div class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div> <p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-indigo-400" : "text-indigo-600")}`)}>Résumé exécutif — Auto-généré</p></div> <button${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500 hover:text-gray-300" : "text-gray-400 hover:text-gray-600")} transition-colors flex items-center gap-1`)}>${escape_html("📋 Copier")}</button></div> <div class="space-y-1.5"><!--[-->`);
      const each_array = ensure_array_like(lines);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let line = each_array[$$index];
        $$renderer2.push(`<p${attr_class(`text-sm ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")} leading-relaxed`)}>${escape_html(line)}</p>`);
      }
      $$renderer2.push(`<!--]--></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]-->`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
function _page($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    var $$store_subs;
    let mitreDonut, levelDonut, levelTotal;
    const MITRE_COLORS = {
      "Reconnaissance": "#6366f1",
      "Credential Access": "#ef4444",
      "Defense Evasion": "#3b82f6",
      "Exploitation": "#dc2626",
      "Initial Access": "#f59e0b",
      "Other": "#6b7280"
    };
    mitreDonut = store_get($$store_subs ??= {}, "$mitreTactics", mitreTactics).map((t) => ({
      label: t.tactic,
      value: t.count,
      color: t.color ?? MITRE_COLORS[t.tactic] ?? "#6b7280"
    }));
    levelDonut = [
      {
        label: "Critique",
        value: store_get($$store_subs ??= {}, "$summary", summary)?.critiques ?? 0,
        color: "#ef4444"
      },
      {
        label: "Moyen",
        value: store_get($$store_subs ??= {}, "$summary", summary)?.moyens ?? 0,
        color: "#f59e0b"
      },
      {
        label: "Faible",
        value: store_get($$store_subs ??= {}, "$summary", summary)?.faibles ?? 0,
        color: "#f97316"
      }
    ];
    levelTotal = (store_get($$store_subs ??= {}, "$summary", summary)?.critiques ?? 0) + (store_get($$store_subs ??= {}, "$summary", summary)?.moyens ?? 0) + (store_get($$store_subs ??= {}, "$summary", summary)?.faibles ?? 0);
    $$renderer2.push(`<div class="p-5 space-y-5">`);
    ExecutiveSummary($$renderer2);
    $$renderer2.push(`<!----> <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 items-stretch">`);
    SparklineKPI($$renderer2, {
      label: "Événements totaux",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.totalEvents ?? 0,
      icon: "📡",
      color: "#6366f1",
      subtitle: "Dernières 24h",
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).total,
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).totalEvents
    });
    $$renderer2.push(`<!----> `);
    SparklineKPI($$renderer2, {
      label: "Clients touchés",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.clientsHit ?? 0,
      icon: "🏢",
      color: "#f59e0b",
      subtitle: `${stringify(store_get($$store_subs ??= {}, "$summary", summary)?.totalClients ?? 0)} total`,
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).total.map((v) => Math.min(v, store_get($$store_subs ??= {}, "$summary", summary)?.clientsHit ?? 0)),
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).clientsHit
    });
    $$renderer2.push(`<!----> `);
    SparklineKPI($$renderer2, {
      label: "Critiques",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.critiques ?? 0,
      icon: "🔴",
      color: "#ef4444",
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).critique,
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).critiques
    });
    $$renderer2.push(`<!----> `);
    SparklineKPI($$renderer2, {
      label: "Moyens",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.moyens ?? 0,
      icon: "🟡",
      color: "#f59e0b",
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).moyen,
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).moyens
    });
    $$renderer2.push(`<!----> `);
    SparklineKPI($$renderer2, {
      label: "Faibles",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.faibles ?? 0,
      icon: "🟠",
      color: "#f97316",
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).faible,
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).faibles
    });
    $$renderer2.push(`<!----> `);
    SparklineKPI($$renderer2, {
      label: "Non bloqués",
      value: store_get($$store_subs ??= {}, "$summary", summary)?.totalUnblocked ?? 0,
      icon: "⚠️",
      warning: true,
      subtitle: "Requêtes passées",
      sparkData: store_get($$store_subs ??= {}, "$sparklines", sparklines).total.map(() => store_get($$store_subs ??= {}, "$summary", summary)?.totalUnblocked ?? 0),
      delta: store_get($$store_subs ??= {}, "$deltaJ1", deltaJ1).totalUnblocked
    });
    $$renderer2.push(`<!----> `);
    if (store_get($$store_subs ??= {}, "$riskScore", riskScore) !== null) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-3 flex items-center justify-center hover:border-indigo-500/30 transition-colors">`);
      RiskScoreGauge($$renderer2, {
        score: store_get($$store_subs ??= {}, "$riskScore", riskScore),
        darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> <section id="clients"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).clients ? "" : "-rotate-90")}`)}>▼</span> Statut des clients</button> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(store_get($$store_subs ??= {}, "$clients", clients).length)} clients surveillés</span></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).clients) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3"><!--[-->`);
      const each_array = ensure_array_like(store_get($$store_subs ??= {}, "$clients", clients));
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let client = each_array[$$index];
        const status = client.status || (client.critiques > 0 ? "alert" : client.moyens > 5 ? "warning" : client.totalEvents > 100 ? "elevated" : "clean");
        const cfg = {
          alert: {
            border: "border-red-500/50",
            bg: "bg-red-500/10",
            dot: "bg-red-400",
            text: "text-red-400",
            label: "Alerte"
          },
          warning: {
            border: "border-amber-500/50",
            bg: "bg-amber-500/10",
            dot: "bg-amber-400",
            text: "text-amber-400",
            label: "Avertissement"
          },
          elevated: {
            border: "border-orange-500/50",
            bg: "bg-orange-500/10",
            dot: "bg-orange-400",
            text: "text-orange-400",
            label: "Élevé"
          },
          clean: {
            border: "border-green-500/30",
            bg: "bg-green-500/5",
            dot: "bg-green-400",
            text: "text-green-400",
            label: "Normal"
          }
        }[status] ?? {
          border: "border-green-500/30",
          bg: "bg-green-500/5",
          dot: "bg-green-400",
          text: "text-green-400",
          label: "Normal"
        };
        $$renderer2.push(`<button${attr_class(`border rounded-xl p-3 text-left hover:scale-[1.03] active:scale-100 transition-all duration-200 cursor-pointer w-full ${stringify(cfg.border)} ${stringify(cfg.bg)}`)}><div class="flex items-center gap-1.5 mb-2"><span${attr_class(`w-2 h-2 rounded-full ${stringify(cfg.dot)} animate-pulse`)}></span> <span${attr_class(`text-xs font-semibold ${stringify(cfg.text)}`)}>${escape_html(cfg.label)}</span></div> <p class="text-sm font-bold text-gray-200 truncate leading-tight">${escape_html(client.client)}</p> <p class="text-xs text-gray-500 truncate mb-2">${escape_html(client.domain)}</p> <div class="grid grid-cols-2 gap-1 text-xs"><div><span class="text-gray-500">Critique</span><p class="font-bold text-red-400">${escape_html(client.critiques)}</p></div> <div><span class="text-gray-500">Total</span><p class="font-bold text-gray-300">${escape_html(new Intl.NumberFormat("fr-FR").format(client.totalEvents))}</p></div> `);
        if (client.totalUnblocked > 0) {
          $$renderer2.push("<!--[0-->");
          $$renderer2.push(`<div class="col-span-2 mt-1 bg-red-500/20 rounded px-1.5 py-0.5 border border-red-500/30"><span class="text-red-300 font-bold text-[10px]">⚠ ${escape_html(client.totalUnblocked)} non-bloqué${escape_html(client.totalUnblocked > 1 ? "s" : "")}</span></div>`);
        } else {
          $$renderer2.push("<!--[-1-->");
        }
        $$renderer2.push(`<!--]--></div> <p class="text-[10px] text-gray-600 mt-2">Cliquer pour détails →</p></button>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section id="timeline"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).timeline ? "" : "-rotate-90")}`)}>▼</span> Évolution des alertes</button></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).timeline) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-3 gap-5"><div${attr_class(`lg:col-span-2 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")} mb-3`)}>Alertes par heure — 24h · par niveau de sévérité</p> `);
      Timeline($$renderer2, {
        data: store_get($$store_subs ??= {}, "$timeline", timeline)
      });
      $$renderer2.push(`<!----></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Répartition par niveau</p> `);
      DonutChart($$renderer2, {
        data: levelDonut,
        size: 160,
        showLegend: true,
        centerLabel: new Intl.NumberFormat("fr-FR").format(levelTotal)
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section id="mitre"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).mitre ? "" : "-rotate-90")}`)}>▼</span> MITRE ATT&amp;CK — Top Chemins</button></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).mitre) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><div class="flex items-center justify-between mb-4"><p${attr_class(`text-xs font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>MITRE ATT&amp;CK — Tactiques</p> <span class="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">WAF mapping</span></div> <div class="flex gap-6 items-start">`);
      DonutChart($$renderer2, {
        data: mitreDonut,
        size: 180,
        showLegend: false,
        centerLabel: String(mitreDonut.reduce((s, d) => s + d.value, 0))
      });
      $$renderer2.push(`<!----> <div class="flex-1 space-y-2 min-w-0"><!--[-->`);
      const each_array_1 = ensure_array_like(mitreDonut);
      for (let $$index_1 = 0, $$length = each_array_1.length; $$index_1 < $$length; $$index_1++) {
        let item = each_array_1[$$index_1];
        const total = mitreDonut.reduce((s, d) => s + d.value, 0);
        const pct = total > 0 ? Math.round(item.value / total * 100) : 0;
        $$renderer2.push(`<div><div class="flex items-center justify-between text-xs mb-1"><div class="flex items-center gap-1.5 min-w-0"><span class="w-2 h-2 rounded-full shrink-0"${attr_style(`background:${stringify(item.color)}`)}></span> <span${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-300" : "text-gray-700")} truncate font-medium`)}>${escape_html(item.label)}</span></div> <span${attr_class(`font-bold ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400" : "text-gray-600")} shrink-0 ml-2`)}>${escape_html(pct)}%</span></div> <div${attr_class(`h-1 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#22263a]" : "bg-slate-100")} rounded-full overflow-hidden`)}><div class="h-full rounded-full"${attr_style(`width:${stringify(pct)}%;background:${stringify(item.color)}99`)}></div></div></div>`);
      }
      $$renderer2.push(`<!--]--></div></div></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Top chemins attaqués</p> `);
      TopPathsChart($$renderer2, {
        data: store_get($$store_subs ??= {}, "$topPaths", topPaths),
        darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section id="heatmap"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).heatmap ? "" : "-rotate-90")}`)}>▼</span> Heatmap Horaire — Activité par client</button> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>Requêtes par heure UTC</span></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).heatmap) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}>`);
      ClientHeatmapHourly($$renderer2, {
        heatmapData: store_get($$store_subs ??= {}, "$clientHourlyData", clientHourlyData),
        darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section id="multi-client"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).multiClient ? "" : "-rotate-90")}`)}>▼</span> Vue Multi-Clients — IPs Transverses</button> <span${attr_class(`text-xs ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-600" : "text-gray-400")}`)}>${escape_html(store_get($$store_subs ??= {}, "$multiClientIPs", multiClientIPs).length)} IP${escape_html(store_get($$store_subs ??= {}, "$multiClientIPs", multiClientIPs).length > 1 ? "s" : "")} touchant plusieurs clients</span></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).multiClient) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}>`);
      MultiClientGraph($$renderer2, {
        ips: store_get($$store_subs ??= {}, "$multiClientIPs", multiClientIPs),
        darkMode: store_get($$store_subs ??= {}, "$darkMode", darkMode)
      });
      $$renderer2.push(`<!----></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section> <section id="top-ips"><div class="flex items-center justify-between mb-3"><button${attr_class(`flex items-center gap-2 text-sm font-semibold uppercase tracking-wider ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-400 hover:text-gray-200" : "text-gray-500 hover:text-gray-700")} transition-colors`)}><span${attr_class(`transition-transform duration-200 ${stringify(store_get($$store_subs ??= {}, "$sections", sections).topIPs ? "" : "-rotate-90")}`)}>▼</span> Top IPs &amp; Pays</button></div> `);
    if (store_get($$store_subs ??= {}, "$sections", sections).topIPs) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="grid grid-cols-1 lg:grid-cols-2 gap-5"><div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Top 10 IPs — Score de menace</p> `);
      TopIPs($$renderer2, { ips: store_get($$store_subs ??= {}, "$topIPs", topIPs) });
      $$renderer2.push(`<!----></div> <div${attr_class(`${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "bg-[#1a1d27] border-[#2a2d3a]" : "bg-white border-slate-200")} border rounded-xl p-4`)}><p${attr_class(`text-xs font-semibold uppercase tracking-wider mb-4 ${stringify(store_get($$store_subs ??= {}, "$darkMode", darkMode) ? "text-gray-500" : "text-gray-400")}`)}>Top 10 Pays — Volume d'attaques</p> `);
      TopCountries($$renderer2, {
        countries: store_get($$store_subs ??= {}, "$topCountries", topCountries)
      });
      $$renderer2.push(`<!----></div></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></section></div>`);
    if ($$store_subs) unsubscribe_stores($$store_subs);
  });
}
export {
  _page as default
};
