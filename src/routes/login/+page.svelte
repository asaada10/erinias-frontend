<script lang="ts">
	let username = '';
	let password = '';
	let errorMessage = '';
	let showPassword = false;

	const login = async () => {
	  const response = await fetch('/api/login', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, password })
	  });

	  if (!response.ok) {
		const data = await response.json();
		errorMessage = data.message || 'An error occurred';
	  } else {
		// Redirigir al usuario si el login es exitoso
		const data = await response.json();
		// this.$goto('/');
	  }
	};
  </script>

  <div class="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-black">
	<div class="relative z-10 w-full max-w-md rounded-3xl bg-white/10 p-8 backdrop-blur-xl backdrop-filter">
	  <div class="flex flex-col items-center">
		<div class="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gray-700/80">
		  <!-- <Sparkles class="h-6 w-6 text-white" /> -->
		</div>

		<h1 class="mb-8 text-center text-2xl font-medium text-white">Erinias</h1>

		<form class="w-full space-y-4">
		  <div>
			<input
			  type="email"
			  placeholder="Email"
			  bind:value={username}
			  class="w-full rounded-lg bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/20"
			/>
		  </div>

		  <div class="relative">
			<input
			  type={showPassword ? 'text' : 'password'}
			  placeholder="Password"
			  bind:value={password}
			  class="w-full rounded-lg bg-gray-800/60 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none focus:ring-2 focus:ring-white/20"
			/>
			<button
			  type="button"
			  on:click={() => showPassword = !showPassword}
			  class="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
			>
			  {showPassword ? 'Hide' : 'Show'}
			</button>
		  </div>

		  <button
			type="submit"
			on:click={login}
			class="w-full rounded-full bg-gray-700/80 py-3 text-white transition-colors hover:bg-gray-600/80"
		  >
			Sign In
		  </button>
		</form>

		<p class="mt-6 text-center text-sm text-gray-300">
		  Don't have an account? <a href="/register" class="text-white hover:underline">Sign up, it's free!</a>
		</p>
	  </div>
	</div>
  </div>

  {#if errorMessage}
	<p style="color: red" class="text-center">{errorMessage}</p>
  {/if}
