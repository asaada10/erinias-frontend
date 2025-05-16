<script lang="ts">
	import { messages, profile, selectedRoom } from '$lib/states/chat.svelte';
	import { onMount } from 'svelte';
	import { useApi } from '$lib/composables/api';
	const api = useApi();
	import * as Avatar from "$lib/components/ui/avatar/index.js";

	let messagesByDate = $derived.by(() => {
		const grouped: { [date: string]: any[] } = {};

		const sortedMessages = [...messages.list].sort(
			(a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime()
		);
		for (const msg of sortedMessages) {
			const date = new Date(msg.createdAt!).toLocaleDateString();
			if (!grouped[date]) grouped[date] = [];
			grouped[date].push(msg);
		}

		return grouped;
	});

	function formatTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}

	onMount(async () => {
		profile.user = (await api.getProfile()).data;
	});
</script>

{#each Object.entries(messagesByDate) as [date, dateMessages]}
	<!-- Date Separator -->
	<div id={date} class="my-4 flex items-center justify-center">
		<div class="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
			<span class="text-xs text-gray-500 dark:text-gray-400">{date}</span>
		</div>
	</div>

	{#each dateMessages as message, i}
		<div id={message.id}>
			{#if message.authorId === profile.user.id}
				<!-- Sent Message -->
				<div class="mb-4 flex items-start justify-end space-x-2">
					<div class="max-w-[70%]">
						<div class="mb-1 flex flex-col items-end">
							<span class="text-xs font-medium text-gray-700 dark:text-gray-300">You</span>
							<span class="text-xs text-gray-500 dark:text-gray-400">
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
						<div
							class="rounded-lg bg-[#db324d]/10 p-3 transition-shadow group-hover:shadow-md dark:bg-[#db324d]"
						>
							<p class="text-gray-800 dark:text-white">{message.content}</p>
						</div>
					</div>
					<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
								
<Avatar.Root>
	<Avatar.Fallback>{profile.user.username.slice(0, 2)}</Avatar.Fallback>
  </Avatar.Root>
					</div>
				</div>
			{:else}
				<!-- Received Message -->
				<div class="mb-4 flex items-start space-x-2">
					<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
								
<Avatar.Root>
	<Avatar.Fallback>{(selectedRoom.selected?.users?.find((user) => user.id !== profile.user.id)?.name ??
									selectedRoom.selected?.name)?.slice(0, 2)}</Avatar.Fallback>
  </Avatar.Root>
					</div>
					<div class="max-w-[70%]">
						<div class="mb-1 flex flex-col">
							<span class="text-xs font-medium text-gray-700 dark:text-gray-300"
								>{selectedRoom.selected?.users?.find((user) => user.id !== profile.user.id)?.name ??
									selectedRoom.selected?.name}</span
							>
							<span class="text-xs text-gray-500 dark:text-gray-400">
								{formatTime(new Date(message.createdAt))}
							</span>
						</div>
						<div
							class="rounded-lg bg-gray-100 p-3 transition-shadow group-hover:shadow-md dark:bg-gray-800"
						>
							<p class="text-gray-800 dark:text-gray-200">{message.content}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/each}
{/each}
