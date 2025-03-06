<script lang="ts">
	import type { Message, MessagesByDate } from '$lib/types';
	import { onMount } from 'svelte';

	let messages: Message[] = [
		{
			text: 'Hey, how are you doing?',
			time: '10:00 PM',
			sent: false,
			date: '22 Oct 2023'
		},
		{
			text: 'I am doing good. Wbu?',
			time: '10:00 PM',
			sent: true,
			date: '22 Oct 2023'
		},
		{
			text: 'I need some help',
			time: '10:00 PM',
			sent: false,
			date: '22 Oct 2023'
		},
		{
			text: 'What do you need help with?',
			time: '10:00 PM',
			sent: true,
			date: '22 Oct 2023'
		},
		{
			text: 'I need some help with my code',
			time: '10:00 PM',
			sent: false,
			date: '22 Oct 2023'
		},
		{
			text: 'What is your code?',
			time: '10:00 PM',
			sent: true,
			date: '22 Oct 2023'
		}
	];

	let messagesByDate: MessagesByDate = {};
	onMount(() => {
		// Procesar mensajes por fecha
		messages.forEach((message) => {
			if (!messagesByDate[message.date]) {
				messagesByDate[message.date] = [];
			}
			messagesByDate[message.date].push(message);
		});
	});
</script>

{#each Object.entries(messagesByDate) as [date, messages]}
	<!-- Date Separator -->
	<div class="my-4 flex items-center justify-center">
		<span class="text-xs text-gray-500 dark:text-gray-400">{date}</span>
	</div>

	{#each messages as message}
		{#if message.sent}
			<!-- Sent Message -->
			<div class="mb-4 flex justify-end">
				<div class="max-w-[70%] rounded-lg bg-teal-100 p-3 dark:bg-teal-900">
					<p class="text-gray-800 dark:text-gray-200">{message.text}</p>
					<span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
				</div>
			</div>
		{:else}
			<!-- Received Message -->
			<div class="mb-4 flex">
				<div class="max-w-[70%] rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
					<p class="text-gray-800 dark:text-gray-200">{message.text}</p>
					<span class="mt-1 block text-xs text-gray-500 dark:text-gray-400">{message.time}</span>
				</div>
			</div>
		{/if}
	{/each}
{/each}
