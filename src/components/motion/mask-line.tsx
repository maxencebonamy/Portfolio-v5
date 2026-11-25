import type { ReactNode } from "react"

import { MaskedReveal } from "#/components/motion/masked-reveal"
import { EASE } from "#/lib/motion"

type MaskLineProps = {
	children: ReactNode
	/** In s. */
	delay: number
	play: boolean
	onRevealed?: () => void
	/** Shows the line at once, no animation. */
	skip?: boolean
	className?: string
}

/** Title line rising out of a mask, slightly skewed. */
export const MaskLine = ({ children, delay, play, onRevealed, skip, className }: MaskLineProps) => {
	return (
		<MaskedReveal
			display="block"
			play={play}
			initial={{ y: "130%", skewY: 6 }}
			animate={{ y: "0%", skewY: 0 }}
			transition={{ duration: 1.1, ease: EASE, delay }}
			onRevealed={onRevealed}
			skip={skip}
			className={className}
		>
			{children}
		</MaskedReveal>
	)
}
