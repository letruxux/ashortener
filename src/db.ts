import Database from "bun:sqlite";
import fs from "fs";

if (!fs.existsSync("./db")) fs.mkdirSync("./db");
const db = new Database("./db/db.sqlite", { create: true, strict: true });

db.run(`
CREATE TABLE IF NOT EXISTS urls (
  id TEXT PRIMARY KEY,
  url TEXT NOT NULL
);
`);

export function getUrl(id: string) {
  const stmt = db.prepare<{ url: string }, { id: string }>(
    "SELECT url FROM urls WHERE id = :id"
  );
  const row = stmt.get({ id });
  return row ? row.url : null;
}

export function setUrl(id: string, url: string) {
  const result = db.run(`INSERT OR REPLACE INTO urls (id, url) VALUES (?, ?)`, [id, url]);
  return result.changes > 0;
}
