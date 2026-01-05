<script lang="ts">
	import '../app.css';
	import '../syntax.css';
	import Footer from '$lib/components/Footer.svelte';
	import Header from '$lib/components/Header.svelte';
</script>

<div class="flex justify-center bg-dim-1 dark:bg-[#232a2e] text-white dark:text-[#ddd8be] min-h-screen w-full pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]">
	<div class="h-full w-full laptop:max-w-4xl py-8 px-8 laptop:px-20 flex flex-col gap-16">
		<Header />

		<main>
			<slot />
		</main>

		<Footer />
	</div>
</div>

<style>
</style>
