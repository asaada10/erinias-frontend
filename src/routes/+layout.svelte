<script lang="ts">
		import '../app.css';
		let { children } = $props();
		import { onMount } from 'svelte';
  import { accessToken } from '$lib/stores/auth';
  import { connectWebSocket } from "$lib/stores/ws";

  let token: string | null = null;

  onMount(() => {
    // Usamos la reactividad de Svelte para obtener el valor de la store
    token = $accessToken; // Reactivamente se actualiza el valor cuando cambia la store

    console.log($accessToken); // Verifica el token

    if (token) {
      connectWebSocket(token); // Llama a la función si existe el token
    }
  });
</script>

{@render children()}
