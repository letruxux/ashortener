import { Elysia } from "elysia";
import { generateShort, shorturlSchema, validUrlSchema } from "./hash";
import { env } from "./env";
import { getUrl, setUrl } from "./db";
import cors from "@elysiajs/cors";

const isDev = process.argv.includes("--dev");

const app = new Elysia();

if (isDev) app.use(cors());

app.get(
  "/",
  new Response(await Bun.file("dist/index.html").text(), {
    headers: { "Content-Type": "text/html" },
  })
);

app.post("/", async ({ body }) => {
  const { success, data } = validUrlSchema.safeParse(body);
  if (!success) return new Response(null, { status: 400 });

  const short = await generateShort(data.url);
  setUrl(short, data.url);

  return new Response(JSON.stringify({ url: env.SITE_URL + short }), { status: 200 });
});

app.get("/:id", ({ params: { id: _id } }) => {
  const { success, data: id } = shorturlSchema.safeParse(_id);
  if (!success) return new Response(null, { status: 400 });

  const url = getUrl(id);
  if (!url) return new Response(null, { status: 404 });

  if (_id.endsWith("+")) {
    return new Response(null, {
      status: 302,
      headers: {
        Location: `${env.SITE_URL}?url=${encodeURIComponent(
          id
        )}&destination=${encodeURIComponent(url)}`,
      },
    });
  }

  return new Response(null, {
    status: 301,
    headers: { Location: url },
  });
});

app.listen(env.PORT);
