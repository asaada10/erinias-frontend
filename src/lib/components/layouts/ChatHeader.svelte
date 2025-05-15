<script lang="ts">
	import { profile } from "$lib/states/chat.svelte";
	import type { Room } from "$lib/types";

	let { selectedRoom }: {selectedRoom: Room} = $props();
	console.log('selectedRoom', selectedRoom);
	let user = selectedRoom.users?.find((user) => user.id !== profile.user.id) || selectedRoom;
</script>

<div class="flex items-center justify-between border-b border-gray-200 p-3 dark:border-gray-700">
	<div class="flex items-center">
	
		<div class="mr-3 h-10 w-10 overflow-hidden rounded-full">
			<img
				src={selectedRoom.image || '/erinias.svg'}
				alt={selectedRoom.name}
				class="h-full w-full object-cover"
			/>
		</div>
		<div>
			<h3 class="font-medium text-gray-800 dark:text-gray-200">{user.name}</h3>
		</div>
	</div>

</div>
