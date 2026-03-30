import { w as writable } from "./index.js";
const stored = typeof localStorage !== "undefined" ? localStorage.getItem("sidebar-collapsed") : null;
const sidebarCollapsed = writable(stored === "true");
sidebarCollapsed.subscribe((v) => {
  if (typeof localStorage !== "undefined") localStorage.setItem("sidebar-collapsed", String(v));
});
const toasts = writable([]);
let toastId = 0;
function addToast(message, type = "info", duration = 3500) {
  const id = ++toastId;
  toasts.update((t) => [...t, { id, message, type }]);
  setTimeout(() => removeToast(id), duration);
  return id;
}
function removeToast(id) {
  toasts.update((t) => t.filter((x) => x.id !== id));
}
const autoRefreshInterval = writable(0);
const autoRefreshCountdown = writable(0);
const defaultSections = {
  clients: true,
  timeline: true,
  mitre: true,
  paths: true,
  heatmap: true,
  multiClient: true,
  topIPs: true
};
const sections = writable({ ...defaultSections });
const showShortcuts = writable(false);
const activeClient = writable(null);
export {
  activeClient as a,
  autoRefreshInterval as b,
  autoRefreshCountdown as c,
  addToast as d,
  sidebarCollapsed as e,
  sections as f,
  showShortcuts as s,
  toasts as t
};
