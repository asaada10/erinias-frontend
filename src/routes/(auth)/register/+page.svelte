<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Button, Icon } from '$lib/components/ui/';
	import { useApi } from '$lib/composables/api';
	import { toast } from 'svelte-sonner';
	import CalendarIcon from '@lucide/svelte/icons/calendar';
	import { DateFormatter, type DateValue, getLocalTimeZone } from '@internationalized/date';
	import { cn } from '$lib/utils.js';
	import { buttonVariants } from '$lib/components/ui/button';
	import { Calendar } from '$lib/components/ui/calendar';
	import * as Popover from '$lib/components/ui/popover';

	const df = new DateFormatter('en-US', {
		dateStyle: 'long'
	});

	let contentRef = $state<HTMLElement | null>(null);
	const api = useApi();

	let username = $state<string>('');
	let email = $state<string>('');
	let password = $state<string>('');
	let passwordConfirm = $state<string>('');
	let date = $state<DateValue | undefined>();
	let showPassword = $state<boolean>(false);

	const register = async () => {
		if (!date) {
			toast.error('Please select a date');
			return;
		}
		if (password !== passwordConfirm) {
			toast.error('Passwords do not match');
			return;
		}

		const { status, data, message } = await api.register(
			username,
			email,
			password,
			date.toDate(getLocalTimeZone()).toISOString()
		);

		if (status !== 'success') {
			toast.error(message || 'An error occurred');
		} else {
			goto('/');
		}
	};
</script>

<div
	class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
>
	<!-- Background decorative elements -->
	<div class="absolute inset-0 overflow-hidden">
		<div
			class="absolute -left-40 -top-40 h-80 w-80 rounded-full bg-gradient-to-r from-[#db324d] to-[#f04d6a] opacity-20 blur-3xl"
		></div>
		<div
			class="absolute -bottom-20 -right-20 h-80 w-80 rounded-full bg-gradient-to-r from-[#db324d] to-[#f04d6a] opacity-20 blur-3xl"
		></div>
	</div>

	<div
		class="relative z-10 w-full max-w-md rounded-xl border border-gray-700 bg-white/5 p-8 shadow-xl backdrop-blur-xl backdrop-filter"
	>
		<div class="flex flex-col items-center">
			<div class="mb-2 flex items-center">
				<span class="text-3xl font-bold text-[#db324d]">Erinias</span>
				<span class="ml-2 rounded-full bg-pink-900 px-2 py-1 text-xs font-medium text-pink-100"
					>BETA</span
				>
			</div>

			<h1 class="mb-6 text-center text-2xl font-medium text-white">Create Your Account</h1>

			<form class="w-full space-y-4">
				<div>
					<Input type="email" placeholder="Email" bind:value={email} />
				</div>

				<div>
					<Input type="text" placeholder="Username" bind:value={username} />
				</div>

				<div>
					<Popover.Root>
						<Popover.Trigger
							class={cn(
								buttonVariants({
									variant: 'outline',
									class: 'w-[280px] justify-start text-left font-normal'
								}),
								!date && 'text-muted-foreground'
							)}
						>
							<CalendarIcon />
							{date ? df.format(date.toDate(getLocalTimeZone())) : 'Pick a date'}
						</Popover.Trigger>
						<Popover.Content bind:ref={contentRef} class="w-auto p-0">
							<Calendar type="single" bind:value={date} />
						</Popover.Content>
					</Popover.Root>
				</div>

				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						bind:value={password}
					/>
					<button
						type="button"
						on:click={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 transition-colors hover:text-pink-100"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						placeholder="Confirm Password"
						bind:value={passwordConfirm}
					/>
					<button
						type="button"
						on:click={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 transition-colors hover:text-pink-100"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<Button type="submit" onclick={register}>Create Account</Button>
			</form>

			<div class="mt-6 w-full">
				<p class="text-xs text-gray-400">
					By creating an account, you agree to our
					<a href="#" class="text-[#f04d6a] transition-colors hover:text-[#db324d] hover:underline"
						>Terms of Service</a
					>
					and
					<a href="#" class="text-[#f04d6a] transition-colors hover:text-[#db324d] hover:underline"
						>Privacy Policy</a
					>
				</p>
			</div>

			<p class="mt-8 text-center text-sm text-gray-400">
				Already have an account? <a
					href="/login"
					class="text-[#f04d6a] transition-colors hover:text-[#db324d] hover:underline"
				>
					Sign in
				</a>
			</p>
		</div>
	</div>
</div>
