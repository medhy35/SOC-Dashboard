import { derived } from 'svelte/store';
import { alerts, clients, topIPs } from './data.js';

// ── Détection de campagnes coordonnées ───────────────────────────────────
// Une campagne est détectée quand :
// 1. Une IP touche 4+ clients différents
// 2. Un ASN regroupe 3+ IPs touchant chacune 2+ clients
// 3. Un pays envoie des alertes critiques sur 5+ clients le même jour

export const campaigns = derived([alerts, topIPs], ([$alerts, $topIPs]) => {
	const detected = [];

	// ── Type 1 : IP unique multi-clients ─────────────────────────────────
	const ipClientMap = {};
	$alerts.forEach(a => {
		if (!ipClientMap[a.ip]) ipClientMap[a.ip] = { ip: a.ip, clients: new Set(), requests: 0, level: a.level, asn: a.asn, country: a.country, score: a.score, tags: a.tags ?? [], firstSeen: a.firstSeen, lastSeen: a.lastSeen };
		ipClientMap[a.ip].clients.add(a.client);
		ipClientMap[a.ip].requests += a.count;
		if (a.score > ipClientMap[a.ip].score) { ipClientMap[a.ip].score = a.score; ipClientMap[a.ip].level = a.level; }
	});
	Object.values(ipClientMap).forEach(ip => {
		const clientList = [...ip.clients];
		if (clientList.length >= 4) {
			detected.push({
				id: `ip_${ip.ip}`,
				type: 'ip_sweep',
				severity: ip.level === 'critique' ? 'critique' : 'moyen',
				title: `IP transverse multi-clients`,
				description: `L'adresse ${ip.ip} a ciblé ${clientList.length} clients différents (${ip.requests.toLocaleString('fr-FR')} requêtes).`,
				affectedClients: clientList,
				affectedIPs: [ip.ip],
				asn: ip.asn,
				country: ip.country,
				score: ip.score,
				totalRequests: ip.requests,
				tags: ip.tags,
				firstSeen: ip.firstSeen,
				lastSeen: ip.lastSeen,
				icon: '🎯',
			});
		}
	});

	// ── Type 2 : Campagne par ASN ────────────────────────────────────────
	const asnMap = {};
	$alerts.forEach(a => {
		if (!a.asn) return;
		if (!asnMap[a.asn]) asnMap[a.asn] = { asn: a.asn, ips: new Set(), clients: new Set(), requests: 0, maxScore: 0, country: a.country };
		asnMap[a.asn].ips.add(a.ip);
		asnMap[a.asn].clients.add(a.client);
		asnMap[a.asn].requests += a.count;
		asnMap[a.asn].maxScore = Math.max(asnMap[a.asn].maxScore, a.score);
	});
	Object.values(asnMap).forEach(asn => {
		const ipList = [...asn.ips];
		const clientList = [...asn.clients];
		if (ipList.length >= 3 && clientList.length >= 3) {
			detected.push({
				id: `asn_${asn.asn}`,
				type: 'asn_campaign',
				severity: asn.maxScore >= 8 ? 'critique' : 'moyen',
				title: `Campagne ASN coordonnée`,
				description: `${ipList.length} IPs depuis ${asn.asn} ont collectivement ciblé ${clientList.length} clients (${asn.requests.toLocaleString('fr-FR')} requêtes).`,
				affectedClients: clientList,
				affectedIPs: ipList.slice(0, 10),
				asn: asn.asn,
				country: asn.country,
				score: asn.maxScore,
				totalRequests: asn.requests,
				tags: ['coordinated', 'asn-sweep'],
				icon: '🔗',
			});
		}
	});

	// ── Type 3 : Tempête pays ────────────────────────────────────────────
	const countryMap = {};
	$alerts.filter(a => a.level === 'critique').forEach(a => {
		if (!countryMap[a.country]) countryMap[a.country] = { country: a.country, clients: new Set(), ips: new Set(), requests: 0 };
		countryMap[a.country].clients.add(a.client);
		countryMap[a.country].ips.add(a.ip);
		countryMap[a.country].requests += a.count;
	});
	Object.values(countryMap).forEach(c => {
		if ([...c.clients].length >= 5) {
			detected.push({
				id: `country_${c.country}`,
				type: 'country_storm',
				severity: 'critique',
				title: `Tempête d'attaques — ${c.country}`,
				description: `${[...c.ips].length} IPs depuis ${c.country} ont déclenché des alertes critiques sur ${[...c.clients].length} clients.`,
				affectedClients: [...c.clients],
				affectedIPs: [...c.ips].slice(0, 10),
				country: c.country,
				score: 9,
				totalRequests: c.requests,
				tags: ['country-storm', 'critique'],
				icon: '🌩️',
			});
		}
	});

	// Sort by severity + requests
	return detected.sort((a, b) => {
		const sev = (a.severity === 'critique' ? 0 : 1) - (b.severity === 'critique' ? 0 : 1);
		return sev !== 0 ? sev : b.totalRequests - a.totalRequests;
	});
});
