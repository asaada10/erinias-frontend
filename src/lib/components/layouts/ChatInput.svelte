<script lang="ts">
	import { Send, Smile, Paperclip } from 'lucide-svelte';
	// Función para enviar un mensaje (placeholder)
	function sendMessage(event: Event): void {
		const input = event.target as HTMLInputElement;
		const message = input.value.trim();

		if (message) {
			// Aquí iría la lógica para enviar el mensaje
			console.log('Mensaje enviado:', message);
			input.value = '';
		}
	}
	// Función para manejar el envío con Enter
	function handleKeydown(event: KeyboardEvent): void {
		if (event.key === 'Enter') {
			sendMessage(event);
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
		placeholder="Type your message"
		class="mx-2 flex-1 rounded-lg bg-gray-100 p-2 text-gray-800 focus:outline-none dark:bg-gray-800 dark:text-gray-200"
		on:keydown={handleKeydown}
	/>
	<button
		class="p-2 text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
		on:click={(e) => sendMessage(e)}
	>
		<Send class="h-5 w-5 sm:h-6 sm:w-6" />
	</button>
</div>
