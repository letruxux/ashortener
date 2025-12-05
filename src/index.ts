import { Elysia } from "elysia";
import z from "zod";
import { generateShort, shorturlSchema } from "./hash";
import { env } from "./env";
import { getUrl, setUrl } from "./db";

new Elysia()
  .get("/", 'POST / with {"url": "https://abc.com"} to shorten an url')
  .post("/", async ({ body }) => {
    const { success, data } = z
      .object({ url: z.url({ pattern: /^https?:\/\/.+/ }) })
      .safeParse(body);
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
