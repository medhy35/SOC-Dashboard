import { writable, derived } from 'svelte/store';

export const historicalDays = writable([]);   // array of daily summary objects
export const manifest       = writable([]);   // array of {date, label, file}
export const historyLoading = writable(false);
export const selectedDate   = writable(null); // ISO date string

export async function loadManifest() {
	try {
		const res = await fetch('/data/manifest.json');
		if (!res.ok) return;
		const data = await res.json();
		manifest.set(data.files ?? []);
	} catch {}
}

export async function loadHistoricalData() {
	historyLoading.set(true);
	try {
		const res = await fetch('/data/manifest.json');
		if (!res.ok) return;
		const { files } = await res.json();

		const days = await Promise.all(
			files.map(async f => {
				try {
					const r = await fetch(`/data/${f.file}`);
					if (!r.ok) return null;
					const d = await r.json();
					return { ...d, _date: f.date, _label: f.label, _file: f.file };
				} catch { return null; }
			})
		);
		historicalDays.set(days.filter(Boolean).sort((a, b) => a._date.localeCompare(b._date)));
	} catch {} finally {
		historyLoading.set(false);
	}
}

// Trend data derived from historical days
export const trendData = derived(historicalDays, $days => {
	if (!$days.length) return null;
	return {
		labels:     $days.map(d => d._label),
		totalEvents:$days.map(d => d.summary?.totalEvents ?? 0),
		critiques:  $days.map(d => d.summary?.critiques ?? 0),
		moyens:     $days.map(d => d.summary?.moyens ?? 0),
		faibles:    $days.map(d => d.summary?.faibles ?? 0),
		unblocked:  $days.map(d => d.summary?.totalUnblocked ?? 0),
		clientsHit: $days.map(d => d.summary?.clientsHit ?? 0),
		riskScores: $days.map(d => {
			const s = d.summary;
			if (!s) return 0;
			const base = (s.critiques * 0.6 + s.moyens * 0.15 + s.faibles * 0.02 + (s.totalUnblocked ?? 0) * 3);
			const max  = Math.max(s.totalEvents * 0.05, 1);
			return Math.round(Math.min((base / max) * 10, 10) * 10) / 10;
		}),
	};
});

// Per-client evolution
export const clientTrend = derived(historicalDays, $days => {
	if (!$days.length) return {};
	const clientMap = {};
	$days.forEach(day => {
		(day.clients ?? []).forEach(c => {
			if (!clientMap[c.client]) clientMap[c.client] = [];
			clientMap[c.client].push({
				date: day._label,
				totalEvents: c.totalEvents,
				critiques: c.critiques,
				unblocked: c.totalUnblocked ?? 0,
			});
		});
	});
	return clientMap;
});

// New IPs per day (IPs not seen in previous days)
export const newIPsPerDay = derived(historicalDays, $days => {
	const seenIPs = new Set();
	return $days.map(day => {
		const dayIPs = (day.topIPs ?? []).map(ip => ip.ip);
		const newCount = dayIPs.filter(ip => !seenIPs.has(ip)).length;
		dayIPs.forEach(ip => seenIPs.add(ip));
		return { date: day._label, new: newCount, total: dayIPs.length };
	});
});
