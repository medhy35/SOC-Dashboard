<script>
  import { onMount, onDestroy } from 'svelte';
  export let data = [];

  let canvas;
  let chart;

  onMount(async () => {
    const { Chart, registerables } = await import('chart.js');
    Chart.register(...registerables);
    buildChart(Chart);
  });

  onDestroy(() => {
    chart?.destroy();
  });

  $: if (chart && data.length) {
    chart.data.labels = data.map(d => `${String(d.hour).padStart(2,'0')}h`);
    chart.data.datasets[0].data = data.map(d => d.critique);
    chart.data.datasets[1].data = data.map(d => d.moyen);
    chart.data.datasets[2].data = data.map(d => d.faible);
    chart.update();
  }

  function buildChart(Chart) {
    if (!canvas) return;
    chart = new Chart(canvas, {
      type: 'bar',
      data: {
        labels: data.map(d => `${String(d.hour).padStart(2,'0')}h`),
        datasets: [
          {
            label: 'Critique',
            data: data.map(d => d.critique),
            backgroundColor: 'rgba(239,68,68,0.75)',
            borderRadius: 2,
            stack: 'alerts'
          },
          {
            label: 'Moyen',
            data: data.map(d => d.moyen),
            backgroundColor: 'rgba(245,158,11,0.75)',
            borderRadius: 2,
            stack: 'alerts'
          },
          {
            label: 'Faible',
            data: data.map(d => d.faible),
            backgroundColor: 'rgba(249,115,22,0.60)',
            borderRadius: 2,
            stack: 'alerts'
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              color: '#9ca3af',
              boxWidth: 12,
              padding: 16,
              font: { size: 12 }
            }
          },
          tooltip: {
            backgroundColor: '#1a1d27',
            borderColor: '#2a2d3a',
            borderWidth: 1,
            titleColor: '#e5e7eb',
            bodyColor: '#9ca3af',
            padding: 10
          }
        },
        scales: {
          x: {
            stacked: true,
            grid: { color: 'rgba(42,45,58,0.5)' },
            ticks: { color: '#6b7280', font: { size: 11 } }
          },
          y: {
            stacked: true,
            grid: { color: 'rgba(42,45,58,0.5)' },
            ticks: { color: '#6b7280', font: { size: 11 } }
          }
        }
      }
    });
  }
</script>

<div class="relative h-64">
  <canvas bind:this={canvas}></canvas>
  {#if !data.length}
    <div class="absolute inset-0 flex items-center justify-center text-gray-500 text-sm">
      Aucune donnée temporelle disponible
    </div>
  {/if}
</div>
