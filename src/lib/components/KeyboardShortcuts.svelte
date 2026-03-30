<script>
  import { showShortcuts } from '$lib/stores/ui';
  import { darkMode } from '$lib/stores/data';

  const shortcuts = [
    { keys: ['G', 'O'],  label: 'Aller → Vue d\'ensemble',   group: 'Navigation' },
    { keys: ['G', 'A'],  label: 'Aller → Alertes',           group: 'Navigation' },
    { keys: ['G', 'T'],  label: 'Aller → Threat Intel',      group: 'Navigation' },
    { keys: ['G', 'C'],  label: 'Aller → Campagnes',         group: 'Navigation' },
    { keys: ['G', 'I'],  label: 'Aller → Investigations',    group: 'Navigation' },
    { keys: ['G', 'H'],  label: 'Aller → Historique',        group: 'Navigation' },
    { keys: ['G', 'P'],  label: 'Aller → Rapports PDF',      group: 'Navigation' },
    { keys: ['R'],       label: 'Rafraîchir les données',    group: 'Actions'    },
    { keys: ['B'],       label: 'Réduire / Étendre sidebar', group: 'Actions'    },
    { keys: ['?'],       label: 'Afficher ces raccourcis',   group: 'Actions'    },
    { keys: ['Esc'],     label: 'Fermer les modals',         group: 'Actions'    },
  ];

  const groups = [...new Set(shortcuts.map(s => s.group))];

  function close() { showShortcuts.set(false); }
</script>

{#if $showShortcuts}
  <!-- Backdrop -->
  <div class="fixed inset-0 z-50 flex items-center justify-center p-4"
    on:click={close} on:keydown={e => e.key === 'Escape' && close()} role="dialog" tabindex="-1">
    <div class="absolute inset-0 bg-black/60 backdrop-blur-sm"></div>

    <!-- Modal -->
    <div class="relative z-10 w-full max-w-md {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-2xl shadow-2xl p-6"
      on:click|stopPropagation>
      <div class="flex items-center justify-between mb-5">
        <div>
          <h2 class="font-bold text-base {$darkMode ? 'text-white' : 'text-gray-900'}">Raccourcis clavier</h2>
          <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">Naviguez plus vite dans 1T3R SOC</p>
        </div>
        <button on:click={close}
          class="w-8 h-8 flex items-center justify-center rounded-lg {$darkMode ? 'bg-[#22263a] text-gray-400 hover:text-white' : 'bg-slate-100 text-gray-500 hover:text-gray-900'} transition-colors text-lg">
          ×
        </button>
      </div>

      <div class="space-y-4">
        {#each groups as group}
          <div>
            <p class="text-[10px] font-bold uppercase tracking-widest {$darkMode ? 'text-gray-600' : 'text-gray-400'} mb-2">{group}</p>
            <div class="space-y-1">
              {#each shortcuts.filter(s => s.group === group) as sc}
                <div class="flex items-center justify-between py-1 border-b {$darkMode ? 'border-[#22263a]' : 'border-slate-100'} last:border-0">
                  <span class="text-sm {$darkMode ? 'text-gray-300' : 'text-gray-700'}">{sc.label}</span>
                  <div class="flex items-center gap-1">
                    {#each sc.keys as key, i}
                      {#if i > 0}<span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">puis</span>{/if}
                      <kbd class="px-2 py-0.5 text-xs font-mono font-bold rounded border
                        {$darkMode ? 'bg-[#22263a] border-[#2a2d3a] text-gray-300' : 'bg-slate-100 border-slate-300 text-gray-700'}">
                        {key}
                      </kbd>
                    {/each}
                  </div>
                </div>
              {/each}
            </div>
          </div>
        {/each}
      </div>

      <p class="text-center text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} mt-4">
        Appuie sur <kbd class="px-1.5 py-0.5 rounded border text-xs {$darkMode ? 'bg-[#22263a] border-[#2a2d3a]' : 'bg-slate-100 border-slate-300'}">?</kbd> pour afficher ce panneau
      </p>
    </div>
  </div>
{/if}
