<script>
  import SparklineKPI from '$lib/components/SparklineKPI.svelte';
  import ClientHeatmap from '$lib/components/ClientHeatmap.svelte';
  import Timeline from '$lib/components/Timeline.svelte';
  import TopIPs from '$lib/components/TopIPs.svelte';
  import TopCountries from '$lib/components/TopCountries.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import TopPathsChart from '$lib/components/TopPathsChart.svelte';
  import MultiClientGraph from '$lib/components/MultiClientGraph.svelte';
  import ClientHeatmapHourly from '$lib/components/ClientHeatmapHourly.svelte';
  import RiskScoreGauge from '$lib/components/RiskScoreGauge.svelte';
  import ExecutiveSummary from '$lib/components/ExecutiveSummary.svelte';
  import { onMount, onDestroy } from 'svelte';

  import {
    summary, clients, timeline, topIPs, topCountries, darkMode,
    mitreTactics, topPaths, sparklines, multiClientIPs, clientHourlyData,
    riskScore, deltaJ1
  } from '$lib/stores/data';
  import { sections, toggleSection, activeClient, addToast } from '$lib/stores/ui';

  const MITRE_COLORS = {
    'Reconnaissance':'#6366f1','Credential Access':'#ef4444',
    'Defense Evasion':'#3b82f6','Exploitation':'#dc2626',
    'Initial Access':'#f59e0b','Other':'#6b7280',
  };

  $: mitreDonut = $mitreTactics.map(t => ({ label: t.tactic, value: t.count, color: t.color ?? MITRE_COLORS[t.tactic] ?? '#6b7280' }));
  $: levelDonut = [
    { label: 'Critique', value: $summary?.critiques ?? 0, color: '#ef4444' },
    { label: 'Moyen',    value: $summary?.moyens    ?? 0, color: '#f59e0b' },
    { label: 'Faible',   value: $summary?.faibles   ?? 0, color: '#f97316' },
  ];
  $: levelTotal = ($summary?.critiques ?? 0) + ($summary?.moyens ?? 0) + ($summary?.faibles ?? 0);

  function openClient(client) {
    activeClient.set(client);
  }

  // Section toggle helper
  function sectionHeader(key, label, extra = '') {
    return { key, label, extra, open: $sections[key] ?? true };
  }
</script>

<div class="p-5 space-y-5">

  <!-- ── Résumé exécutif ──────────────────────────────────────────────── -->
  <ExecutiveSummary />

  <!-- ── KPI Cards + Risk Score ───────────────────────────────────────── -->
  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3 items-stretch">
    <SparklineKPI label="Événements totaux" value={$summary?.totalEvents ?? 0}
      icon="📡" color="#6366f1" subtitle="Dernières 24h"
      sparkData={$sparklines.total} delta={$deltaJ1.totalEvents} />
    <SparklineKPI label="Clients touchés" value={$summary?.clientsHit ?? 0}
      icon="🏢" color="#f59e0b" subtitle="{$summary?.totalClients ?? 0} total"
      sparkData={$sparklines.total.map(v => Math.min(v, $summary?.clientsHit ?? 0))} delta={$deltaJ1.clientsHit} />
    <SparklineKPI label="Critiques" value={$summary?.critiques ?? 0}
      icon="🔴" color="#ef4444"
      sparkData={$sparklines.critique} delta={$deltaJ1.critiques} />
    <SparklineKPI label="Moyens" value={$summary?.moyens ?? 0}
      icon="🟡" color="#f59e0b"
      sparkData={$sparklines.moyen} delta={$deltaJ1.moyens} />
    <SparklineKPI label="Faibles" value={$summary?.faibles ?? 0}
      icon="🟠" color="#f97316"
      sparkData={$sparklines.faible} delta={$deltaJ1.faibles} />
    <SparklineKPI label="Non bloqués" value={$summary?.totalUnblocked ?? 0}
      icon="⚠️" warning={true} subtitle="Requêtes passées"
      sparkData={$sparklines.total.map(() => $summary?.totalUnblocked ?? 0)} delta={$deltaJ1.totalUnblocked} />

    <!-- Risk Score Gauge -->
    {#if $riskScore !== null}
      <div class="bg-[#1a1d27] border border-[#2a2d3a] rounded-xl p-3 flex items-center justify-center hover:border-indigo-500/30 transition-colors">
        <RiskScoreGauge score={$riskScore} darkMode={$darkMode} />
      </div>
    {/if}
  </div>

  <!-- ── Statut des clients ────────────────────────────────────────────── -->
  <section id="clients">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('clients')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.clients ? '' : '-rotate-90'}">▼</span>
        Statut des clients
      </button>
      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{$clients.length} clients surveillés</span>
    </div>
    {#if $sections.clients}
      <!-- Clickable client cards → drawer -->
      <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {#each $clients as client}
          {@const status = client.status || (client.critiques > 0 ? 'alert' : client.moyens > 5 ? 'warning' : client.totalEvents > 100 ? 'elevated' : 'clean')}
          {@const cfg = {
            alert:    { border:'border-red-500/50',    bg:'bg-red-500/10',    dot:'bg-red-400',    text:'text-red-400',    label:'Alerte' },
            warning:  { border:'border-amber-500/50',  bg:'bg-amber-500/10',  dot:'bg-amber-400',  text:'text-amber-400',  label:'Avertissement' },
            elevated: { border:'border-orange-500/50', bg:'bg-orange-500/10', dot:'bg-orange-400', text:'text-orange-400', label:'Élevé' },
            clean:    { border:'border-green-500/30',  bg:'bg-green-500/5',   dot:'bg-green-400',  text:'text-green-400',  label:'Normal' },
          }[status] ?? { border:'border-green-500/30', bg:'bg-green-500/5', dot:'bg-green-400', text:'text-green-400', label:'Normal' }}
          <button on:click={() => openClient(client)}
            class="border rounded-xl p-3 text-left hover:scale-[1.03] active:scale-100 transition-all duration-200 cursor-pointer w-full
              {cfg.border} {cfg.bg}">
            <div class="flex items-center gap-1.5 mb-2">
              <span class="w-2 h-2 rounded-full {cfg.dot} animate-pulse"></span>
              <span class="text-xs font-semibold {cfg.text}">{cfg.label}</span>
            </div>
            <p class="text-sm font-bold text-gray-200 truncate leading-tight">{client.client}</p>
            <p class="text-xs text-gray-500 truncate mb-2">{client.domain}</p>
            <div class="grid grid-cols-2 gap-1 text-xs">
              <div><span class="text-gray-500">Critique</span><p class="font-bold text-red-400">{client.critiques}</p></div>
              <div><span class="text-gray-500">Total</span><p class="font-bold text-gray-300">{new Intl.NumberFormat('fr-FR').format(client.totalEvents)}</p></div>
              {#if client.totalUnblocked > 0}
                <div class="col-span-2 mt-1 bg-red-500/20 rounded px-1.5 py-0.5 border border-red-500/30">
                  <span class="text-red-300 font-bold text-[10px]">⚠ {client.totalUnblocked} non-bloqué{client.totalUnblocked > 1 ? 's' : ''}</span>
                </div>
              {/if}
            </div>
            <p class="text-[10px] text-gray-600 mt-2">Cliquer pour détails →</p>
          </button>
        {/each}
      </div>
    {/if}
  </section>

  <!-- ── Timeline + Donut niveaux ──────────────────────────────────────── -->
  <section id="timeline">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('timeline')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.timeline ? '' : '-rotate-90'}">▼</span>
        Évolution des alertes
      </button>
    </div>
    {#if $sections.timeline}
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-5">
        <div class="lg:col-span-2 {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">Alertes par heure — 24h · par niveau de sévérité</p>
          <Timeline data={$timeline} />
        </div>
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Répartition par niveau</p>
          <DonutChart data={levelDonut} size={160} showLegend={true}
            centerLabel={new Intl.NumberFormat('fr-FR').format(levelTotal)} />
        </div>
      </div>
    {/if}
  </section>

  <!-- ── MITRE ATT&CK + Top Chemins ────────────────────────────────────── -->
  <section id="mitre">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('mitre')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.mitre ? '' : '-rotate-90'}">▼</span>
        MITRE ATT&CK — Top Chemins
      </button>
    </div>
    {#if $sections.mitre}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <div class="flex items-center justify-between mb-4">
            <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'}">MITRE ATT&CK — Tactiques</p>
            <span class="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-2 py-0.5">WAF mapping</span>
          </div>
          <div class="flex gap-6 items-start">
            <DonutChart data={mitreDonut} size={180} showLegend={false}
              centerLabel={String(mitreDonut.reduce((s,d)=>s+d.value,0))} />
            <div class="flex-1 space-y-2 min-w-0">
              {#each mitreDonut as item}
                {@const total = mitreDonut.reduce((s,d)=>s+d.value,0)}
                {@const pct = total > 0 ? Math.round((item.value/total)*100) : 0}
                <div>
                  <div class="flex items-center justify-between text-xs mb-1">
                    <div class="flex items-center gap-1.5 min-w-0">
                      <span class="w-2 h-2 rounded-full shrink-0" style="background:{item.color}"></span>
                      <span class="{$darkMode ? 'text-gray-300' : 'text-gray-700'} truncate font-medium">{item.label}</span>
                    </div>
                    <span class="font-bold {$darkMode ? 'text-gray-400' : 'text-gray-600'} shrink-0 ml-2">{pct}%</span>
                  </div>
                  <div class="h-1 {$darkMode ? 'bg-[#22263a]' : 'bg-slate-100'} rounded-full overflow-hidden">
                    <div class="h-full rounded-full" style="width:{pct}%;background:{item.color}99"></div>
                  </div>
                </div>
              {/each}
            </div>
          </div>
        </div>
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Top chemins attaqués</p>
          <TopPathsChart data={$topPaths} darkMode={$darkMode} />
        </div>
      </div>
    {/if}
  </section>

  <!-- ── Heatmap horaire ────────────────────────────────────────────────── -->
  <section id="heatmap">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('heatmap')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.heatmap ? '' : '-rotate-90'}">▼</span>
        Heatmap Horaire — Activité par client
      </button>
      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">Requêtes par heure UTC</span>
    </div>
    {#if $sections.heatmap}
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <ClientHeatmapHourly heatmapData={$clientHourlyData} darkMode={$darkMode} />
      </div>
    {/if}
  </section>

  <!-- ── Multi-clients ──────────────────────────────────────────────────── -->
  <section id="multi-client">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('multiClient')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.multiClient ? '' : '-rotate-90'}">▼</span>
        Vue Multi-Clients — IPs Transverses
      </button>
      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{$multiClientIPs.length} IP{$multiClientIPs.length>1?'s':''} touchant plusieurs clients</span>
    </div>
    {#if $sections.multiClient}
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <MultiClientGraph ips={$multiClientIPs} darkMode={$darkMode} />
      </div>
    {/if}
  </section>

  <!-- ── Top IPs + Pays ─────────────────────────────────────────────────── -->
  <section id="top-ips">
    <div class="flex items-center justify-between mb-3">
      <button on:click={() => toggleSection('topIPs')}
        class="flex items-center gap-2 text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'} transition-colors">
        <span class="transition-transform duration-200 {$sections.topIPs ? '' : '-rotate-90'}">▼</span>
        Top IPs & Pays
      </button>
    </div>
    {#if $sections.topIPs}
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Top 10 IPs — Score de menace</p>
          <TopIPs ips={$topIPs} />
        </div>
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <p class="text-xs font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Top 10 Pays — Volume d'attaques</p>
          <TopCountries countries={$topCountries} />
        </div>
      </div>
    {/if}
  </section>

</div>
