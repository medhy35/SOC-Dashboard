import { f as fallback, a as attr_class, c as escape_html, h as bind_props, b as stringify } from "./index2.js";
function LevelBadge($$renderer, $$props) {
  $$renderer.component(($$renderer2) => {
    let level = fallback($$props["level"], "faible");
    let size = fallback($$props["size"], "sm");
    const labels = { critique: "CRITIQUE", moyen: "MOYEN", faible: "FAIBLE" };
    const classes = {
      critique: "bg-red-500/20 text-red-400 border-red-500/40",
      moyen: "bg-amber-500/20 text-amber-400 border-amber-500/40",
      faible: "bg-orange-500/20 text-orange-400 border-orange-500/40"
    };
    const dots = {
      critique: "bg-red-400",
      moyen: "bg-amber-400",
      faible: "bg-orange-400"
    };
    $$renderer2.push(`<span${attr_class(`inline-flex items-center gap-1 border rounded-full font-semibold ${stringify(size === "sm" ? "px-2 py-0.5 text-xs" : "px-3 py-1 text-sm")} ${stringify(classes[level] ?? classes.faible)}`)}><span${attr_class(`w-1.5 h-1.5 rounded-full ${stringify(dots[level] ?? dots.faible)}`)}></span> ${escape_html(labels[level] ?? level.toUpperCase())}</span>`);
    bind_props($$props, { level, size });
  });
}
export {
  LevelBadge as L
};
