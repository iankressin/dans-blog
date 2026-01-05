import { _ as __vite_glob_0_0 } from "../../../../chunks/Cracking Solidity Storage With Assembly.js";
import { _ as __vite_glob_0_1 } from "../../../../chunks/How EQL is different from Dune.js";
import { j as json } from "../../../../chunks/index.js";
async function getPosts() {
  let posts = [];
  const paths = /* @__PURE__ */ Object.assign({
    "../../../posts/Cracking Solidity Storage With Assembly.md": __vite_glob_0_0,
    "../../../posts/How EQL is different from Dune.md": __vite_glob_0_1
  });
  for (const path in paths) {
    const file = paths[path];
    const title = path.split("/").at(-1)?.replace(".md", "");
    if (!title)
      continue;
    const slug = title.replaceAll(" ", "_");
    if (file && typeof file === "object" && "metadata" in file && slug) {
      const metadata = file.metadata;
      metadata.title = title;
      const post = { ...metadata, slug };
      posts.push(post);
    }
  }
  posts = posts.sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return posts;
}
async function GET() {
  return json(await getPosts());
}
export {
  GET
};
