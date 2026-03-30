import { f as fallback, c as escape_html, j as attr_style, d as attr, e as ensure_array_like, b as stringify, h as bind_props } from "./index2.js";
import { o as onDestroy } from "./index-server.js";
function DonutChart($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let data = fallback($$props["data"], () => [], true);
    let title = fallback($$props["title"], "");
    let size = fallback($$props["size"], 180);
    let showLegend = fallback($$props["showLegend"], true);
    let centerLabel = fallback($$props["centerLabel"], "");
    let chart;
    function fmt(n) {
      return new Intl.NumberFormat("fr-FR").format(n);
    }
    onDestroy(() => chart?.destroy());
    $$renderer2.push(`<div class="flex flex-col items-center gap-3">`);
    if (title) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<p class="text-xs font-semibold uppercase tracking-wider text-gray-500">${escape_html(title)}</p>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> <div class="relative"${attr_style(`width:${stringify(size)}px;height:${stringify(size)}px`)}><canvas${attr("width", size)}${attr("height", size)}></canvas> `);
    if (centerLabel) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none"><p class="text-lg font-bold text-gray-200">${escape_html(centerLabel)}</p> <p class="text-[10px] text-gray-500 uppercase">total</p></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--> `);
    if (!data.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">Aucune donnée</div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div> `);
    if (showLegend && data.length) {
      $$renderer2.push("<!--[0-->");
      $$renderer2.push(`<div class="flex flex-col gap-1.5 w-full"><!--[-->`);
      const each_array = ensure_array_like(data);
      for (let $$index = 0, $$length = each_array.length; $$index < $$length; $$index++) {
        let item = each_array[$$index];
        const total = data.reduce((s, d) => s + d.value, 0);
        const pct = total > 0 ? Math.round(item.value / total * 100) : 0;
        $$renderer2.push(`<div class="flex items-center justify-between gap-2 text-xs"><div class="flex items-center gap-1.5 min-w-0"><span class="w-2.5 h-2.5 rounded-full shrink-0"${attr_style(`background:${stringify(item.color)}`)}></span> <span class="text-gray-400 truncate">${escape_html(item.label)}</span></div> <div class="flex items-center gap-2 shrink-0"><span class="font-bold text-gray-300">${escape_html(fmt(item.value))}</span> <span class="text-gray-600 w-8 text-right">${escape_html(pct)}%</span></div></div>`);
      }
      $$renderer2.push(`<!--]--></div>`);
    } else {
      $$renderer2.push("<!--[-1-->");
    }
    $$renderer2.push(`<!--]--></div>`);
    bind_props($$props, { data, title, size, showLegend, centerLabel });
  });
}
export {
  DonutChart as D
};
