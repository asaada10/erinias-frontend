<script lang="ts">
	import { sendMessage } from '$lib/states/ws.svelte';
	import { Paperclip, Send, Smile } from 'lucide-svelte';
	import { messages, profile } from '$lib/states/chat.svelte';
	import { useApi } from '$lib/composables/api';
	const api = useApi();
	let message = $state('');
	let { domain, room } = $props();

	async function send() {
		if (!profile.user) {
			profile.user = (await api.getProfile()).data;
		}
		if (message.trim() !== '') {
			messages.list.push({
				content: message,
				authorId: profile.user.id,
				channelId: room.id,
				createdAt: new Date()
			});
			sendMessage(message, domain, room); // @TODO
			message = '';
		}
	}
</script>

<div class="flex items-center border-t border-gray-200 p-3 dark:border-gray-700">
	<button class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
		<Smile class="h-5 w-5 sm:h-6 sm:w-6" />
	</button>
	<button class="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200">
		<Paperclip class="h-5 w-5 sm:h-6 sm:w-6" />
	</button>
	<input
		type="text"
		bind:value={message}
		placeholder="Type your message"
		class="mx-2 flex-1 rounded-lg bg-gray-100 p-2 text-gray-800 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
		onkeydown={(e) => e.key === 'Enter' && send()}
	/>
	<button
		class="p-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
		onclick={send}
	>
		<Send class="h-5 w-5 sm:h-6 sm:w-6" />
	</button>
</div>
