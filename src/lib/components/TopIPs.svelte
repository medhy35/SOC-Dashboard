<script>
  import LevelBadge from './LevelBadge.svelte';
  import TagBadge from './TagBadge.svelte';
  export let ips = [];

  function fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n ?? 0);
  }

  const flagMap = {
    'RU': '🇷🇺', 'CN': '🇨🇳', 'US': '🇺🇸', 'DE': '🇩🇪', 'FR': '🇫🇷',
    'BR': '🇧🇷', 'IN': '🇮🇳', 'NL': '🇳🇱', 'UA': '🇺🇦', 'GB': '🇬🇧',
    'KR': '🇰🇷', 'JP': '🇯🇵', 'SG': '🇸🇬', 'CA': '🇨🇦', 'TR': '🇹🇷',
    'ID': '🇮🇩', 'VN': '🇻🇳', 'MA': '🇲🇦', 'SN': '🇸🇳', 'NG': '🇳🇬',
    'CI': '🇨🇮', 'CM': '🇨🇲', 'TN': '🇹🇳', 'DZ': '🇩🇿', 'EG': '🇪🇬',
    'ZA': '🇿🇦', 'KE': '🇰🇪', 'GH': '🇬🇭', 'ET': '🇪🇹', 'TZ': '🇹🇿'
  };

  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
</script>

<div class="space-y-2">
  {#each ips.slice(0, 10) as ip, i}
    <div class="flex items-center gap-3 bg-[#22263a] rounded-lg px-3 py-2 hover:bg-[#2a2d3a] transition-colors">
      <span class="text-xs text-gray-600 w-4 text-right shrink-0">{i+1}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center gap-2 flex-wrap">
          <code class="text-sm font-mono text-gray-200">{ip.ip}</code>
          <LevelBadge level={ip.level} />
        </div>
        <div class="flex items-center gap-2 mt-0.5 flex-wrap">
          <span class="text-xs text-gray-500">{flag(ip.country)} {ip.country}</span>
          <span class="text-xs text-gray-600">·</span>
          <span class="text-xs text-gray-500 font-mono">{ip.asn}</span>
          {#if ip.clients?.length > 1}
            <span class="text-xs bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-1">
              {ip.clients.length} clients
            </span>
          {/if}
        </div>
        {#if ip.tags?.length}
          <div class="flex gap-1 mt-1 flex-wrap">
            {#each ip.tags.slice(0, 3) as tag}
              <TagBadge {tag} />
            {/each}
          </div>
        {/if}
      </div>
      <div class="text-right shrink-0">
        <p class="text-sm font-bold text-gray-200">{fmt(ip.count)}</p>
        <p class="text-xs text-gray-500">req.</p>
        <div class="text-xs font-bold text-indigo-400">Score: {ip.score}</div>
      </div>
    </div>
  {/each}
  {#if !ips.length}
    <p class="text-center text-gray-500 text-sm py-8">Aucune donnée disponible</p>
  {/if}
</div>
