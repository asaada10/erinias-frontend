<script lang="ts">
	import { goto } from '$app/navigation';
	import { useApi } from '$lib/composables/api';
	import { Input, Button, Icon } from '$lib/components/ui/';
	import { access } from '$lib/states/auth.svelte';
	import { toast } from 'svelte-sonner';
	import { profile } from '$lib/states/chat.svelte';
	const api = useApi();
	let email = $state('');
	let password = $state('');
	let showPassword = $state(false);

	const login = async () => {
		const { status, data, message } = await api.login(email, password);
		if (status === 'success' && data) {
			access.token = data.accessToken;
			profile.user = (await api.getProfile()).data;
			goto('/chat');
		} else {
			toast.error(message || 'An error occurred');
		}
	};
</script>

<div
	class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-gradient-to-b from-gray-900 to-gray-800"
>
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

			<h1 class="mb-8 text-center text-2xl font-medium text-white">Welcome Back</h1>

			<form class="w-full space-y-5">
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
						class="absolute right-3 top-1/2 -translate-y-1/2 rounded-md px-2 py-1 text-sm text-gray-400 transition-colors hover:text-pink-100"
					>
						{showPassword ? 'Hide' : 'Show'}
					</button>
				</div>

				<Button type="submit" onclick={login}>Sign In</Button>
			</form>

			<p class="mt-8 text-center text-sm text-gray-400">
				Don't have an account? <a
					href="/register"
					class="text-[#f04d6a] transition-colors hover:text-[#db324d] hover:underline"
				>
					Sign up, it's free!
				</a>
			</p>

			<p class="mt-4 text-center text-xs text-gray-500">
				By signing in, you agree to our <a
					href="#"
					class="text-gray-400 hover:text-[#f04d6a] hover:underline">Terms of Service</a
				>
				and
				<a href="#" class="text-gray-400 hover:text-[#f04d6a] hover:underline">Privacy Policy</a>
			</p>
		</div>
	</div>
</div>
