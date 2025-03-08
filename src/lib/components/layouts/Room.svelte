<script lang="ts">
	import type { Room } from '$lib/types';
	// let { sidebarOpen } = $props();

	let rooms: Room[] = [
		{
			name: 'John Doe',
			message: 'How you doing?',
			time: '10 mins ago',
			active: true,
			avatar: 'https://randomuser.me/api/portraits/men/1.jpg'
		},
		{
			name: 'Jane Doe',
			message: 'Hey, how are you?',
			time: '10 mins ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/women/2.jpg'
		},
		{
			name: 'Bob Johnson',
			message: 'I need your help',
			time: '1 day ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/men/3.jpg'
		},
		{
			name: 'Linda Smith',
			message: 'I am good',
			time: '1 day ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/women/4.jpg'
		},
		{
			name: 'David Lee',
			message: 'How you doing?',
			time: '1 day ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/men/5.jpg'
		},
		{
			name: 'Sarah Taylor',
			message: 'I am good',
			time: '2 days ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/women/6.jpg'
		},
		{
			name: 'Michael Davis',
			message: 'I need your help',
			time: '2 days ago',
			active: false,
			avatar: 'https://randomuser.me/api/portraits/men/7.jpg'
		}
	];
</script>

{#each rooms as room}
	<a
		href="#test"
		class={`flex w-full items-center p-3 text-left ${
			room.active ? 'bg-gray-100 dark:bg-gray-800' : 'hover:bg-gray-100 dark:hover:bg-gray-800'
		} cursor-pointer`}
		type="button"
	>
		<div class="mr-3 h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
			<img
				src={room.avatar || '/placeholder.svg'}
				alt={room.name}
				class="h-full w-full object-cover"
			/>
		</div>
		<div class="flex-1">
			<div class="flex justify-between">
				<h3 class="font-medium text-gray-800 dark:text-gray-200">{room.name}</h3>
				<span class="text-xs text-gray-500 dark:text-gray-400">{room.time}</span>
			</div>
			<p class="truncate text-sm text-gray-500 dark:text-gray-400">{room.message}</p>
		</div>
	</a>
{/each}
