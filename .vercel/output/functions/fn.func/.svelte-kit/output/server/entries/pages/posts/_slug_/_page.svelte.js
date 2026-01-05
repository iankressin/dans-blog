import { c as create_ssr_component, v as validate_component, m as missing_component } from "../../../../chunks/ssr.js";
const Article = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { content } = $$props;
  if ($$props.content === void 0 && $$bindings.content && content !== void 0)
    $$bindings.content(content);
  return `<article class="flex flex-col gap-5"><div class="flex flex-col gap-4 font-body font text-xl [&>h1]:text-2xl [&>h1]:font-bold [&>h1]:mt-2 [&>h1]:font-sans [&>h1]:text-red [&>h2]:text-xl [&>h2]:font-bold [&>h2]:mt-2 [&>h2]:font-sans [&>h2]:text-blue [&>h3]:text-lg [&>h3]:font-bold [&>h3]:mt-2 [&>h3]:font-sans [&>h3]:text-green [&>h4]:text-base [&>h4]:font-bold [&>h4]:mt-2 [&>h4]:font-sans [&>h4]:text-yellow [&>blockquote]:px-4 [&>blockquote]:border-l-4 [&>blockquote]:border-gray dark:[&>blockquote]:border-gray [&>blockquote]:italic [&>pre]:bg-dim-0 dark:[&>pre]:bg-[#2d353b] [&>pre]:p-4 [&>pre]:rounded [&>pre]:text-sm [&>pre]:text-black dark:[&>pre]:text-[#ddd8be] [&>p>code]:text-base [&>p>code]:bg-dim-0 dark:[&>p>code]:bg-[#2d353b] [&>p>code]:px-1 [&>p>code]:rounded [&>p>code]:font-mono [&>p>code]:text-olive dark:[&>p>code]:text-[#a7c080] [&>p>a]:text-blue [&>p>a]:underline [&>p>a]:underline-offset-2 [&>p>em]:text-xl [&>p>em]:text-center [&>ul>li]:list-disc [&>ul]:gap-2 [&>ul]:flex [&>ul]:flex-col [&>ul]:pl-4 [&>ol>li]:list-decimal [&>ol]:gap-2 [&>ol]:flex [&>ol]:flex-col [&>ol]:pl-4 [&>ul>li>ul]:list-[circle] [&>ul>li>ul]:px-8 [&>ul>li>p>code]:bg-dim-0 dark:[&>ul>li>p>code]:bg-[#2d353b] [&>ul>li>p>code]:p-1 [&>ul>li>p>code]:rounded [&>ul>li>p>code]:text-sm [&>ul>li>p>code]:text-black dark:[&>ul>li>p>code]:text-[#ddd8be] [&>table]:border [&>table]:border-black/20 dark:[&>table]:border-[#ddd8be]/20 [&>table]:border-collapse [&>table]:w-full [&>table]:my-4 [&>table>thead>tr>th]:border [&>table>thead>tr>th]:border-black/20 dark:[&>table>thead>tr>th]:border-[#ddd8be]/20 [&>table>thead>tr>th]:px-4 [&>table>thead>tr>th]:py-2 [&>table>thead>tr>th]:text-left [&>table>thead>tr>th]:font-bold [&>table>tbody>tr>td]:border [&>table>tbody>tr>td]:border-black/20 dark:[&>table>tbody>tr>td]:border-[#ddd8be]/20 [&>table>tbody>tr>td]:px-4 [&>table>tbody>tr>td]:py-2 ">${validate_component(content || missing_component, "svelte:component").$$render($$result, {}, {}, {})}</div></article>`;
});
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-pdgouo_START -->${$$result.title = `<title>Ian - Posts</title>`, ""}<!-- HEAD_svelte-pdgouo_END -->`, ""} ${validate_component(Article, "Article").$$render($$result, { content: data.content }, {}, {})}`;
});
export {
  Page as default
};
