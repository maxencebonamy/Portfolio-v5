import { useNavigate, useRouterState } from "@tanstack/react-router"
import { useCallback } from "react"

import { stripLocale } from "#/lib/i18n"
import { scrollToTarget } from "#/lib/scroll"
import { useI18n } from "#/providers/i18n-provider"
import { useLenis } from "#/providers/smooth-scroll-provider"

/** Returns a function going to a home page section (by id), from any route, in the current language. */
export const useGoToSection = (): (id: string) => void => {
	const lenis = useLenis()
	const navigate = useNavigate()
	const { langParam } = useI18n()
	const pathname = useRouterState({ select: state => state.location.pathname })

	return useCallback((id: string) => {
		if (stripLocale(pathname) === "/") scrollToTarget(lenis, `#${id}`)
		else void navigate({ to: "/{-$lang}", params: { lang: langParam }, hash: id })
	}, [ langParam, lenis, navigate, pathname ])
}
