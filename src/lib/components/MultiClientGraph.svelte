<script>
  import LevelBadge from './LevelBadge.svelte';
  export let ips = [];      // multiClientIPs store value
  export let darkMode = true;

  // Gather unique clients
  $: allClients = [...new Set(ips.flatMap(ip => ip.clients ?? []))].sort();
  $: maxCount = Math.max(...ips.map(ip => ip.count), 1);

  const flagMap = {
    'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳',
    'NL':'🇳🇱','UA':'🇺🇦','GB':'🇬🇧','KR':'🇰🇷','JP':'🇯🇵','SG':'🇸🇬','CA':'🇨🇦',
    'TR':'🇹🇷','ID':'🇮🇩','VN':'🇻🇳','MA':'🇲🇦','SN':'🇸🇳','NG':'🇳🇬',
    'CI':'🇨🇮','CM':'🇨🇲','TN':'🇹🇳','DZ':'🇩🇿','EG':'🇪🇬','ZA':'🇿🇦'
  };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  function clientShort(name) {
    return name.replace('Client ', '').slice(0, 10);
  }

  // Color per IP level
  const levelColor = { critique: '#ef4444', moyen: '#f59e0b', faible: '#f97316' };
</script>

<div class="overflow-x-auto">
  <!-- Header row: client names -->
  <div class="min-w-max">
    <!-- IP rows -->
    <div class="space-y-1.5">
      {#each ips as ip, i}
        {@const intensity = ip.count / maxCount}
        <div class="flex items-center gap-2">
          <!-- IP info -->
          <div class="w-52 shrink-0 flex items-center gap-2 {darkMode ? 'bg-[#22263a]' : 'bg-slate-100'} rounded-lg px-2.5 py-1.5">
            <span class="text-xs">{flag(ip.country)}</span>
            <div class="min-w-0 flex-1">
              <code class="text-xs font-mono {darkMode ? 'text-gray-200' : 'text-gray-700'} block truncate">{ip.ip}</code>
              <div class="flex items-center gap-1 mt-0.5">
                <span class="w-1.5 h-1.5 rounded-full" style="background:{levelColor[ip.level] ?? '#6b7280'}"></span>
                <span class="text-[10px] font-bold text-gray-500">{fmt(ip.count)} req · score {ip.score}</span>
              </div>
            </div>
          </div>

          <!-- Client cells -->
          <div class="flex gap-1 flex-wrap">
            {#each allClients as client}
              {@const hit = (ip.clients ?? []).includes(client)}
              <div class="w-20 h-8 rounded flex items-center justify-center text-[10px] font-medium transition-all
                {hit
                  ? 'border'
                  : (darkMode ? 'bg-[#1a1d27] border border-[#2a2d3a]' : 'bg-slate-50 border border-slate-100')}"
                style={hit ? `background:${levelColor[ip.level]}22;border-color:${levelColor[ip.level]}66;color:${levelColor[ip.level]}` : ''}
                title={hit ? `${ip.ip} → ${client}` : ''}>
                {#if hit}
                  <span>✓ {clientShort(client)}</span>
                {:else}
                  <span class="{darkMode ? 'text-gray-700' : 'text-gray-300'}">—</span>
                {/if}
              </div>
            {/each}
          </div>

          <!-- Client count badge -->
          <span class="text-xs font-bold px-2 py-0.5 rounded-full border
            {ip.level === 'critique'
              ? 'bg-red-500/20 text-red-400 border-red-500/30'
              : 'bg-amber-500/20 text-amber-400 border-amber-500/30'}">
            {ip.clients?.length} clients
          </span>
        </div>
      {/each}
    </div>

    <!-- Footer: client labels -->
    <div class="flex gap-1 mt-2 ml-[216px]">
      {#each allClients as client}
        <div class="w-20 text-[10px] text-center {darkMode ? 'text-gray-600' : 'text-gray-400'} truncate px-0.5"
          title={client}>
          {clientShort(client)}
        </div>
      {/each}
    </div>
  </div>

  {#if !ips.length}
    <div class="text-center py-8 text-gray-500 text-sm">
      Aucune IP ne touche plusieurs clients
    </div>
  {/if}
</div>
