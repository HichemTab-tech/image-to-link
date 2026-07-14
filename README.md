# image→link

![image-to-link banner](public/meta.png)

Drop, paste or upload an image — get a shareable link instantly. Links
self-destruct after a few minutes (5 by default) and the image is deleted
from disk by a background sweeper.

Built with [TanStack Start](https://tanstack.com/start), React 19,
Tailwind CSS v4 and shadcn-style components.

Made by [HichemTab-tech](https://github.com/HichemTab-tech).

## Why?

Sometimes you just need an image to *be a URL* for a few minutes:

- **Feeding a screenshot to a CLI AI agent** (Claude Code, etc.) — instead of
  saving a file, finding its path, and worrying about what the agent can
  access, paste the screenshot here and hand the agent a plain URL it can
  fetch.
- **Testing** anything that consumes an image URL — og:image tags, webhooks,
  Markdown previews — with a real, temporary link.

No account, no gallery, no cleanup to remember: the link dies on its own and
the file is deleted.

## Features

- **Three ways in** — drag & drop anywhere on the page, `Ctrl+V` paste, or
  click to browse.
- **Instant links** — upload with live progress, copy with one click.
- **Self-destructing** — every link expires after `LINK_TTL_SECONDS`
  (default 300s). Expired images are deleted by an in-process sweeper and
  also lazily on access.
- **No accounts, no tracking.**

## Development

```bash
pnpm install
pnpm dev        # http://localhost:3131
```

## Production (Docker)

```bash
cp .env.example .env   # tweak if you like
docker compose up --build -d
```

Uploads are stored in the `uploads` named volume (`/data/uploads` in the
container).

### Environment variables

| Variable                   | Default                        | Description                                          |
|----------------------------|--------------------------------|------------------------------------------------------|
| `PORT`                     | `3131`                         | Host port published by docker compose                |
| `LINK_TTL_SECONDS`         | `300`                          | How long a link stays alive                          |
| `MAX_UPLOAD_MB`            | `10`                           | Maximum accepted image size                          |
| `MAX_STORAGE_MB`           | `500`                          | Total storage budget; uploads are rejected when full |
| `CLEANUP_INTERVAL_SECONDS` | `30`                           | How often the expired-image sweeper runs             |
| `UPLOAD_DIR`               | `./uploads`                    | Where images are stored on disk                      |
| `PUBLIC_BASE_URL`          | _(empty)_                      | Public origin for generated links (behind a proxy)   |
| `VITE_GITHUB_REPO`         | `HichemTab-tech/image-to-link` | Repo linked from the star button (build-time)        |

## API

- `POST /api/upload` — multipart form with a `file` field. Returns
  `{ url, fileId, expiresAt, ttlSeconds }`.
- `GET /i/:file` — serves the image until it expires, then `404`.

Supported types: PNG, JPEG, WebP, GIF, AVIF, SVG.
