

export const index = 1;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/fallbacks/error.svelte.js')).default;
export const imports = ["_app/immutable/nodes/1.48411cc2.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js","_app/immutable/chunks/singletons.88c20fd6.js","_app/immutable/chunks/paths.81ca1fb9.js"];
export const stylesheets = [];
export const fonts = [];
