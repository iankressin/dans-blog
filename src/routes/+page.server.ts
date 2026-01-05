import type { Content } from '$lib/types';

export async function load({ fetch }): Promise<{ posts: Content[] }> {
	const response = await fetch('api/posts');
	const posts: Content[] = await response.json();
	return { posts };
}
