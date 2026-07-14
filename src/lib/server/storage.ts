import { randomBytes } from 'node:crypto'
import { mkdir, readdir, rm, stat, writeFile } from 'node:fs/promises'
import { createReadStream } from 'node:fs'
import { Readable } from 'node:stream'
import path from 'node:path'

export const TTL_SECONDS = Math.max(
  10,
  Number(process.env.LINK_TTL_SECONDS ?? 300),
)
export const MAX_UPLOAD_MB = Math.max(
  1,
  Number(process.env.MAX_UPLOAD_MB ?? 10),
)
const CLEANUP_INTERVAL_SECONDS = Math.max(
  5,
  Number(process.env.CLEANUP_INTERVAL_SECONDS ?? 30),
)
const UPLOAD_DIR = path.resolve(process.env.UPLOAD_DIR ?? './uploads')

const EXTENSION_BY_MIME: Record<string, string> = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/webp': 'webp',
  'image/gif': 'gif',
  'image/avif': 'avif',
  'image/svg+xml': 'svg',
}

const MIME_BY_EXTENSION = Object.fromEntries(
  Object.entries(EXTENSION_BY_MIME).map(([mime, ext]) => [ext, mime]),
)

const FILE_ID_PATTERN = /^[A-Za-z0-9_-]{8,32}\.[a-z0-9]{2,5}$/

export function isSupportedImageType(mime: string): boolean {
  return mime in EXTENSION_BY_MIME
}

export function supportedMimeTypes(): Array<string> {
  return Object.keys(EXTENSION_BY_MIME)
}

async function ensureUploadDir() {
  await mkdir(UPLOAD_DIR, { recursive: true })
}

export async function saveImage(
  file: File,
): Promise<{ fileId: string; expiresAt: number }> {
  const ext = EXTENSION_BY_MIME[file.type]
  if (!ext) throw new Error(`Unsupported image type: ${file.type}`)

  await ensureUploadDir()
  const fileId = `${randomBytes(9).toString('base64url')}.${ext}`
  const bytes = Buffer.from(await file.arrayBuffer())
  await writeFile(path.join(UPLOAD_DIR, fileId), bytes)
  return { fileId, expiresAt: Date.now() + TTL_SECONDS * 1000 }
}

export async function openImage(fileId: string): Promise<{
  stream: ReadableStream
  mime: string
  size: number
  expiresAt: number
} | null> {
  if (!FILE_ID_PATTERN.test(fileId)) return null
  const mime = MIME_BY_EXTENSION[fileId.split('.').at(-1)!]
  if (!mime) return null

  const filePath = path.join(UPLOAD_DIR, fileId)
  let info
  try {
    info = await stat(filePath)
  } catch {
    return null
  }

  const expiresAt = info.mtimeMs + TTL_SECONDS * 1000
  if (expiresAt <= Date.now()) {
    rm(filePath, { force: true }).catch(() => {})
    return null
  }

  return {
    stream: Readable.toWeb(createReadStream(filePath)) as ReadableStream,
    mime,
    size: info.size,
    expiresAt,
  }
}

export async function sweepExpired(): Promise<number> {
  let entries: Array<string>
  try {
    entries = await readdir(UPLOAD_DIR)
  } catch {
    return 0
  }

  const now = Date.now()
  let removed = 0
  await Promise.all(
    entries.map(async (name) => {
      if (!FILE_ID_PATTERN.test(name)) return
      const filePath = path.join(UPLOAD_DIR, name)
      try {
        const info = await stat(filePath)
        if (info.mtimeMs + TTL_SECONDS * 1000 <= now) {
          await rm(filePath, { force: true })
          removed++
        }
      } catch {
        // File may have been removed concurrently; nothing to do.
      }
    }),
  )
  return removed
}

// Background cleanup "cron". Guarded on globalThis so dev-server HMR
// doesn't stack multiple intervals.
const SWEEP_KEY = Symbol.for('image-to-link.sweeper')
const globalStore = globalThis as { [SWEEP_KEY]?: ReturnType<typeof setInterval> }
if (!globalStore[SWEEP_KEY]) {
  globalStore[SWEEP_KEY] = setInterval(() => {
    sweepExpired().catch(() => {})
  }, CLEANUP_INTERVAL_SECONDS * 1000)
  globalStore[SWEEP_KEY].unref?.()
}
