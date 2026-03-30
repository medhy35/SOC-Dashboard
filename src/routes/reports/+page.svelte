<script>
  import { clients, alerts, summary, topIPs, darkMode, generatedAt, dateLabel } from '$lib/stores/data';
  import { riskScore } from '$lib/stores/data';
  import { addToast } from '$lib/stores/ui';
  import LevelBadge from '$lib/components/LevelBadge.svelte';

  let selectedClient = '';
  let generating = false;

  const flagMap = { 'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳','NL':'🇳🇱','UA':'🇺🇦','GB':'🇬🇧','MA':'🇲🇦','SN':'🇸🇳','NG':'🇳🇬','CI':'🇨🇮','CM':'🇨🇲','VN':'🇻🇳','ID':'🇮🇩','TR':'🇹🇷','DZ':'🇩🇿','TN':'🇹🇳','KR':'🇰🇷','SG':'🇸🇬' };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  $: clientList = [...new Set($alerts.map(a => a.client))].sort();

  $: clientAlerts = selectedClient
    ? $alerts.filter(a => a.client === selectedClient).sort((a,b) => b.score - a.score)
    : [];

  $: clientStats = clientAlerts.length ? {
    total: clientAlerts.reduce((s,a) => s + a.count, 0),
    critiques: clientAlerts.filter(a => a.level === 'critique').length,
    moyens: clientAlerts.filter(a => a.level === 'moyen').length,
    unblocked: clientAlerts.reduce((s,a) => s + (a.countUnblocked || 0), 0),
    topIP: clientAlerts[0],
    countries: [...new Set(clientAlerts.map(a => a.country))].length,
    asns: [...new Set(clientAlerts.map(a => a.asn).filter(Boolean))].length,
  } : null;

  $: riskLevel = $riskScore >= 8 ? 'CRITIQUE' : $riskScore >= 5 ? 'ÉLEVÉ' : $riskScore >= 3 ? 'MODÉRÉ' : 'FAIBLE';
  $: riskColor = $riskScore >= 8 ? '#ef4444' : $riskScore >= 5 ? '#f97316' : $riskScore >= 3 ? '#f59e0b' : '#22c55e';

  $: countryBreakdown = (() => {
    const m = {};
    clientAlerts.forEach(a => {
      if (!m[a.country]) m[a.country] = { country: a.country, count: 0, critiques: 0, requests: 0 };
      m[a.country].count++;
      m[a.country].requests += a.count;
      if (a.level === 'critique') m[a.country].critiques++;
    });
    return Object.values(m).sort((a,b) => b.requests - a.requests).slice(0, 8);
  })();

  function generateNarrative(stats, alerts) {
    if (!stats) return '';
    const today = new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' });
    const critText = stats.critiques > 0 ? `dont **${stats.critiques} alerte${stats.critiques > 1 ? 's' : ''} critique${stats.critiques > 1 ? 's'  : ''}** nécessitant une attention immédiate` : 'sans alerte critique détectée';
    const unblockedText = stats.unblocked > 0 ? `⚠️ **${stats.unblocked} requête${stats.unblocked > 1 ? 's' : ''} malveillante${stats.unblocked > 1 ? 's' : ''}** ont contourné la protection WAF. Une analyse forensique approfondie est recommandée.` : '✅ Toutes les requêtes malveillantes identifiées ont été bloquées avec succès.';
    return `Ce rapport a été généré le ${today} par le SOC 1T3R Médiation dans le cadre de la surveillance continue de l'infrastructure WAF Cloudflare. Période d'analyse : ${$dateLabel || 'dernières 24 heures'}.\n\nAu cours de la période analysée, ${fmt(stats.total)} événements de sécurité ont été détectés sur le domaine surveillé, ${critText}. Les menaces proviennent de ${stats.countries} pays distincts et ${stats.asns} ASN différents.\n\n${unblockedText}`;
  }

  async function printReport() {
    if (!selectedClient) return;
    generating = true;
    addToast('Préparation du rapport…', 'info', 2000);
    await new Promise(r => setTimeout(r, 300));
    window.print();
    generating = false;
    addToast(`Rapport ${selectedClient} envoyé vers l'imprimante/PDF`, 'success');
  }
</script>

<style>
  @media print {
    :global(aside), :global(header), :global(.no-print) { display: none !important; }
    :global(main) { overflow: visible !important; }
    :global(.print-page) { padding: 0 !important; }
    .report-container { padding: 2rem; color: #111; background: white; }
    .page-break { page-break-before: always; }
  }
</style>

<div class="p-5 space-y-5 print-page">
  <!-- Header controls (hidden on print) -->
  <div class="no-print">
    <div class="flex items-center justify-between flex-wrap gap-3 mb-5">
      <div>
        <h1 class="text-lg font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">Rapports clients PDF</h1>
        <p class="text-sm {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">Rapport de sécurité WAF brandé 1T3R — exportable en PDF via impression</p>
      </div>
      {#if selectedClient}
        <button on:click={printReport} disabled={generating}
          class="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors">
          {#if generating}
            <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          {:else}
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z"/>
            </svg>
          {/if}
          Imprimer / Exporter PDF
        </button>
      {/if}
    </div>

    <!-- Client selector -->
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">Sélectionner un client</p>
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
        {#each clientList as client}
          <button on:click={() => selectedClient = client}
            class="text-left px-4 py-3 rounded-xl border transition-all text-sm font-medium
              {selectedClient === client
                ? ($darkMode ? 'bg-indigo-600/20 border-indigo-500/50 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-700')
                : ($darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-300 hover:border-indigo-500/30' : 'bg-slate-50 border-slate-200 text-gray-700 hover:border-slate-300')}">
            <div class="flex items-center gap-2">
              <span class="text-base">🏢</span>
              <span class="truncate">{client.replace('Client ', 'C')}</span>
            </div>
            {#if $alerts.filter(a => a.client === client).some(a => a.level === 'critique')}
              <span class="text-xs text-red-400 mt-0.5 block">⚠ Alertes critiques</span>
            {:else}
              <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} mt-0.5 block">{$alerts.filter(a=>a.client===client).length} alertes</span>
            {/if}
          </button>
        {/each}
      </div>
    </div>

    {#if !selectedClient}
      <div class="text-center py-16 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
        <p class="text-4xl mb-3">📋</p>
        <p class="font-semibold">Sélectionnez un client ci-dessus</p>
        <p class="text-sm mt-1">Le rapport de sécurité sera généré automatiquement</p>
      </div>
    {/if}
  </div>

  <!-- ══════════════════════════════════════════════════════════════════ -->
  <!-- REPORT PREVIEW (visible + printable)                              -->
  <!-- ══════════════════════════════════════════════════════════════════ -->
  {#if selectedClient && clientStats}
    <div class="report-container {$darkMode ? 'bg-[#0f1117]' : 'bg-white'} rounded-2xl overflow-hidden border {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">

      <!-- ── Page 1: Cover ──────────────────────────────────────────── -->
      <div class="relative overflow-hidden" style="background: linear-gradient(135deg, #1e1b4b 0%, #312e81 40%, #1a1d27 100%); min-height: 320px;">
        <!-- Background decoration -->
        <div class="absolute inset-0 opacity-10">
          <div class="absolute top-0 right-0 w-96 h-96 rounded-full" style="background: radial-gradient(circle, #6366f1 0%, transparent 70%); transform: translate(30%, -30%);"></div>
          <div class="absolute bottom-0 left-0 w-64 h-64 rounded-full" style="background: radial-gradient(circle, #818cf8 0%, transparent 70%); transform: translate(-30%, 30%);"></div>
        </div>

        <div class="relative z-10 p-8">
          <!-- Header -->
          <div class="flex items-start justify-between mb-10">
            <div class="flex items-center gap-3">
              <div class="w-12 h-12 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/20">
                <svg viewBox="0 0 24 24" class="w-7 h-7 fill-none stroke-white stroke-2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
                </svg>
              </div>
              <div>
                <p class="text-white font-bold text-lg tracking-wide">1T3R SOC</p>
                <p class="text-indigo-300 text-xs">Security Operations Center</p>
              </div>
            </div>
            <div class="text-right">
              <p class="text-indigo-200 text-xs">Rapport de sécurité</p>
              <p class="text-white/60 text-xs mt-1">{new Date().toLocaleDateString('fr-FR', { day:'2-digit', month:'long', year:'numeric' })}</p>
            </div>
          </div>

          <!-- Title -->
          <div class="mb-8">
            <p class="text-indigo-300 text-sm uppercase tracking-widest mb-2">Rapport de Sécurité WAF</p>
            <h1 class="text-4xl font-black text-white mb-2">{selectedClient}</h1>
            <p class="text-indigo-200/70 text-sm">Période : {$dateLabel || 'Dernières 24 heures'} · Généré par n8n + Cloudflare WAF</p>
          </div>

          <!-- Risk score pill on cover -->
          <div class="inline-flex items-center gap-3 px-5 py-3 rounded-full border" style="background: rgba(255,255,255,0.05); border-color: {riskColor}55; backdrop-filter: blur(10px);">
            <div class="w-3 h-3 rounded-full" style="background: {riskColor}; box-shadow: 0 0 8px {riskColor};"></div>
            <span class="text-white font-bold">Score de risque global : {$riskScore}/10</span>
            <span class="font-bold text-sm" style="color: {riskColor};">{riskLevel}</span>
          </div>
        </div>
      </div>

      <!-- ── Executive Summary ──────────────────────────────────────── -->
      <div class="p-8 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'}">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-indigo-500/20 flex items-center justify-center">
            <span class="text-base">📋</span>
          </div>
          <h2 class="font-bold text-lg {$darkMode ? 'text-white' : 'text-gray-900'}">Résumé exécutif</h2>
        </div>

        <!-- KPI row -->
        <div class="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {#each [
            { label: 'Événements totaux', value: fmt(clientStats.total), color: 'text-indigo-400', icon: '📡', bg: 'bg-indigo-500/10 border-indigo-500/20' },
            { label: 'Alertes critiques', value: clientStats.critiques, color: 'text-red-400', icon: '🔴', bg: clientStats.critiques > 0 ? 'bg-red-500/10 border-red-500/20' : ($darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200') },
            { label: 'Non bloquées', value: clientStats.unblocked || '0', color: clientStats.unblocked > 0 ? 'text-red-400' : 'text-green-400', icon: clientStats.unblocked > 0 ? '⚠️' : '✅', bg: clientStats.unblocked > 0 ? 'bg-red-500/10 border-red-500/20' : ($darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200') },
            { label: 'IPs malveillantes', value: clientAlerts.length, color: 'text-amber-400', icon: '🔍', bg: $darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200' },
          ] as kpi}
            <div class="border rounded-xl p-4 {kpi.bg}">
              <div class="flex items-center justify-between mb-1">
                <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'} uppercase tracking-wider">{kpi.label}</p>
                <span>{kpi.icon}</span>
              </div>
              <p class="text-3xl font-black {kpi.color}">{kpi.value}</p>
            </div>
          {/each}
        </div>

        <!-- Narrative -->
        {#each generateNarrative(clientStats, clientAlerts).split('\n\n') as para}
          {#if para.trim()}
            <p class="text-sm {$darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed mb-3">
              {#each para.split(/(\*\*[^*]+\*\*)/) as part}
                {#if part.startsWith('**') && part.endsWith('**')}
                  <strong class="{$darkMode ? 'text-white' : 'text-gray-900'}">{part.slice(2,-2)}</strong>
                {:else}
                  {part}
                {/if}
              {/each}
            </p>
          {/if}
        {/each}
      </div>

      <!-- ── Threat breakdown ──────────────────────────────────────── -->
      <div class="p-8 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'}">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-red-500/20 flex items-center justify-center">
            <span class="text-base">⚡</span>
          </div>
          <h2 class="font-bold text-lg {$darkMode ? 'text-white' : 'text-gray-900'}">Analyse des menaces</h2>
        </div>

        <!-- Level distribution -->
        <div class="grid grid-cols-3 gap-4 mb-6">
          {#each [
            { label: 'Critique', count: clientAlerts.filter(a=>a.level==='critique').length, color: 'bg-red-500', text: 'text-red-400', border: 'border-red-500/30' },
            { label: 'Moyen', count: clientAlerts.filter(a=>a.level==='moyen').length, color: 'bg-amber-500', text: 'text-amber-400', border: 'border-amber-500/30' },
            { label: 'Faible', count: clientAlerts.filter(a=>a.level==='faible').length, color: 'bg-orange-500', text: 'text-orange-400', border: 'border-orange-500/30' },
          ] as level}
            <div class="border rounded-xl p-4 {$darkMode ? 'bg-[#1a1d27]' : 'bg-slate-50'} {level.border}">
              <div class="flex items-center gap-2 mb-2">
                <div class="w-3 h-3 rounded-full {level.color}"></div>
                <span class="text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'} font-semibold uppercase tracking-wider">{level.label}</span>
              </div>
              <p class="text-3xl font-black {level.text}">{level.count}</p>
              <p class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1">
                {clientAlerts.length ? Math.round((level.count/clientAlerts.length)*100) : 0}% des alertes
              </p>
            </div>
          {/each}
        </div>

        <!-- Top threats table -->
        <div>
          <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">
            Top {Math.min(10, clientAlerts.length)} menaces prioritaires
          </p>
          <div class="overflow-hidden rounded-xl border {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
            <table class="w-full text-xs">
              <thead>
                <tr class="{$darkMode ? 'bg-[#22263a] text-gray-400' : 'bg-slate-50 text-gray-500'} border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">#</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">IP Source</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">Pays / ASN</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">Score</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">Niveau</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">Requêtes</th>
                  <th class="text-left px-3 py-2.5 font-semibold uppercase tracking-wider">Tags</th>
                </tr>
              </thead>
              <tbody>
                {#each clientAlerts.slice(0, 10) as alert, i}
                  <tr class="border-b {$darkMode ? 'border-[#2a2d3a] hover:bg-[#22263a]' : 'border-slate-100 hover:bg-slate-50'}">
                    <td class="px-3 py-2.5 {$darkMode ? 'text-gray-600' : 'text-gray-400'} font-mono">{i+1}</td>
                    <td class="px-3 py-2.5">
                      <code class="font-mono font-bold {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{alert.ip}</code>
                      {#if alert.countUnblocked > 0}
                        <span class="ml-1 text-red-400 font-bold">⚠</span>
                      {/if}
                    </td>
                    <td class="px-3 py-2.5 {$darkMode ? 'text-gray-400' : 'text-gray-600'}">
                      <span>{flag(alert.country)} {alert.country}</span>
                      {#if alert.asn}
                        <br><code class="text-[10px] {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{alert.asn}</code>
                      {/if}
                    </td>
                    <td class="px-3 py-2.5">
                      <span class="font-bold text-sm {alert.score>=8?'text-red-400':alert.score>=5?'text-amber-400':'text-orange-400'}">{alert.score}/10</span>
                    </td>
                    <td class="px-3 py-2.5"><LevelBadge level={alert.level} /></td>
                    <td class="px-3 py-2.5 font-mono {$darkMode ? 'text-gray-300' : 'text-gray-700'}">{fmt(alert.count)}</td>
                    <td class="px-3 py-2.5">
                      <div class="flex flex-wrap gap-1">
                        {#each (alert.tags ?? []).slice(0,2) as tag}
                          <span class="px-1.5 py-0.5 rounded text-[10px] bg-indigo-500/20 text-indigo-400 border border-indigo-500/30">{tag}</span>
                        {/each}
                      </div>
                    </td>
                  </tr>
                {/each}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- ── Geographic analysis ──────────────────────────────────── -->
      <div class="p-8 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'}">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-amber-500/20 flex items-center justify-center">
            <span class="text-base">🌍</span>
          </div>
          <h2 class="font-bold text-lg {$darkMode ? 'text-white' : 'text-gray-900'}">Analyse géographique</h2>
        </div>

        <div class="grid grid-cols-2 gap-3">
          {#each countryBreakdown as c}
            <div class="flex items-center gap-3 {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-slate-50 border-slate-200'} border rounded-xl p-3">
              <span class="text-2xl">{flag(c.country)}</span>
              <div class="flex-1 min-w-0">
                <div class="flex items-center justify-between">
                  <span class="font-bold text-sm {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{c.country}</span>
                  {#if c.critiques > 0}
                    <span class="text-xs text-red-400 font-bold">{c.critiques} crit.</span>
                  {/if}
                </div>
                <div class="flex items-center gap-2 mt-1">
                  <div class="flex-1 h-1.5 {$darkMode ? 'bg-[#22263a]' : 'bg-slate-200'} rounded-full overflow-hidden">
                    <div class="h-full bg-indigo-500 rounded-full" style="width: {Math.round((c.requests/clientStats.total)*100)}%"></div>
                  </div>
                  <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} shrink-0">{fmt(c.requests)}</span>
                </div>
              </div>
            </div>
          {/each}
        </div>
      </div>

      <!-- ── Recommendations ───────────────────────────────────────── -->
      <div class="p-8 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'}">
        <div class="flex items-center gap-3 mb-5">
          <div class="w-8 h-8 rounded-lg bg-green-500/20 flex items-center justify-center">
            <span class="text-base">💡</span>
          </div>
          <h2 class="font-bold text-lg {$darkMode ? 'text-white' : 'text-gray-900'}">Recommandations 1T3R</h2>
        </div>

        <div class="space-y-3">
          {#if clientStats.unblocked > 0}
            <div class="flex gap-4 p-4 border rounded-xl bg-red-500/10 border-red-500/30">
              <div class="w-8 h-8 rounded-full bg-red-500/20 flex items-center justify-center shrink-0">
                <span class="text-sm font-black text-red-400">!</span>
              </div>
              <div>
                <p class="font-bold text-red-400 text-sm mb-1">ACTION URGENTE — Requêtes non bloquées</p>
                <p class="text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'}">{clientStats.unblocked} requête{clientStats.unblocked > 1 ? 's' : ''} malveillante{clientStats.unblocked > 1 ? 's ont' : ' a'} contourné la protection. Réviser les règles WAF Cloudflare et activer le mode "Challenge" pour les IPs concernées.</p>
              </div>
            </div>
          {/if}
          {#if clientStats.critiques > 5}
            <div class="flex gap-4 p-4 border rounded-xl {$darkMode ? 'bg-amber-500/10 border-amber-500/30' : 'bg-amber-50 border-amber-200'}">
              <div class="w-8 h-8 rounded-full bg-amber-500/20 flex items-center justify-center shrink-0">
                <span class="text-sm font-black text-amber-400">2</span>
              </div>
              <div>
                <p class="font-bold text-amber-400 text-sm mb-1">Volume d'alertes critiques élevé</p>
                <p class="text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'}">{clientStats.critiques} alertes critiques détectées. Envisager d'activer le rate limiting strict et de bloquer les ASN sources. Revue hebdomadaire des règles recommandée.</p>
              </div>
            </div>
          {/if}
          <div class="flex gap-4 p-4 border rounded-xl {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-slate-50 border-slate-200'}">
            <div class="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center shrink-0">
              <span class="text-sm font-black text-blue-400">3</span>
            </div>
            <div>
              <p class="font-bold {$darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1">Surveillance continue activée</p>
              <p class="text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'}">Le SOC 1T3R surveille votre infrastructure 24/7 via Cloudflare WAF. Prochain rapport prévu dans 24h. Pour toute urgence : soc@1t3rmediation.fr</p>
            </div>
          </div>
          <div class="flex gap-4 p-4 border rounded-xl {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-slate-50 border-slate-200'}">
            <div class="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
              <span class="text-sm font-black text-indigo-400">4</span>
            </div>
            <div>
              <p class="font-bold {$darkMode ? 'text-gray-300' : 'text-gray-700'} text-sm mb-1">Enrichissement des IPs critiques</p>
              <p class="text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'}">Les {Math.min(clientStats.critiques, 10)} IPs les plus dangereuses ont été soumises à AbuseIPDB pour vérification croisée avec la base de données mondiale des IPs malveillantes.</p>
            </div>
          </div>
        </div>
      </div>

      <!-- ── Footer ────────────────────────────────────────────────── -->
      <div class="p-6 {$darkMode ? 'bg-[#22263a]' : 'bg-slate-50'}">
        <div class="flex items-center justify-between flex-wrap gap-4">
          <div class="flex items-center gap-3">
            <div class="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
              <svg viewBox="0 0 24 24" class="w-4 h-4 fill-none stroke-white stroke-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div>
              <p class="font-bold text-sm {$darkMode ? 'text-white' : 'text-gray-900'}">1T3R Médiation — SOC</p>
              <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Rapport confidentiel — usage interne uniquement</p>
            </div>
          </div>
          <div class="text-right">
            <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Données Cloudflare WAF · Powered by n8n</p>
            <p class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-300'} mt-0.5">Généré le {new Date().toLocaleString('fr-FR')}</p>
          </div>
        </div>
      </div>

    </div>
  {/if}
</div>
