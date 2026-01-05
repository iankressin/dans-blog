import { error } from '@sveltejs/kit';

/* @vite-ignore */
export async function load({ params }) {
	try {
		const slug = `${params.slug.replaceAll('_', ' ')}`;
		const post = await import(`../../../posts/${slug}.md`);

		return {
			content: post.default,
			meta: post.metadata
		};
	} catch (e) {
		throw error(404, `Could not find ${params.slug}`);
	}
}

