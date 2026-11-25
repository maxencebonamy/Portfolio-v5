import { motion, useInView } from "motion/react"
import type { ReactNode } from "react"
import { useRef } from "react"

import { EASE } from "#/lib/motion"

type RevealProps = {
	children: ReactNode
	/** In s. */
	delay?: number
	className?: string
	/** Initial vertical offset, in px. */
	y?: number
}

/** Fades and slides in when scrolled into view. */
export const Reveal = ({ children, delay = 0, className, y = 40 }: RevealProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })

	return (
		<div ref={ref} className={className}>
			<motion.div
				className="h-full"
				initial={{ opacity: 0, y }}
				animate={inView ? { opacity: 1, y: 0 } : undefined}
				transition={{ duration: 1, ease: EASE, delay }}
			>
				{children}
			</motion.div>
		</div>
	)
}
