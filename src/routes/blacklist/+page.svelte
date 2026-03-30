<script>
  import { blacklist, blacklistStats, addIP, removeIP, updateIP, autoPopulate, exportPlainText, exportCSV, exportCloudflareList, exportJSON } from '$lib/stores/blacklist';
  import { topIPs, darkMode } from '$lib/stores/data';
  import { addToast } from '$lib/stores/ui';
  import LevelBadge from '$lib/components/LevelBadge.svelte';

  let newIP = ''; let newNote = ''; let search = '';
  let sortCol = 'score'; let sortDir = -1;

  const flagMap = { 'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳','NL':'🇳🇱','UA':'🇺🇦','SG':'🇸🇬','MA':'🇲🇦','SN':'🇸🇳','NG':'🇳🇬','VN':'🇻🇳','ID':'🇮🇩','TR':'🇹🇷','DZ':'🇩🇿','TN':'🇹🇳','KR':'🇰🇷' };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  function doAutoPopulate() {
    autoPopulate($topIPs);
    addToast(`${$topIPs.filter(ip=>ip.score>=7).length} IPs importées automatiquement`, 'success');
  }

  function doAdd() {
    if (!newIP.trim()) return;
    addIP(newIP.trim(), { notes: newNote, source: 'manual' });
    addToast(`IP ${newIP} ajoutée à la blacklist`, 'success');
    newIP = ''; newNote = '';
  }

  function doRemove(ip) {
    if (confirm(`Retirer ${ip} de la blacklist ?`)) {
      removeIP(ip);
      addToast(`IP ${ip} retirée`, 'info');
    }
  }

  function doExport(format) {
    const bl = $blacklist;
    let content, filename, type;
    if (format === 'txt') { content = exportPlainText(bl); filename = '1t3r-blacklist.txt'; type = 'text/plain'; }
    else if (format === 'csv') { content = exportCSV(bl); filename = '1t3r-blacklist.csv'; type = 'text/csv'; }
    else if (format === 'cf') { content = exportCloudflareList(bl); filename = '1t3r-blacklist-cloudflare.txt'; type = 'text/plain'; }
    else { content = exportJSON(bl); filename = '1t3r-blacklist.json'; type = 'application/json'; }
    const blob = new Blob(['\ufeff' + content], { type });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
    addToast(`Export ${format.toUpperCase()} téléchargé (${Object.keys(bl).length} IPs)`, 'success');
  }

  $: all = Object.values($blacklist);
  $: filtered = all.filter(i => !search || i.ip.includes(search) || i.country?.includes(search) || i.asn?.includes(search))
    .sort((a,b) => {
      let va = a[sortCol], vb = b[sortCol];
      return sortDir * ((va > vb ? 1 : va < vb ? -1 : 0));
    });
</script>

<div class="p-5 space-y-5">
  <!-- Header -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="text-lg font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">Blacklist 1T3R — IPs malveillantes</h1>
      <p class="text-sm {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">Base propriétaire exportable vers Cloudflare, NGINX, pare-feu</p>
    </div>
    <div class="flex gap-2">
      <button on:click={doAutoPopulate} class="text-sm px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg transition-colors font-medium">
        ⚡ Import auto (score ≥ 7)
      </button>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-3">
    {#each [
      { label: 'Total IPs', value: $blacklistStats.total, color: 'text-indigo-400' },
      { label: 'Critiques', value: $blacklistStats.critique, color: 'text-red-400' },
      { label: 'Moyens', value: $blacklistStats.moyen, color: 'text-amber-400' },
      { label: 'Auto-détectées', value: $blacklistStats.auto, color: 'text-blue-400' },
      { label: 'Manuelles', value: $blacklistStats.manual, color: 'text-green-400' },
      { label: 'Pays', value: $blacklistStats.countries, color: 'text-purple-400' },
      { label: 'ASNs', value: $blacklistStats.asns, color: 'text-cyan-400' },
    ] as s}
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-3">
        <p class="text-xs text-gray-500 uppercase tracking-wider truncate">{s.label}</p>
        <p class="text-2xl font-bold mt-0.5 {s.color}">{s.value}</p>
      </div>
    {/each}
  </div>

  <!-- Export row -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
    <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">Exporter la blacklist</p>
    <div class="flex flex-wrap gap-2">
      {#each [
        { format:'txt', label:'Plain Text', icon:'📄', desc:'1 IP par ligne' },
        { format:'csv', label:'CSV', icon:'📊', desc:'Avec métadonnées' },
        { format:'cf', label:'Cloudflare', icon:'🔶', desc:'Format IP List CF' },
        { format:'json', label:'JSON', icon:'📦', desc:'Format complet 1T3R' },
      ] as exp}
        <button on:click={() => doExport(exp.format)}
          class="flex items-center gap-2 px-4 py-2.5 border rounded-lg transition-colors text-sm
            {$darkMode ? 'border-[#2a2d3a] text-gray-300 hover:bg-[#22263a] hover:text-white' : 'border-slate-200 text-gray-600 hover:bg-slate-50'}">
          <span>{exp.icon}</span>
          <div class="text-left">
            <p class="font-medium">{exp.label}</p>
            <p class="text-[10px] {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{exp.desc}</p>
          </div>
        </button>
      {/each}
    </div>
  </div>

  <!-- Add IP manually -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
    <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">Ajouter une IP manuellement</p>
    <div class="flex gap-3 flex-wrap">
      <input type="text" bind:value={newIP} placeholder="Adresse IP (ex: 45.33.12.100)"
        class="flex-1 min-w-48 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-slate-50 border-slate-200'}"/>
      <input type="text" bind:value={newNote} placeholder="Note (optionnel)"
        class="flex-1 min-w-48 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-slate-50 border-slate-200'}"/>
      <button on:click={doAdd} disabled={!newIP.trim()}
        class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-40 text-white rounded-lg text-sm font-medium transition-colors">
        Ajouter
      </button>
    </div>
  </div>

  <!-- Search + Table -->
  <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl overflow-hidden">
    <div class="p-4 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} flex items-center justify-between gap-3">
      <input type="text" bind:value={search} placeholder="Rechercher IP, pays, ASN…"
        class="flex-1 max-w-xs px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-slate-50 border-slate-200'}"/>
      <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">{filtered.length} IP{filtered.length !== 1 ? 's' : ''}</span>
    </div>

    {#if filtered.length === 0}
      <div class="text-center py-12 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
        <p class="text-3xl mb-2">🛡️</p>
        <p>Blacklist vide — cliquer sur "Import auto" pour commencer</p>
      </div>
    {:else}
      <div class="overflow-x-auto">
        <table class="w-full text-sm">
          <thead>
            <tr class="border-b {$darkMode ? 'border-[#2a2d3a] bg-[#22263a]' : 'border-slate-200 bg-slate-50'}">
              {#each [['ip','Adresse IP'],['score','Score'],['level','Niveau'],['country','Pays'],['asn','ASN'],['hits','Hits'],['source','Source'],['addedAt','Ajouté le']] as [k,l]}
                <th on:click={() => { sortCol === k ? sortDir=-sortDir : (sortCol=k,sortDir=-1) }}
                  class="text-left px-3 py-3 text-xs font-semibold uppercase tracking-wider cursor-pointer {$darkMode ? 'text-gray-400 hover:text-gray-200' : 'text-gray-500 hover:text-gray-700'}">
                  {l} {sortCol===k ? (sortDir===-1?'↓':'↑') : '↕'}
                </th>
              {/each}
              <th class="px-3 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {#each filtered as ip}
              <tr class="border-b transition-colors {$darkMode ? 'border-[#2a2d3a] hover:bg-[#22263a]' : 'border-slate-100 hover:bg-slate-50'}">
                <td class="px-3 py-2.5"><code class="text-xs font-mono font-bold {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{ip.ip}</code></td>
                <td class="px-3 py-2.5">
                  <div class="flex gap-0.5">
                    {#each Array(10) as _,j}
                      <div class="h-2 w-1.5 rounded-sm {j<ip.score ? (j>=7?'bg-red-500':j>=4?'bg-amber-500':'bg-orange-400') : (darkMode?'bg-[#22263a]':'bg-slate-200')}"></div>
                    {/each}
                    <span class="ml-1 text-xs font-bold {ip.score>=8?'text-red-400':ip.score>=5?'text-amber-400':'text-orange-400'}">{ip.score}</span>
                  </div>
                </td>
                <td class="px-3 py-2.5"><LevelBadge level={ip.level} /></td>
                <td class="px-3 py-2.5 text-xs {$darkMode?'text-gray-400':'text-gray-600'}">{flag(ip.country)} {ip.country}</td>
                <td class="px-3 py-2.5"><code class="text-xs {$darkMode?'text-gray-500':'text-gray-500'}">{ip.asn}</code></td>
                <td class="px-3 py-2.5 text-xs font-mono {$darkMode?'text-gray-300':'text-gray-700'}">{fmt(ip.hits)}</td>
                <td class="px-3 py-2.5">
                  <span class="text-xs px-2 py-0.5 rounded-full border {ip.source==='auto' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' : 'bg-green-500/20 text-green-400 border-green-500/30'}">
                    {ip.source === 'auto' ? '⚡ Auto' : '✍️ Manuel'}
                  </span>
                </td>
                <td class="px-3 py-2.5 text-xs {$darkMode?'text-gray-500':'text-gray-400'}">
                  {new Date(ip.addedAt).toLocaleDateString('fr-FR')}
                </td>
                <td class="px-3 py-2.5">
                  <button on:click={() => doRemove(ip.ip)}
                    class="text-xs px-2 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">✕</button>
                </td>
              </tr>
            {/each}
          </tbody>
        </table>
      </div>
    {/if}
  </div>
</div>
