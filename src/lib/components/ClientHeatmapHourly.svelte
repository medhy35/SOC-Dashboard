<script>
  export let heatmapData = { data: {}, clients: [], maxVal: 1 };
  export let darkMode = true;

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  function cellColor(value, maxVal) {
    if (value === 0) return darkMode ? 'rgba(26,29,39,1)' : 'rgba(241,245,249,1)';
    const ratio = Math.min(value / maxVal, 1);
    if (ratio > 0.7) return `rgba(239,68,68,${0.4 + ratio * 0.6})`;
    if (ratio > 0.3) return `rgba(245,158,11,${0.3 + ratio * 0.5})`;
    return `rgba(99,102,241,${0.15 + ratio * 0.5})`;
  }

  function textColor(value, maxVal) {
    if (value === 0) return darkMode ? '#374151' : '#d1d5db';
    const ratio = value / maxVal;
    return ratio > 0.3 ? '#fff' : (darkMode ? '#9ca3af' : '#6b7280');
  }

  const hours = Array.from({length: 24}, (_, i) => i);

  $: clientList = heatmapData.clients ?? [];
  $: maxVal     = heatmapData.maxVal  ?? 1;

  function shortName(name) {
    return name.replace('Client ', '').slice(0, 8);
  }
</script>

<div class="overflow-x-auto">
  <div class="min-w-max text-xs">
    <!-- Hour headers -->
    <div class="flex">
      <div class="w-28 shrink-0"></div>
      {#each hours as h}
        <div class="w-9 text-center {darkMode ? 'text-gray-600' : 'text-gray-400'} py-1 font-mono text-[10px]">
          {String(h).padStart(2,'0')}
        </div>
      {/each}
      <div class="w-16 text-right {darkMode ? 'text-gray-600' : 'text-gray-400'} py-1 px-1 text-[10px]">Total</div>
    </div>

    <!-- Client rows -->
    {#each clientList as client}
      {@const row = heatmapData.data[client] ?? Array(24).fill(0)}
      {@const rowTotal = row.reduce((s,v) => s+v, 0)}
      <div class="flex items-center mb-0.5">
        <div class="w-28 shrink-0 pr-2 text-right">
          <span class="{darkMode ? 'text-gray-400' : 'text-gray-600'} font-medium truncate block" title={client}>
            {shortName(client)}
          </span>
        </div>
        {#each hours as h}
          {@const val = row[h] ?? 0}
          <div class="w-9 h-7 flex items-center justify-center rounded-sm mx-px cursor-default transition-all hover:scale-110 hover:z-10 relative"
            style="background:{cellColor(val, maxVal)};color:{textColor(val, maxVal)}"
            title="{client} — {String(h).padStart(2,'0')}h : {fmt(val)} req.">
            {#if val > 0}
              <span class="font-bold text-[9px] leading-none select-none">
                {val >= 1000 ? Math.round(val/1000)+'k' : val}
              </span>
            {/if}
          </div>
        {/each}
        <div class="w-16 text-right px-1 font-bold {darkMode ? 'text-gray-400' : 'text-gray-600'} font-mono text-[10px]">
          {fmt(rowTotal)}
        </div>
      </div>
    {/each}

    <!-- Hour totals row -->
    <div class="flex mt-1 pt-1 border-t {darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
      <div class="w-28 shrink-0 pr-2 text-right {darkMode ? 'text-gray-600' : 'text-gray-400'} text-[10px] font-semibold self-center">
        TOTAL
      </div>
      {#each hours as h}
        {@const colTotal = clientList.reduce((s,c) => s + (heatmapData.data[c]?.[h] ?? 0), 0)}
        <div class="w-9 h-6 flex items-center justify-center text-[9px] font-bold
          {darkMode ? 'text-gray-500' : 'text-gray-500'} font-mono">
          {colTotal >= 1000 ? Math.round(colTotal/1000)+'k' : colTotal || ''}
        </div>
      {/each}
    </div>
  </div>

  <!-- Legend -->
  <div class="flex items-center gap-3 mt-3 pt-3 border-t {darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
    <span class="text-[10px] {darkMode ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-wider">Intensité :</span>
    <div class="flex items-center gap-1">
      {#each ['Nulle', 'Faible', 'Modérée', 'Élevée', 'Critique'] as label, i}
        <div class="flex items-center gap-1">
          <div class="w-5 h-3 rounded-sm"
            style="background:{['rgba(26,29,39,1)','rgba(99,102,241,0.4)','rgba(245,158,11,0.5)','rgba(239,68,68,0.7)','rgba(239,68,68,1)'][i]}">
          </div>
          <span class="text-[10px] {darkMode ? 'text-gray-600' : 'text-gray-400'}">{label}</span>
        </div>
      {/each}
    </div>
  </div>
</div>
