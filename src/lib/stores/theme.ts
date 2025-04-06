// import { writable } from 'svelte/store';
// import { browser } from '$app/environment';

// const initialValue = browser ? localStorage.getItem('darkMode') === 'true' : false;

// export const darkMode = $state<boolean>(initialValue);

// if (browser) {
// 	darkMode.subscribe((value) => {
// 		localStorage.setItem('darkMode', String(value));

// 		if (value) {
// 			document.documentElement.classList.add('dark');
// 		} else {
// 			document.documentElement.classList.remove('dark');
// 		}
// 	});
// }

// export function toggleDarkMode(): void {
// 	darkMode.update((value) => !value);
// }
