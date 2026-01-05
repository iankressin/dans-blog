import { c as create_ssr_component, v as validate_component } from "../../chunks/ssr.js";
const app = "";
const syntax = "";
const Footer = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div></div>`;
});
const ThemeToggle = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<button class="p-2 rounded hover:bg-dim-0 dark:hover:bg-[#2d353b] transition-colors text-gray dark:text-gray" aria-label="Toggle theme">${`<svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"></path></svg>`}</button>`;
});
const Header = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class=""><div class="flex flex-col items-center gap-2 tablet:flex-row tablet:justify-between"><div class="font-heading font-semibold text-2xl" data-svelte-h="svelte-1m3lzzm"><a href="/">Dan Quirk</a></div> <div class="flex items-center gap-6"><ul class="flex gap-10 text-gray dark:text-gray" data-svelte-h="svelte-bkcr8y"><li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors"><a href="/posts">Posts</a></li> <li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors"><a href="https://www.linkedin.com/in/dan-quirk-71258811/" target="_blank">LinkedIn</a></li> <li class="hover:text-white dark:hover:text-[#ddd8be] transition-colors"><a href="https://x.com/kureus_" target="_blank">X</a></li></ul> ${validate_component(ThemeToggle, "ThemeToggle").$$render($$result, {}, {}, {})}</div></div></div>`;
});
const Layout = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  return `<div class="flex justify-center bg-dim-1 dark:bg-[#232a2e] text-white dark:text-[#ddd8be] h-full min-h-screen"><div class="h-full w-full laptop:max-w-4xl py-8 px-8 laptop:px-20 flex flex-col gap-16">${validate_component(Header, "Header").$$render($$result, {}, {}, {})} <main>${slots.default ? slots.default({}) : ``}</main> ${validate_component(Footer, "Footer").$$render($$result, {}, {}, {})}</div> </div>`;
});
export {
  Layout as default
};
