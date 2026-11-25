import { motion } from "motion/react"

import { cn } from "#/lib/cn"

type ChipProps = {
	children: string
	/** In s. */
	delay?: number
}

/** Skill chip popping in on scroll. */
export const Chip = ({ children, delay = 0 }: ChipProps) => {
	const chipClassName = cn(
		"rounded-full border border-line px-3.5 py-1.5",
		"bg-bg/60",
		"text-sm",
		"transition-colors hover:border-coral hover:text-coral"
	)

	return (
		<motion.li
			className={chipClassName}
			initial={{ opacity: 0, scale: 0.85 }}
			whileInView={{ opacity: 1, scale: 1 }}
			viewport={{ once: true }}
			transition={{ delay, type: "spring", stiffness: 300, damping: 22 }}
		>
			{children}
		</motion.li>
	)
}
