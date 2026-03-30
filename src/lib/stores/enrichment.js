import { writable, derived } from 'svelte/store';

const KEY_RESULTS = '1t3r_enrichment';
const KEY_APIKEY  = '1t3r_abuseipdb_key';

function loadResults() { try { return JSON.parse(localStorage.getItem(KEY_RESULTS) ?? '{}'); } catch { return {}; } }

export const apiKey         = writable(typeof window !== 'undefined' ? (localStorage.getItem(KEY_APIKEY) ?? '') : '');
export const enrichmentData = writable(typeof window !== 'undefined' ? loadResults() : {});
export const enriching      = writable(false);
export const enrichProgress = writable({ done: 0, total: 0 });

apiKey.subscribe(v => { if (typeof window !== 'undefined') localStorage.setItem(KEY_APIKEY, v); });
enrichmentData.subscribe(v => { if (typeof window !== 'undefined') localStorage.setItem(KEY_RESULTS, JSON.stringify(v)); });

// AbuseIPDB Category labels
const ABUSE_CATEGORIES = {
	1:'DNS Compromise', 2:'DNS Poisoning', 3:'Fraud Orders', 4:'DDoS Attack',
	5:'FTP Brute-Force', 6:'Ping of Death', 7:'Phishing', 8:'Fraud VoIP',
	9:'Open Proxy', 10:'Web Spam', 11:'Email Spam', 12:'Blog Spam',
	13:'VPN IP', 14:'Port Scan', 15:'Hacking', 16:'SQL Injection',
	17:'Spoofing', 18:'Brute-Force', 19:'Bad Web Bot', 20:'Exploited Host',
	21:'Web App Attack', 22:'SSH', 23:'IoT Targeted'
};

export function getCategoryLabel(id) { return ABUSE_CATEGORIES[id] ?? `Cat. ${id}`; }

export async function enrichIPs(ips, key) {
	if (!key || !ips.length) return;
	enriching.set(true);
	enrichProgress.set({ done: 0, total: ips.length });
	let done = 0;

	for (const ip of ips.slice(0, 50)) { // max 50 per session (free tier)
		try {
			const res = await fetch(
				`https://api.abuseipdb.com/api/v2/check?ipAddress=${encodeURIComponent(ip)}&maxAgeInDays=90&verbose`,
				{ headers: { 'Key': key, 'Accept': 'application/json' } }
			);
			if (res.ok) {
				const json = await res.json();
				enrichmentData.update(d => ({
					...d,
					[ip]: { ...json.data, fetchedAt: new Date().toISOString() }
				}));
			}
		} catch {}
		done++;
		enrichProgress.set({ done, total: ips.length });
		await new Promise(r => setTimeout(r, 200)); // rate limit
	}
	enriching.set(false);
}

export function getEnrichmentForIP(ip, data) { return data[ip] ?? null; }

export function enrichmentScore(d) {
	if (!d) return null;
	return d.abuseConfidenceScore ?? 0;
}

export function enrichmentLabel(score) {
	if (score >= 75) return { label: 'Très dangereux', color: 'text-red-400', bg: 'bg-red-500/20', border: 'border-red-500/30' };
	if (score >= 40) return { label: 'Dangereux',      color: 'text-orange-400', bg: 'bg-orange-500/20', border: 'border-orange-500/30' };
	if (score >= 15) return { label: 'Suspect',        color: 'text-amber-400', bg: 'bg-amber-500/20', border: 'border-amber-500/30' };
	return                   { label: 'Inconnu',        color: 'text-gray-400', bg: 'bg-gray-500/20', border: 'border-gray-500/30' };
}
