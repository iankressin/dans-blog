

export const index = 0;
let component_cache;
export const component = async () => component_cache ??= (await import('../entries/pages/_layout.svelte.js')).default;
export const imports = ["_app/immutable/nodes/0.1f41d39e.js","_app/immutable/chunks/scheduler.e108d1fd.js","_app/immutable/chunks/index.b97aa178.js"];
export const stylesheets = ["_app/immutable/assets/0.b05ff119.css"];
export const fonts = ["_app/immutable/assets/eb-garamond-cyrillic-ext-wght-normal.90061794.woff2","_app/immutable/assets/eb-garamond-cyrillic-wght-normal.575db5f4.woff2","_app/immutable/assets/eb-garamond-greek-ext-wght-normal.b47194d9.woff2","_app/immutable/assets/eb-garamond-greek-wght-normal.fa7f6216.woff2","_app/immutable/assets/eb-garamond-vietnamese-wght-normal.5bb9c1bf.woff2","_app/immutable/assets/eb-garamond-latin-ext-wght-normal.0c2688cd.woff2","_app/immutable/assets/eb-garamond-latin-wght-normal.d148d291.woff2"];
