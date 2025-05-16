<script lang="ts">
	import { Menu, X } from 'lucide-svelte';
	let { sidebarOpen, toggleSidebar } = $props();
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu';
	import { useApi } from '$lib/composables/api';
	import { goto } from '$app/navigation';
	const api = useApi();

	async function handleLogout() {
		try {
			await api.logout();
			goto('/login');
		} catch (e) {
			console.error('Logout failed', e);
		}
	}
</script>

<header class="flex items-center justify-between bg-[#db324d] p-3 text-white">
	<div class="flex items-center space-x-2 md:space-x-6">
		<button class="p-1 md:hidden" onclick={toggleSidebar}>
			{#if sidebarOpen}
				<X class="h-6 w-6" />
			{:else}
				<Menu class="h-6 w-6" />
			{/if}
		</button>

		<button class="hidden p-1 md:block" aria-label="Logo">
			<img src="/erinias.svg" alt="Icon" class="h-6 w-6" />
		</button>

	</div>
	<div class="flex items-center space-x-2">

		<DropdownMenu.Root>
			<DropdownMenu.Trigger>Profile</DropdownMenu.Trigger>
			<DropdownMenu.Content>
				<DropdownMenu.Group>
					<DropdownMenu.GroupHeading>My Account</DropdownMenu.GroupHeading>
					<DropdownMenu.Separator />
					<DropdownMenu.Item onclick={handleLogout}>Logout</DropdownMenu.Item>
				</DropdownMenu.Group>
			</DropdownMenu.Content>
		</DropdownMenu.Root>
	</div>
</header>
