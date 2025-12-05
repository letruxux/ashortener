import { Elysia, file } from "elysia";
import { generateShort, shorturlSchema, validUrlSchema } from "./hash";
import { env } from "./env";
import { getUrl, setUrl } from "./db";
import path from "path";
import cors from "@elysiajs/cors";

console.log(path.join(process.cwd(), "dist"));

new Elysia()
  .use(cors())
  .get("/", file("dist/index.html"))
  .post("/", async ({ body }) => {
    const { success, data } = validUrlSchema.safeParse(body);
    if (!success) return new Response(null, { status: 400 });

    const short = await generateShort(data.url);
    setUrl(short, data.url);

    return new Response(JSON.stringify({ url: env.SITE_URL + short }), { status: 200 });
  })
  .get("/:id", ({ params: { id: _id } }) => {
    const { success, data: id } = shorturlSchema.safeParse(_id);
    if (!success) return new Response(null, { status: 400 });

    const url = getUrl(id);
    if (!url) return new Response(null, { status: 404 });

    if (_id.endsWith("+")) {
      return new Response(
        `<html><body><a href="${env.SITE_URL + id}">${
          env.SITE_URL + id
        }</a> redirects to <a href="${url}">${url}</a></body></html>`,
        { status: 200, headers: { "Content-Type": "text/html" } }
      );
    }

    return new Response(null, {
      status: 301,
      headers: { Location: url },
    });
  })
  .listen(env.PORT);
