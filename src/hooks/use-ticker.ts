import { useInView, useReducedMotion } from "motion/react"
import type { RefObject } from "react"
import { useEffect, useState } from "react"

/**
 * Counts ticks while an element is in view. Stays at 0 with reduced motion.
 *
 * @param interval - In ms.
 * @param ref - Ticks only while this element is in view.
 */
export const useTicker = (interval: number, ref: RefObject<Element | null>): number => {
	const inView = useInView(ref, { margin: "100px" })
	const reduceMotion = useReducedMotion()
	const [ tick, setTick ] = useState(0)

	useEffect(() => {
		if (!inView || reduceMotion) return
		const id = setInterval(() => setTick(current => current + 1), interval)
		return () => clearInterval(id)
	}, [ interval, inView, reduceMotion ])

	return tick
}
