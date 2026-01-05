

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.52e9111f.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js","_app/immutable/chunks/singletons.6c970f2a.js","_app/immutable/chunks/paths.f212eb73.js"];
export const stylesheets = [];
export const fonts = [];
