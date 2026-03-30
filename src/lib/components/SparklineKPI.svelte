<script>
  export let label = '';
  export let value = 0;
  export let color = '#6366f1';
  export let icon = '';
  export let warning = false;
  export let subtitle = '';
  export let sparkData = [];   // array of numbers (24 values)

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  // Build SVG sparkline path
  function buildPath(data, w, h, pad = 3) {
    if (!data || data.length < 2) return '';
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = max - min || 1;
    const xStep = (w - pad * 2) / (data.length - 1);
    const points = data.map((v, i) => {
      const x = pad + i * xStep;
      const y = h - pad - ((v - min) / range) * (h - pad * 2);
      return `${x},${y}`;
    });
    return `M ${points.join(' L ')}`;
  }

  // Build gradient area path
  function buildArea(data, w, h, pad = 3) {
    if (!data || data.length < 2) return '';
    const path = buildPath(data, w, h, pad);
    const lastX = pad + (data.length - 1) * ((w - pad * 2) / (data.length - 1));
    return `${path} L ${lastX},${h} L ${pad},${h} Z`;
  }

  const W = 120, H = 36;
  $: linePath = buildPath(sparkData, W, H);
  $: areaPath = buildArea(sparkData, W, H);

  // Trend: compare last 6h vs first 6h
  $: trend = sparkData.length >= 12
    ? (() => {
        const mid = Math.floor(sparkData.length / 2);
        const first = sparkData.slice(0, mid).reduce((s,v)=>s+v,0);
        const last  = sparkData.slice(mid).reduce((s,v)=>s+v,0);
        if (first === 0) return 0;
        return Math.round(((last - first) / first) * 100);
      })()
    : 0;
</script>

<div class="relative overflow-hidden rounded-xl p-4 border flex flex-col gap-1 group hover:border-opacity-60 transition-all
  {warning && value > 0
    ? 'bg-red-950/20 border-red-500/50'
    : 'bg-[#1a1d27] border-[#2a2d3a] hover:border-indigo-500/30'}">

  <!-- Top row: label + trend -->
  <div class="flex items-start justify-between">
    <div class="flex-1 min-w-0">
      <p class="text-xs text-gray-500 uppercase tracking-wider font-medium truncate">{label}</p>
      <p class="text-3xl font-bold mt-0.5" style="color: {warning && value > 0 ? '#f87171' : color}">
        {fmt(value)}
      </p>
      {#if subtitle}
        <p class="text-xs text-gray-500 mt-0.5">{subtitle}</p>
      {/if}
    </div>
    <div class="flex flex-col items-end gap-1">
      {#if icon}
        <span class="text-xl opacity-60 group-hover:opacity-100 transition-opacity">{icon}</span>
      {/if}
      {#if trend !== 0 && sparkData.length}
        <span class="text-xs font-semibold {trend > 0 ? 'text-red-400' : 'text-green-400'}">
          {trend > 0 ? '▲' : '▼'} {Math.abs(trend)}%
        </span>
      {/if}
    </div>
  </div>

  <!-- Sparkline SVG -->
  {#if sparkData.length >= 2}
    <div class="mt-2">
      <svg width={W} height={H} class="w-full overflow-visible" viewBox="0 0 {W} {H}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="sg-{label.replace(/\s/g,'')}" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="{warning && value > 0 ? '#ef4444' : color}" stop-opacity="0.3"/>
            <stop offset="100%" stop-color="{warning && value > 0 ? '#ef4444' : color}" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <!-- Area -->
        <path d={areaPath} fill="url(#sg-{label.replace(/\s/g,'')})" />
        <!-- Line -->
        <path d={linePath} fill="none"
          stroke="{warning && value > 0 ? '#ef4444' : color}"
          stroke-width="1.5"
          stroke-linecap="round"
          stroke-linejoin="round"/>
        <!-- Last point dot -->
        {#if sparkData.length}
          {@const lv = sparkData[sparkData.length - 1]}
          {@const min = Math.min(...sparkData)}
          {@const max = Math.max(...sparkData)}
          {@const range = max - min || 1}
          {@const lx = 120 - 3}
          {@const ly = H - 3 - ((lv - min) / range) * (H - 6)}
          <circle cx={lx} cy={ly} r="2.5"
            fill="{warning && value > 0 ? '#ef4444' : color}"
            stroke="#1a1d27" stroke-width="1"/>
        {/if}
      </svg>
      <p class="text-[10px] text-gray-600 mt-0.5">Dernières 24h</p>
    </div>
  {/if}

  {#if warning && value > 0}
    <div class="absolute top-0 right-0 w-1 h-full bg-red-500/60 rounded-r-xl"></div>
  {/if}
</div>
