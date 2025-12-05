import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

export const env = createEnv({
  server: {
    SITE_URL: z.url().endsWith("/"),
    PORT: z.coerce.number().default(3000),
  },
  runtimeEnv: process.env,

  emptyStringAsUndefined: true,
});
