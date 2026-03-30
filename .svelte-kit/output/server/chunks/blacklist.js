import { w as writable, d as derived } from "./index.js";
import "./data.js";
const KEY = "1t3r_blacklist";
function load() {
  try {
    const r = localStorage.getItem(KEY);
    return r ? JSON.parse(r) : {};
  } catch {
    return {};
  }
}
function save(d) {
  try {
    localStorage.setItem(KEY, JSON.stringify(d));
  } catch {
  }
}
const blacklist = writable(typeof window !== "undefined" ? load() : {});
blacklist.subscribe(save);
const blacklistStats = derived(blacklist, ($bl) => {
  const all = Object.values($bl);
  return {
    total: all.length,
    critique: all.filter((i) => i.score >= 8).length,
    moyen: all.filter((i) => i.score >= 5 && i.score < 8).length,
    auto: all.filter((i) => i.source === "auto").length,
    manual: all.filter((i) => i.source === "manual").length,
    countries: [...new Set(all.map((i) => i.country))].length,
    asns: [...new Set(all.map((i) => i.asn))].length
  };
});
export {
  blacklistStats as a,
  blacklist as b
};
