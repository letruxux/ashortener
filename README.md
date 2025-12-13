# AShortener

```bash
docker run -d -p 3000:3000 -v <empty folder here>:/app/db -e SITE_URL=http://localhost:3000/ -e PORT=3000 ghcr.io/letruxux/ashortener:latest
```

## stack

Backend:
* Bun
* Elysiajs
* SQLite
* Zod

Frontend:
* Vite
* React
* Tailwind
* DaisyUI
