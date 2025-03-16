<script lang="ts">
	import { onMount } from 'svelte';
	import { darkMode, toggleDarkMode } from '$lib/stores/theme';
	import { connect } from '$lib/stores/ws';
	import {
	  Header,
	  Room,
	  SidebarHeader,
	  ChatHeader,
	  Chat,
	  ChatInput,
	  Search
	} from '$lib/components/layouts';
	import { ArrowLeft } from 'lucide-svelte';
	import { fetchRefresh } from '$lib/components/helpers/auth';
	import type { Room as RoomType } from '$lib/types';
  
	// State for sidebar visibility on mobile
	let sidebarOpen = $state(false);
	
	// Toggle sidebar function
	function toggleSidebar(): void {
	  sidebarOpen = !sidebarOpen;
	}
  
	// Search state
	let search = $state('');
	let rooms: RoomType[] = $state([]);
	let isSearching = $state(false);
	let searchError = $state<string | null>(null);
  
	// Connect to WebSocket on mount
	onMount(() => {
	connect('ws://localhost:4343');
	});
  
function handleSearch() {
	  if (!search) {
		rooms = [];
		return;
	  }
	  
	  async function fetchRooms() {
		isSearching = true;
		searchError = null;
		
		try {
		  const result = await fetchRefresh('/api/users', {
			method: 'POST',
			credentials: 'include',
			body: JSON.stringify({ search })
		  }).then((res) => res.json());
		  
		  if (result && result.rooms) {
			rooms = result.rooms;
		  } else {
			rooms = [];
		  }
		} catch (error) {
		  console.error('Error fetching rooms:', error);
		  searchError = 'Failed to fetch rooms. Please try again.';
		} finally {
		  isSearching = false;
		}
	  }
	  
	  // Debounce search
	  const timer = setTimeout(fetchRooms, 300);
	  return () => clearTimeout(timer);
	};
  </script>
  
  <div class={`min-h-screen w-full overflow-hidden bg-white shadow-xl ${!$darkMode ? 'dark:bg-slate-950' : ''}`}>
	<Header sidebarOpen={sidebarOpen} darkMode={$darkMode} {toggleSidebar} toggleDarkMode={toggleDarkMode} />
	
	<!-- Main Content -->
	<div class="flex h-[calc(100vh-64px)]">
	  <!-- Sidebar - Mobile: absolute positioning, Desktop: normal flow -->
	  <div
		class={`${sidebarOpen ? 'fixed inset-0 z-50 bg-white dark:bg-slate-950' : 'hidden'} md:relative md:flex md:w-80 md:flex-col md:border-r md:border-gray-200 md:dark:border-gray-700`}
	  >
		<!-- Back button for mobile -->
		{#if sidebarOpen}
		  <div class="flex items-center border-b border-gray-200 p-3 md:hidden dark:border-gray-700">
			<button class="mr-2 p-1" onclick={toggleSidebar}>
			  <ArrowLeft class="h-5 w-5 text-gray-500 dark:text-gray-400" />
			</button>
			<span class="font-medium text-gray-800 dark:text-gray-200">Back to Chat</span>
		  </div>
		{/if}
  
		<!-- Sidebar Header -->
		<SidebarHeader title="All Chats" />
  
		<!-- Search -->
		<Search placeholder="Search" bind:search={search} {handleSearch} {isSearching} {searchError}  />
  
		<!-- Contacts List -->
		<div class="flex-1 overflow-y-auto">
		  <Room {rooms} />
		</div>
	  </div>
  
	  <!-- Chat Area -->
	  <div class="flex flex-1 flex-col">
		<!-- Chat Header -->
		<ChatHeader />
  
		<!-- Messages -->
		<div class="flex-1 overflow-y-auto p-4">
		  <Chat />
		</div>
		
		<!-- Chat Input -->
		<ChatInput />
	  </div>
	</div>
  </div>