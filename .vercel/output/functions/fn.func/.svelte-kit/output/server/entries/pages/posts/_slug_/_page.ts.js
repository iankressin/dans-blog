import { e as error } from "../../../../chunks/index.js";
const __variableDynamicImportRuntimeHelper = (glob, path) => {
  const v = glob[path];
  if (v) {
    return typeof v === "function" ? v() : Promise.resolve(v);
  }
  return new Promise((_, reject) => {
    (typeof queueMicrotask === "function" ? queueMicrotask : setTimeout)(reject.bind(null, new Error("Unknown variable dynamic import: " + path)));
  });
};
async function load({ params }) {
  try {
    const slug = `${params.slug.replaceAll("_", " ")}`;
    const post = await __variableDynamicImportRuntimeHelper(/* @__PURE__ */ Object.assign({ "../../../posts/Cracking Solidity Storage With Assembly.md": () => import("../../../../chunks/Cracking Solidity Storage With Assembly.js").then((n) => n._), "../../../posts/How EQL is different from Dune.md": () => import("../../../../chunks/How EQL is different from Dune.js").then((n) => n._) }), `../../../posts/${slug}.md`);
    return {
      content: post.default,
      meta: post.metadata
    };
  } catch (e) {
    throw error(404, `Could not find ${params.slug}`);
  }
}
export {
  load
};
