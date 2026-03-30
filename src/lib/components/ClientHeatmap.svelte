<script>
  export let clients = [];

  const statusConfig = {
    alert: {
      border: 'border-red-500/50',
      bg: 'bg-red-500/10',
      dot: 'bg-red-400',
      text: 'text-red-400',
      label: 'Alerte'
    },
    warning: {
      border: 'border-amber-500/50',
      bg: 'bg-amber-500/10',
      dot: 'bg-amber-400',
      text: 'text-amber-400',
      label: 'Avertissement'
    },
    elevated: {
      border: 'border-orange-500/50',
      bg: 'bg-orange-500/10',
      dot: 'bg-orange-400',
      text: 'text-orange-400',
      label: 'Élevé'
    },
    clean: {
      border: 'border-green-500/30',
      bg: 'bg-green-500/5',
      dot: 'bg-green-400',
      text: 'text-green-400',
      label: 'Normal'
    }
  };

  function getStatus(client) {
    if (client.critiques > 0) return 'alert';
    if (client.moyens > 5) return 'warning';
    if (client.totalEvents > 100) return 'elevated';
    return 'clean';
  }

  function fmt(n) {
    return new Intl.NumberFormat('fr-FR').format(n ?? 0);
  }
</script>

<div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
  {#each clients as client}
    {@const status = client.status || getStatus(client)}
    {@const cfg = statusConfig[status] ?? statusConfig.clean}
    <div class="border rounded-xl p-3 hover:scale-[1.02] transition-all duration-200 cursor-default
      {cfg.border} {cfg.bg}">
      <div class="flex items-center gap-1.5 mb-2">
        <span class="w-2 h-2 rounded-full {cfg.dot} animate-pulse"></span>
        <span class="text-xs font-semibold {cfg.text}">{cfg.label}</span>
      </div>
      <p class="text-sm font-bold text-gray-200 truncate leading-tight">{client.client}</p>
      <p class="text-xs text-gray-500 truncate mb-2">{client.domain}</p>
      <div class="grid grid-cols-2 gap-1 text-xs">
        <div>
          <span class="text-gray-500">Critique</span>
          <p class="font-bold text-red-400">{fmt(client.critiques)}</p>
        </div>
        <div>
          <span class="text-gray-500">Total</span>
          <p class="font-bold text-gray-300">{fmt(client.totalEvents)}</p>
        </div>
        {#if client.totalUnblocked > 0}
          <div class="col-span-2 mt-1 bg-red-500/20 rounded px-1.5 py-0.5 border border-red-500/30">
            <span class="text-red-300 font-bold">⚠ {client.totalUnblocked} non-bloqué{client.totalUnblocked > 1 ? 's' : ''}</span>
          </div>
        {/if}
      </div>
    </div>
  {/each}
</div>
