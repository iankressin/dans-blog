import * as universal from '../entries/pages/posts/_slug_/_page.ts.js';

export const index = 5;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/posts/_slug_/_page.svelte.js')).default;
export { universal };
export const universal_id = "src/routes/posts/[slug]/+page.ts";
export const imports = ["_app/immutable/nodes/5.5bb3e38b.js","_app/immutable/chunks/preload-helper.a4192956.js","_app/immutable/chunks/control.f5b05b5f.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js"];
export const stylesheets = [];
export const fonts = [];
