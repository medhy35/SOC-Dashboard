<script>
  import { activeClient } from '$lib/stores/ui';
  import { alerts, darkMode } from '$lib/stores/data';
  import LevelBadge from './LevelBadge.svelte';
  import TagBadge from './TagBadge.svelte';

  function close() { activeClient.set(null); }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
  }

  const flagMap = {
    'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳',
    'NL':'🇳🇱','UA':'🇺🇦','GB':'🇬🇧','KR':'🇰🇷','SG':'🇸🇬','MA':'🇲🇦','SN':'🇸🇳',
    'NG':'🇳🇬','CI':'🇨🇮','CM':'🇨🇲','VN':'🇻🇳','ID':'🇮🇩','TR':'🇹🇷'
  };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }

  $: client = $activeClient;
  $: clientAlerts = client
    ? $alerts.filter(a => a.client === client.client).sort((a, b) => b.score - a.score)
    : [];
</script>

{#if client}
  <!-- Backdrop -->
  <div class="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
    on:click={close} on:keydown={e => e.key === 'Escape' && close()} role="button" tabindex="-1"></div>

  <!-- Drawer panel -->
  <div class="fixed right-0 top-0 h-full z-50 w-[520px] max-w-[95vw] flex flex-col shadow-2xl
    {$darkMode ? 'bg-[#1a1d27] border-l border-[#2a2d3a]' : 'bg-white border-l border-slate-200'}
    translate-x-0 transition-transform duration-300">

    <!-- Header -->
    <div class="p-5 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} shrink-0">
      <div class="flex items-start justify-between">
        <div>
          <h2 class="font-bold text-lg {$darkMode ? 'text-white' : 'text-gray-900'}">{client.client}</h2>
          <p class="{$darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm font-mono">{client.domain}</p>
        </div>
        <button on:click={close}
          class="w-8 h-8 flex items-center justify-center rounded-lg {$darkMode ? 'bg-[#22263a] text-gray-400 hover:text-white' : 'bg-slate-100 text-gray-500 hover:text-gray-900'} transition-colors text-xl">
          ×
        </button>
      </div>

      <!-- Stats row -->
      <div class="grid grid-cols-4 gap-3 mt-4">
        {#each [
          { label: 'Total', value: client.totalEvents, color: 'text-gray-300' },
          { label: 'Critiques', value: client.critiques, color: 'text-red-400' },
          { label: 'Moyens', value: client.moyens, color: 'text-amber-400' },
          { label: 'Non-bloqués', value: client.totalUnblocked, color: client.totalUnblocked > 0 ? 'text-red-300' : 'text-green-400' },
        ] as stat}
          <div class="{$darkMode ? 'bg-[#22263a]' : 'bg-slate-50'} rounded-lg p-2.5 text-center">
            <p class="text-xl font-bold {stat.color}">{fmt(stat.value)}</p>
            <p class="text-[10px] {$darkMode ? 'text-gray-600' : 'text-gray-400'} uppercase tracking-wide">{stat.label}</p>
          </div>
        {/each}
      </div>
    </div>

    <!-- Alert list -->
    <div class="flex-1 overflow-y-auto p-4 space-y-2">
      <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-3">
        {clientAlerts.length} alerte{clientAlerts.length !== 1 ? 's' : ''} associée{clientAlerts.length !== 1 ? 's' : ''}
      </p>

      {#each clientAlerts as alert}
        {@const unblocked = alert.countUnblocked > 0}
        <div class="rounded-lg p-3 border text-sm transition-colors
          {unblocked
            ? ($darkMode ? 'bg-red-950/30 border-red-500/30' : 'bg-red-50 border-red-200')
            : ($darkMode ? 'bg-[#22263a] border-[#2a2d3a] hover:border-[#3a3d4a]' : 'bg-slate-50 border-slate-200')}">
          <div class="flex items-center justify-between gap-2 mb-2">
            <div class="flex items-center gap-2">
              <LevelBadge level={alert.level} />
              <code class="text-xs font-mono {$darkMode ? 'text-gray-300' : 'text-gray-700'}">{alert.ip}</code>
              <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">{flag(alert.country)} {alert.country}</span>
            </div>
            <div class="flex items-center gap-2 shrink-0">
              {#if unblocked}
                <span class="text-xs text-red-400 font-bold">⚠ {alert.countUnblocked} passé{alert.countUnblocked > 1 ? 's' : ''}</span>
              {/if}
              <span class="text-xs font-bold {alert.score >= 8 ? 'text-red-400' : 'text-amber-400'}">Score {alert.score}</span>
            </div>
          </div>

          <div class="flex flex-wrap gap-1 mb-2">
            {#each (alert.tags ?? []) as tag}
              <TagBadge {tag} />
            {/each}
          </div>

          <div class="flex items-center justify-between text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
            <div class="flex gap-2">
              {#each (alert.paths ?? []).slice(0,2) as path}
                <code>{path}</code>
              {/each}
              {#if (alert.paths ?? []).length > 2}
                <span>+{alert.paths.length - 2}</span>
              {/if}
            </div>
            <span class="font-mono">{fmt(alert.count)} req.</span>
          </div>

          <div class="flex items-center justify-between text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} mt-1.5">
            <span>1ère vue : {fmtDate(alert.firstSeen)}</span>
            <span>Dernière : {fmtDate(alert.lastSeen)}</span>
          </div>
        </div>
      {/each}

      {#if !clientAlerts.length}
        <div class="text-center py-12 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
          <div class="text-3xl mb-2">✅</div>
          <p class="font-medium">Aucune alerte pour ce client</p>
        </div>
      {/if}
    </div>

    <!-- Footer -->
    <div class="p-4 border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} shrink-0">
      <a href="/alerts?client={encodeURIComponent(client.client)}"
        class="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors">
        Voir toutes les alertes →
      </a>
    </div>
  </div>
{/if}
