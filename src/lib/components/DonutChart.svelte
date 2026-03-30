<script>
  import { onMount, onDestroy } from 'svelte';

  export let data = [];       // [{ label, value, color }]
  export let title = '';
  export let size = 180;
  export let showLegend = true;
  export let centerLabel = '';

  let canvas;
  let chart;

  function fmt(n) { return new Intl.NumberFormat('fr-FR').format(n); }

  onMount(async () => {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    buildChart(Chart);
  });

  onDestroy(() => chart?.destroy());

  $: if (chart && data.length) {
    chart.data.labels   = data.map(d => d.label);
    chart.data.datasets[0].data            = data.map(d => d.value);
    chart.data.datasets[0].backgroundColor = data.map(d => d.color + 'cc');
    chart.data.datasets[0].borderColor     = data.map(d => d.color);
    chart.update();
  }

  function buildChart(Chart) {
    if (!canvas) return;
    chart = new Chart(canvas, {
      type: 'doughnut',
      data: {
        labels: data.map(d => d.label),
        datasets: [{
          data: data.map(d => d.value),
          backgroundColor: data.map(d => d.color + 'cc'),
          borderColor:     data.map(d => d.color),
          borderWidth: 1.5,
          hoverOffset: 6,
        }]
      },
      options: {
        responsive: false,
        cutout: '68%',
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: '#2a2d3a',
            borderWidth: 1,
            titleColor: '#e5e7eb',
            bodyColor: '#9ca3af',
            padding: 10,
            callbacks: {
              label: ctx => ` ${ctx.label}: ${fmt(ctx.parsed)} (${Math.round(ctx.parsed / ctx.dataset.data.reduce((a,b)=>a+b,0)*100)}%)`
            }
          }
        }
      }
    });
  }
</script>

<div class="flex flex-col items-center gap-3">
  {#if title}
    <p class="text-xs font-semibold uppercase tracking-wider text-gray-500">{title}</p>
  {/if}

  <div class="relative" style="width:{size}px;height:{size}px">
    <canvas bind:this={canvas} width={size} height={size}></canvas>
    {#if centerLabel}
      <div class="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <p class="text-lg font-bold text-gray-200">{centerLabel}</p>
        <p class="text-[10px] text-gray-500 uppercase">total</p>
      </div>
    {/if}
    {#if !data.length}
      <div class="absolute inset-0 flex items-center justify-center text-gray-600 text-xs">Aucune donnée</div>
    {/if}
  </div>

  {#if showLegend && data.length}
    <div class="flex flex-col gap-1.5 w-full">
      {#each data as item}
        {@const total = data.reduce((s,d) => s+d.value, 0)}
        {@const pct = total > 0 ? Math.round((item.value/total)*100) : 0}
        <div class="flex items-center justify-between gap-2 text-xs">
          <div class="flex items-center gap-1.5 min-w-0">
            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background:{item.color}"></span>
            <span class="text-gray-400 truncate">{item.label}</span>
          </div>
          <div class="flex items-center gap-2 shrink-0">
            <span class="font-bold text-gray-300">{fmt(item.value)}</span>
            <span class="text-gray-600 w-8 text-right">{pct}%</span>
          </div>
        </div>
      {/each}
    </div>
  {/if}
</div>
