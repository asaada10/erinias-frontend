<script lang="ts">
	let username = '';
	let password = '';
	let errorMessage = '';
  
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
		window.location.href = '/';
	  }
	};
  </script>
  
  <div>
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<button on:click={login}>Login</button>
	{#if errorMessage}
	  <p style="color: red">{errorMessage}</p>
	{/if}
  </div>
  