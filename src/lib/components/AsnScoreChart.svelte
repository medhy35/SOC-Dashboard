<script>
  export let data = [];   // asnScores store value
  export let darkMode = true;

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  const scoreColor = (score) => {
    if (score >= 8) return { bg: 'bg-red-500/20', text: 'text-red-400', bar: '#ef4444', border: 'border-red-500/30' };
    if (score >= 5) return { bg: 'bg-amber-500/20', text: 'text-amber-400', bar: '#f59e0b', border: 'border-amber-500/30' };
    return { bg: 'bg-orange-500/20', text: 'text-orange-400', bar: '#f97316', border: 'border-orange-500/30' };
  };

  $: maxRequests = Math.max(...data.map(d => d.totalRequests), 1);
</script>

<div class="space-y-2">
  {#each data as asn, i}
    {@const c = scoreColor(asn.avgScore)}
    {@const pct = Math.round((asn.totalRequests / maxRequests) * 100)}
    <div class="{darkMode ? 'bg-[#22263a]' : 'bg-slate-50'} rounded-lg p-2.5 hover:{darkMode ? 'bg-[#2a2d3a]' : 'bg-slate-100'} transition-colors">
      <div class="flex items-center justify-between mb-1.5">
        <div class="flex items-center gap-2">
          <span class="text-xs {darkMode ? 'text-gray-600' : 'text-gray-400'} w-4 text-right">{i+1}</span>
          <code class="text-xs font-mono font-bold {darkMode ? 'text-gray-200' : 'text-gray-700'}">{asn.asn}</code>
          {#if asn.critiques > 0}
            <span class="text-[10px] bg-red-500/20 text-red-400 border border-red-500/30 rounded px-1.5 py-px font-bold">
              {asn.critiques} critique{asn.critiques > 1 ? 's' : ''}
            </span>
          {/if}
        </div>
        <div class="flex items-center gap-3 text-xs">
          <span class="{darkMode ? 'text-gray-500' : 'text-gray-400'}">{asn.count} alerte{asn.count > 1 ? 's' : ''}</span>
          <span class="font-mono {darkMode ? 'text-gray-300' : 'text-gray-600'}">{fmt(asn.totalRequests)} req.</span>
          <span class="font-bold {c.text} border {c.border} {c.bg} rounded px-1.5 py-px">
            ⌀ {asn.avgScore}
          </span>
        </div>
      </div>
      <!-- Request volume bar -->
      <div class="h-1.5 {darkMode ? 'bg-[#1a1d27]' : 'bg-slate-200'} rounded-full overflow-hidden">
        <div class="h-full rounded-full transition-all duration-500"
          style="width:{pct}%;background:{c.bar}99"></div>
      </div>
      <!-- Score dots -->
      <div class="flex items-center gap-0.5 mt-1.5">
        {#each Array(10) as _, j}
          <div class="h-1 flex-1 rounded-sm {j < asn.maxScore
            ? (j >= 7 ? 'bg-red-500' : j >= 4 ? 'bg-amber-500' : 'bg-orange-500')
            : (darkMode ? 'bg-[#1a1d27]' : 'bg-slate-200')}"></div>
        {/each}
        <span class="ml-2 text-[10px] {darkMode ? 'text-gray-600' : 'text-gray-400'}">max {asn.maxScore}/10</span>
      </div>
    </div>
  {/each}

  {#if !data.length}
    <div class="text-center py-8 {darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm">
      Aucune donnée ASN
    </div>
  {/if}
</div>
