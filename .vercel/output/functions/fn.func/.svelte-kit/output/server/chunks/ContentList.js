import { c as create_ssr_component, d as each, f as add_attribute, e as escape } from "./ssr.js";
const ContentList = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { list } = $$props;
  if ($$props.list === void 0 && $$bindings.list && list !== void 0)
    $$bindings.list(list);
  return ` <section class="flex flex-col gap-8"><ul class="flex flex-col gap-12">${each(list, (content) => {
    return `<a${add_attribute("href", `/posts/${content.slug}`, 0)} class="title"><li class="flex flex-col gap-3"><h1 class="font-semibold text-lg leading-none">${escape(content.title)}</h1> ${content.description ? `<p class="text-sm leading-none text-black/70 dark:text-[#ddd8be]/70">${escape(content.description)}</p>` : ``} <div class="tags flex gap-2">${each(content.tags, (category) => {
      return `<div class="${[
        "rounded-full flex items-center justify-center",
        (category == "final" ? "bg-green" : "") + " " + (category != "final" ? "bg-yellow" : "")
      ].join(" ").trim()}"><span class="px-2 py-1 text-sm cursor-pointer text-dim-0 dark:text-[#2d353b] leading-tight">${escape(category.replace("#", ""))}</span> </div>`;
    })} <p class="italic text-sm">Publish at ${escape(content.date)}</p> </div></li> </a>`;
  })}</ul></section>`;
});
export {
  ContentList as C
};
