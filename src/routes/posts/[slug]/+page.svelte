<script lang="ts">
	import Article from '$lib/components/Article.svelte';
	export let data;
</script>

<svelte:head>
	<title>Ian - Posts</title>
</svelte:head>

<Article content={data.content} />

