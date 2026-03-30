<script>
  import { campaigns } from '$lib/stores/campaigns';
  import { darkMode } from '$lib/stores/data';
  import LevelBadge from '$lib/components/LevelBadge.svelte';

  const flagMap = { 'RU':'🇷🇺','CN':'🇨🇳','US':'🇺🇸','DE':'🇩🇪','FR':'🇫🇷','BR':'🇧🇷','IN':'🇮🇳','NL':'🇳🇱','UA':'🇺🇦','GB':'🇬🇧','KR':'🇰🇷','SG':'🇸🇬','MA':'🇲🇦','SN':'🇸🇳','NG':'🇳🇬','CI':'🇨🇮','CM':'🇨🇲','VN':'🇻🇳','ID':'🇮🇩','TR':'🇹🇷','DZ':'🇩🇿','TN':'🇹🇳' };
  function flag(cc) { return flagMap[cc] ?? '🏳️'; }
  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  const typeLabels = {
    ip_sweep: { label: 'IP Transverse', color: 'bg-red-500/20 text-red-400 border-red-500/30' },
    asn_campaign: { label: 'Campagne ASN', color: 'bg-purple-500/20 text-purple-400 border-purple-500/30' },
    country_storm: { label: 'Tempête pays', color: 'bg-orange-500/20 text-orange-400 border-orange-500/30' },
  };
</script>

<div class="p-5 space-y-5">
  <!-- Header -->
  <div class="flex items-center justify-between">
    <div>
      <h1 class="text-lg font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">Détection de campagnes coordonnées</h1>
      <p class="text-sm {$darkMode ? 'text-gray-500' : 'text-gray-400'} mt-0.5">
        Attaques multi-clients détectées automatiquement — impossible à voir dans Cloudflare
      </p>
    </div>
    <div class="flex items-center gap-2">
      <div class="px-3 py-1.5 rounded-lg text-sm font-bold
        {$campaigns.filter(c => c.severity === 'critique').length > 0
          ? 'bg-red-500/20 text-red-400 border border-red-500/30'
          : 'bg-green-500/20 text-green-400 border border-green-500/30'}">
        {$campaigns.filter(c => c.severity === 'critique').length} campagne{$campaigns.filter(c => c.severity === 'critique').length !== 1 ? 's' : ''} critiques
      </div>
    </div>
  </div>

  <!-- Stats -->
  <div class="grid grid-cols-3 gap-4">
    {#each [
      { label: 'Campagnes détectées', value: $campaigns.length, icon: '🎯', color: 'text-indigo-400' },
      { label: 'Critiques', value: $campaigns.filter(c=>c.severity==='critique').length, icon: '🔴', color: 'text-red-400' },
      { label: 'Clients impactés', value: [...new Set($campaigns.flatMap(c=>c.affectedClients))].length, icon: '🏢', color: 'text-amber-400' },
    ] as stat}
      <div class="{$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'} border rounded-xl p-4">
        <div class="flex items-center justify-between">
          <p class="text-xs text-gray-500 uppercase tracking-wider">{stat.label}</p>
          <span class="text-xl">{stat.icon}</span>
        </div>
        <p class="text-3xl font-bold mt-1 {stat.color}">{stat.value}</p>
      </div>
    {/each}
  </div>

  <!-- Campaign cards -->
  {#if $campaigns.length === 0}
    <div class="text-center py-16 {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
      <div class="text-5xl mb-3">✅</div>
      <p class="font-semibold text-lg">Aucune campagne coordonnée détectée</p>
      <p class="text-sm mt-1">Les seuils actuels n'ont pas identifié d'attaques coordonnées multi-clients.</p>
    </div>
  {:else}
    <div class="space-y-4">
      {#each $campaigns as campaign}
        {@const typeInfo = typeLabels[campaign.type] ?? typeLabels.ip_sweep}
        <div class="border rounded-xl overflow-hidden
          {campaign.severity === 'critique'
            ? ($darkMode ? 'border-red-500/40 bg-red-950/10' : 'border-red-200 bg-red-50')
            : ($darkMode ? 'border-amber-500/30 bg-amber-950/10' : 'border-amber-200 bg-amber-50')}">

          <!-- Campaign header -->
          <div class="p-4 flex items-start justify-between gap-4">
            <div class="flex items-start gap-3">
              <span class="text-3xl">{campaign.icon}</span>
              <div>
                <div class="flex items-center gap-2 flex-wrap">
                  <h3 class="font-bold {$darkMode ? 'text-white' : 'text-gray-900'}">{campaign.title}</h3>
                  <span class="text-xs border rounded-full px-2 py-0.5 font-semibold {typeInfo.color}">{typeInfo.label}</span>
                  <LevelBadge level={campaign.severity} />
                </div>
                <p class="text-sm {$darkMode ? 'text-gray-400' : 'text-gray-600'} mt-1">{campaign.description}</p>
              </div>
            </div>
            <div class="text-right shrink-0">
              <p class="text-2xl font-bold {$darkMode ? 'text-gray-200' : 'text-gray-800'}">{fmt(campaign.totalRequests)}</p>
              <p class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">requêtes totales</p>
              {#if campaign.score}
                <p class="text-sm font-bold {campaign.score >= 8 ? 'text-red-400' : 'text-amber-400'} mt-1">Score {campaign.score}/10</p>
              {/if}
            </div>
          </div>

          <!-- Details grid -->
          <div class="border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} p-4 grid grid-cols-1 md:grid-cols-3 gap-4">
            <!-- Clients touchés -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2">
                Clients touchés ({campaign.affectedClients.length})
              </p>
              <div class="flex flex-wrap gap-1.5">
                {#each campaign.affectedClients as client}
                  <span class="text-xs {$darkMode ? 'bg-[#22263a] text-gray-300 border-[#2a2d3a]' : 'bg-slate-100 text-gray-600 border-slate-200'} border rounded px-2 py-0.5">
                    {client.replace('Client ', '')}
                  </span>
                {/each}
              </div>
            </div>

            <!-- IPs impliquées -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2">
                IPs impliquées ({campaign.affectedIPs.length}{campaign.affectedIPs.length === 10 ? '+' : ''})
              </p>
              <div class="flex flex-col gap-1">
                {#each campaign.affectedIPs.slice(0, 5) as ip}
                  <div class="flex items-center gap-1.5">
                    {#if campaign.country}<span class="text-xs">{flag(campaign.country)}</span>{/if}
                    <code class="text-xs font-mono {$darkMode ? 'text-gray-400' : 'text-gray-600'}">{ip}</code>
                  </div>
                {/each}
                {#if campaign.affectedIPs.length > 5}
                  <p class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">+{campaign.affectedIPs.length - 5} autres…</p>
                {/if}
              </div>
            </div>

            <!-- Contexte -->
            <div>
              <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-gray-500' : 'text-gray-400'} mb-2">Contexte</p>
              <div class="space-y-1 text-xs">
                {#if campaign.asn}
                  <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">ASN : <code>{campaign.asn}</code></p>
                {/if}
                {#if campaign.country}
                  <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">Pays : {flag(campaign.country)} {campaign.country}</p>
                {/if}
                {#if campaign.firstSeen}
                  <p class="{$darkMode ? 'text-gray-400' : 'text-gray-600'}">Début : {new Date(campaign.firstSeen).toLocaleString('fr-FR')}</p>
                {/if}
                <div class="flex flex-wrap gap-1 mt-1">
                  {#each (campaign.tags ?? []).slice(0,4) as tag}
                    <span class="bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 rounded px-1.5 py-0.5 text-[10px]">{tag}</span>
                  {/each}
                </div>
              </div>
            </div>
          </div>

          <!-- Action bar -->
          <div class="border-t {$darkMode ? 'border-[#2a2d3a] bg-[#22263a]/50' : 'border-slate-200 bg-slate-50/50'} px-4 py-2.5 flex items-center justify-between">
            <p class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'}">
              Détecté automatiquement par l'algorithme 1T3R SOC
            </p>
            <div class="flex gap-2">
              <a href="/alerts?q={campaign.affectedIPs[0]}"
                class="text-xs px-3 py-1.5 {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a] text-gray-400 hover:text-gray-200' : 'bg-white border-slate-300 text-gray-600 hover:text-gray-900'} border rounded-lg transition-colors">
                Voir alertes →
              </a>
              <a href="/investigations"
                class="text-xs px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors">
                Ouvrir investigation
              </a>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
