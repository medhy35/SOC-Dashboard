<script>
  import { investigations, investigationStats, updateInvestigation, deleteInvestigation, STATUS, PRIORITY, getSLAStatus, getSLARemaining } from '$lib/stores/investigations';
  import { darkMode } from '$lib/stores/data';
  import { addToast } from '$lib/stores/ui';
  import LevelBadge from '$lib/components/LevelBadge.svelte';

  let filterStatus = 'all';
  let filterPriority = 'all';
  let editingId = null;
  let editNote = '';
  let editAssigned = '';
  let editStatus = '';
  let editPriority = '';

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }
  function fmtDate(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
  }

  $: all = Object.values($investigations);
  $: filtered = all.filter(i => {
    if (filterStatus !== 'all' && i.status !== filterStatus) return false;
    if (filterPriority !== 'all' && i.priority !== filterPriority) return false;
    return true;
  }).sort((a, b) => {
    // overdue first, then by priority
    const sa = getSLAStatus(a), sb = getSLAStatus(b);
    if (sa === 'overdue' && sb !== 'overdue') return -1;
    if (sb === 'overdue' && sa !== 'overdue') return 1;
    const pOrder = { critical:0, high:1, medium:2, low:3 };
    return (pOrder[a.priority]??4) - (pOrder[b.priority]??4);
  });

  function startEdit(inv) {
    editingId = inv.id;
    editNote = inv.notes;
    editAssigned = inv.assignedTo;
    editStatus = inv.status;
    editPriority = inv.priority;
  }
  function saveEdit() {
    updateInvestigation(editingId, { notes: editNote, assignedTo: editAssigned, status: editStatus, priority: editPriority });
    addToast('Investigation mise à jour', 'success');
    editingId = null;
  }
  function del(id) {
    if (confirm('Supprimer cette investigation ?')) {
      deleteInvestigation(id);
      addToast('Investigation supprimée', 'info');
    }
  }

  const slaColors = {
    ok:      'text-green-400',
    warning: 'text-amber-400 font-bold animate-pulse',
    overdue: 'text-red-400 font-bold',
  };
</script>

<div class="p-5 space-y-5">
  <!-- Header + Stats -->
  <div class="flex items-center justify-between flex-wrap gap-3">
    <div>
      <h1 class="text-lg font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">Workflow d'investigation</h1>
      <p class="text-sm {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">Suivi des alertes en cours d'analyse — SLA temps réel</p>
    </div>
    <a href="/alerts" class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">
      + Nouvelle depuis alertes
    </a>
  </div>

  <!-- KPI row -->
  <div class="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
    {#each [
      { label: 'Total', value: $investigationStats.total, color: 'text-indigo-400' },
      { label: 'Nouveaux', value: $investigationStats.new, color: 'text-blue-400' },
      { label: 'En cours', value: $investigationStats.inProgress, color: 'text-amber-400' },
      { label: 'Résolus', value: $investigationStats.resolved, color: 'text-green-400' },
      { label: 'Escaladés', value: $investigationStats.escalated, color: 'text-red-400' },
      { label: 'SLA dépassé', value: $investigationStats.overdue, color: 'text-red-400' },
    ] as kpi}
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-3
        {kpi.label === 'SLA dépassé' && $investigationStats.overdue > 0 ? 'border-red-500/50' : ''}">
        <p class="text-xs text-gray-500 uppercase tracking-wider">{kpi.label}</p>
        <p class="text-2xl font-bold mt-0.5 {kpi.color}">{kpi.value}</p>
        {#if kpi.label === 'Résolus' && $investigationStats.avgResolutionH !== null}
          <p class="text-[10px] text-gray-600 mt-0.5">moy. {$investigationStats.avgResolutionH}h</p>
        {/if}
      </div>
    {/each}
  </div>

  <!-- Filters -->
  <div class="flex gap-3 flex-wrap">
    <select bind:value={filterStatus} class="px-3 py-2 rounded-lg text-sm border focus:outline-none {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200' : 'bg-white border-slate-200 text-gray-800'}">
      <option value="all">Tous les statuts</option>
      {#each Object.entries(STATUS) as [k, v]}<option value={k}>{v.icon} {v.label}</option>{/each}
    </select>
    <select bind:value={filterPriority} class="px-3 py-2 rounded-lg text-sm border focus:outline-none {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200' : 'bg-white border-slate-200 text-gray-800'}">
      <option value="all">Toutes priorités</option>
      {#each Object.entries(PRIORITY) as [k, v]}<option value={k}>{v.label}</option>{/each}
    </select>
  </div>

  <!-- Empty state -->
  {#if all.length === 0}
    <div class="text-center py-16 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
      <div class="text-5xl mb-3">🔍</div>
      <p class="font-semibold text-lg">Aucune investigation ouverte</p>
      <p class="text-sm mt-1">Allez sur la page <a href="/alerts" class="text-indigo-400 underline">Alertes</a> et cliquez sur "Investiguer" pour commencer.</p>
    </div>

  {:else if filtered.length === 0}
    <div class="text-center py-10 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
      <p>Aucune investigation ne correspond aux filtres.</p>
    </div>

  {:else}
    <div class="space-y-3">
      {#each filtered as inv}
        {@const slaStatus = getSLAStatus(inv)}
        {@const slaRemaining = getSLARemaining(inv)}
        {@const statusInfo = STATUS[inv.status] ?? STATUS.new}
        {@const priorityInfo = PRIORITY[inv.priority] ?? PRIORITY.medium}

        <div class="border rounded-xl overflow-hidden
          {slaStatus === 'overdue' && inv.status !== 'resolved' && inv.status !== 'false_positive'
            ? ($darkMode ? 'border-red-500/50 bg-red-950/10' : 'border-red-300 bg-red-50')
            : ($darkMode ? 'border-[#2a2d3a] bg-[#1a1d27]' : 'border-slate-200 bg-white')}">

          <div class="p-4">
            <div class="flex items-start justify-between gap-3 flex-wrap">
              <!-- Left: info -->
              <div class="flex items-start gap-3">
                <div>
                  <div class="flex items-center gap-2 flex-wrap mb-1">
                    <code class="text-sm font-mono font-bold {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{inv.ip}</code>
                    <LevelBadge level={inv.level} />
                    <span class="text-xs border rounded-full px-2 py-0.5 font-semibold {statusInfo.color}">{statusInfo.icon} {statusInfo.label}</span>
                    <span class="text-xs border rounded-full px-2 py-0.5 font-semibold {priorityInfo.color} {priorityInfo.bg} {priorityInfo.border}">{priorityInfo.label}</span>
                  </div>
                  <p class="text-sm {$darkMode ? 'text-gray-400' : 'text-gray-600'}">{inv.client} · {inv.domain}</p>
                  {#if inv.assignedTo}
                    <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">👤 {inv.assignedTo}</p>
                  {/if}
                </div>
              </div>

              <!-- Right: SLA + actions -->
              <div class="flex flex-col items-end gap-2 shrink-0">
                <div class="text-xs {slaColors[slaStatus] ?? 'text-gray-500'}">
                  {#if inv.status === 'resolved' || inv.status === 'false_positive'}
                    <span class="text-green-400">✅ Clôturé</span>
                  {:else}
                    ⏱ SLA : {slaRemaining}
                  {/if}
                </div>
                <div class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">
                  Ouvert le {fmtDate(inv.createdAt)}
                </div>
                <div class="flex gap-1.5">
                  <button on:click={() => startEdit(inv)}
                    class="text-xs px-2.5 py-1 rounded border transition-colors {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200' : 'border-slate-200 text-gray-500 hover:bg-slate-50'}">
                    ✏️ Modifier
                  </button>
                  <button on:click={() => del(inv.id)}
                    class="text-xs px-2.5 py-1 rounded border border-red-500/30 text-red-400 hover:bg-red-500/10 transition-colors">
                    🗑
                  </button>
                </div>
              </div>
            </div>

            <!-- Notes -->
            {#if inv.notes}
              <div class="mt-3 pt-3 border-t {$darkMode ? 'border-[#22263a]' : 'border-slate-100'}">
                <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} font-semibold uppercase tracking-wider mb-1">Notes</p>
                <p class="text-sm {$darkMode ? 'text-gray-300' : 'text-gray-700'} whitespace-pre-wrap">{inv.notes}</p>
              </div>
            {/if}
          </div>

          <!-- Edit panel -->
          {#if editingId === inv.id}
            <div class="border-t {$darkMode ? 'border-[#2a2d3a] bg-[#22263a]/60' : 'border-slate-200 bg-slate-50'} p-4 space-y-3">
              <div class="grid grid-cols-2 gap-3">
                <div>
                  <label class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">Statut</label>
                  <select bind:value={editStatus} class="w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200' : 'bg-white border-slate-200'}">
                    {#each Object.entries(STATUS) as [k,v]}<option value={k}>{v.icon} {v.label}</option>{/each}
                  </select>
                </div>
                <div>
                  <label class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">Priorité</label>
                  <select bind:value={editPriority} class="w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200' : 'bg-white border-slate-200'}">
                    {#each Object.entries(PRIORITY) as [k,v]}<option value={k}>{v.label}</option>{/each}
                  </select>
                </div>
              </div>
              <div>
                <label class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">Assigné à</label>
                <input type="text" bind:value={editAssigned} placeholder="Nom de l'analyste"
                  class="w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-white border-slate-200'}"/>
              </div>
              <div>
                <label class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} uppercase tracking-wider">Notes d'investigation</label>
                <textarea bind:value={editNote} rows="3" placeholder="Observations, actions prises, recommandations…"
                  class="w-full mt-1 px-3 py-2 rounded-lg text-sm border focus:outline-none focus:ring-2 focus:ring-indigo-500/50 resize-none {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-200 placeholder-gray-600' : 'bg-white border-slate-200'}"></textarea>
              </div>
              <div class="flex gap-2 justify-end">
                <button on:click={() => editingId = null} class="text-sm px-4 py-2 border rounded-lg transition-colors {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a]' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}">Annuler</button>
                <button on:click={saveEdit} class="text-sm px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors font-medium">Enregistrer</button>
              </div>
            </div>
          {/if}
        </div>
      {/each}
    </div>
  {/if}
</div>
