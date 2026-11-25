import type { MotionValue } from "motion/react"
import { motion, useMotionValue, useSpring, useTransform } from "motion/react"
import type { PointerEvent, ReactNode } from "react"

import { useFinePointer } from "#/hooks/use-fine-pointer"
import { cn } from "#/lib/cn"

const SPRING = { stiffness: 150, damping: 20 }

type GlareProps = {
	/** Cursor X, 0 to 1. */
	x: MotionValue<number>
	/** Cursor Y, 0 to 1. */
	y: MotionValue<number>
}

/** Light reflection following the cursor. */
const Glare = ({ x, y }: GlareProps) => {
	const background = useTransform(
		() => `radial-gradient(circle at ${x.get() * 100}% ${y.get() * 100}%, rgba(255,255,255,.35), transparent 50%)`
	)

	const glareClassName = cn(
		"pointer-events-none absolute inset-0",
		"rounded-[inherit]",
		"mix-blend-overlay"
	)

	return <motion.div aria-hidden className={glareClassName} style={{ background }} />
}

type TiltProps = {
	children: ReactNode
	className?: string
	/** In degrees. */
	max?: number
	glare?: boolean
}

/** Card tilting in 3D toward the cursor. */
export const Tilt = ({ children, className, max = 8, glare = true }: TiltProps) => {
	const fine = useFinePointer()
	const pointerX = useMotionValue(0.5)
	const pointerY = useMotionValue(0.5)
	const rotateX = useSpring(useTransform(pointerY, [ 0, 1 ], [ max, -max ]), SPRING)
	const rotateY = useSpring(useTransform(pointerX, [ 0, 1 ], [ -max, max ]), SPRING)

	const onPointerMove = (event: PointerEvent<HTMLDivElement>): void => {
		if (!fine) return
		const rect = event.currentTarget.getBoundingClientRect()
		pointerX.set((event.clientX - rect.left) / rect.width)
		pointerY.set((event.clientY - rect.top) / rect.height)
	}

	const onPointerLeave = (): void => {
		pointerX.set(0.5)
		pointerY.set(0.5)
	}

	return (
		<motion.div
			className={cn("[perspective:1200px]", className)}
			onPointerMove={onPointerMove}
			onPointerLeave={onPointerLeave}
		>
			<motion.div className="relative size-full rounded-[inherit]" style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}>
				{children}
				{glare && <Glare x={pointerX} y={pointerY} />}
			</motion.div>
		</motion.div>
	)
}
