<script>
  export let darkMode = true;
  const pulse = 'animate-pulse rounded';
  const bg    = darkMode ? 'bg-[#22263a]' : 'bg-slate-200';
  const card  = darkMode ? 'bg-[#1a1d27] border-[#2a2d3a]' : 'bg-white border-slate-200';
</script>

<div class="p-5 space-y-5">
  <!-- KPI row -->
  <div class="grid grid-cols-6 gap-3">
    {#each Array(6) as _}
      <div class="border {card} rounded-xl p-4 space-y-3">
        <div class="{pulse} {bg} h-3 w-24"></div>
        <div class="{pulse} {bg} h-8 w-20"></div>
        <div class="{pulse} {bg} h-3 w-full"></div>
        <div class="{pulse} {bg} h-10 w-full opacity-40"></div>
      </div>
    {/each}
  </div>
  <!-- Client grid -->
  <div class="grid grid-cols-5 gap-3">
    {#each Array(14) as _}
      <div class="border {card} rounded-xl p-3 space-y-2">
        <div class="{pulse} {bg} h-3 w-16"></div>
        <div class="{pulse} {bg} h-4 w-28"></div>
        <div class="{pulse} {bg} h-3 w-20 opacity-60"></div>
        <div class="grid grid-cols-2 gap-1 mt-1">
          <div class="{pulse} {bg} h-6"></div>
          <div class="{pulse} {bg} h-6"></div>
        </div>
      </div>
    {/each}
  </div>
  <!-- Charts row -->
  <div class="grid grid-cols-3 gap-5">
    <div class="col-span-2 border {card} rounded-xl p-4 space-y-3">
      <div class="{pulse} {bg} h-3 w-40"></div>
      <div class="{pulse} {bg} h-56 w-full"></div>
    </div>
    <div class="border {card} rounded-xl p-4 space-y-3">
      <div class="{pulse} {bg} h-3 w-32"></div>
      <div class="{pulse} {bg} h-44 w-44 rounded-full mx-auto"></div>
      <div class="space-y-1.5">
        {#each Array(3) as _}
          <div class="{pulse} {bg} h-3 w-full"></div>
        {/each}
      </div>
    </div>
  </div>
</div>
