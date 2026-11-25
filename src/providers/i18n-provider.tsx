import { useNavigate, useRouterState } from "@tanstack/react-router"
import type { ReactNode } from "react"
import { createContext, useCallback, useContext, useEffect, useLayoutEffect, useMemo, useState } from "react"
import { flushSync } from "react-dom"

import type { MessageKey } from "#/content/messages"
import { messages } from "#/content/messages"
import { useShellRender } from "#/hooks/use-shell-render"
import { DEFAULT_LOCALE, interpolate, localeFromPath, localeParam, localizePath, persistLocale, stripLocale } from "#/lib/i18n"
import { prefersReducedMotion } from "#/lib/motion"
import type { Locale, Localized } from "#/schemas/localized"

/** Translation helpers exposed by `useI18n`. */
export type I18n = {
	/** From the URL: `/en/...` is English, anything else French. Switches ahead of the URL on a language change. */
	lang: Locale
	/** Value of the `{-$lang}` route param, for links staying in the current language. */
	langParam: Locale | undefined
	/** Current page in another language. */
	pathIn: (locale: Locale) => string
	/** Saves the choice and goes to the current page in that language, with a cross-fade and nothing remounted. */
	setLang: (locale: Locale) => void
	/** Translates a `messages.json` key, filling `{name}` placeholders. */
	t: (key: MessageKey, values?: Record<string, string | number>) => string
	/** Picks the current language from a localized value. */
	pick: <V>(value: Localized<V>) => V
}

const I18nContext = createContext<I18n | null>(null)

type I18nProviderProps = {
	children: ReactNode
}

/** Provides the page language (taken from the URL) and translation helpers, keeps `<html lang>` in sync. */
export const I18nProvider = ({ children }: I18nProviderProps) => {
	const navigate = useNavigate()
	const location = useRouterState({ select: state => state.location })
	const shellRender = useShellRender()
	// Language shown before the URL catches up, so the switch renders at once inside the view transition.
	const [ pending, setPending ] = useState<Locale | null>(null)
	// The shell is prerendered in the default language, whatever its URL.
	const urlLang = shellRender ? DEFAULT_LOCALE : localeFromPath(location.pathname)
	if (pending !== null && pending === urlLang) setPending(null)
	const lang = pending ?? urlLang

	// Shell hydrated and switched to the URL's language: the boot script can show the page. React leaves
	// the shell's own head tags in place (the client never rendered them), so they go here.
	useLayoutEffect(() => {
		if (shellRender) return
		delete document.documentElement.dataset.pendingLang
		document.querySelectorAll("[data-shell-only]").forEach(element => element.remove())
	}, [ shellRender ])

	useEffect(() => {
		document.documentElement.lang = lang
	}, [ lang ])

	const pathIn = useCallback((locale: Locale) => {
		return localizePath(stripLocale(location.pathname), locale) + location.searchStr + (location.hash ? `#${location.hash}` : "")
	}, [ location ])

	const setLang = useCallback((next: Locale) => {
		persistLocale(next)
		if (next === lang) return
		// Same route, other param: the page stays mounted, only its texts and URL change.
		const switchLanguage = (): void => {
			flushSync(() => setPending(next))
			void navigate({ href: pathIn(next), resetScroll: false })
		}
		if (!("startViewTransition" in document) || prefersReducedMotion()) return switchLanguage()

		const root = document.documentElement
		root.classList.add("lang-vt")
		const transition = document.startViewTransition(switchLanguage)
		void transition.finished.finally(() => root.classList.remove("lang-vt"))
	}, [ lang, navigate, pathIn ])

	const value = useMemo<I18n>(() => ({
		lang,
		langParam: localeParam(lang),
		pathIn,
		setLang,
		t: (key, values) => interpolate(messages[key][lang], values),
		pick: localized => localized[lang]
	}), [ lang, pathIn, setLang ])

	return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}

/**
 * Current language and translation helpers.
 *
 * @throws If used outside of {@link I18nProvider}.
 */
export const useI18n = (): I18n => {
	const context = useContext(I18nContext)
	if (!context) throw new Error("useI18n must be used inside <I18nProvider>")
	return context
}
