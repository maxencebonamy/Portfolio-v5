import { useRouter, useRouterState } from "@tanstack/react-router"
import { useLayoutEffect, useState } from "react"

/** Where the SPA shell is prerendered (see `vite.config.ts`). */
const SHELL_PATH = "/404"

/**
 * Whether the SPA shell (`404.html`) is rendering: on the server at prerender, or in the browser while it
 * hydrates (`data-shell` on `<html>`, set by `__root.tsx`). The dev server flags every page as the shell,
 * hence the path check.
 */
const useIsShell = (): boolean => {
	const router = useRouter()
	const pathname = useRouterState({ select: state => state.location.pathname })
	if (typeof document === "undefined") return router.isShell() && pathname === SHELL_PATH
	return document.documentElement.hasAttribute("data-shell")
}

/**
 * `true` for the first render of the SPA shell, then `false`. The shell is prerendered without page
 * content, in the default language, whatever the URL it is served at: content depending on the route
 * waits for this flag, so the hydration matches the prerendered HTML.
 */
export const useShellRender = (): boolean => {
	const isShell = useIsShell()
	const [ shell, setShell ] = useState(isShell)

	useLayoutEffect(() => {
		// Hydrated: the real content is rendered before first paint.
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setShell(false)
	}, [])

	return shell
}
