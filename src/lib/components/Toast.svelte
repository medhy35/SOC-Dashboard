<script>
  import { toasts, removeToast } from '$lib/stores/ui';

  const icons = { success:'✅', error:'❌', warning:'⚠️', info:'ℹ️' };
  const colors = {
    success: 'border-green-500/40 bg-green-950/60',
    error:   'border-red-500/40 bg-red-950/60',
    warning: 'border-amber-500/40 bg-amber-950/60',
    info:    'border-indigo-500/40 bg-indigo-950/60',
  };
</script>

<div class="fixed bottom-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
  {#each $toasts as toast (toast.id)}
    <div class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl border shadow-2xl
      backdrop-blur-sm text-sm font-medium text-white min-w-64 max-w-sm
      animate-[slideIn_0.2s_ease-out] {colors[toast.type] ?? colors.info}"
      style="animation: slideIn 0.2s ease-out;">
      <span class="text-base shrink-0">{icons[toast.type] ?? icons.info}</span>
      <span class="flex-1 text-gray-200">{toast.message}</span>
      <button on:click={() => removeToast(toast.id)}
        class="text-gray-500 hover:text-white transition-colors shrink-0 text-lg leading-none">×</button>
    </div>
  {/each}
</div>

<style>
  @keyframes slideIn {
    from { opacity: 0; transform: translateX(2rem); }
    to   { opacity: 1; transform: translateX(0); }
  }
</style>
