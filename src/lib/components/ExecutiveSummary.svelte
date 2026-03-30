<script>
  import { executiveSummary, summary, dateLabel, darkMode } from '$lib/stores/data';

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n ?? 0); }

  $: s  = $executiveSummary;
  $: sm = $summary;

  $: lines = s && sm ? [
    `📅 Rapport du ${$dateLabel} — ${fmt(sm.totalEvents)} événements analysés sur ${sm.totalClients} clients Cloudflare WAF.`,
    `🔴 ${fmt(sm.critiques)} alertes critiques détectées sur ${s.alertClients} client${s.alertClients > 1 ? 's' : ''}, soit ${s.criticalRatio}% du volume total.`,
    `🕐 Pic d'activité observé à ${String(s.peakHour).padStart(2,'0')}h00 UTC. Tactique MITRE dominante : ${s.topTactic}.`,
    `🌍 Pays d'origine principal : ${s.topCountry}. ${s.multiHitIPs} IP${s.multiHitIPs > 1 ? 's identifiées ciblant' : ' identifiée ciblant'} plusieurs clients simultanément.`,
    sm.totalUnblocked > 0
      ? `⚠️ ATTENTION : ${fmt(sm.totalUnblocked)} requête${sm.totalUnblocked > 1 ? 's' : ''} non bloquée${sm.totalUnblocked > 1 ? 's' : ''} — investigation immédiate requise.`
      : `✅ Aucune requête malveillante n'a franchi les règles WAF sur cette période.`
  ] : [];

  let copied = false;
  function copyText() {
    navigator.clipboard.writeText(lines.join('\n'));
    copied = true;
    setTimeout(() => copied = false, 2000);
  }
</script>

{#if lines.length}
  <div class="relative {$darkMode ? 'bg-indigo-950/30 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'} border rounded-xl p-4">
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex items-center gap-2">
        <div class="w-2 h-2 rounded-full bg-indigo-400 animate-pulse"></div>
        <p class="text-xs font-semibold uppercase tracking-wider {$darkMode ? 'text-indigo-400' : 'text-indigo-600'}">
          Résumé exécutif — Auto-généré
        </p>
      </div>
      <button on:click={copyText}
        class="text-xs {$darkMode ? 'text-gray-500 hover:text-gray-300' : 'text-gray-400 hover:text-gray-600'} transition-colors flex items-center gap-1">
        {copied ? '✅ Copié' : '📋 Copier'}
      </button>
    </div>
    <div class="space-y-1.5">
      {#each lines as line}
        <p class="text-sm {$darkMode ? 'text-gray-300' : 'text-gray-700'} leading-relaxed">{line}</p>
      {/each}
    </div>
  </div>
{/if}
