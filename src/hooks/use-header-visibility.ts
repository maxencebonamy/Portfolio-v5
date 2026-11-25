import { useMotionValueEvent, useScroll } from "motion/react"
import type { RefObject } from "react"
import { useEffect, useRef, useState, useSyncExternalStore } from "react"

import { isAutoScrolling, subscribeAutoScroll } from "#/lib/scroll"

/** Navigation bar state. */
export type HeaderVisibility = {
	/** Scrolling down, mouse far from the top. */
	hidden: boolean
	/** Page has scrolled: the bar gets a background. */
	scrolled: boolean
}

/** In px. Never hides above it. */
const HIDE_AFTER = 300

/** In px, scrolled down in one go. */
const HIDE_DISTANCE = 160

/** In px. */
const ELEVATE_AFTER = 40

/** In px, below the bar. */
const REVEAL_MARGIN = 24

/** In ms. Scrolls within this window count as user input (smooth scroll included). */
const USER_SCROLL_WINDOW = 1000

const USER_SCROLL_EVENTS = [ "wheel", "touchmove", "keydown" ] as const

/**
 * Hides the nav bar on scroll down, shows it on scroll up or when the mouse nears the top.
 * Only user scrolls count: it stays visible during site-initiated scrolls (so the active
 * section can be followed) and when the page shifts on its own (images, page change).
 *
 * @param headerRef - Used to measure the bar height.
 */
export const useHeaderVisibility = (headerRef: RefObject<HTMLElement | null>): HeaderVisibility => {
	const { scrollY } = useScroll()
	const autoScrolling = useSyncExternalStore(subscribeAutoScroll, isAutoScrolling, () => false)
	const [ scrolledAway, setScrolledAway ] = useState(false)
	const [ scrolled, setScrolled ] = useState(false)
	const [ nearTop, setNearTop ] = useState(false)
	const downStart = useRef(0)
	const lastUserInput = useRef(Number.NEGATIVE_INFINITY)

	useMotionValueEvent(scrollY, "change", current => {
		const previous = scrollY.getPrevious() ?? 0
		setScrolled(current > ELEVATE_AFTER)

		if (isAutoScrolling() || current <= previous) {
			downStart.current = current
			setScrolledAway(false)
			return
		}
		if (performance.now() - lastUserInput.current > USER_SCROLL_WINDOW) {
			downStart.current = current
			return
		}
		setScrolledAway(current > HIDE_AFTER && current - downStart.current > HIDE_DISTANCE)
	})

	useEffect(() => {
		const onUserInput = (): void => {
			lastUserInput.current = performance.now()
		}
		USER_SCROLL_EVENTS.forEach(type => window.addEventListener(type, onUserInput, { passive: true }))
		return () => USER_SCROLL_EVENTS.forEach(type => window.removeEventListener(type, onUserInput))
	}, [])

	useEffect(() => {
		const onPointerMove = (event: PointerEvent): void => {
			if (event.pointerType !== "mouse") return
			const height = headerRef.current?.offsetHeight ?? 80
			setNearTop(event.clientY < height + REVEAL_MARGIN)
		}
		window.addEventListener("pointermove", onPointerMove, { passive: true })
		return () => window.removeEventListener("pointermove", onPointerMove)
	}, [ headerRef ])

	return { hidden: scrolledAway && !nearTop && !autoScrolling, scrolled }
}
