<script lang="ts">
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';

	let isDark = false;

	onMount(() => {
		if (!browser) return;
		const stored = localStorage.getItem('theme');
		const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
		isDark = stored === 'dark' || (!stored && prefersDark);
		updateTheme();
	});

	function toggleTheme() {
		if (!browser) return;
		isDark = !isDark;
		updateTheme();
	}

	function updateTheme() {
		if (!browser) return;
		const html = document.documentElement;
		if (isDark) {
			html.classList.add('dark');
			localStorage.setItem('theme', 'dark');
		} else {
			html.classList.remove('dark');
			localStorage.setItem('theme', 'light');
		}
	}
</script>

<button
	on:click={toggleTheme}
	class="p-2 rounded hover:bg-dim-0 dark:hover:bg-[#2d353b] transition-colors text-gray dark:text-gray"
	aria-label="Toggle theme"
>
	{#if isDark}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
			/>
		</svg>
	{:else}
		<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path
				stroke-linecap="round"
				stroke-linejoin="round"
				stroke-width="2"
				d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
			/>
		</svg>
	{/if}
</button>

