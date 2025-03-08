<script lang="ts">
	import type { Message } from '$lib/db/schema';
	import { ws } from '$lib/stores/ws';
	import { onDestroy } from 'svelte';
	import { writable } from 'svelte/store';

	let messages = writable<Message[]>([]);

	// Agrupar mensajes por fecha
	let messagesByDate = writable<{ [date: string]: Message[] }>({});

	// Suscribirse al WebSocket
	let unsubscribe = ws.subscribe((socket) => {
		if (!socket) return;

		const handleMessage = (event: MessageEvent) => {
			const data = JSON.parse(event.data);
			if (data.type === 'message') {
				messages.update((msgs) => [...msgs, data]);

				// Actualizar agrupación de mensajes por fecha
				messagesByDate.update((grouped) => {
					const date = new Date(data.createdAt).toDateString();
					if (!grouped[date]) grouped[date] = [];
					grouped[date].push(data);
					return grouped;
				});
			}
		};

		socket.addEventListener('message', handleMessage);

		onDestroy(() => {
			socket.removeEventListener('message', handleMessage);
		});
	});

	// Función para formatear la hora
	function formatTime(date: Date) {
		return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
	}
</script>

{#each Object.entries($messagesByDate) as [date, messages]}
	<!-- Separador de Fecha -->
	<div id={date} class="my-4 flex items-center justify-center">
		<span class="text-xs text-gray-500 dark:text-gray-400">{date}</span>
	</div>

	{#each messages as message}
		<div id={message.id}>
			{#if message.authorId === '1'}
				<!-- Mensaje Enviado -->
				<div class="mb-4 flex items-start justify-end space-x-2">
					<div class="max-w-[70%]">
						<div class="mb-1 flex flex-col items-end">
							<span class="text-xs font-medium text-gray-700 dark:text-gray-300">{message.id}</span>
							<span class="text-xs text-gray-500 dark:text-gray-400"
								>{formatTime(new Date(message.createdAt!))}</span
							>
						</div>
						<div class="rounded-lg bg-teal-100 p-3 dark:bg-teal-900">
							<p class="text-gray-800 dark:text-gray-200">{message.content}</p>
						</div>
					</div>
					<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
						<img
							src="https://randomuser.me/api/portraits/men/1.jpg"
							alt={message.id}
							class="h-full w-full object-cover"
						/>
					</div>
				</div>
			{:else}
				<!-- Mensaje Recibido -->
				<div class="mb-4 flex items-start space-x-2">
					<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
						<img
							src="https://randomuser.me/api/portraits/men/1.jpg"
							alt={message.id}
							class="h-full w-full object-cover"
						/>
					</div>
					<div class="max-w-[70%]">
						<div class="mb-1 flex flex-col">
							<span class="text-xs font-medium text-gray-700 dark:text-gray-300">{message.id}</span>
							<span class="text-xs text-gray-500 dark:text-gray-400"
								>{formatTime(new Date(message.createdAt!))}</span
							>
						</div>
						<div class="rounded-lg bg-gray-100 p-3 dark:bg-gray-800">
							<p class="text-gray-800 dark:text-gray-200">{message.content}</p>
						</div>
					</div>
				</div>
			{/if}
		</div>
	{/each}
{/each}
