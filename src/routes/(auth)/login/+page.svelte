<script lang="ts">
	import { goto } from '$app/navigation';
	import { Input, Button, Icon } from '$lib/components/ui/';
	import { access } from '$lib/stores/auth.svelte';
	let email = '';
	let password = '';
	let errorMessage = '';
	let showPassword = false;

	const login = async () => {
		console.log({ email, password });
		const response = await fetch('/api/v1/auth/login', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ email, password })
		});

		if (!response.ok) {
			const data = await response.json();
			errorMessage = data.message || 'An error occurred';
		} else {
			access.token = (await response.json()).accessToken;
			goto('/chat');
		}
	};
</script>

<div class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
	<div
		class="relative z-10 w-full max-w-md rounded-3xl bg-white/10 p-8 backdrop-blur-xl backdrop-filter"
	>
		<div class="flex flex-col items-center">
			<Icon />
			<h1 class="mb-8 text-center text-2xl font-medium text-white">Log in</h1>

			<form class="w-full space-y-4">
				<div>
					<Input type="email" placeholder="Email" bind:value={email} />
				</div>

				<div class="relative">
					<Input
						type={showPassword ? 'text' : 'password'}
						placeholder="Password"
						bind:value={password}
					/>
					<button
						type="button"
						onclick={() => (showPassword = !showPassword)}
						class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<Button type="submit" onclick={login}>Sign In</Button>
			</form>

			<p class="mt-6 text-center text-sm text-gray-300">
				Don't have an account? <a href="/register" class="text-white hover:underline"
					>Sign up, it's free!</a
				>
			</p>
		</div>
	</div>
</div>

{#if errorMessage}
	<p style="color: red" class="text-center">{errorMessage}</p>
{/if}
