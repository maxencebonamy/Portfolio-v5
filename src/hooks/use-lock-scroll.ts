import { useEffect } from "react"

import { useLenis } from "#/providers/smooth-scroll-provider"

/** Pauses smooth scrolling while a menu or dialog is open. */
export const useLockScroll = (locked = true): void => {
	const lenis = useLenis()

	useEffect(() => {
		if (!locked) return
		lenis?.stop()
		return () => lenis?.start()
	}, [ locked, lenis ])
}
