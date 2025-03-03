<script lang="ts">
	import type { HTMLInputTypeAttribute } from "svelte/elements";
  let { value, placeholder, type }: { value: string; placeholder: string; type: HTMLInputTypeAttribute } = $props();
  </script>
<input {type} {placeholder} bind:value={value}
class="w-full rounded-lg bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/20"
/>