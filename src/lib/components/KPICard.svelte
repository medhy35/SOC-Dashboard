<script>
  export let label = '';
  export let value = 0;
  export let color = 'text-indigo-400';
  export let icon = '';
  export let warning = false;
  export let subtitle = '';

  function fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n);
  }
</script>

<div class="stat-card relative overflow-hidden group hover:border-indigo-500/30 transition-colors"
  class:border-red-500={warning && value > 0}>
  <div class="flex items-start justify-between">
    <div class="flex-1 min-w-0">
      <p class="text-xs text-gray-500 uppercase tracking-wider font-medium truncate">{label}</p>
      <p class="text-3xl font-bold mt-1 {warning && value > 0 ? 'text-red-400' : color}">
        {fmt(value)}
      </p>
      {#if subtitle}
        <p class="text-xs text-gray-500 mt-1">{subtitle}</p>
      {/if}
    </div>
    {#if icon}
      <div class="text-2xl opacity-60 group-hover:opacity-100 transition-opacity">{icon}</div>
    {/if}
  </div>
  {#if warning && value > 0}
    <div class="absolute top-0 right-0 w-1 h-full bg-red-500/60 rounded-r-xl"></div>
  {/if}
</div>
