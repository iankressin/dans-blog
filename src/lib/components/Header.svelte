<script lang="ts">
	import ThemeToggle from './ThemeToggle.svelte';
</script>

<div class="">
	<div class="flex flex-col items-center gap-2 tablet:flex-row tablet:justify-between">
		<div class="font-heading font-semibold text-2xl">
			<a href="/"> Dan Quirk </a>
		</div>
		<div class="flex items-center gap-6">
			<ul class="flex gap-10 text-gray dark:text-gray">
				<li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors"><a href="/posts">Posts</a></li>
				<li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors">
					<a href="https://www.linkedin.com/in/dan-quirk-71258811/" target="_blank">LinkedIn</a>
				</li>
				<li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors">
					<a href="https://x.com/kureus_" target="_blank">X</a>
				</li>
			</ul>
			<ThemeToggle />
		</div>
	</div>
</div>
