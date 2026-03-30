import { writable, derived } from 'svelte/store';

// ── Sidebar ───────────────────────────────────────────────────────────────
const stored = typeof localStorage !== 'undefined' ? localStorage.getItem('sidebar-collapsed') : null;
export const sidebarCollapsed = writable(stored === 'true');
sidebarCollapsed.subscribe(v => {
	if (typeof localStorage !== 'undefined') localStorage.setItem('sidebar-collapsed', String(v));
});

// ── Toast notifications ───────────────────────────────────────────────────
export const toasts = writable([]);
let toastId = 0;

export function addToast(message, type = 'info', duration = 3500) {
	const id = ++toastId;
	toasts.update(t => [...t, { id, message, type }]);
	setTimeout(() => removeToast(id), duration);
	return id;
}
export function removeToast(id) {
	toasts.update(t => t.filter(x => x.id !== id));
}

// ── Auto-refresh ──────────────────────────────────────────────────────────
export const autoRefreshInterval = writable(0); // 0 = off, 30 / 60 / 300
export const autoRefreshCountdown = writable(0);

// ── Section collapse state ─────────────────────────────────────────────────
const defaultSections = {
	clients: true, timeline: true, mitre: true,
	paths: true, heatmap: true, multiClient: true, topIPs: true
};
export const sections = writable({ ...defaultSections });
export function toggleSection(key) {
	sections.update(s => ({ ...s, [key]: !s[key] }));
}
export function expandAll() { sections.set({ ...defaultSections }); }

// ── Compact mode (alerts table) ───────────────────────────────────────────
export const compactMode = writable(false);

// ── Keyboard shortcuts modal ──────────────────────────────────────────────
export const showShortcuts = writable(false);

// ── Client drawer ─────────────────────────────────────────────────────────
export const activeClient = writable(null); // client object or null

// ── Alert workflow status ─────────────────────────────────────────────────
// Map: ip+client → status
export const alertStatuses = writable({});
export function setAlertStatus(key, status) {
	alertStatuses.update(s => ({ ...s, [key]: status }));
}
export function getAlertKey(alert) {
	return `${alert.ip}::${alert.client}`;
}
