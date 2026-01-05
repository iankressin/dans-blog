import { j as json } from "../../../../chunks/index.js";
async function getEssays() {
  let essays = [];
  const paths = /* @__PURE__ */ Object.assign({});
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
      essays.push(post);
    }
  }
  essays = essays.sort(
    (first, second) => new Date(second.date).getTime() - new Date(first.date).getTime()
  );
  return essays;
}
async function GET() {
  return json(await getEssays());
}
export {
  GET
};
