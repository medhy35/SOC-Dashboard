import { writable, derived, get } from 'svelte/store';
import { alerts, topIPs } from './data.js';

const KEY = '1t3r_blacklist';
function load() { try { const r = localStorage.getItem(KEY); return r ? JSON.parse(r) : {}; } catch { return {}; } }
function save(d) { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch {} }

export const blacklist = writable(typeof window !== 'undefined' ? load() : {});
blacklist.subscribe(save);

export function addIP(ip, meta = {}) {
	blacklist.update(bl => ({
		...bl,
		[ip]: {
			ip,
			addedAt: new Date().toISOString(),
			score: meta.score ?? 0,
			hits: meta.count ?? 0,
			clients: meta.clients ?? [],
			country: meta.country ?? '?',
			asn: meta.asn ?? '?',
			tags: meta.tags ?? [],
			source: meta.source ?? 'manual',
			notes: meta.notes ?? '',
			level: meta.level ?? 'faible',
		}
	}));
}

export function removeIP(ip) {
	blacklist.update(bl => { const n = { ...bl }; delete n[ip]; return n; });
}

export function updateIP(ip, updates) {
	blacklist.update(bl => ({ ...bl, [ip]: { ...bl[ip], ...updates } }));
}

// Auto-populate from current data (score >= 7)
export function autoPopulate(ipsData) {
	const high = ipsData.filter(ip => ip.score >= 7);
	blacklist.update(bl => {
		const next = { ...bl };
		high.forEach(ip => {
			if (!next[ip.ip]) {
				next[ip.ip] = {
					ip: ip.ip, addedAt: new Date().toISOString(),
					score: ip.score, hits: ip.count,
					clients: ip.clients ?? [], country: ip.country ?? '?',
					asn: ip.asn ?? '?', tags: ip.tags ?? [],
					source: 'auto', notes: '', level: ip.level ?? 'critique',
				};
			}
		});
		return next;
	});
}

// Export formats
export function exportPlainText(bl) {
	return Object.keys(bl).join('\n');
}

export function exportCSV(bl) {
	const rows = [['IP','Score','Niveau','Pays','ASN','Tags','Hits','Clients','Source','Ajouté le']];
	Object.values(bl).forEach(ip => {
		rows.push([
			ip.ip, ip.score, ip.level, ip.country, ip.asn,
			(ip.tags ?? []).join('|'), ip.hits,
			(ip.clients ?? []).join('|'), ip.source,
			new Date(ip.addedAt).toLocaleDateString('fr-FR')
		]);
	});
	return rows.map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
}

export function exportCloudflareList(bl) {
	const header = `# 1T3R Blacklist — Cloudflare IP List format\n# Generated: ${new Date().toISOString()}\n# Import via: Cloudflare Dashboard > Security > WAF > IP Lists\n`;
	return header + Object.keys(bl).join('\n');
}

export function exportJSON(bl) {
	return JSON.stringify({
		name: '1T3R SOC Blacklist',
		generated: new Date().toISOString(),
		version: '1.0',
		count: Object.keys(bl).length,
		ips: Object.values(bl)
	}, null, 2);
}

// Stats
export const blacklistStats = derived(blacklist, $bl => {
	const all = Object.values($bl);
	return {
		total: all.length,
		critique: all.filter(i => i.score >= 8).length,
		moyen: all.filter(i => i.score >= 5 && i.score < 8).length,
		auto: all.filter(i => i.source === 'auto').length,
		manual: all.filter(i => i.source === 'manual').length,
		countries: [...new Set(all.map(i => i.country))].length,
		asns: [...new Set(all.map(i => i.asn))].length,
	};
});
