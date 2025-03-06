<script lang="ts">
	import type { Message } from '$lib/db/schema';
	import { onMount } from 'svelte';

	let messages: Message[] = [
		{
			id: '1',
			content: 'Hey, how are you doing?',
			authorId: '1',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
		{
			id: '2',
			content: 'I am doing good. Wbu?',
			authorId: '2',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
		{
			id: '3',
			content: 'I need some help',
			authorId: '1',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
		{
			id: '4',
			content: 'What do you need help with?',
			authorId: '2',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
		{
			id: '5',
			content: 'I need some help with my code',
			authorId: '1',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
		{
			id: '6',
			content: 'What is your code?',
			authorId: '2',
			channelId: '1',
			createdAt: new Date(),
			updatedAt: new Date(),
			edited: false,
		},
	];

	let messagesByDate: { [date: string]: Message[] } = {};
	onMount(() => {
		// Procesar mensajes por fecha
		messages.forEach((message) => {
			const date = message.createdAt!.toDateString();
			if (!messagesByDate[date]) {
				messagesByDate[date] = [];
			}
			messagesByDate[date].push(message);
		});
	});
</script>
{#each Object.entries(messagesByDate) as [date, messages]}
	<!-- Date Separator -->
    <div id={date}>
        <div class="my-4 flex items-center justify-center">
            <span class="text-xs text-gray-500 dark:text-gray-400">{date}</span>
          </div>

	{#each messages as message}
    <div id={message.id}>
		{#if message.authorId === '1'}
			<!-- Sent Message -->
            <div class="mb-4 flex justify-end items-start space-x-2">
                <div class="max-w-[70%]">
                  <div class="flex flex-col items-end mb-1">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{message.id}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {message.createdAt!.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div class="rounded-lg bg-teal-100 p-3 dark:bg-teal-900">
                    <p class="text-gray-800 dark:text-gray-200">{message.content}</p>
                  </div>
                </div>
                <div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                        src={'https://randomuser.me/api/portraits/men/1.jpg'}
                        alt={message.id}
                        class="h-full w-full object-cover"
                    />
                </div>

              </div>
		{:else}
			<!-- Received Message -->
            <div class="mb-4 flex items-start space-x-2">
                <div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                    <img
                        src={'https://randomuser.me/api/portraits/men/1.jpg'}
                        alt={message.id}
                        class="h-full w-full object-cover"
                    />
                </div>
                <div class="max-w-[70%]">
                  <div class="flex flex-col mb-1">
                    <span class="text-xs font-medium text-gray-700 dark:text-gray-300">{message.id}</span>
                    <span class="text-xs text-gray-500 dark:text-gray-400">
                      {message.createdAt!.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </span>
                  </div>
                  <div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
                    <p class="text-gray-800 dark:text-gray-200">{message.content}</p>
                  </div>
                </div>
              </div>
		{/if}
    </div>
	{/each}
</div>
{/each}
