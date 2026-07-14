import * as React from 'react'
import {
  AlertTriangle,
  Check,
  ClipboardPaste,
  Copy,
  ImageUp,
  Link2,
  MousePointerClick,
  RotateCcw,
  UploadCloud,
} from 'lucide-react'
import { Button } from '#/components/ui/button'
import { StarButton } from '#/components/StarButton'
import { cn } from '#/lib/utils'

type UploadResult = {
  url: string
  fileId: string
  expiresAt: number
  ttlSeconds: number
}

type UploaderState =
  | { phase: 'idle'; error?: string }
  | { phase: 'uploading'; progress: number; previewUrl: string }
  | { phase: 'done'; result: UploadResult; previewUrl: string }

export function Uploader({ maxUploadMb }: { maxUploadMb: number }) {
  const [state, setState] = React.useState<UploaderState>({ phase: 'idle' })
  const [dragging, setDragging] = React.useState(false)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const previewUrlRef = React.useRef<string | null>(null)

  const upload = React.useCallback(
    (file: File) => {
      if (!file.type.startsWith('image/')) {
        setState({ phase: 'idle', error: 'That is not an image file.' })
        return
      }
      if (file.size > maxUploadMb * 1024 * 1024) {
        setState({
          phase: 'idle',
          error: `Image is too large — max ${maxUploadMb} MB.`,
        })
        return
      }

      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
      const previewUrl = URL.createObjectURL(file)
      previewUrlRef.current = previewUrl
      setState({ phase: 'uploading', progress: 0, previewUrl })

      const form = new FormData()
      form.append('file', file)

      const xhr = new XMLHttpRequest()
      xhr.open('POST', '/api/upload')
      xhr.responseType = 'json'
      xhr.upload.onprogress = (event) => {
        if (event.lengthComputable) {
          setState({
            phase: 'uploading',
            progress: event.loaded / event.total,
            previewUrl,
          })
        }
      }
      xhr.onerror = () =>
        setState({ phase: 'idle', error: 'Upload failed — check your connection.' })
      xhr.onload = () => {
        if (xhr.status >= 200 && xhr.status < 300 && xhr.response?.url) {
          setState({ phase: 'done', result: xhr.response, previewUrl })
        } else {
          setState({
            phase: 'idle',
            error: xhr.response?.error ?? `Upload failed (${xhr.status}).`,
          })
        }
      }
      xhr.send(form)
    },
    [maxUploadMb],
  )

  const acceptFiles = React.useCallback(
    (files: FileList | null | undefined) => {
      const file = files?.[0]
      if (file) upload(file)
    },
    [upload],
  )

  // Paste anywhere on the page.
  React.useEffect(() => {
    const onPaste = (event: ClipboardEvent) => {
      const item = Array.from(event.clipboardData?.items ?? []).find((i) =>
        i.type.startsWith('image/'),
      )
      const file = item?.getAsFile()
      if (file) {
        event.preventDefault()
        upload(file)
      }
    }
    window.addEventListener('paste', onPaste)
    return () => window.removeEventListener('paste', onPaste)
  }, [upload])

  // Drag & drop anywhere on the page.
  React.useEffect(() => {
    let depth = 0
    const hasFiles = (event: DragEvent) =>
      Array.from(event.dataTransfer?.types ?? []).includes('Files')

    const onDragEnter = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth++
      setDragging(true)
    }
    const onDragOver = (event: DragEvent) => {
      if (hasFiles(event)) event.preventDefault()
    }
    const onDragLeave = (event: DragEvent) => {
      if (!hasFiles(event)) return
      depth = Math.max(0, depth - 1)
      if (depth === 0) setDragging(false)
    }
    const onDrop = (event: DragEvent) => {
      if (!hasFiles(event)) return
      event.preventDefault()
      depth = 0
      setDragging(false)
      acceptFiles(event.dataTransfer?.files)
    }

    window.addEventListener('dragenter', onDragEnter)
    window.addEventListener('dragover', onDragOver)
    window.addEventListener('dragleave', onDragLeave)
    window.addEventListener('drop', onDrop)
    return () => {
      window.removeEventListener('dragenter', onDragEnter)
      window.removeEventListener('dragover', onDragOver)
      window.removeEventListener('dragleave', onDragLeave)
      window.removeEventListener('drop', onDrop)
    }
  }, [acceptFiles])

  React.useEffect(
    () => () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    },
    [],
  )

  const reset = () => {
    if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current)
    previewUrlRef.current = null
    setState({ phase: 'idle' })
  }

  return (
    <div className="w-full max-w-xl">
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="sr-only"
        onChange={(event) => {
          acceptFiles(event.target.files)
          event.target.value = ''
        }}
      />

      {dragging && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="flex flex-col items-center gap-4 rounded-3xl border-2 border-dashed border-primary/70 bg-card/80 px-16 py-12 shadow-2xl">
            <ImageUp className="size-12 text-primary animate-bounce" />
            <p className="text-lg font-semibold">Drop it anywhere</p>
          </div>
        </div>
      )}

      {state.phase === 'idle' && (
        <Dropzone
          error={state.error}
          maxUploadMb={maxUploadMb}
          onBrowse={() => inputRef.current?.click()}
        />
      )}

      {state.phase === 'uploading' && (
        <UploadingCard progress={state.progress} previewUrl={state.previewUrl} />
      )}

      {state.phase === 'done' && (
        <ResultCard result={state.result} previewUrl={state.previewUrl} onReset={reset} />
      )}
    </div>
  )
}

function Dropzone({
  error,
  maxUploadMb,
  onBrowse,
}: {
  error?: string
  maxUploadMb: number
  onBrowse: () => void
}) {
  return (
    <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
      <button
        type="button"
        onClick={onBrowse}
        className="group relative w-full cursor-pointer rounded-3xl border-2 border-dashed border-border bg-card/50 px-8 py-14 text-center backdrop-blur transition-all duration-300 hover:border-primary/60 hover:bg-card/80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
      >
        <div className="pointer-events-none absolute inset-0 rounded-3xl opacity-0 transition-opacity duration-300 group-hover:opacity-100 bg-[radial-gradient(420px_180px_at_50%_0%,var(--glow-soft),transparent)]" />
        <div className="relative flex flex-col items-center gap-5">
          <div className="grid size-16 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[var(--accent-2)] text-primary-foreground shadow-[0_8px_30px_-6px_var(--glow)] transition-transform duration-300 group-hover:-translate-y-1 group-hover:scale-105">
            <UploadCloud className="size-8" />
          </div>
          <div className="space-y-1.5">
            <p className="text-lg font-semibold text-foreground">
              Drop an image here
            </p>
            <p className="text-sm text-muted-foreground">
              or click to browse — up to {maxUploadMb} MB
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2 text-xs text-muted-foreground">
            <Hint icon={<MousePointerClick className="size-3.5" />} label="Drag & drop" />
            <Hint icon={<ClipboardPaste className="size-3.5" />} label="Ctrl+V to paste" />
            <Hint icon={<ImageUp className="size-3.5" />} label="PNG · JPG · WebP · GIF" />
          </div>
        </div>
      </button>
      {error && (
        <p className="mt-4 flex items-center justify-center gap-2 text-sm font-medium text-destructive animate-in fade-in slide-in-from-top-1 duration-200">
          <AlertTriangle className="size-4" /> {error}
        </p>
      )}
    </div>
  )
}

function Hint({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-border/70 bg-secondary/40 px-3 py-1">
      {icon} {label}
    </span>
  )
}

function UploadingCard({
  progress,
  previewUrl,
}: {
  progress: number
  previewUrl: string
}) {
  const percent = Math.round(progress * 100)
  return (
    <div className="rounded-3xl border border-border bg-card/70 p-6 backdrop-blur animate-in fade-in zoom-in-95 duration-200">
      <div className="flex items-center gap-5">
        <img
          src={previewUrl}
          alt="Uploading preview"
          className="size-20 rounded-2xl border border-border object-cover"
        />
        <div className="min-w-0 flex-1 space-y-3">
          <p className="text-sm font-semibold">Uploading… {percent}%</p>
          <div className="h-2 overflow-hidden rounded-full bg-secondary">
            <div
              className="h-full rounded-full bg-gradient-to-r from-primary to-[var(--accent-2)] transition-[width] duration-150 ease-out"
              style={{ width: `${Math.max(4, percent)}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}

function ResultCard({
  result,
  previewUrl,
  onReset,
}: {
  result: UploadResult
  previewUrl: string
  onReset: () => void
}) {
  const remaining = useCountdown(result.expiresAt)
  const expired = remaining <= 0
  const fraction = Math.min(1, remaining / (result.ttlSeconds * 1000))

  return (
    <div className="space-y-4 animate-in fade-in zoom-in-95 duration-300">
      <div className="overflow-hidden rounded-3xl border border-border bg-card/70 backdrop-blur">
        <div className="flex items-center gap-4 border-b border-border/70 p-5">
          <img
            src={previewUrl}
            alt="Uploaded preview"
            className="size-16 rounded-xl border border-border object-cover"
          />
          <div className="min-w-0 flex-1">
            <p className="flex items-center gap-2 text-sm font-semibold">
              {expired ? (
                <>
                  <AlertTriangle className="size-4 text-destructive" /> Link expired
                </>
              ) : (
                <>
                  <span className="relative flex size-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
                    <span className="relative inline-flex size-2.5 rounded-full bg-emerald-400" />
                  </span>
                  Your link is live
                </>
              )}
            </p>
            <p className="mt-1 text-xs text-muted-foreground">
              {expired
                ? 'The image has been deleted from our servers.'
                : `Self-destructs in ${formatDuration(remaining)}`}
            </p>
          </div>
          <CountdownRing fraction={expired ? 0 : fraction} label={formatShort(remaining)} />
        </div>

        <div className="p-5">
          <div
            className={cn(
              'flex items-center gap-2 rounded-2xl border border-border bg-background/60 p-2 pl-4 transition-opacity',
              expired && 'opacity-40',
            )}
          >
            <Link2 className="size-4 shrink-0 text-muted-foreground" />
            <span className="min-w-0 flex-1 truncate font-mono text-sm" title={result.url}>
              {result.url}
            </span>
            <CopyButton value={result.url} disabled={expired} />
          </div>
        </div>
      </div>

      <div className="flex flex-col items-center justify-between gap-3 sm:flex-row">
        <Button variant="secondary" onClick={onReset}>
          <RotateCcw /> {expired ? 'Upload another' : 'New upload'}
        </Button>
        <StarButton />
      </div>
    </div>
  )
}

function CopyButton({ value, disabled }: { value: string; disabled?: boolean }) {
  const [copied, setCopied] = React.useState(false)
  const timeoutRef = React.useRef<ReturnType<typeof setTimeout>>(undefined)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(value)
    } catch {
      const textarea = document.createElement('textarea')
      textarea.value = value
      document.body.appendChild(textarea)
      textarea.select()
      document.execCommand('copy')
      textarea.remove()
    }
    setCopied(true)
    clearTimeout(timeoutRef.current)
    timeoutRef.current = setTimeout(() => setCopied(false), 1800)
  }

  React.useEffect(() => () => clearTimeout(timeoutRef.current), [])

  return (
    <Button
      onClick={copy}
      disabled={disabled}
      className={cn('min-w-28 transition-colors', copied && 'bg-emerald-500 text-white')}
    >
      {copied ? (
        <span className="flex items-center gap-2 animate-in zoom-in-75 duration-200">
          <Check /> Copied!
        </span>
      ) : (
        <span className="flex items-center gap-2">
          <Copy /> Copy link
        </span>
      )}
    </Button>
  )
}

function CountdownRing({ fraction, label }: { fraction: number; label: string }) {
  const radius = 20
  const circumference = 2 * Math.PI * radius
  return (
    <div className="relative grid size-14 shrink-0 place-items-center">
      <svg viewBox="0 0 48 48" className="size-14 -rotate-90">
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          className="stroke-secondary"
        />
        <circle
          cx="24"
          cy="24"
          r={radius}
          fill="none"
          strokeWidth="4"
          strokeLinecap="round"
          className="stroke-primary transition-[stroke-dashoffset] duration-1000 ease-linear"
          strokeDasharray={circumference}
          strokeDashoffset={circumference * (1 - fraction)}
        />
      </svg>
      <span className="absolute font-mono text-[10px] font-bold tabular-nums">{label}</span>
    </div>
  )
}

function useCountdown(expiresAt: number) {
  const [remaining, setRemaining] = React.useState(() => expiresAt - Date.now())
  React.useEffect(() => {
    const tick = () => setRemaining(Math.max(0, expiresAt - Date.now()))
    tick()
    const interval = setInterval(tick, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])
  return remaining
}

function formatDuration(ms: number): string {
  const total = Math.ceil(ms / 1000)
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  if (minutes === 0) return `${seconds}s`
  return `${minutes}m ${seconds.toString().padStart(2, '0')}s`
}

function formatShort(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000))
  const minutes = Math.floor(total / 60)
  const seconds = total % 60
  return `${minutes}:${seconds.toString().padStart(2, '0')}`
}
