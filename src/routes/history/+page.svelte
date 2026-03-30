<script>
  import { onMount, onDestroy } from 'svelte';
  import { historicalDays, trendData, clientTrend, newIPsPerDay, loadHistoricalData, historyLoading } from '$lib/stores/history';
  import { darkMode } from '$lib/stores/data';
  import RiskScoreGauge from '$lib/components/RiskScoreGauge.svelte';

  onMount(loadHistoricalData);

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  let trendCanvas, critCanvas, riskCanvas, newIPCanvas;
  let charts = [];

  onDestroy(() => charts.forEach(c => c?.destroy()));

  $: if ($trendData && trendCanvas) buildCharts();

  async function buildCharts() {
    charts.forEach(c => c?.destroy());
    charts = [];
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);

    const baseOpts = {
      responsive: true, maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#9ca3af', boxWidth: 12, font: { size: 11 } } },
        tooltip: { backgroundColor: '#1a1d27', borderColor: '#2a2d3a', borderWidth: 1, titleColor: '#e5e7eb', bodyColor: '#9ca3af' }
      },
      scales: {
        x: { grid: { color: 'rgba(42,45,58,0.5)' }, ticks: { color: '#6b7280', font: { size: 10 } } },
        y: { grid: { color: 'rgba(42,45,58,0.5)' }, ticks: { color: '#6b7280', font: { size: 10 } } }
      }
    };

    // Total events trend
    if (trendCanvas && $trendData) {
      charts[0] = new Chart(trendCanvas, {
        type: 'line',
        data: {
          labels: $trendData.labels,
          datasets: [
            { label: 'Total', data: $trendData.totalEvents, borderColor: '#6366f1', backgroundColor: '#6366f122', fill: true, tension: 0.4, borderWidth: 2 },
            { label: 'Clients touchés', data: $trendData.clientsHit, borderColor: '#f59e0b', backgroundColor: 'transparent', tension: 0.4, borderWidth: 1.5, borderDash: [4,3], yAxisID: 'y1' },
          ]
        },
        options: { ...baseOpts, scales: { ...baseOpts.scales, y1: { position: 'right', grid: { display: false }, ticks: { color: '#6b7280', font: { size: 10 } } } } }
      });
    }

    // Critiques per day
    if (critCanvas && $trendData) {
      charts[1] = new Chart(critCanvas, {
        type: 'bar',
        data: {
          labels: $trendData.labels,
          datasets: [
            { label: 'Critiques', data: $trendData.critiques, backgroundColor: '#ef444499', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4 },
            { label: 'Moyens', data: $trendData.moyens, backgroundColor: '#f59e0b99', borderColor: '#f59e0b', borderWidth: 1, borderRadius: 4 },
            { label: 'Non bloqués', data: $trendData.unblocked, backgroundColor: '#dc262699', borderColor: '#dc2626', borderWidth: 1, borderRadius: 4 },
          ]
        },
        options: { ...baseOpts }
      });
    }

    // Risk score evolution
    if (riskCanvas && $trendData) {
      charts[2] = new Chart(riskCanvas, {
        type: 'line',
        data: {
          labels: $trendData.labels,
          datasets: [{
            label: 'Score de risque', data: $trendData.riskScores,
            borderColor: '#f97316', backgroundColor: '#f9731622', fill: true, tension: 0.4, borderWidth: 2.5,
            pointBackgroundColor: $trendData.riskScores.map(s => s >= 7 ? '#ef4444' : s >= 4 ? '#f59e0b' : '#22c55e'),
            pointRadius: 5,
          }]
        },
        options: { ...baseOpts, scales: { ...baseOpts.scales, y: { ...baseOpts.scales.y, min: 0, max: 10 } } }
      });
    }

    // New IPs per day
    if (newIPCanvas && $newIPsPerDay.length) {
      charts[3] = new Chart(newIPCanvas, {
        type: 'bar',
        data: {
          labels: $newIPsPerDay.map(d => d.date),
          datasets: [
            { label: 'Nouvelles IPs', data: $newIPsPerDay.map(d => d.new), backgroundColor: '#ef444488', borderColor: '#ef4444', borderWidth: 1, borderRadius: 4 },
            { label: 'Total IPs', data: $newIPsPerDay.map(d => d.total), backgroundColor: '#6366f144', borderColor: '#6366f1', borderWidth: 1, borderRadius: 4 },
          ]
        },
        options: { ...baseOpts }
      });
    }
  }

  // Per-client selected
  let selectedClient = '';
  $: clientList = Object.keys($clientTrend).sort();
  $: clientData = selectedClient ? ($clientTrend[selectedClient] ?? []) : [];
</script>

<div class="p-5 space-y-5">
  <div>
    <h1 class="text-lg font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">Historique multi-jours</h1>
    <p class="text-sm {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">
      Tendances sur {$historicalDays.length} jours — Impossible sur Cloudflare Free (rétention 24h)
    </p>
  </div>

  {#if $historyLoading}
    <div class="flex items-center justify-center py-16">
      <div class="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
    </div>
  {:else if !$historicalDays.length}
    <div class="text-center py-16 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
      <p class="text-4xl mb-3">📅</p>
      <p class="font-semibold">Aucune donnée historique disponible</p>
      <p class="text-sm mt-1">Placez des fichiers <code>soc_data_YYYY-MM-DD.json</code> dans <code>/static/data/</code></p>
    </div>
  {:else}
    <!-- Summary cards -->
    <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {#each [
        { label: 'Jours analysés', value: $historicalDays.length, color: 'text-indigo-400', icon:'📅' },
        { label: 'Total événements', value: $trendData?.totalEvents.reduce((s,v)=>s+v,0), color:'text-blue-400', icon:'📡' },
        { label: 'Total critiques', value: $trendData?.critiques.reduce((s,v)=>s+v,0), color:'text-red-400', icon:'🔴' },
        { label: 'Pic journalier', value: Math.max(...($trendData?.totalEvents??[0])), color:'text-amber-400', icon:'⚡' },
      ] as s}
        <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
          <div class="flex items-center justify-between">
            <p class="text-xs text-gray-500 uppercase tracking-wider">{s.label}</p>
            <span>{s.icon}</span>
          </div>
          <p class="text-2xl font-bold mt-1 {s.color}">{fmt(s.value)}</p>
        </div>
      {/each}
    </div>

    <!-- Charts grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4">Volume total & clients touchés</p>
        <div class="h-52"><canvas bind:this={trendCanvas}></canvas></div>
      </div>

      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4">Alertes par niveau</p>
        <div class="h-52"><canvas bind:this={critCanvas}></canvas></div>
      </div>

      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4">Évolution du score de risque global</p>
        <div class="h-52"><canvas bind:this={riskCanvas}></canvas></div>
      </div>

      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-4">Nouvelles IPs vs récurrentes</p>
        <div class="h-52"><canvas bind:this={newIPCanvas}></canvas></div>
      </div>
    </div>

    <!-- Per-client evolution -->
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <div class="flex items-center justify-between mb-4">
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Évolution par client</p>
        <select bind:value={selectedClient} class="text-sm px-3 py-1.5 border rounded-lg focus:outline-none {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200' : 'bg-slate-50 border-slate-200'}">
          <option value="">— Choisir un client —</option>
          {#each clientList as c}<option value={c}>{c}</option>{/each}
        </select>
      </div>
      {#if clientData.length}
        <div class="overflow-x-auto">
          <table class="w-full text-sm">
            <thead><tr class="border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
              {#each ['Date','Total événements','Critiques','Non bloqués'] as h}
                <th class="text-left px-3 py-2 text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">{h}</th>
              {/each}
            </tr></thead>
            <tbody>
              {#each clientData as d}
                <tr class="border-b {$darkMode ? 'border-[#2a2d3a] hover:bg-[#22263a]' : 'border-slate-100 hover:bg-slate-50'}">
                  <td class="px-3 py-2 text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'}">{d.date}</td>
                  <td class="px-3 py-2 font-mono text-xs font-bold {$darkMode ? 'text-gray-300' : 'text-gray-700'}">{fmt(d.totalEvents)}</td>
                  <td class="px-3 py-2 text-xs font-bold {d.critiques > 0 ? 'text-red-400' : ($darkMode ? 'text-gray-500' : 'text-gray-400')}">{d.critiques}</td>
                  <td class="px-3 py-2 text-xs font-bold {d.unblocked > 0 ? 'text-red-300' : ($darkMode ? 'text-gray-600' : 'text-gray-400')}">{d.unblocked || '—'}</td>
                </tr>
              {/each}
            </tbody>
          </table>
        </div>
      {:else}
        <p class="text-center py-6 {$darkMode ? 'text-gray-600' : 'text-gray-400'} text-sm">Sélectionner un client ci-dessus</p>
      {/if}
    </div>
  {/if}
</div>
