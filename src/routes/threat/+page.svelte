<script>
  import { topIPs, topCountries, topTags, topMethods, topStatuses, asnScores, socData, darkMode } from '$lib/stores/data';
  import LevelBadge from '$lib/components/LevelBadge.svelte';
  import TagBadge from '$lib/components/TagBadge.svelte';
  import DonutChart from '$lib/components/DonutChart.svelte';
  import AsnScoreChart from '$lib/components/AsnScoreChart.svelte';
  import { onMount, onDestroy } from 'svelte';

  let showRaw = false;
  let tagCanvas, countryCanvas;
  let tagChart, countryChart;

  const flagMap = {
    'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳',
    'NL':'🇳🇱','UA':'🇺🇦','GB':'🇬🇧','KR':'🇰🇷','JP':'🇯🇵','SG':'🇸🇬','CA':'🇨🇦',
    'TR':'🇹🇷','ID':'🇮🇩','VN':'🇻🇳','MA':'🇲🇦','SN':'🇸🇳','NG':'🇳🇬',
    'CI':'🇨🇮','CM':'🇨🇲','TN':'🇹🇳','DZ':'🇩🇿','EG':'🇪🇬','ZA':'🇿🇦'
  };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  let ipSortCol = 'score';
  let ipSortDir = -1;

  $: sortedIPs = [...$topIPs].sort((a, b) => {
    let va = a[ipSortCol], vb = b[ipSortCol];
    if (typeof va === 'string') { va = va.toLowerCase(); vb = vb?.toLowerCase() ?? ''; }
    return ipSortDir * ((va > vb ? 1 : va < vb ? -1 : 0));
  });

  function sortIP(col) {
    if (ipSortCol === col) ipSortDir = -ipSortDir;
    else { ipSortCol = col; ipSortDir = -1; }
  }
  function sortIcon(col) {
    if (ipSortCol !== col) return '↕';
    return ipSortDir === -1 ? '↓' : '↑';
  }

  // Méthodes donut
  const METHOD_COLORS = {
    'GET': '#6366f1', 'POST': '#f59e0b', 'HEAD': '#3b82f6',
    'PUT': '#f97316', 'DELETE': '#ef4444', 'OPTIONS': '#22c55e',
    'PATCH': '#8b5cf6', 'CONNECT': '#ec4899'
  };
  $: methodDonut = $topMethods.map(m => ({
    label: m.method, value: m.count, color: METHOD_COLORS[m.method] ?? '#6b7280'
  }));

  // Statuts donut
  const STATUS_COLORS = {
    403:'#ef4444', 200:'#22c55e', 404:'#f59e0b', 429:'#f97316',
    500:'#dc2626', 301:'#6366f1', 302:'#8b5cf6', 400:'#ec4899', 401:'#f43f5e'
  };
  $: statusDonut = $topStatuses.map(s => ({
    label: `HTTP ${s.status}`, value: s.count, color: STATUS_COLORS[s.status] ?? '#6b7280'
  }));

  onMount(async () => {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    if (tagCanvas && $topTags.length) buildTagChart(Chart);
    if (countryCanvas && $topCountries.length) buildCountryChart(Chart);
  });

  onDestroy(() => {
    tagChart?.destroy();
    countryChart?.destroy();
  });

  $: if (tagChart && $topTags.length) {
    tagChart.data.labels = $topTags.map(t => t.tag);
    tagChart.data.datasets[0].data = $topTags.map(t => t.count);
    tagChart.update();
  }
  $: if (countryChart && $topCountries.length) {
    countryChart.data.labels = $topCountries.slice(0, 15).map(c => `${flag(c.country)} ${c.country}`);
    countryChart.data.datasets[0].data = $topCountries.slice(0, 15).map(c => c.count);
    countryChart.update();
  }

  function buildTagChart(Chart) {
    if (!tagCanvas) return;
    tagChart = new Chart(tagCanvas, {
      type: 'bar',
      data: {
        labels: $topTags.map(t => t.tag),
        datasets: [{
          data: $topTags.map(t => t.count),
          backgroundColor: ['#ef4444cc','#f59e0bcc','#f97316cc','#a855f7cc','#3b82f6cc','#14b8a6cc','#ec4899cc','#6366f1cc'],
          borderColor:     ['#ef4444','#f59e0b','#f97316','#a855f7','#3b82f6','#14b8a6','#ec4899','#6366f1'],
          borderWidth: 1, borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor:'#1a1d27', borderColor:'#2a2d3a', borderWidth:1, titleColor:'#e5e7eb', bodyColor:'#9ca3af' }
        },
        scales: {
          x: { grid:{ color:'rgba(42,45,58,0.5)' }, ticks:{ color:'#6b7280', font:{size:11} } },
          y: { grid:{ display:false }, ticks:{ color:'#9ca3af', font:{size:12} } }
        }
      }
    });
  }

  function buildCountryChart(Chart) {
    if (!countryCanvas) return;
    countryChart = new Chart(countryCanvas, {
      type: 'bar',
      data: {
        labels: $topCountries.slice(0,15).map(c => `${flag(c.country)} ${c.country}`),
        datasets: [{
          data: $topCountries.slice(0,15).map(c => c.count),
          backgroundColor: 'rgba(99,102,241,0.7)', borderRadius: 4
        }]
      },
      options: {
        indexAxis: 'y', responsive: true, maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: { backgroundColor:'#1a1d27', borderColor:'#2a2d3a', borderWidth:1, titleColor:'#e5e7eb', bodyColor:'#9ca3af' }
        },
        scales: {
          x: { grid:{ color:'rgba(42,45,58,0.5)' }, ticks:{ color:'#6b7280', font:{size:11} } },
          y: { grid:{ display:false }, ticks:{ color:'#9ca3af', font:{size:11} } }
        }
      }
    });
  }

  function exportJSON() {
    if (!$socData) return;
    const blob = new Blob([JSON.stringify($socData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'soc_data.json'; a.click();
    URL.revokeObjectURL(url);
  }
</script>

<div class="p-5 space-y-5">

  <!-- ── Méthodes HTTP + Statuts de réponse ───────────────────────────── -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <!-- Méthodes -->
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Distribution méthodes HTTP
      </h2>
      <div class="flex gap-6 items-start justify-center">
        <DonutChart data={methodDonut} size={160} showLegend={true}
          centerLabel={String(methodDonut.reduce((s,d)=>s+d.value,0))} />
      </div>
    </div>

    <!-- Statuts HTTP -->
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Statuts de réponse HTTP
      </h2>
      <div class="flex gap-6 items-start justify-center">
        <DonutChart data={statusDonut} size={160} showLegend={true}
          centerLabel={String(statusDonut.reduce((s,d)=>s+d.value,0))} />
      </div>
    </div>
  </div>

  <!-- ── Score par ASN ─────────────────────────────────────────────────── -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
    <div class="flex items-center justify-between mb-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Score de menace par ASN
      </h2>
      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">
        Score moyen · max · volume de requêtes
      </span>
    </div>
    <AsnScoreChart data={$asnScores} darkMode={$darkMode} />
  </div>

  <!-- ── Top IPs Full Table ─────────────────────────────────────────────── -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden">
    <div class="p-4 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Top IPs — Analyse complète
      </h2>
      <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">{$topIPs.length} adresses</span>
    </div>
    <div class="overflow-x-auto">
      <table class="w-full text-sm">
        <thead>
          <tr class="border-b {$darkMode ? 'border-[#2a2d3a] bg-[#22263a]' : 'border-slate-200 bg-slate-50'}">
            {#each [
              {key:'ip',label:'Adresse IP'},{key:'level',label:'Niveau'},
              {key:'score',label:'Score'},{key:'count',label:'Requêtes'},
              {key:'country',label:'Pays'},{key:'asn',label:'ASN'},
              {key:'clients',label:'Clients touchés'},{key:'tags',label:'Tags'}
            ] as col}
              <th on:click={() => sortIP(col.key)}
                class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
                  {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}">
                {col.label} <span class="opacity-50">{sortIcon(col.key)}</span>
              </th>
            {/each}
          </tr>
        </thead>
        <tbody>
          {#each sortedIPs as ip}
            <tr class="border-b transition-colors {$darkMode ? 'border-[#2a2d3a] hover:bg-[#22263a]' : 'border-slate-100 hover:bg-slate-50'}">
              <td class="px-3 py-3"><code class="text-sm font-mono {$darkMode ? 'text-gray-200' : 'text-gray-700'}">{ip.ip}</code></td>
              <td class="px-3 py-3"><LevelBadge level={ip.level} /></td>
              <td class="px-3 py-3">
                <div class="flex items-center gap-2">
                  <div class="w-16 h-2 {$darkMode ? 'bg-[#22263a]' : 'bg-slate-200'} rounded-full overflow-hidden">
                    <div class="h-full rounded-full
                      {ip.score >= 8 ? 'bg-red-500' : ip.score >= 5 ? 'bg-amber-500' : 'bg-orange-500'}"
                      style="width:{(ip.score/10)*100}%"></div>
                  </div>
                  <span class="font-bold text-sm {ip.score >= 8 ? 'text-red-400' : ip.score >= 5 ? 'text-amber-400' : 'text-orange-400'}">
                    {ip.score}/10
                  </span>
                </div>
              </td>
              <td class="px-3 py-3 font-mono text-sm {$darkMode ? 'text-gray-300' : 'text-gray-700'}">{fmt(ip.count)}</td>
              <td class="px-3 py-3 text-sm {$darkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap">{flag(ip.country)} {ip.country}</td>
              <td class="px-3 py-3"><code class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'}">{ip.asn}</code></td>
              <td class="px-3 py-3">
                {#if ip.clients?.length > 1}
                  <span class="bg-red-500/20 text-red-400 border border-red-500/30 rounded-full px-2 py-0.5 text-xs font-bold">
                    {ip.clients.length} clients
                  </span>
                  <div class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} mt-0.5">
                    {ip.clients.slice(0,2).join(', ')}{ip.clients.length > 2 ? '...' : ''}
                  </div>
                {:else}
                  <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'}">{ip.clients?.[0] ?? '—'}</span>
                {/if}
              </td>
              <td class="px-3 py-3">
                <div class="flex flex-wrap gap-1">
                  {#each (ip.tags ?? []).slice(0,3) as tag}
                    <TagBadge {tag} />
                  {/each}
                </div>
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    </div>
  </div>

  <!-- ── Tags + Pays charts ─────────────────────────────────────────────── -->
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-5">
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Distribution des tags de menace
      </h2>
      <div class="h-64 relative">
        <canvas bind:this={tagCanvas}></canvas>
        {#if !$topTags.length}
          <div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucune donnée</div>
        {/if}
      </div>
    </div>
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
      <h2 class="text-sm font-semibold uppercase tracking-wider mb-4 {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Volume d'attaques par pays
      </h2>
      <div class="h-64 relative">
        <canvas bind:this={countryCanvas}></canvas>
        {#if !$topCountries.length}
          <div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">Aucune donnée</div>
        {/if}
      </div>
    </div>
  </div>

  <!-- ── Données brutes JSON ────────────────────────────────────────────── -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden">
    <div class="p-4 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} flex items-center justify-between">
      <h2 class="text-sm font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-400' : 'text-gray-500'}">
        Données brutes JSON
      </h2>
      <div class="flex gap-2">
        <button on:click={() => showRaw = !showRaw}
          class="px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors
            {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
          {showRaw ? 'Masquer' : 'Afficher'} JSON
        </button>
        <button on:click={exportJSON}
          class="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-medium transition-colors">
          <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
          </svg>
          Exporter JSON
        </button>
      </div>
    </div>
    {#if showRaw && $socData}
      <div class="p-4 overflow-auto max-h-96">
        <pre class="text-xs font-mono {$darkMode ? 'text-gray-400' : 'text-gray-600'} leading-relaxed whitespace-pre-wrap break-all">{JSON.stringify($socData, null, 2)}</pre>
      </div>
    {:else if showRaw}
      <div class="p-8 text-center {$darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm">Aucune donnée chargée</div>
    {/if}
  </div>
</div>
