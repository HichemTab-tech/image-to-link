// noinspection SpellCheckingInspection

import {createFileRoute} from '@tanstack/react-router'
import {Check, Link2} from 'lucide-react'

export const Route = createFileRoute('/og')({component: OgPreview})

// Temporary: a 1200x628 canvas to screenshot as the og:image, pinned over
// the normal layout. Open /og in a 1200x628 viewport and screenshot.

const SAMPLE_IMAGE =
    "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 200 200'%3E%3Cdefs%3E%3ClinearGradient id='s' x1='0' y1='0' x2='0' y2='1'%3E%3Cstop offset='0' stop-color='%23f6c453'/%3E%3Cstop offset='.55' stop-color='%23e8865a'/%3E%3Cstop offset='1' stop-color='%23d6482f'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='200' height='200' fill='url(%23s)'/%3E%3Ccircle cx='100' cy='86' r='34' fill='%23fdf8ec'/%3E%3Cpath d='M0 200 L62 108 L104 162 L138 124 L200 200 Z' fill='%2326211a' opacity='.85'/%3E%3C/svg%3E"

const GRAIN =
    "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='240' height='240'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.05'/%3E%3C/svg%3E\")"

function OgPreview() {
    return (
        <div className="fixed left-0 top-0 z-60 flex h-157 w-300 items-center overflow-hidden bg-paper">
            <div
                className="pointer-events-none absolute inset-0 opacity-55"
                style={{backgroundImage: GRAIN}}
            />

            {/* Corner crop marks */}
            <span className="crop-mark tl" aria-hidden/>
            <span className="crop-mark tr" aria-hidden/>
            <span className="crop-mark bl" aria-hidden/>
            <span className="crop-mark br" aria-hidden/>

            {/* Left: brand + headline */}
            <div className="relative z-10 flex-1 space-y-8 pl-20 pr-6">
                <div className="flex items-center gap-4">
          <span
              className="grid size-12 place-items-center rounded-xl border-2 border-ink bg-stamp text-paper-bright shadow-[3px_3px_0_var(--ink)]">
            <Link2 className="size-6"/>
          </span>
                    <span className="font-serif text-3xl font-bold tracking-tight text-ink">
            image<span className="text-stamp">→</span>link
          </span>
                </div>

                <h1 className="font-serif text-[76px] font-bold leading-[1.02] tracking-tight text-ink">
                    Image in.
                    <br/>
                    Link out. <em className="font-medium italic text-stamp">Poof.</em>
                </h1>

                <div className="space-y-4">
                    <p className="max-w-md text-lg leading-relaxed text-muted-foreground">
                        Shareable image links that self-destruct after 5 minutes.
                    </p>
                    <span
                        className="label-caps inline-flex items-center rounded-full border-2 border-ink bg-paper-bright px-5 py-2 text-sm text-muted-foreground shadow-[2px_2px_0_var(--ink)]">
            No account · No tracking · Auto-shredded
          </span>
                </div>
            </div>

            {/* Right: the ticket */}
            <div className="relative z-10 w-120 shrink-0 pr-16">
                <div className="plate rotate-2">
                    <div className="flex items-center gap-5 p-6 pb-7">
                        <div className="polaroid relative shrink-0">
                            <span className="tape" aria-hidden/>
                            <img src={SAMPLE_IMAGE} alt="" className="size-24 object-cover"/>
                        </div>
                        <div className="min-w-0 flex-1">
                            <p className="label-caps flex items-center gap-2 whitespace-nowrap text-[13px] text-ink">
                                <span className="size-3 rounded-full border border-ink bg-seal"/>
                                Link is live
                            </p>
                            <p className="mt-2 whitespace-nowrap text-sm text-muted-foreground">
                                Gone in 4m 32s
                            </p>
                        </div>
                        <CountdownRing/>
                    </div>

                    <div className="tear-line p-6">
                        <div className="flex items-center gap-3 rounded-lg border-2 border-ink bg-paper p-2 pl-4">
                            <Link2 className="size-5 shrink-0 text-muted-foreground"/>
                            <span className="min-w-0 flex-1 truncate text-[15px]">
                img.link/x7Kd.png
              </span>
                            <span
                                className="inline-flex h-11 shrink-0 items-center gap-2 rounded-lg border-2 border-ink bg-seal px-4 text-sm font-bold uppercase tracking-wider text-paper-bright shadow-[3px_3px_0_var(--ink)]">
                <Check className="size-4"/> Copied!
              </span>
                        </div>
                    </div>
                </div>

                <span className="rubber-stamp stamp-in absolute -top-7 right-10 z-20 text-sm">
          Expires · 5 min
        </span>
            </div>
        </div>
    )
}

function CountdownRing() {
    const radius = 20
    const circumference = 2 * Math.PI * radius
    return (
        <div className="relative grid size-16 shrink-0 place-items-center">
            <svg viewBox="0 0 48 48" className="size-16 -rotate-90">
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    strokeWidth="3"
                    strokeDasharray="2.5 5"
                    strokeLinecap="round"
                    className="stroke-ink/25"
                />
                <circle
                    cx="24"
                    cy="24"
                    r={radius}
                    fill="none"
                    strokeWidth="4"
                    strokeLinecap="round"
                    className="stroke-stamp"
                    strokeDasharray={circumference}
                    strokeDashoffset={circumference * 0.095}
                />
            </svg>
            <span className="absolute text-xs font-bold tabular-nums text-stamp">4:32</span>
        </div>
    )
}
