<script>
  import '../app.css';
  import { onMount, onDestroy } from 'svelte';
  import { goto } from '$app/navigation';
  import { page } from '$app/stores';
  import { loadData, socData, loading, error, generatedAt, dateLabel, darkMode, formatNumber, summary } from '$lib/stores/data';
  import { sidebarCollapsed, addToast, showShortcuts, autoRefreshInterval, autoRefreshCountdown } from '$lib/stores/ui';
  import { derived } from 'svelte/store';
  import Toast from '$lib/components/Toast.svelte';
  import KeyboardShortcuts from '$lib/components/KeyboardShortcuts.svelte';
  import ClientDrawer from '$lib/components/ClientDrawer.svelte';
  import SkeletonDashboard from '$lib/components/SkeletonDashboard.svelte';

  const totalEvents   = derived(socData, $d => $d?.summary?.totalEvents ?? 0);
  const totalUnblocked= derived(socData, $d => $d?.summary?.totalUnblocked ?? 0);

  onMount(() => {
    loadData();
    document.documentElement.classList.add('dark');
    setupKeyboard();
    updateFavicon();
  });

  onDestroy(() => {
    window.removeEventListener('keydown', handleKey);
    stopAutoRefresh();
  });

  // ── Theme ──────────────────────────────────────────────────────────────
  function toggleTheme() {
    darkMode.update(v => {
      const next = !v;
      document.documentElement.classList.toggle('dark', next);
      document.body.style.background = next ? '#0f1117' : '#f1f5f9';
      document.body.style.color      = next ? '#f3f4f6' : '#111827';
      return next;
    });
  }

  // ── Auto-refresh ───────────────────────────────────────────────────────
  let refreshTimer = null;
  let countdownTimer = null;

  function startAutoRefresh(seconds) {
    stopAutoRefresh();
    if (!seconds) return;
    autoRefreshCountdown.set(seconds);
    countdownTimer = setInterval(() => {
      autoRefreshCountdown.update(c => {
        if (c <= 1) { doRefresh(); return seconds; }
        return c - 1;
      });
    }, 1000);
  }

  function stopAutoRefresh() {
    clearInterval(countdownTimer);
    countdownTimer = null;
    autoRefreshCountdown.set(0);
  }

  autoRefreshInterval.subscribe(v => { v ? startAutoRefresh(v) : stopAutoRefresh(); });

  async function doRefresh() {
    await loadData();
    addToast('Données actualisées', 'success', 2000);
    updateFavicon();
  }

  // ── Favicon dynamique ──────────────────────────────────────────────────
  function updateFavicon() {
    const unblocked = document.title;
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 32;
    const ctx = canvas.getContext('2d');
    // Background
    ctx.fillStyle = '#1a1d27';
    ctx.roundRect(0, 0, 32, 32, 6);
    ctx.fill();
    // Letter "S"
    ctx.fillStyle = '#6366f1';
    ctx.font = 'bold 20px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('S', 16, 17);
    const link = document.querySelector('link[rel~="icon"]') || document.createElement('link');
    link.type = 'image/x-icon';
    link.rel  = 'shortcut icon';
    link.href = canvas.toDataURL();
    document.head.appendChild(link);
  }

  // ── Keyboard shortcuts ─────────────────────────────────────────────────
  let gPressed = false;
  let gTimer   = null;

  function setupKeyboard() {
    window.addEventListener('keydown', handleKey);
  }

  function handleKey(e) {
    const tag = e.target.tagName;
    const inInput = tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable;

    if (e.key === 'Escape') {
      showShortcuts.set(false);
      return;
    }
    if (inInput) return;

    if (e.key === '?') { showShortcuts.update(v => !v); return; }
    if (e.key === 'r' || e.key === 'R') { doRefresh(); return; }
    if (e.key === 'b' || e.key === 'B') { sidebarCollapsed.update(v => !v); return; }

    if (e.key === 'g' || e.key === 'G') {
      gPressed = true;
      clearTimeout(gTimer);
      gTimer = setTimeout(() => { gPressed = false; }, 1500);
      return;
    }

    if (gPressed) {
      gPressed = false;
      clearTimeout(gTimer);
      if (e.key === 'o' || e.key === 'O') { goto('/'); return; }
      if (e.key === 'a' || e.key === 'A') { goto('/alerts'); return; }
      if (e.key === 't' || e.key === 'T') { goto('/threat'); return; }
      if (e.key === 'c' || e.key === 'C') { goto('/campaigns'); return; }
      if (e.key === 'i' || e.key === 'I') { goto('/investigations'); return; }
      if (e.key === 'h' || e.key === 'H') { goto('/history'); return; }
      if (e.key === 'p' || e.key === 'P') { goto('/reports'); return; }
    }
  }

  const navGroups = [
    {
      label: 'Supervision',
      items: [
        { href: '/',           label: 'Vue d\'ensemble', icon: '📊', desc: 'Manager' },
        { href: '/alerts',     label: 'Alertes',         icon: '🔔', desc: 'Analyste' },
        { href: '/threat',     label: 'Threat Intel',    icon: '🎯', desc: 'Red Team' },
      ]
    },
    {
      label: 'Différentiateurs',
      items: [
        { href: '/campaigns',      label: 'Campagnes',      icon: '🎯', desc: 'Multi-clients' },
        { href: '/investigations', label: 'Investigations', icon: '🔍', desc: 'Workflow SLA' },
        { href: '/blacklist',      label: 'Blacklist',      icon: '🛡️', desc: 'Export CF/NGINX' },
        { href: '/history',        label: 'Historique',     icon: '📅', desc: 'Multi-jours' },
        { href: '/reports',        label: 'Rapports PDF',   icon: '📋', desc: 'Clients' },
      ]
    }
  ];

  $: currentPath = $page.url.pathname;

  function formatDateShort(iso) {
    if (!iso) return '—';
    return new Date(iso).toLocaleString('fr-FR', { day:'2-digit', month:'2-digit', hour:'2-digit', minute:'2-digit' });
  }

  const REFRESH_OPTIONS = [
    { label: 'Off', value: 0 },
    { label: '30s', value: 30 },
    { label: '1 min', value: 60 },
    { label: '5 min', value: 300 },
  ];
</script>

<svelte:window on:keydown={handleKey} />

<div class="flex h-screen overflow-hidden {$darkMode ? 'bg-[#0f1117] text-gray-100' : 'bg-slate-100 text-gray-900'}">

  <!-- ── Sidebar ─────────────────────────────────────────────────────── -->
  <aside class="shrink-0 flex flex-col border-r transition-all duration-300
    {$sidebarCollapsed ? 'w-16' : 'w-64'}
    {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'}">

    <!-- Logo -->
    <div class="p-3 border-b {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} shrink-0">
      <div class="flex items-center gap-3 overflow-hidden">
        <div class="w-9 h-9 bg-indigo-600 rounded-lg flex items-center justify-center shrink-0 shadow-lg shadow-indigo-900/50">
          <svg viewBox="0 0 24 24" class="w-5 h-5 text-white fill-none stroke-white stroke-2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
          </svg>
        </div>
        {#if !$sidebarCollapsed}
          <div class="min-w-0 transition-opacity duration-200">
            <p class="font-bold text-sm tracking-wide {$darkMode ? 'text-white' : 'text-gray-900'}">1T3R SOC</p>
            <p class="text-xs {$darkMode ? 'text-indigo-400' : 'text-indigo-600'}">Security Operations</p>
          </div>
        {/if}
      </div>
    </div>

    <!-- Nav -->
    <nav class="flex-1 p-2 overflow-y-auto space-y-3">
      {#each navGroups as group}
        <div>
          {#if !$sidebarCollapsed}
            <p class="text-[10px] font-bold uppercase tracking-widest px-3 py-1.5 {$darkMode ? 'text-gray-600' : 'text-gray-400'}">{group.label}</p>
          {:else}
            <div class="border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-100'} my-1"></div>
          {/if}
          {#each group.items as item}
            {@const active = currentPath === item.href}
            <a href={item.href} title={$sidebarCollapsed ? item.label : ''}
              class="flex items-center gap-3 px-2.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 no-underline
                {active
                  ? ($darkMode ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/30' : 'bg-indigo-50 text-indigo-600 border border-indigo-200')
                  : ($darkMode ? 'text-gray-400 hover:bg-[#22263a] hover:text-gray-200' : 'text-gray-600 hover:bg-slate-100 hover:text-gray-900')}">
              <span class="text-base shrink-0">{item.icon}</span>
              {#if !$sidebarCollapsed}
                <div class="min-w-0 flex-1">
                  <p class="truncate text-xs">{item.label}</p>
                  <p class="text-[10px] {active ? 'opacity-70' : ($darkMode ? 'text-gray-600' : 'text-gray-400')}">{item.desc}</p>
                </div>
                {#if active}
                  <div class="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0"></div>
                {/if}
              {/if}
            </a>
          {/each}
        </div>
      {/each}

      <!-- Alerts indicator -->
      {#if $totalUnblocked > 0 && !$sidebarCollapsed}
        <div class="mx-2 mt-2 bg-red-500/10 border border-red-500/30 rounded-lg px-3 py-2">
          <div class="flex items-center gap-2">
            <span class="w-2 h-2 rounded-full bg-red-500 animate-pulse shrink-0"></span>
            <span class="text-xs text-red-400 font-semibold">{$totalUnblocked} non-bloqué{$totalUnblocked > 1 ? 's' : ''}</span>
          </div>
        </div>
      {/if}
    </nav>

    <!-- Footer -->
    <div class="p-2 border-t {$darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'} shrink-0 space-y-1">
      <!-- Shortcuts button -->
      <button on:click={() => showShortcuts.update(v => !v)}
        class="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors
          {$darkMode ? 'text-gray-500 hover:bg-[#22263a] hover:text-gray-300' : 'text-gray-400 hover:bg-slate-100 hover:text-gray-600'}">
        <span class="text-base shrink-0">⌨️</span>
        {#if !$sidebarCollapsed}<span>Raccourcis clavier</span>{/if}
      </button>

      <!-- Theme toggle -->
      <button on:click={toggleTheme}
        class="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors
          {$darkMode ? 'text-gray-500 hover:bg-[#22263a] hover:text-gray-300' : 'text-gray-400 hover:bg-slate-100 hover:text-gray-600'}">
        <span class="text-base shrink-0">{$darkMode ? '☀️' : '🌙'}</span>
        {#if !$sidebarCollapsed}<span>{$darkMode ? 'Mode clair' : 'Mode sombre'}</span>{/if}
      </button>

      <!-- Collapse toggle -->
      <button on:click={() => sidebarCollapsed.update(v => !v)}
        class="w-full flex items-center gap-3 px-2.5 py-2 rounded-lg text-xs transition-colors
          {$darkMode ? 'text-gray-600 hover:bg-[#22263a] hover:text-gray-400' : 'text-gray-400 hover:bg-slate-100'}">
        <span class="text-base shrink-0 transition-transform duration-300 {$sidebarCollapsed ? 'rotate-180' : ''}">◀</span>
        {#if !$sidebarCollapsed}<span>Réduire la sidebar</span>{/if}
      </button>

      {#if !$sidebarCollapsed}
        <div class="px-2 pt-1">
          <div class="flex items-center gap-1.5">
            <div class="w-1.5 h-1.5 rounded-full {$loading ? 'bg-amber-400 animate-pulse' : $error ? 'bg-red-400' : 'bg-green-400'}"></div>
            <span class="text-[10px] {$darkMode ? 'text-gray-600' : 'text-gray-400'}">
              {$loading ? 'Chargement…' : $error ? 'Erreur' : 'Connecté'}
            </span>
          </div>
          <p class="text-[10px] {$darkMode ? 'text-gray-700' : 'text-gray-400'} mt-0.5">Cloudflare WAF Monitor · v1.0</p>
        </div>
      {/if}
    </div>
  </aside>

  <!-- ── Main area ───────────────────────────────────────────────────── -->
  <div class="flex-1 flex flex-col min-w-0 overflow-hidden">

    <!-- Topbar -->
    <header class="h-14 shrink-0 flex items-center justify-between px-5 border-b gap-4
      {$darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200'}">
      <div class="flex items-center gap-3 min-w-0">
        <h1 class="font-semibold text-sm truncate {$darkMode ? 'text-gray-200' : 'text-gray-800'}">
          {#if currentPath === '/'} Vue d'ensemble — Sécurité WAF
          {:else if currentPath === '/alerts'} Alertes de Sécurité
          {:else if currentPath === '/threat'} Threat Intelligence
          {:else if currentPath === '/campaigns'} Campagnes coordonnées
          {:else if currentPath === '/investigations'} Workflow d'investigation
          {:else if currentPath === '/blacklist'} Blacklist propriétaire 1T3R
          {:else if currentPath === '/history'} Historique multi-jours
          {:else if currentPath === '/reports'} Rapports clients PDF
          {:else} SOC Dashboard{/if}
        </h1>
        {#if $dateLabel !== '—'}
          <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} shrink-0">· {$dateLabel}</span>
        {/if}
      </div>

      <div class="flex items-center gap-2 shrink-0">
        <!-- Last update -->
        {#if $generatedAt}
          <span class="text-xs {$darkMode ? 'text-gray-600' : 'text-gray-400'} hidden lg:block">
            🕐 {formatDateShort($generatedAt)}
          </span>
        {/if}

        <!-- Auto-refresh -->
        <div class="flex items-center gap-1 {$darkMode ? 'bg-[#22263a] border-[#2a2d3a]' : 'bg-slate-100 border-slate-200'} border rounded-lg px-2 py-1">
          <span class="text-xs {$darkMode ? 'text-gray-500' : 'text-gray-400'}">
            {#if $autoRefreshCountdown > 0}
              <span class="text-indigo-400 font-mono font-bold">{$autoRefreshCountdown}s</span>
            {:else}
              🔄
            {/if}
          </span>
          <select bind:value={$autoRefreshInterval}
            class="text-xs bg-transparent {$darkMode ? 'text-gray-400' : 'text-gray-600'} focus:outline-none cursor-pointer">
            {#each REFRESH_OPTIONS as opt}
              <option value={opt.value}>{opt.label}</option>
            {/each}
          </select>
        </div>

        <!-- Manual refresh -->
        <button on:click={doRefresh} title="Rafraîchir (R)"
          class="px-2.5 py-1.5 rounded-lg text-xs border transition-colors
            {$darkMode ? 'border-[#2a2d3a] text-gray-400 hover:bg-[#22263a] hover:text-gray-200' : 'border-slate-200 text-gray-500 hover:bg-slate-100'}"
          class:animate-spin={$loading}>
          ↺
        </button>

        <!-- Events badge -->
        {#if !$loading && $totalEvents > 0}
          <div class="flex items-center gap-1.5 bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 rounded-full px-3 py-1 text-xs font-semibold">
            <span class="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            {formatNumber($totalEvents)} événements
          </div>
        {/if}

        <!-- Unblocked warning -->
        {#if $totalUnblocked > 0}
          <div class="flex items-center gap-1.5 bg-red-500/20 border border-red-500/40 text-red-400 rounded-full px-3 py-1 text-xs font-bold animate-pulse">
            ⚠ {$totalUnblocked} non-bloqué{$totalUnblocked > 1 ? 's' : ''}
          </div>
        {/if}
      </div>
    </header>

    <!-- Page content -->
    <main class="flex-1 overflow-y-auto">
      {#if $loading}
        <SkeletonDashboard darkMode={$darkMode} />
      {:else if $error}
        <div class="flex flex-col items-center justify-center h-full gap-4">
          <div class="text-5xl">⚠️</div>
          <p class="text-red-400 font-semibold">Erreur de chargement</p>
          <p class="{$darkMode ? 'text-gray-500' : 'text-gray-400'} text-sm">{$error}</p>
          <button on:click={doRefresh}
            class="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Réessayer
          </button>
        </div>
      {:else}
        <slot />
      {/if}
    </main>
  </div>
</div>

<!-- Global overlays -->
<Toast />
<KeyboardShortcuts />
<ClientDrawer />
