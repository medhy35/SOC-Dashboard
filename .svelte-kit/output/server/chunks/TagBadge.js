import { f as fallback, a as attr_class, c as escape_html, h as bind_props, b as stringify } from "./index2.js";
function TagBadge($$renderer, $$props) {
  let colorClass;
  let tag = fallback($$props["tag"], "");
  const tagColors = {
    "exploitation": "bg-red-500/20 text-red-400 border-red-500/30",
    "non-bloqué": "bg-red-600/20 text-red-300 border-red-600/30",
    "scanner": "bg-orange-500/20 text-orange-400 border-orange-500/30",
    "brute-force": "bg-amber-500/20 text-amber-400 border-amber-500/30",
    "vpn-datacenter": "bg-purple-500/20 text-purple-400 border-purple-500/30",
    "bot": "bg-blue-500/20 text-blue-400 border-blue-500/30",
    "tor": "bg-pink-500/20 text-pink-400 border-pink-500/30",
    "proxy": "bg-cyan-500/20 text-cyan-400 border-cyan-500/30",
    "default": "bg-gray-500/20 text-gray-400 border-gray-500/30"
  };
  colorClass = tagColors[tag] ?? tagColors.default;
  $$renderer.push(`<span${attr_class(`inline-flex items-center border rounded-full px-2 py-0.5 text-xs font-medium ${stringify(colorClass)}`)}>${escape_html(tag)}</span>`);
  bind_props($$props, { tag });
}
export {
  TagBadge as T
};
