import type { Transition } from "motion/react"

/** Same curve as the `ease-out-expo` class. */
export const EASE = [ 0.16, 1, 0.3, 1 ] as const

/** Curtain transitions (mobile menu, portrait). */
export const EASE_IN_OUT = [ 0.76, 0, 0.24, 1 ] as const

/** Sliding "active" pills. */
export const PILL_SPRING: Transition = { type: "spring", stiffness: 400, damping: 34 }

export const REDUCED_MOTION_QUERY = "(prefers-reduced-motion: reduce)"

/** Whether the user asked for less motion. */
export const prefersReducedMotion = (): boolean => {
	return window.matchMedia(REDUCED_MOTION_QUERY).matches
}
