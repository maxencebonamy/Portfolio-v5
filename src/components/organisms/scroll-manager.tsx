import { useRouterState } from "@tanstack/react-router"
import { useEffect } from "react"

import { stripLocale } from "#/lib/i18n"
import { scrollToTarget } from "#/lib/scroll"
import { useLenis } from "#/providers/smooth-scroll-provider"

/** In ms, lets the new page mount before scrolling to the anchor. */
const HASH_SCROLL_DELAY = 150

/** On page change, scrolls to top or to the URL anchor. The same page in another language keeps its scroll. */
export const ScrollManager = () => {
	const lenis = useLenis()
	const page = useRouterState({ select: state => stripLocale(state.location.pathname) })
	const hash = useRouterState({ select: state => state.location.hash })

	useEffect(() => {
		if (!hash) return scrollToTarget(lenis, 0, true)
		const timeout = setTimeout(() => scrollToTarget(lenis, `#${hash}`), HASH_SCROLL_DELAY)
		return () => clearTimeout(timeout)
	}, [ page, hash, lenis ])

	return null
}
