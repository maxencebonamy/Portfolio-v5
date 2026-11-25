import { Link, useNavigate, useRouterState } from "@tanstack/react-router"
import { motion } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { WindowBar } from "#/components/molecules/window-bar"
import { site } from "#/content/site"
import { useGoToSection } from "#/hooks/use-go-to-section"
import { cn } from "#/lib/cn"
import { localizePath } from "#/lib/i18n"
import { EASE } from "#/lib/motion"
import type { TerminalEffect } from "#/lib/terminal-commands"
import { runTerminalCommand } from "#/lib/terminal-commands"
import { useI18n } from "#/providers/i18n-provider"

/** Between lines, in s. */
const LINE_DELAY = 0.12

const MAX_HISTORY = 6

/** A typed command and its output. */
type HistoryEntry = {
	id: number
	command: string
	output: string[]
}

type NotFoundTerminalProps = {
	className?: string
}

/**
 * Terminal showing the failed request, with links to existing pages.
 * Easter egg: the prompt is a tiny working shell (`help`, `ls`, `cd`, `whoami`...).
 */
export const NotFoundTerminal = ({ className }: NotFoundTerminalProps) => {
	const { t, lang, langParam } = useI18n()
	const navigate = useNavigate()
	const goToSection = useGoToSection()
	const pathname = useRouterState({ select: state => state.location.pathname })
	const host = site.url.replace(/^https?:\/\//, "")
	const inputRef = useRef<HTMLInputElement>(null)
	const bodyRef = useRef<HTMLDivElement>(null)
	const nextId = useRef(0)
	const [ input, setInput ] = useState("")
	const [ focused, setFocused ] = useState(false)
	const [ history, setHistory ] = useState<HistoryEntry[]>([])
	const [ cleared, setCleared ] = useState(false)

	// Keeps the prompt in view as commands pile up.
	useEffect(() => {
		const body = bodyRef.current
		if (body) body.scrollTop = body.scrollHeight
	}, [ history ])

	const suggestions = [
		{ to: "/{-$lang}", path: localizePath("/", lang), label: t("nav.home") },
		{ to: "/{-$lang}/projects", path: localizePath("/projects", lang), label: t("nav.allProjects") }
	] as const

	/** Applies a command's effect. */
	const applyEffect = (effect: TerminalEffect): void => {
		if (effect.type === "clear") {
			setHistory([])
			setCleared(true)
		} else if (effect.type === "page") void navigate({ to: effect.to === "/" ? "/{-$lang}" : "/{-$lang}/projects", params: { lang: langParam } })
		else if (effect.type === "project") void navigate({ to: "/{-$lang}/projects/$slug", params: { lang: langParam, slug: effect.slug } })
		else goToSection(effect.id)
	}

	/** Runs the typed command and prints it with its output. */
	const submit = (): void => {
		const { output, effect } = runTerminalCommand(input, { t, lang })
		const entry = { id: nextId.current++, command: input, output }
		setHistory(entries => [ ...entries, entry ].slice(-MAX_HISTORY))
		setInput("")
		if (effect) applyEffect(effect)
	}

	const windowClassName = cn(
		"flex flex-col overflow-hidden",
		"rounded-xl border border-white/10",
		"bg-[#111] shadow-2xl",
		className
	)

	const bodyClassName = cn(
		"flex max-h-[22rem] cursor-text flex-col gap-2 overflow-y-auto overscroll-contain p-5 md:max-h-[24rem] md:p-6",
		"font-mono text-xs text-[#ebebeb] md:text-sm"
	)

	const linkClassName = cn(
		"group flex items-center gap-3",
		"rounded-md -mx-2 px-2 py-1",
		"transition-colors hover:bg-white/5"
	)

	// 16px on phones: iOS zooms in on focus for smaller inputs.
	const inputClassName = cn(
		"min-w-0 flex-1",
		"bg-transparent outline-none",
		"text-base md:text-sm",
		"caret-coral placeholder:text-white/25"
	)

	const intro = cleared
		? []
		: [
			<p key="request" className="break-all">
				<span className="text-coral">$ </span>
				{`curl -I ${host}${pathname}`}
			</p>,
			<p key="status">
				<span className="font-semibold text-coral">HTTP/2 404</span>
				<span className="text-white/50"> Not Found</span>
			</p>,
			<p key="hint" className="mt-2 text-white/40">{`# ${t("notFound.terminalHint")}`}</p>,
			...suggestions.map(suggestion => (
				<Link key={suggestion.to} to={suggestion.to} params={{ lang: langParam }} className={linkClassName}>
					<span className="text-coral transition-transform duration-300 ease-out-expo group-hover:translate-x-1">→</span>
					<span className="w-28 shrink-0">{suggestion.path}</span>
					<span className="text-white/50 transition-colors group-hover:text-white">{suggestion.label}</span>
				</Link>
			))
		]

	return (
		<div className={windowClassName}>
			<WindowBar frame="app" title="zsh" />
			{/* Click anywhere focuses the prompt, like a real terminal. */}
			{/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
			<div ref={bodyRef} data-lenis-prevent className={bodyClassName} onClick={() => inputRef.current?.focus({ preventScroll: true })}>
				{intro.map((line, index) => (
					<motion.div
						key={line.key}
						initial={{ opacity: 0, x: -12 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{ duration: 0.6, ease: EASE, delay: 0.5 + index * LINE_DELAY }}
					>
						{line}
					</motion.div>
				))}

				{history.map(entry => (
					<div key={entry.id} className={cn(entry.id === 0 && !cleared && "mt-2")}>
						<p className="break-all">
							<span className="text-coral">$ </span>
							{entry.command}
						</p>
						{entry.output.map(line => <p key={line} className="break-words text-white/60">{line}</p>)}
					</div>
				))}

				<motion.form
					className={cn("flex items-center", history.length === 0 && !cleared && "mt-2")}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ duration: 0.6, delay: 0.5 + intro.length * LINE_DELAY }}
					onSubmit={event => {
						event.preventDefault()
						submit()
					}}
				>
					<span aria-hidden className="text-coral">$&nbsp;</span>
					{!focused && !input && (
						<span aria-hidden className="mr-2 inline-block h-[1.1em] w-[0.55em] animate-pulse bg-[#ebebeb]" />
					)}
					<input
						ref={inputRef}
						value={input}
						onChange={event => setInput(event.target.value)}
						onFocus={() => setFocused(true)}
						onBlur={() => setFocused(false)}
						aria-label={t("terminal.inputLabel")}
						placeholder={t("terminal.placeholder")}
						autoComplete="off"
						autoCapitalize="off"
						spellCheck={false}
						className={inputClassName}
					/>
				</motion.form>
			</div>
		</div>
	)
}
