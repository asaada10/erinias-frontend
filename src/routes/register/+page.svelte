<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Button, Icon } from '$lib/components/ui/';

	let username = '';
	let email = '';
	let password = '';
	let passwordConfirm = '';
	let errorMessage = '';
	let date = '';
	let showPassword = false;

	const register = async () => {
		if (password !== passwordConfirm) {
			errorMessage = 'Passwords do not match';
			return;
		}

		const response = await fetch('/api/auth/register', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ username, email, password, date })
		});

		if (!response.ok) {
			const data = await response.json();
			errorMessage = data.message || 'An error occurred';
		} else {
			goto('/');
		}
	};
</script>

<div>
	<div
		class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black"
	>
		<div
			class="relative z-10 w-full max-w-md rounded-3xl bg-white/10 p-8 backdrop-blur-xl backdrop-filter"
		>
			<div class="flex flex-col items-center">
				<Icon />
				<h1 class="mb-8 text-center text-2xl font-medium text-white">Sign up</h1>
				<form class="w-full space-y-4">
					<div><Input type="email" placeholder="Email" bind:value={email} /></div>
					<div><Input type="text" placeholder="Username" bind:value={username} /></div>
					<div><Input type="date" placeholder="Date of Birth" bind:value={date} /></div>
					<div class="relative">
						<Input
							type={showPassword ? 'text' : 'password'}
							placeholder="Password"
							bind:value={password}
						/>
						<button
							type="button"
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
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
							onclick={() => (showPassword = !showPassword)}
							class="absolute top-1/2 right-3 -translate-y-1/2 text-gray-400"
						>
							{showPassword ? 'Hide' : 'Show'}
						</button>
					</div>
					<Button type="submit" onclick={register}>Sign up</Button>
				</form>
				<p class="mt-6 text-center text-sm text-gray-300">
					Already have an account? <a href="/login" class="text-white hover:underline">Sign in</a>
				</p>
			</div>
		</div>
	</div>
	{#if errorMessage}
		<p class="text-red-500">{errorMessage}</p>
	{/if}
</div>
