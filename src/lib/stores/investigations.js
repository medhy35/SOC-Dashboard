import { writable, derived, get } from 'svelte/store';

const STORAGE_KEY = '1t3r_investigations';

function loadFromStorage() {
	try {
		const raw = localStorage.getItem(STORAGE_KEY);
		return raw ? JSON.parse(raw) : {};
	} catch { return {}; }
}

function saveToStorage(data) {
	try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)); } catch {}
}

export const investigations = writable(typeof window !== 'undefined' ? loadFromStorage() : {});
investigations.subscribe(saveToStorage);

export const STATUS = {
	new:           { label: 'Nouveau',       color: 'bg-blue-500/20 text-blue-400 border-blue-500/30',    icon: '🔵' },
	investigating: { label: 'En cours',      color: 'bg-amber-500/20 text-amber-400 border-amber-500/30', icon: '🔍' },
	resolved:      { label: 'Résolu',        color: 'bg-green-500/20 text-green-400 border-green-500/30', icon: '✅' },
	false_positive:{ label: 'Faux positif',  color: 'bg-gray-500/20 text-gray-400 border-gray-500/30',    icon: '⬜' },
	escalated:     { label: 'Escaladé',      color: 'bg-red-500/20 text-red-400 border-red-500/30',       icon: '🚨' },
};

export const PRIORITY = {
	critical: { label: 'Critique', color: 'text-red-400',    bg: 'bg-red-500/20',    border: 'border-red-500/30' },
	high:     { label: 'Haute',    color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' },
	medium:   { label: 'Moyenne',  color: 'text-amber-400',  bg: 'bg-amber-500/20',  border: 'border-amber-500/30' },
	low:      { label: 'Faible',   color: 'text-blue-400',   bg: 'bg-blue-500/20',   border: 'border-blue-500/30' },
};

export function getAlertKey(alert) {
	return `${alert.ip}::${alert.client}::${alert.firstSeen ?? ''}`;
}

export function createInvestigation(alert, assignedTo = '', priority = 'high') {
	const key = getAlertKey(alert);
	investigations.update(inv => {
		if (inv[key]) return inv;
		return {
			...inv,
			[key]: {
				id: key,
				ip: alert.ip,
				client: alert.client,
				domain: alert.domain,
				level: alert.level,
				score: alert.score,
				tags: alert.tags ?? [],
				paths: alert.paths ?? [],
				count: alert.count,
				countUnblocked: alert.countUnblocked ?? 0,
				firstSeen: alert.firstSeen,
				lastSeen: alert.lastSeen,
				status: 'new',
				priority,
				assignedTo,
				notes: '',
				createdAt: new Date().toISOString(),
				updatedAt: new Date().toISOString(),
				resolvedAt: null,
				slaDurationH: priority === 'critical' ? 1 : priority === 'high' ? 4 : priority === 'medium' ? 24 : 72,
			}
		};
	});
}

export function updateInvestigation(id, updates) {
	investigations.update(inv => {
		if (!inv[id]) return inv;
		return {
			...inv,
			[id]: {
				...inv[id],
				...updates,
				updatedAt: new Date().toISOString(),
				resolvedAt: updates.status === 'resolved' ? new Date().toISOString() : inv[id].resolvedAt,
			}
		};
	});
}

export function deleteInvestigation(id) {
	investigations.update(inv => {
		const next = { ...inv };
		delete next[id];
		return next;
	});
}

// Derived stats
export const investigationStats = derived(investigations, $inv => {
	const all = Object.values($inv);
	const now = Date.now();
	return {
		total:       all.length,
		new:         all.filter(i => i.status === 'new').length,
		inProgress:  all.filter(i => i.status === 'investigating').length,
		resolved:    all.filter(i => i.status === 'resolved').length,
		escalated:   all.filter(i => i.status === 'escalated').length,
		overdue:     all.filter(i => {
			if (i.status === 'resolved' || i.status === 'false_positive') return false;
			const deadline = new Date(i.createdAt).getTime() + i.slaDurationH * 3_600_000;
			return now > deadline;
		}).length,
		avgResolutionH: (() => {
			const resolved = all.filter(i => i.resolvedAt);
			if (!resolved.length) return null;
			const avg = resolved.reduce((s, i) => {
				return s + (new Date(i.resolvedAt) - new Date(i.createdAt)) / 3_600_000;
			}, 0) / resolved.length;
			return Math.round(avg * 10) / 10;
		})(),
	};
});

export function getSLAStatus(inv) {
	if (inv.status === 'resolved' || inv.status === 'false_positive') return 'ok';
	const deadline = new Date(inv.createdAt).getTime() + inv.slaDurationH * 3_600_000;
	const now = Date.now();
	const remaining = deadline - now;
	if (remaining < 0) return 'overdue';
	if (remaining < inv.slaDurationH * 3_600_000 * 0.25) return 'warning';
	return 'ok';
}

export function getSLARemaining(inv) {
	const deadline = new Date(inv.createdAt).getTime() + inv.slaDurationH * 3_600_000;
	const diff = deadline - Date.now();
	if (diff <= 0) return 'Dépassé';
	const h = Math.floor(diff / 3_600_000);
	const m = Math.floor((diff % 3_600_000) / 60_000);
	return h > 0 ? `${h}h ${m}m` : `${m}m`;
}
