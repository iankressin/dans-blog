import * as server from '../entries/pages/_page.server.ts.js';

export const index = 2;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_page.svelte.js')).default;
export { server };
export const server_id = "src/routes/+page.server.ts";
export const imports = ["_app/immutable/nodes/2.65d0a1c4.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js","_app/immutable/chunks/ContentList.52e8b25c.js","_app/immutable/chunks/paths.81ca1fb9.js"];
export const stylesheets = [];
export const fonts = [];
