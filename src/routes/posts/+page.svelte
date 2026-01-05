<script lang="ts">
	import ContentList from '$lib/components/ContentList.svelte';

	export let data;
</script>

<svelte:head>
	<title>Ian - Posts</title>
</svelte:head>

<!-- Posts -->
<ContentList list={data.posts} />

