<script>
  import { alerts, clients, darkMode } from '$lib/stores/data';
  import { addToast } from '$lib/stores/ui';
  import { createInvestigation } from '$lib/stores/investigations';
  import { addIP } from '$lib/stores/blacklist';
  import LevelBadge from '$lib/components/LevelBadge.svelte';
  import TagBadge from '$lib/components/TagBadge.svelte';
  import { page } from '$app/stores';
  import { goto } from '$app/navigation';
  import { onMount } from 'svelte';

  // ── Filters ───────────────────────────────────────────────────────────
  let filterClient = 'all';
  let filterLevel = 'all';
  let filterTags = [];
  let filterUnblocked = false;
  let searchQuery = '';

  // ── Sort ──────────────────────────────────────────────────────────────
  let sortCol = 'score';
  let sortDir = -1;

  // ── Pagination ────────────────────────────────────────────────────────
  let currentPage = 1;
  const PAGE_SIZE = 25;

  // ── Expanded rows ─────────────────────────────────────────────────────
  let expandedRows = new Set();

  const allTags = ['scanner', 'bot', 'exploitation', 'vpn-datacenter', 'brute-force', 'tor', 'proxy', 'non-bloqué'];

  const flagMap = {
    'RU': '🇷🇺', 'CN': '🇨🇳', 'US': '🇺🇸', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'BR': '🇧🇷', 'IN': '🇮🇳', 'NL': '🇳🇱', 'UA': '🇺🇦', 'GB': '🇬🇧',
    'KR': '🇰🇷', 'JP': '🇯🇵', 'SG': '🇸🇬', 'CA': '🇨🇦', 'TR': '🇹🇷',
    'ID': '🇮🇩', 'VN': '🇻🇳', 'MA': '🇲🇦', 'SN': '🇸🇳', 'NG': '🇳🇬',
    'CI': '🇨🇮', 'CM': '🇨🇲', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬',
    'ZA': '🇿🇦', 'KE': '🇰🇪', 'GH': '🇬🇭', 'ET': '🇪🇹', 'TZ': '🇹🇿'
  };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }
  function formatDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
  }

  // ── Read URL params on mount ──────────────────────────────────────────
  onMount(() => {
    const params = $page.url.searchParams;
    if (params.get('client')) filterClient = params.get('client');
    if (params.get('level'))  filterLevel  = params.get('level');
    if (params.get('q'))      searchQuery  = params.get('q');
  });

  // ── Reactive filtered list ────────────────────────────────────────────
  $: allClients = [...new Set($alerts.map(a => a.client))].sort();

  $: filtered = $alerts.filter(a => {
    if (filterClient !== 'all' && a.client !== filterClient) return false;
    if (filterLevel !== 'all' && a.level !== filterLevel) return false;
    if (filterUnblocked && !(a.countUnblocked > 0)) return false;
    if (filterTags.length > 0 && !filterTags.some(t => a.tags?.includes(t))) return false;
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!a.ip?.toLowerCase().includes(q) && !a.domain?.toLowerCase().includes(q) && !a.client?.toLowerCase().includes(q) && !a.asn?.toLowerCase().includes(q)) return false;
    }
    return true;
  }).sort((a, b) => {
    let va = a[sortCol], vb = b[sortCol];
    if (typeof va === 'string') va = va.toLowerCase(), vb = vb?.toLowerCase() ?? '';
    return sortDir * ((va > vb ? 1 : va < vb ? -1 : 0));
  });

  // ── Reset pagination when filters change ─────────────────────────────
  $: { filtered; currentPage = 1; }

  // ── Pagination derived ────────────────────────────────────────────────
  $: totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  $: paged = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  $: pageStart = filtered.length === 0 ? 0 : (currentPage - 1) * PAGE_SIZE + 1;
  $: pageEnd   = Math.min(currentPage * PAGE_SIZE, filtered.length);

  // ── Active filter badges ──────────────────────────────────────────────
  $: activeFilters = [
    ...(filterClient !== 'all'   ? [{ key: 'client',     label: `Client: ${filterClient}` }] : []),
    ...(filterLevel  !== 'all'   ? [{ key: 'level',      label: `Niveau: ${filterLevel}`  }] : []),
    ...(filterUnblocked          ? [{ key: 'unblocked',  label: 'Non bloqués'              }] : []),
    ...filterTags.map(t          =>  ({ key: `tag:${t}`, label: `Tag: ${t}`                })),
    ...(searchQuery              ? [{ key: 'search',     label: `"${searchQuery}"`         }] : []),
  ];

  function removeFilter(key) {
    if (key === 'client')    filterClient = 'all';
    else if (key === 'level')     filterLevel = 'all';
    else if (key === 'unblocked') filterUnblocked = false;
    else if (key === 'search')    searchQuery = '';
    else if (key.startsWith('tag:')) filterTags = filterTags.filter(t => `tag:${t}` !== key);
  }

  function sort(col) {
    if (sortCol === col) sortDir = -sortDir;
    else { sortCol = col; sortDir = -1; }
  }

  function toggleRow(i) {
    const key = (currentPage - 1) * PAGE_SIZE + i;
    if (expandedRows.has(key)) expandedRows.delete(key);
    else expandedRows.add(key);
    expandedRows = new Set(expandedRows);
  }

  function toggleTag(tag) {
    if (filterTags.includes(tag)) filterTags = filterTags.filter(t => t !== tag);
    else filterTags = [...filterTags, tag];
  }

  function resetFilters() {
    filterClient = 'all';
    filterLevel = 'all';
    filterTags = [];
    filterUnblocked = false;
    searchQuery = '';
  }

  function exportCSV() {
    const cols = ['IP', 'Client', 'Domaine', 'Pays', 'ASN', 'Niveau', 'Score', 'Count', 'Non bloqués', 'Tags', 'Paths', 'Première vue', 'Dernière vue'];
    const rows = filtered.map(a => [
      a.ip, a.client, a.domain, a.country, a.asn, a.level, a.score, a.count, a.countUnblocked,
      (a.tags ?? []).join('|'), (a.paths ?? []).join('|'), a.firstSeen, a.lastSeen
    ]);
    const csv = [cols, ...rows].map(r => r.map(v => `"${v ?? ''}"`).join(',')).join('\n');
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = `alertes-soc-${new Date().toISOString().slice(0,10)}.csv`; a.click();
    URL.revokeObjectURL(url);
    addToast(`${filtered.length} alertes exportées en CSV`, 'success');
  }

  function sortIcon(col) {
    if (sortCol !== col) return '↕';
    return sortDir === -1 ? '↓' : '↑';
  }

  // ── Investigation workflow ────────────────────────────────────────────
  function investigate(alert, e) {
    e.stopPropagation();
    createInvestigation(alert);
    addToast(`Investigation ouverte pour ${alert.ip}`, 'success');
  }

  // ── Blacklist action ──────────────────────────────────────────────────
  function blacklistIP(alert, e) {
    e.stopPropagation();
    addIP(alert.ip, {
      score: alert.score,
      level: alert.level,
      country: alert.country,
      asn: alert.asn,
      hits: alert.count,
      notes: `Auto depuis alertes – ${alert.client}`,
      source: 'auto',
    });
    addToast(`${alert.ip} ajoutée à la blacklist`, 'success');
  }

  // ── Highlight search term ─────────────────────────────────────────────
  function highlight(text, query) {
    if (!query || !text) return text ?? '';
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    return text.replace(new RegExp(`(${escaped})`, 'gi'), '<mark class="bg-yellow-400/30 text-yellow-300 rounded px-0.5">$1</mark>');
  }

  // ── Pagination helpers ────────────────────────────────────────────────
  function getPageNumbers() {
    const pages = [];
    const delta = 2;
    for (let i = Math.max(1, currentPage - delta); i <= Math.min(totalPages, currentPage + delta); i++) {
      pages.push(i);
    }
    return pages;
  }
</script>

<div class="p-5 space-y-4">
  <!-- ── Filter bar ──────────────────────────────────────────────────── -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
    <div class="flex flex-wrap gap-3 items-center">
      <!-- Search -->
      <div class="relative flex-1 min-w-48">
        <svg class="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 {$darkMode ? 'text-gray-500' : 'text-gray-400'}" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
        </svg>
        <input type="text" bind:value={searchQuery} placeholder="Rechercher IP, domaine, client, ASN..."
          class="w-full pl-9 pr-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50
            {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-slate-50 border-slate-200 text-gray-800 placeholder-gray-400'}"/>
      </div>

      <!-- Client filter -->
      <select bind:value={filterClient}
        class="px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50
          {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200' : 'bg-slate-50 border-slate-200 text-gray-800'}">
        <option value="all">Tous les clients</option>
        {#each allClients as c}
          <option value={c}>{c}</option>
        {/each}
      </select>

      <!-- Level filter -->
      <select bind:value={filterLevel}
        class="px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50
          {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200' : 'bg-slate-50 border-slate-200 text-gray-800'}">
        <option value="all">Tous les niveaux</option>
        <option value="critique">🔴 Critique</option>
        <option value="moyen">🟡 Moyen</option>
        <option value="faible">🟠 Faible</option>
      </select>

      <!-- Unblocked toggle -->
      <label class="flex items-center gap-2 cursor-pointer select-none">
        <div class="relative">
          <input type="checkbox" bind:checked={filterUnblocked} class="sr-only"/>
          <div class="w-10 h-5 rounded-full transition-colors {filterUnblocked ? 'bg-red-500' : ($darkMode ? 'bg-[#22263a]' : 'bg-slate-200')} border {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-300'}"></div>
          <div class="absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform {filterUnblocked ? 'translate-x-5' : ''}"></div>
        </div>
        <span class="text-sm {$darkMode ? 'text-gray-400' : 'text-gray-600'}">Non bloqués seuls</span>
      </label>

      <!-- Reset -->
      {#if activeFilters.length > 0}
        <button on:click={resetFilters}
          class="px-3 py-2 rounded-lg text-sm border transition-colors
            {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
          Réinitialiser
        </button>
      {/if}

      <!-- Export -->
      <button on:click={exportCSV}
        class="flex items-center gap-2 px-3 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"/>
        </svg>
        Export CSV
      </button>
    </div>

    <!-- Tag filters -->
    <div class="flex flex-wrap gap-2 mt-3 pt-3 border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'}">
      <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} self-center">Tags :</span>
      {#each allTags as tag}
        <button on:click={() => toggleTag(tag)}
          class="px-2 py-0.5 rounded-full text-xs font-medium border transition-all
            {filterTags.includes(tag)
              ? 'bg-indigo-600/30 text-indigo-300 border-indigo-500/50'
              : ($darkMode ? 'bg-[#22263a] text-gray-500 border-[#2a2d3a] hover:text-gray-300' : 'bg-slate-100 text-gray-500 border-slate-200 hover:text-gray-700')}">
          {tag}
        </button>
      {/each}
    </div>
  </div>

  <!-- ── Active filter badges ──────────────────────────────────────────── -->
  {#if activeFilters.length > 0}
    <div class="flex flex-wrap gap-2 items-center">
      <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">Filtres actifs :</span>
      {#each activeFilters as f}
        <button on:click={() => removeFilter(f.key)}
          class="flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium border transition-all
            bg-indigo-600/20 text-indigo-300 border-indigo-500/40 hover:bg-red-500/20 hover:text-red-300 hover:border-red-500/40">
          {f.label}
          <span class="text-xs opacity-70">✕</span>
        </button>
      {/each}
    </div>
  {/if}

  <!-- ── Result count + pagination info ────────────────────────────────── -->
  <div class="flex items-center justify-between flex-wrap gap-2">
    <p class="text-sm {$darkMode ? 'text-gray-400' : 'text-gray-600'}">
      <span class="font-bold {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{filtered.length}</span>
      alerte{filtered.length !== 1 ? 's' : ''} affichée{filtered.length !== 1 ? 's' : ''}
      {#if filtered.length !== $alerts.length}
        <span class="{$darkMode ? 'text-gray-600' : 'text-gray-400'}"> / {$alerts.length} total</span>
      {/if}
    </p>
    {#if filtered.length > PAGE_SIZE}
      <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
        Affichage {pageStart}–{pageEnd} sur {filtered.length}
      </p>
    {/if}
  </div>

  <!-- ── Table ──────────────────────────────────────────────────────────── -->
  {#if filtered.length === 0}
    <div class="text-center py-16 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
      <div class="text-4xl mb-3">🔍</div>
      <p class="font-semibold">Aucune alerte ne correspond aux filtres</p>
      <p class="text-sm mt-1">Essayez de modifier vos critères de recherche</p>
    </div>
  {:else}
    <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden">
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b {$darkMode ? 'border-[#2a2d3a] bg-[#22263a]' : 'border-slate-200 bg-slate-50'}">
              {#each [
                { key: 'level',     label: 'Niveau'       },
                { key: 'ip',        label: 'IP'           },
                { key: 'client',    label: 'Client'       },
                { key: 'country',   label: 'Pays'         },
                { key: 'score',     label: 'Score'        },
                { key: 'count',     label: 'Requêtes'     },
                { key: 'tags',      label: 'Tags'         },
                { key: 'paths',     label: 'Chemins'      },
                { key: 'firstSeen', label: 'Première vue' },
                { key: 'lastSeen',  label: 'Dernière vue' },
              ] as col}
                <th on:click={() => sort(col.key)}
                  class="text-left px-3 py-3 font-semibold text-xs uppercase tracking-wider cursor-pointer select-none whitespace-nowrap
                    {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}">
                  {col.label}
                  <span class="ml-1 opacity-50">{sortIcon(col.key)}</span>
                </th>
              {/each}
              <th class="px-3 py-3 text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody>
            {#each paged as alert, i}
              {@const globalIdx = (currentPage - 1) * PAGE_SIZE + i}
              {@const unblocked = alert.countUnblocked > 0}
              <tr class="border-b cursor-pointer transition-colors
                {$darkMode
                  ? (unblocked ? 'border-[#2a2d3a] bg-red-950/20 hover:bg-red-950/30' : 'border-[#2a2d3a] hover:bg-[#22263a]')
                  : (unblocked ? 'border-slate-100 bg-red-50 hover:bg-red-100/50' : 'border-slate-100 hover:bg-slate-50')}"
                on:click={() => toggleRow(i)}>
                <td class="px-3 py-2.5"><LevelBadge level={alert.level} /></td>
                <td class="px-3 py-2.5">
                  <code class="text-xs font-mono {$darkMode ? 'text-gray-300' : 'text-gray-700'}">
                    {#if searchQuery}
                      {@html highlight(alert.ip, searchQuery)}
                    {:else}
                      {alert.ip}
                    {/if}
                  </code>
                  {#if unblocked}
                    <span class="ml-1 text-xs text-red-400 font-bold">⚠</span>
                  {/if}
                </td>
                <td class="px-3 py-2.5">
                  <div class="text-xs {$darkMode ? 'text-gray-300' : 'text-gray-700'} font-medium">
                    {#if searchQuery}
                      {@html highlight(alert.client, searchQuery)}
                    {:else}
                      {alert.client}
                    {/if}
                  </div>
                  <div class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{alert.domain}</div>
                </td>
                <td class="px-3 py-2.5 text-xs {$darkMode ? 'text-gray-400' : 'text-gray-600'} whitespace-nowrap">
                  {flag(alert.country)} {alert.country}
                </td>
                <td class="px-3 py-2.5">
                  <div class="flex items-center gap-1">
                    <div class="w-8 h-1.5 {$darkMode ? 'bg-[#22263a]' : 'bg-slate-200'} rounded-full overflow-hidden">
                      <div class="h-full rounded-full
                        {alert.score >= 8 ? 'bg-red-500' : alert.score >= 5 ? 'bg-amber-500' : 'bg-orange-500'}"
                        style="width: {(alert.score / 10) * 100}%"></div>
                    </div>
                    <span class="text-xs font-bold
                      {alert.score >= 8 ? 'text-red-400' : alert.score >= 5 ? 'text-amber-400' : 'text-orange-400'}">
                      {alert.score}
                    </span>
                  </div>
                </td>
                <td class="px-3 py-2.5 text-xs font-mono {$darkMode ? 'text-gray-300' : 'text-gray-700'}">
                  {fmt(alert.count)}
                  {#if alert.countUnblocked > 0}
                    <div class="text-red-400 font-bold">{alert.countUnblocked} passés</div>
                  {/if}
                </td>
                <td class="px-3 py-2.5">
                  <div class="flex flex-wrap gap-1 max-w-[160px]">
                    {#each (alert.tags ?? []).slice(0, 2) as tag}
                      <TagBadge {tag} />
                    {/each}
                    {#if (alert.tags ?? []).length > 2}
                      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">+{alert.tags.length - 2}</span>
                    {/if}
                  </div>
                </td>
                <td class="px-3 py-2.5">
                  <div class="flex flex-col gap-0.5 max-w-[140px]">
                    {#each (alert.paths ?? []).slice(0, 2) as path}
                      <code class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'} truncate">{path}</code>
                    {/each}
                    {#if (alert.paths ?? []).length > 2}
                      <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">+{alert.paths.length - 2} autres</span>
                    {/if}
                  </div>
                </td>
                <td class="px-3 py-2.5 text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'} whitespace-nowrap">
                  {formatDate(alert.firstSeen)}
                </td>
                <td class="px-3 py-2.5 text-xs {$darkMode ? 'text-gray-500' : 'text-gray-500'} whitespace-nowrap">
                  {formatDate(alert.lastSeen)}
                </td>
                <!-- Actions -->
                <td class="px-3 py-2.5" on:click|stopPropagation>
                  <div class="flex gap-1">
                    <button on:click={(e) => investigate(alert, e)}
                      title="Ouvrir une investigation"
                      class="text-xs px-2 py-1 rounded border transition-colors whitespace-nowrap
                        {$darkMode ? 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/20' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'}">
                      🔍
                    </button>
                    <button on:click={(e) => blacklistIP(alert, e)}
                      title="Ajouter à la blacklist"
                      class="text-xs px-2 py-1 rounded border transition-colors
                        {$darkMode ? 'border-red-500/40 text-red-400 hover:bg-red-500/20' : 'border-red-300 text-red-500 hover:bg-red-50'}">
                      🛡
                    </button>
                  </div>
                </td>
              </tr>

              <!-- Expanded detail row -->
              {#if expandedRows.has(i)}
                <tr class="{$darkMode ? 'bg-[#22263a] border-[#2a2d3a]' : 'bg-slate-50 border-slate-200'} border-b">
                  <td colspan="11" class="px-4 py-4">
                    <div class="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs">
                      <div>
                        <p class="font-semibold {$darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2">Chemins ciblés</p>
                        {#each alert.paths ?? [] as path}
                          <code class="{$darkMode ? 'text-gray-300' : 'text-gray-600'} block">{path}</code>
                        {/each}
                      </div>
                      <div>
                        <p class="font-semibold {$darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2">Raisons WAF</p>
                        {#each alert.reasons ?? [] as reason}
                          <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">{reason}</p>
                        {/each}
                      </div>
                      <div>
                        <p class="font-semibold {$darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2">User Agents</p>
                        {#each alert.userAgents ?? [] as ua}
                          <code class="{$darkMode ? 'text-gray-500' : 'text-gray-500'} block text-xs break-all">{ua}</code>
                        {/each}
                      </div>
                      <div>
                        <p class="font-semibold {$darkMode ? 'text-gray-400' : 'text-gray-500'} uppercase tracking-wider mb-2">Détails</p>
                        <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">ASN: <code>{alert.asn}</code></p>
                        <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">Actions: {(alert.actions ?? []).join(', ')}</p>
                        <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">Méthodes: {(alert.methods ?? []).join(', ')}</p>
                        <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">Status HTTP: {(alert.responseStatuses ?? []).join(', ')}</p>
                        {#if alert.countUnblocked > 0}
                          <p class="text-red-400 font-bold mt-1">⚠ {alert.countUnblocked} requête{alert.countUnblocked > 1 ? 's' : ''} non bloquée{alert.countUnblocked > 1 ? 's' : ''}</p>
                        {/if}
                      </div>
                    </div>
                    {#if (alert.tags ?? []).length}
                      <div class="mt-3 pt-3 border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} flex gap-1.5 flex-wrap">
                        {#each alert.tags as tag}
                          <TagBadge {tag} />
                        {/each}
                      </div>
                    {/if}
                    <!-- Action bar in expanded row -->
                    <div class="mt-3 pt-3 border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} flex gap-2">
                      <button on:click={(e) => investigate(alert, e)}
                        class="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors
                          {$darkMode ? 'border-indigo-500/40 text-indigo-400 hover:bg-indigo-500/20' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'}">
                        🔍 Ouvrir investigation
                      </button>
                      <button on:click={(e) => blacklistIP(alert, e)}
                        class="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors
                          {$darkMode ? 'border-red-500/40 text-red-400 hover:bg-red-500/20' : 'border-red-300 text-red-500 hover:bg-red-50'}">
                        🛡 Blacklister
                      </button>
                      <a href="/reports?client={encodeURIComponent(alert.client)}"
                        class="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors
                          {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
                        📋 Rapport client
                      </a>
                    </div>
                  </td>
                </tr>
              {/if}
            {/each}
          </tbody>
        </table>
      </div>
    </div>

    <!-- ── Pagination controls ─────────────────────────────────────────── -->
    {#if totalPages > 1}
      <div class="flex items-center justify-between flex-wrap gap-3">
        <!-- Info -->
        <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
          Page {currentPage}/{totalPages} · {pageStart}–{pageEnd} sur {filtered.length} alertes
        </p>

        <!-- Controls -->
        <div class="flex items-center gap-1">
          <!-- First -->
          <button on:click={() => currentPage = 1} disabled={currentPage === 1}
            class="px-2 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30
              {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
            «
          </button>
          <!-- Prev -->
          <button on:click={() => currentPage--} disabled={currentPage === 1}
            class="px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30
              {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
            ‹
          </button>

          <!-- Page numbers -->
          {#if currentPage > 3}
            <span class="px-1 text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">…</span>
          {/if}
          {#each getPageNumbers() as p}
            <button on:click={() => currentPage = p}
              class="w-8 h-8 rounded-lg text-xs border transition-colors font-medium
                {currentPage === p
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : ($darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]' : 'border-slate-200 text-gray-600 hover:bg-slate-100')}">
              {p}
            </button>
          {/each}
          {#if currentPage < totalPages - 2}
            <span class="px-1 text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">…</span>
          {/if}

          <!-- Next -->
          <button on:click={() => currentPage++} disabled={currentPage === totalPages}
            class="px-2.5 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30
              {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
            ›
          </button>
          <!-- Last -->
          <button on:click={() => currentPage = totalPages} disabled={currentPage === totalPages}
            class="px-2 py-1.5 rounded-lg text-xs border transition-colors disabled:opacity-30
              {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] disabled:hover:bg-transparent' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">
            »
          </button>
        </div>

        <!-- Per-page note -->
        <p class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{PAGE_SIZE} lignes/page</p>
      </div>
    {/if}
  {/if}
</div>
