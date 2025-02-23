<script lang="ts">
	import { enhance } from '$app/forms';
	let user: { id: string; username: string };
	(async () => {
	try {
	  const response = await fetch('/api/user', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
	  });
	
	  if (!response.ok) {
		throw new Error('Failed to post data');
	  }
	user = await response.json();
	} catch (error) {
	  console.error(error);
	  return null;
	}
	})();
	
	
	</script>
	
	<h1>Hi, {user.username}!</h1>
	<p>Your user ID is {user.id}.</p>
	<form method="post" action="/logout" use:enhance>
		<button>Sign out</button>
	</form>
	