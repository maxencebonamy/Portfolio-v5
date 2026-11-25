import { STORAGE_KEYS } from "#/config/storage-keys"
import { site } from "#/content/site"
import { prefersReducedMotion } from "#/lib/motion"
import { storage } from "#/lib/storage"

export type Theme = "dark" | "light"

const listeners = new Set<() => void>()

/** Reads `data-theme` on `<html>`. */
export const getTheme = (): Theme => {
	return document.documentElement.dataset.theme === "light" ? "light" : "dark"
}

/**
 * Subscribes to theme changes.
 *
 * @returns Unsubscribe function.
 */
export const subscribeTheme = (listener: () => void): () => void => {
	listeners.add(listener)
	return () => {
		listeners.delete(listener)
	}
}

/** Matches the browser UI color (`<meta name="theme-color">`) to a theme. */
export const syncThemeColor = (theme: Theme): void => {
	document.querySelector("meta[name=\"theme-color\"]")?.setAttribute("content", site.themeColor[theme])
}

/** Applies and saves a theme. */
const applyTheme = (theme: Theme): void => {
	document.documentElement.dataset.theme = theme
	syncThemeColor(theme)
	storage.set(STORAGE_KEYS.theme, theme)
	listeners.forEach(listener => listener())
}

/**
 * Toggles the theme with a circular reveal (View Transitions API).
 *
 * @param origin - Reveal center. Defaults to the top right corner.
 */
export const toggleTheme = (origin?: { x: number, y: number }): void => {
	const next: Theme = getTheme() === "dark" ? "light" : "dark"
	if (!("startViewTransition" in document) || prefersReducedMotion()) return applyTheme(next)

	const x = origin?.x ?? window.innerWidth - 40
	const y = origin?.y ?? 40
	const radius = Math.hypot(Math.max(x, innerWidth - x), Math.max(y, innerHeight - y))
	const root = document.documentElement

	root.classList.add("theme-vt")
	const transition = document.startViewTransition(() => applyTheme(next))
	void transition.ready.then(() => {
		root.animate(
			{ clipPath: [ `circle(0px at ${x}px ${y}px)`, `circle(${radius}px at ${x}px ${y}px)` ] },
			{ duration: 700, easing: "cubic-bezier(0.65, 0, 0.35, 1)", pseudoElement: "::view-transition-new(root)" }
		)
	})
	void transition.finished.finally(() => root.classList.remove("theme-vt"))
}
