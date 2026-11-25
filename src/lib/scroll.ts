import type Lenis from "lenis"

/** In s. */
const SCROLL_DURATION = 1.4

/** In ms. Ends the scroll state even without a completion event (e.g. user interrupt). */
const SCROLL_TIMEOUT = SCROLL_DURATION * 1000 + 300

/** Site-initiated (not user) scroll running. */
let autoScrolling = false

/** Id of the latest scroll, so an older one finishing doesn't end a newer one. */
let currentScroll = 0

const listeners = new Set<() => void>()

/** Updates the scroll state and notifies listeners. */
const setAutoScrolling = (value: boolean): void => {
	if (autoScrolling === value) return
	autoScrolling = value
	listeners.forEach(listener => listener())
}

/** Whether a site-initiated scroll is running (nav link, back to top...). */
export const isAutoScrolling = (): boolean => {
	return autoScrolling
}

/**
 * Subscribes to start/end of site-initiated scrolls.
 *
 * @returns Unsubscribe function.
 */
export const subscribeAutoScroll = (listener: () => void): () => void => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

/**
 * Marks the start of an animated scroll.
 *
 * @returns End function, ignored if a newer scroll started since.
 */
const startAutoScroll = (): () => void => {
	const id = ++currentScroll
	setAutoScrolling(true)
	const end = (): void => {
		clearTimeout(timeout)
		if (id === currentScroll) setAutoScrolling(false)
	}
	const timeout = setTimeout(end, SCROLL_TIMEOUT)
	return end
}

/**
 * Scrolls to an anchor (`#id`) or a position, through Lenis when available.
 * {@link isAutoScrolling} is `true` meanwhile (keeps the nav bar visible).
 *
 * @param lenis - `null` when smooth scroll is disabled.
 * @param target - CSS selector or position in px.
 * @param immediate - Jump without animation.
 */
export const scrollToTarget = (lenis: Lenis | null, target: string | number, immediate = false): void => {
	const element = typeof target === "string" ? document.querySelector<HTMLElement>(target) : null
	if (typeof target === "string" && !element) return

	const end = immediate ? undefined : startAutoScroll()

	if (lenis) {
		// Lenis may keep the previous page's height and stop short.
		lenis.resize()
		lenis.scrollTo(element ?? target, {
			offset: 0,
			immediate,
			duration: SCROLL_DURATION,
			easing: progress => 1 - Math.pow(1 - progress, 4),
			onComplete: () => end?.()
		})
		return
	}

	const behavior = immediate ? "auto" : "smooth"
	if (end) window.addEventListener("scrollend", end, { once: true })
	if (element) element.scrollIntoView({ behavior })
	else window.scrollTo({ top: target as number, behavior })
}
