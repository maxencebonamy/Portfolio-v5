import Lenis from "lenis"
import type { ReactNode } from "react"
import { createContext, useContext, useEffect, useState } from "react"

import { prefersReducedMotion } from "#/lib/motion"

/** `null` when smooth scrolling is disabled. */
const LenisContext = createContext<Lenis | null>(null)

type SmoothScrollProviderProps = {
	children: ReactNode
}

/** Lenis smooth scrolling, off with reduced motion. */
export const SmoothScrollProvider = ({ children }: SmoothScrollProviderProps) => {
	const [ lenis, setLenis ] = useState<Lenis | null>(null)

	useEffect(() => {
		if (prefersReducedMotion()) return
		const instance = new Lenis({ lerp: 0.1, wheelMultiplier: 1 })
		let frame = 0
		const loop = (time: number): void => {
			instance.raf(time)
			frame = requestAnimationFrame(loop)
		}
		frame = requestAnimationFrame(loop)
		// Needs the DOM: created here, shared through state.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setLenis(instance)
		return () => {
			cancelAnimationFrame(frame)
			instance.destroy()
			setLenis(null)
		}
	}, [])

	return <LenisContext.Provider value={lenis}>{children}</LenisContext.Provider>
}

/** Lenis instance, or `null` when smooth scrolling is disabled. */
export const useLenis = (): Lenis | null => {
	return useContext(LenisContext)
}
