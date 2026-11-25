import { motion, useSpring } from "motion/react"
import type { PointerEvent, ReactNode } from "react"

import { useFinePointer } from "#/hooks/use-fine-pointer"
import { cn } from "#/lib/cn"

const SPRING = { stiffness: 200, damping: 15, mass: 0.4 }

type MagneticProps = {
	children: ReactNode
	/** Share of the cursor offset applied, 0 to 1. */
	strength?: number
	className?: string
}

/** Wrapper attracted by the cursor. */
export const Magnetic = ({ children, strength = 0.35, className }: MagneticProps) => {
	const fine = useFinePointer()
	const x = useSpring(0, SPRING)
	const y = useSpring(0, SPRING)

	const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
		if (!fine) return
		const rect = event.currentTarget.getBoundingClientRect()
		x.set((event.clientX - (rect.left + rect.width / 2)) * strength)
		y.set((event.clientY - (rect.top + rect.height / 2)) * strength)
	}

	const onPointerLeave = (): void => {
		x.set(0)
		y.set(0)
	}

	return (
		<motion.div
			className={cn("inline-block", className)}
			style={{ x, y }}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
		>
			{children}
		</motion.div>
	)
}
