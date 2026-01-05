import * as universal from '../entries/pages/posts/_page.ts.js';

export const index = 4;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/+page.ts";
export const imports = ["_app/immutable/nodes/4.ab969916.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js","_app/immutable/chunks/ContentList.52e8b25c.js","_app/immutable/chunks/paths.81ca1fb9.js"];
export const stylesheets = [];
export const fonts = [];
