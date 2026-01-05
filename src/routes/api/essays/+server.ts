import { json } from '@sveltejs/kit';
import type { Content } from '$lib/types';

async function getEssays() {
	let essays: Content[] = [];

	const paths = import.meta.glob('../../../essays/*.md', {
		eager: true
	});

	for (const path in paths) {
		const file = paths[path];
		const title = path.split('/').at(-1)?.replace('.md', '');

		if (!title) continue;

		const slug = title.replaceAll(' ', '_');

		if (file && typeof file === 'object' && 'metadata' in file && slug) {
			const metadata = file.metadata as Omit<Content, 'slug'>;
			metadata.title = title;
			const post = { ...metadata, slug } satisfies Content;
			essays.push(post);
		}
	}

	essays = essays.sort(
		(first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
	);

	return essays;
}

export async function GET() {
	return json(await getEssays());
}
