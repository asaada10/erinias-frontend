<script lang="ts">
let username: string, 
    email: string, 
    password: string, 
    passwordConfirm: string, 
    errorMessage: string;

  
	const register = async () => {
	  if (password !== passwordConfirm) {
		errorMessage = 'Passwords do not match';
	  }
	  const response = await fetch('/api/register', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ username, email, password })
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
	<input type="text" bind:value={email} placeholder="Email" />
	<input type="text" bind:value={username} placeholder="Username" />
	<input type="password" bind:value={password} placeholder="Password" />
	<input type="password" bind:value={passwordConfirm} placeholder="Confirm Password" />
	<button on:click={register}>Login</button>
	{#if errorMessage}
	  <p style="color: red">{errorMessage}</p>
	{/if}
  </div>
  