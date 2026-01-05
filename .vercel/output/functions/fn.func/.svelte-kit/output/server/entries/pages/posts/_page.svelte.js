import { c as create_ssr_component, v as validate_component } from "../../../chunks/ssr.js";
import { C as ContentList } from "../../../chunks/ContentList.js";
const Page = create_ssr_component(($$result, $$props, $$bindings, slots) => {
  let { data } = $$props;
  if ($$props.data === void 0 && $$bindings.data && data !== void 0)
    $$bindings.data(data);
  return `${$$result.head += `<!-- HEAD_svelte-pdgouo_START -->${$$result.title = `<title>Ian - Posts</title>`, ""}<!-- HEAD_svelte-pdgouo_END -->`, ""}  ${validate_component(ContentList, "ContentList").$$render($$result, { list: data.posts }, {}, {})}`;
});
export {
  Page as default
};
