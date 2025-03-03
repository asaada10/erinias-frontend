<script lang="ts">
	import type { Snippet } from "svelte";
  let { type, onclick, children }: { type: "button" | "submit" | "reset"; onclick: () => void; children: Snippet<[]>} = $props();
</script>

<button {type} {onclick}
  class="w-full rounded-full bg-gray-700/80 py-3 text-white transition-colors hover:bg-gray-600/80"
>
{@render children()}
</button>