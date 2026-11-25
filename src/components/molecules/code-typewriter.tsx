import { useRef } from "react"

import { useTicker } from "#/hooks/use-ticker"
import { cn } from "#/lib/cn"

/** Per character, in ms. */
const TYPING_SPEED = 55

/** Ticks a fully typed snippet stays on screen. */
const HOLD_TICKS = 28

/** Empty ticks before the next snippet. */
const GAP_TICKS = 6

/** Text shown at a given tick: each snippet is typed, held, then erased. */
const visibleText = (snippets: string[], tick: number): string => {
	const durations = snippets.map(snippet => snippet.length * 2 + HOLD_TICKS + GAP_TICKS)
	let elapsed = tick % durations.reduce((total, duration) => total + duration, 0)
	let index = 0
	while (elapsed >= durations[index]) {
		elapsed -= durations[index]
		index++
	}
	const snippet = snippets[index]
	if (elapsed < snippet.length) return snippet.slice(0, elapsed + 1)
	if (elapsed < snippet.length + HOLD_TICKS) return snippet
	return snippet.slice(0, Math.max(0, snippet.length * 2 + HOLD_TICKS - elapsed))
}

/**
 * Highlights string literals in a line of code.
 *
 * @returns The line split into plain and string parts.
 */
const highlight = (code: string): { text: string, string: boolean }[] => {
	return code.split(/("[^"]*"?|'[^']*'?)/).filter(Boolean).map(text => ({ text, string: /^["']/.test(text) }))
}

type CodeTypewriterProps = {
	/** Typed in turn, e.g. "Hello world" in several languages. */
	snippets: string[]
}

/** Terminal line typing code snippets in turn. */
export const CodeTypewriter = ({ snippets }: CodeTypewriterProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const tick = useTicker(TYPING_SPEED, ref)
	const text = tick === 0 ? snippets[0] : visibleText(snippets, tick)

	const terminalClassName = cn(
		"w-full overflow-hidden px-4 py-3",
		"rounded-xl border border-line",
		"bg-bg/60",
		"font-mono text-xs whitespace-nowrap sm:text-sm"
	)

	return (
		<div ref={ref} className={terminalClassName}>
			<span className="text-coral">❯ </span>
			{highlight(text).map((part, index) => (
				<span key={index} className={part.string ? "text-emerald-600 dark:text-emerald-400" : "text-fg/80"}>{part.text}</span>
			))}
			<span className="ml-0.5 inline-block h-[1.1em] w-[0.55em] animate-pulse bg-coral/80 align-text-bottom" />
		</div>
	)
}
