import type { TargetAndTransition, Transition } from "motion/react"
import { motion } from "motion/react"
import type { ReactNode } from "react"
import { useState } from "react"

import { cn } from "#/lib/cn"

/**
 * Room around the text inside the mask, offset by negative margins so layout is unchanged.
 * Top: capital accents. Bottom: descenders. Sides: italic overhang, text stroke.
 */
const MASK_BLEED_CLASS_NAME = cn(
	"-mx-[0.15em] px-[0.15em]",
	"-mt-[0.35em] pt-[0.35em]",
	"-mb-[0.2em] pb-[0.2em]"
)

type MaskedRevealProps = {
	children: ReactNode
	play: boolean
	/** Hidden state, below the mask. */
	initial: TargetAndTransition
	animate: TargetAndTransition
	transition: Transition
	/** `block` for full lines, `inline-block` for words. */
	display?: "block" | "inline-block"
	onRevealed?: () => void
	/** Shows content at once, no mask (e.g. text swapped after reveal). */
	skip?: boolean
	className?: string
}

/** Slides content out of a mask. Clips only while animating, so nothing gets cut once revealed. */
export const MaskedReveal = ({ children, play, initial, animate, transition, display = "inline-block", onRevealed, skip = false, className }: MaskedRevealProps) => {
	const [ revealed, setRevealed ] = useState(false)

	const maskClassName = cn(
		display,
		"align-bottom",
		MASK_BLEED_CLASS_NAME,
		!revealed && !skip && "overflow-hidden",
		className
	)

	return (
		<span className={maskClassName}>
			<motion.span
				className={display}
				initial={skip ? false : initial}
				animate={play ? animate : undefined}
				transition={transition}
				onAnimationComplete={() => {
					if (!play) return
					setRevealed(true)
					onRevealed?.()
				}}
			>
				{children}
			</motion.span>
		</span>
	)
}
