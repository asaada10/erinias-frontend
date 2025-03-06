<script lang="ts">
    import type { Room } from '$lib/types';
    let { hub, activeHub, sidebarOpen } = $props();
    function selectHub(contact: Room): void {
		activeHub = contact;
		if (window.innerWidth < 768) {
			sidebarOpen = false;
		}
	}

</script>
<button
class={`flex items-center p-3 w-full text-left ${
    hub.active ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
} cursor-pointer`}
onclick={() => selectHub(hub)}
type="button"
>
<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
    <img
        src={hub.avatar || '/placeholder.svg'}
        alt={hub.name}
        class="h-full w-full object-cover"
    />
</div>
<div class="flex-1">
    <div class="flex justify-between">
        <h3 class="font-medium text-gray-800 dark:text-gray-200">{hub.name}</h3>
        <span class="text-xs text-gray-500 dark:text-gray-400">{hub.time}</span>
    </div>
    <p class="truncate text-sm text-gray-500 dark:text-gray-400">{hub.message}</p>
</div>
</button>