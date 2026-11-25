import { useRouterState } from "@tanstack/react-router"
import { useEffect, useState } from "react"

import { SECTIONS } from "#/config/sections"
import { stripLocale } from "#/lib/i18n"

/** Fraction of the viewport height. A section is active once its top passes this line. */
const READING_LINE = 0.45

/** In px from the page bottom; below it the last section is active. */
const BOTTOM_TOLERANCE = 4

/**
 * Section under the reading line. Read from layout on each call, so unlike an
 * IntersectionObserver it never misses one after a long programmatic scroll.
 *
 * @returns `null` above the first section.
 */
const findActiveSection = (): string | null => {
	const elements = SECTIONS.map(section => document.getElementById(section.id)).filter(element => element !== null)
	const last = elements.at(-1)
	const atBottom = window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - BOTTOM_TOLERANCE
	if (atBottom && last) return last.id
	const line = window.innerHeight * READING_LINE
	const passed = elements.filter(element => element.getBoundingClientRect().top <= line)
	return passed.at(-1)?.id ?? null
}

/**
 * Tracks the home page section under the reading line.
 *
 * @returns `null` outside the home page or above the first section.
 */
export const useActiveSection = (): string | null => {
	const [ active, setActive ] = useState<string | null>(null)
	const pathname = useRouterState({ select: state => state.location.pathname })
	const isHome = stripLocale(pathname) === "/"

	useEffect(() => {
		if (!isHome) return
		let frame = 0
		const update = (): void => {
			cancelAnimationFrame(frame)
			frame = requestAnimationFrame(() => setActive(findActiveSection()))
		}
		update()
		window.addEventListener("scroll", update, { passive: true })
		window.addEventListener("resize", update)
		return () => {
			cancelAnimationFrame(frame)
			window.removeEventListener("scroll", update)
			window.removeEventListener("resize", update)
		}
	}, [ isHome ])

	return isHome ? active : null
}
