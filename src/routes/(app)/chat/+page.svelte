<script lang="ts">
	import { setLayoutComponent, cleanLayoutContext } from '$lib/components/helpers/layout.svelte';
	import { Room, SidebarHeader, Search } from '$lib/components/layouts';
	// Asigna los componentes al contexto
	setLayoutComponent({
		sidebarHeader,
		search,
		chatHeader
	});

	$effect(() => {
		return cleanLayoutContext;
	});

	import { onMount } from 'svelte';
	// import { darkMode, toggleDarkMode } from '$lib/stores/theme';
	import { connect } from '$lib/states/ws.svelte';

	// Search state

	// Connect to WebSocket on mount
	onMount(async () => {
		await connect();
	});
</script>

{#snippet sidebarHeader()}
	<SidebarHeader title="All Chats" />
{/snippet}


{#snippet chatHeader()}
	<div class="flex h-full items-center justify-center">
		<div class="text-center">
			<h1 class="mb-4 text-2xl font-bold">No hay chat seleccionado</h1>
			<p class="text-gray-600">Selecciona una sala para comenzar a chatear.</p>
		</div>
	</div>
{/snippet}

{#snippet search()}
	<Search placeholder="Search..." />
{/snippet}
