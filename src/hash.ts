import z from "zod";

const BASE62 = "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ";

function bytesToBase62(bytes: Uint8Array): string {
  let value = BigInt(0);
  for (const b of bytes) value = (value << BigInt(8)) + BigInt(b);

  let out = "";
  while (value > 0n) {
    out = BASE62[Number(value % 62n)] + out;
    value /= 62n;
  }
  return out || "0";
}

export async function generateShort(url: string, length = 6) {
  const enc = new TextEncoder().encode(url);
  const hash = await crypto.subtle.digest("SHA-256", enc);
  const bytes = new Uint8Array(hash);

  const base62 = bytesToBase62(bytes);
  return base62.slice(0, length);
}

export const shorturlSchema = z
  .string()
  .regex(/^[0-9a-zA-Z]{6}$/)
  .or(z.string().regex(/^[0-9a-zA-Z]{6}\+$/))
  .transform((s) => s.replace(/\+$/, ""));

/* literally random stuff just to hope it never collides */
