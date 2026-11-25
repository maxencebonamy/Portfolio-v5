import { animate, motion, useInView, useMotionValue, useTransform } from "motion/react"
import { useEffect, useRef } from "react"

import { EASE } from "#/lib/motion"

type CounterProps = {
	to: number
}

/** Counts up from 0 when scrolled into view. */
export const Counter = ({ to }: CounterProps) => {
	const ref = useRef<HTMLSpanElement>(null)
	const inView = useInView(ref, { once: true })
	const value = useMotionValue(0)
	const rounded = useTransform(value, Math.round)

	useEffect(() => {
		if (!inView) return
		const controls = animate(value, to, { duration: 1.8, ease: EASE })
		return () => controls.stop()
	}, [ inView, to, value ])

	return <motion.span ref={ref}>{rounded}</motion.span>
}
