<script lang="ts">
	import { page } from '$app/stores';
	import type { Content } from '$lib/types';

	export let list: Content[];
</script>

<!-- Posts -->
<section class="flex flex-col gap-8">
	<ul class="flex flex-col gap-12">
		{#each list as content}
			<a href={`/posts/${content.slug}`} class="title">
				<li class="flex flex-col gap-3">
					<h1 class="font-semibold text-lg leading-none">{content.title}</h1>
					{#if content.description}
						<p class="text-sm leading-none text-black/70 dark:text-[#ddd8be]/70">{content.description}</p>
					{/if}
					<div class="tags flex gap-2">
						{#each content.tags as category}
							<div
								class="rounded-full flex items-center justify-center"
								class:bg-green={category == 'final'}
								class:bg-yellow={category != 'final'}
							>
							<span class="px-2 py-1 text-sm cursor-pointer text-dim-0 dark:text-[#2d353b] leading-tight"
								>{category.replace('#', '')}</span
							>
							</div>
						{/each}
						<p class="italic text-sm">Publish at {content.date}</p>
					</div>
				</li>
			</a>
		{/each}
	</ul>
</section>
