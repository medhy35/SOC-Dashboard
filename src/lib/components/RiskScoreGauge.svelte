<script>
  export let score = 0;   // 0–10
  export let darkMode = true;

  // Arc SVG params
  const R = 54, CX = 70, CY = 70;
  const FULL = 2 * Math.PI * R;
  // We use 270° arc (from 135° to 405°, i.e. bottom-left to bottom-right)
  const ARC = FULL * 0.75;

  $: pct       = Math.min(score / 10, 1);
  $: fillArc   = ARC * pct;
  $: dashArray = `${fillArc} ${FULL}`;
  $: rotation  = 'rotate(135, 70, 70)';

  $: color = score >= 8 ? '#ef4444' : score >= 5 ? '#f59e0b' : score >= 3 ? '#f97316' : '#22c55e';
  $: label = score >= 8 ? 'CRITIQUE' : score >= 5 ? 'ÉLEVÉ' : score >= 3 ? 'MODÉRÉ' : 'FAIBLE';
  $: labelColor = score >= 8 ? 'text-red-400' : score >= 5 ? 'text-amber-400' : score >= 3 ? 'text-orange-400' : 'text-green-400';
</script>

<div class="flex flex-col items-center gap-1">
  <div class="relative">
    <svg width="140" height="100" viewBox="0 0 140 100">
      <!-- Background arc -->
      <circle cx={CX} cy={CY} r={R}
        fill="none"
        stroke={darkMode ? '#22263a' : '#e2e8f0'}
        stroke-width="10"
        stroke-dasharray="{ARC} {FULL}"
        stroke-dashoffset="0"
        stroke-linecap="round"
        transform={rotation} />
      <!-- Score arc -->
      <circle cx={CX} cy={CY} r={R}
        fill="none"
        stroke={color}
        stroke-width="10"
        stroke-dasharray={dashArray}
        stroke-dashoffset="0"
        stroke-linecap="round"
        transform={rotation}
        style="transition: stroke-dasharray 0.8s ease, stroke 0.4s ease;" />
      <!-- Center text -->
      <text x={CX} y={CY - 4} text-anchor="middle" dominant-baseline="middle"
        font-size="24" font-weight="bold" fill={color}>{score?.toFixed(1)}</text>
      <text x={CX} y={CY + 16} text-anchor="middle"
        font-size="9" fill={darkMode ? '#6b7280' : '#9ca3af'} font-weight="600" letter-spacing="1">/10</text>
    </svg>
  </div>
  <div class="text-center -mt-2">
    <span class="text-xs font-bold tracking-widest {labelColor} uppercase">{label}</span>
    <p class="text-[10px] {darkMode ? 'text-gray-600' : 'text-gray-400'} mt-0.5">Score de risque global</p>
  </div>
</div>
