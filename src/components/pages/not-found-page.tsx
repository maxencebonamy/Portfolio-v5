import { Link } from "@tanstack/react-router"
import type { MotionValue } from "motion/react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import { useEffect } from "react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { Container } from "#/components/atoms/container"
import { PingDot } from "#/components/atoms/ping-dot"
import { Magnetic } from "#/components/motion/magnetic"
import { MaskedReveal } from "#/components/motion/masked-reveal"
import { NotFoundTerminal } from "#/components/organisms/not-found-terminal"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"
import { PageHead } from "#/seo/page-head"
import { notFoundMeta } from "#/seo/page-meta"

const PARALLAX_SPRING = { stiffness: 60, damping: 18 }

/** `depth`: how far each digit follows the mouse (middle one floats closer). */
const DIGITS = [
	{ char: "4", depth: 0.6, filled: false },
	{ char: "0", depth: 1.4, filled: true },
	{ char: "4", depth: 0.9, filled: false }
]

type DigitProps = {
	char: string
	depth: number
	/** Solid coral instead of outlined. */
	filled: boolean
	/** From -1 to 1. */
	pointerX: MotionValue<number>
	pointerY: MotionValue<number>
	delay: number
}

/** Giant "404" digit, revealed from below, following the mouse. */
const Digit = ({ char, depth, filled, pointerX, pointerY, delay }: DigitProps) => {
	const x = useSpring(useTransform(pointerX, value => value * 24 * depth), PARALLAX_SPRING)
	const y = useSpring(useTransform(pointerY, value => value * 16 * depth), PARALLAX_SPRING)

	return (
		<motion.span className="inline-block" style={{ x, y }}>
			<MaskedReveal
				play
				initial={{ y: "110%", rotate: 8 }}
				animate={{ y: "0%", rotate: 0 }}
				transition={{ duration: 1.1, ease: EASE, delay }}
			>
				<span className={cn("pr-[0.06em]", filled ? "text-coral" : "text-outline")}>{char}</span>
			</MaskedReveal>
		</motion.span>
	)
}

/** 404 page: giant animated code, short text, terminal listing existing pages. */
export const NotFoundPage = () => {
	const { t, lang, langParam } = useI18n()
	const pointerX = useMotionValue(0)
	const pointerY = useMotionValue(0)

	useEffect(() => {
		const onPointerMove = (event: PointerEvent): void => {
			pointerX.set(event.clientX / window.innerWidth * 2 - 1)
			pointerY.set(event.clientY / window.innerHeight * 2 - 1)
		}
		window.addEventListener("pointermove", onPointerMove, { passive: true })
		return () => window.removeEventListener("pointermove", onPointerMove)
	}, [ pointerX, pointerY ])

	const sectionClassName = cn(
		"relative flex min-h-svh flex-col overflow-hidden",
		"px-4 pt-32 pb-16 md:px-8 md:pt-36"
	)

	const glowClassName = cn(
		"pointer-events-none absolute top-[20%] left-1/2 size-[50vmax] -translate-x-1/2",
		"rounded-full blur-[140px]",
		"bg-[radial-gradient(circle,rgba(255,106,105,.35),rgba(255,106,105,0)_65%)]"
	)

	const labelClassName = cn(
		"flex items-center gap-2",
		"font-mono text-[11px] tracking-widest text-muted uppercase"
	)

	// Smaller from `lg`, where it shares the width with the terminal: the three digits stay on one line.
	const codeClassName = cn(
		"-ml-[0.04em] select-none whitespace-nowrap",
		"text-[clamp(7rem,26vw,19rem)] leading-[0.85] font-black tracking-tight italic lg:text-[clamp(7rem,20vw,19rem)]"
	)

	const primaryClassName = cn(
		"group flex items-center gap-3 py-3.5 pr-3.5 pl-6",
		"rounded-full bg-coral",
		"font-semibold text-[#1a1a1a]"
	)

	const secondaryClassName = cn(
		"flex items-center px-6 py-3.5",
		"rounded-full border border-line",
		"font-semibold",
		"transition-colors hover:border-fg"
	)

	return (
		<section className={sectionClassName}>
			<PageHead meta={notFoundMeta(lang)} />
			<div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
			<motion.div
				aria-hidden
				className={glowClassName}
				initial={{ opacity: 0, scale: 0.5 }}
				animate={{ opacity: 1, scale: 1 }}
				transition={{ duration: 2, ease: EASE }}
			/>

			<Container className="relative grid flex-1 items-center gap-12 lg:grid-cols-[1.15fr_1fr] lg:gap-16">
				<div>
					<motion.p
						className={labelClassName}
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						transition={{ duration: 1, delay: 0.2 }}
					>
						<PingDot color="bg-coral" />
						{t("notFound.label")}
					</motion.p>

					<h1 className="mt-4">
						<span className="sr-only">404. </span>
						<span aria-hidden className={codeClassName}>
							{DIGITS.map((digit, index) => (
								<Digit key={index} {...digit} pointerX={pointerX} pointerY={pointerY} delay={0.1 + index * 0.08} />
							))}
						</span>
						<motion.span
							className="mt-6 block max-w-xl text-2xl leading-tight font-semibold text-balance md:text-4xl"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 1, ease: EASE, delay: 0.4 }}
						>
							{t("notFound.heading")}
						</motion.span>
					</h1>

					<motion.div
						initial={{ opacity: 0, y: 20 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 1, ease: EASE, delay: 0.55 }}
					>
						<p className="mt-4 max-w-md leading-relaxed text-muted md:text-lg">{t("notFound.message")}</p>
						<div className="mt-8 flex flex-wrap items-center gap-3">
							<Magnetic>
								<Link to="/{-$lang}" params={{ lang: langParam }} className={primaryClassName}>
									<span>{t("notFound.backHome")}</span>
									<ArrowBadge className="bg-[#1a1a1a] text-coral" />
								</Link>
							</Magnetic>
							<Magnetic>
								<Link to="/{-$lang}/projects" params={{ lang: langParam }} className={secondaryClassName}>
									<span>{t("nav.allProjects")}</span>
								</Link>
							</Magnetic>
						</div>
					</motion.div>
				</div>

				<NotFoundTerminal className="w-full max-w-xl lg:justify-self-end" />
			</Container>
		</section>
	)
}
