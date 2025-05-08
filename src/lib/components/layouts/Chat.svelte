<script lang="ts">
	import { messages, profile } from '$lib/states/chat.svelte';

	let messagesByDate = $derived.by(() => {
		const grouped: { [date: string]: any[] } = {};

		for (const msg of messages.list) {
			const date = new Date(msg.createdAt!).toLocaleDateString();
			if (!grouped[date]) grouped[date] = [];
			grouped[date].push(msg);
		}

		return grouped;
	});

	function formatTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

{#each Object.entries(messagesByDate) as [date, dateMessages]}
	<!-- Date Separator -->
	<div id={date} class="my-4 flex items-center justify-center">
		<div class="rounded-full bg-gray-100 px-3 py-1 dark:bg-gray-800">
			<span class="text-xs text-gray-500 dark:text-gray-400">{date}</span>
		</div>
	</div>

	{#each dateMessages as message, i}
	{$inspect(message.authorId, profile.user.id)}
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
						<img
							src="https://randomuser.me/api/portraits/women/2.jpg"
							alt="Your Avatar"
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			{:else}
				<!-- Received Message -->
				<div class="mb-4 flex items-start space-x-2">
					<div class="h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
						<img
							src="https://randomuser.me/api/portraits/men/1.jpg"
							alt="John Doe"
							class="h-full w-full object-cover"
						/>
					</div>
					<div class="max-w-[70%]">
						<div class="mb-1 flex flex-col">
							<span class="text-xs font-medium text-gray-700 dark:text-gray-300">John Doe</span>
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
