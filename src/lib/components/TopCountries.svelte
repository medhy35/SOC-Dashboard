<script>
  export let countries = [];

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

  $: max = countries[0]?.count ?? 1;
  $: top10 = countries.slice(0, 10);
</script>

<div class="space-y-2">
  {#each top10 as c, i}
    {@const pct = Math.round((c.count / max) * 100)}
    <div class="flex items-center gap-3">
      <span class="text-xs text-gray-600 w-4 text-right shrink-0">{i+1}</span>
      <span class="text-lg w-7 shrink-0">{flag(c.country)}</span>
      <div class="flex-1 min-w-0">
        <div class="flex items-center justify-between mb-1">
          <span class="text-sm font-medium text-gray-300">{c.country}</span>
          <div class="flex items-center gap-2">
            {#if c.critiques > 0}
              <span class="text-xs text-red-400 font-semibold">⚠ {c.critiques}</span>
            {/if}
            <span class="text-xs font-bold text-gray-300">{fmt(c.count)}</span>
          </div>
        </div>
        <div class="h-1.5 bg-[#22263a] rounded-full overflow-hidden">
          <div class="h-full rounded-full transition-all duration-500
            {c.critiques > 0 ? 'bg-red-500/70' : 'bg-indigo-500/60'}"
            style="width: {pct}%"></div>
        </div>
      </div>
    </div>
  {/each}
  {#if !countries.length}
    <p class="text-center text-gray-500 text-sm py-8">Aucune donnée disponible</p>
  {/if}
</div>
