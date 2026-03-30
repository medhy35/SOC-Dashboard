<script>
  import { onMount, onDestroy } from 'svelte';
  export let data = [];   // [{ path, count, critiques }]
  export let darkMode = true;

  let canvas;
  let chart;

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n); }

  const pathColors = (path) => {
    if (['/admin','/wp-admin','/phpmyadmin','/cpanel'].some(p => path.includes(p))) return '#ef4444';
    if (['/.env','/.git','/config','/backup','/secret'].some(p => path.includes(p))) return '#f59e0b';
    if (['/login','/wp-login','/xmlrpc'].some(p => path.includes(p))) return '#f97316';
    return '#6366f1';
  };

  onMount(async () => {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    buildChart(Chart);
  });
  onDestroy(() => chart?.destroy());

  $: if (chart && data.length) {
    chart.data.labels = data.slice(0,12).map(d => d.path);
    chart.data.datasets[0].data = data.slice(0,12).map(d => d.count);
    chart.data.datasets[0].backgroundColor = data.slice(0,12).map(d => pathColors(d.path) + 'cc');
    chart.data.datasets[0].borderColor = data.slice(0,12).map(d => pathColors(d.path));
    chart.update();
  }

  function buildChart(Chart) {
    if (!canvas) return;
    const top12 = data.slice(0, 12);
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: top12.map(d => d.path),
        datasets: [{
          data: top12.map(d => d.count),
          backgroundColor: top12.map(d => pathColors(d.path) + 'cc'),
          borderColor: top12.map(d => pathColors(d.path)),
          borderWidth: 1,
          borderRadius: 4,
        }]
      },
      options: {
        indexAxis: 'y',
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: '#2a2d3a',
            borderWidth: 1,
            titleColor: '#e5e7eb',
            bodyColor: '#9ca3af',
            padding: 10,
            callbacks: { label: ctx => ` ${fmt(ctx.parsed.x)} requêtes` }
          }
        },
        scales: {
          x: {
            grid: { color: 'rgba(42,45,58,0.5)' },
            ticks: { color: '#6b7280', font: { size: 11 } }
          },
          y: {
            grid: { display: false },
            ticks: {
              color: '#9ca3af',
              font: { size: 11, family: 'monospace' },
            }
          }
        }
      }
    });
  }
</script>

<div class="relative" style="height: {Math.max(data.length * 28, 200)}px; max-height: 360px">
  <canvas bind:this={canvas}></canvas>
  {#if !data.length}
    <div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
      Aucun chemin disponible
    </div>
  {/if}
</div>

<!-- Legend -->
<div class="flex flex-wrap gap-3 mt-3 pt-3 border-t {darkMode ? 'border-[#2a2d3a]' : 'border-slate-200'}">
  {#each [
    { label: 'Admin/Panel', color: '#ef4444' },
    { label: 'Config/Secrets', color: '#f59e0b' },
    { label: 'Auth', color: '#f97316' },
    { label: 'Autres', color: '#6366f1' }
  ] as l}
    <div class="flex items-center gap-1.5 text-xs">
      <span class="w-3 h-3 rounded" style="background:{l.color}cc;border:1px solid {l.color}"></span>
      <span class="{darkMode ? 'text-gray-500' : 'text-gray-500'}">{l.label}</span>
    </div>
  {/each}
</div>
