import { motion } from "motion/react"

import { cn } from "#/lib/cn"
import { PILL_SPRING } from "#/lib/motion"

type ActivePillProps = {
	/** Shared between items so the pill slides across. */
	layoutId: string
	className?: string
}

/** Sliding background of a group's active item (tabs, filters, menu). */
export const ActivePill = ({ layoutId, className }: ActivePillProps) => {
	return (
		<motion.span
			layoutId={layoutId}
			className={cn("absolute inset-0 rounded-full bg-coral", className)}
			transition={PILL_SPRING}
		/>
	)
}
