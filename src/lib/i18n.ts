import { LOCALES } from "#/config/locales"
import { STORAGE_KEYS } from "#/config/storage-keys"
import { storage } from "#/lib/storage"
import type { Locale } from "#/schemas/localized"

/** Served at the root (`/projects`); other languages get a prefix (`/en/projects`). */
export const DEFAULT_LOCALE: Locale = LOCALES[0]

/** Checks whether a value is a supported language code. */
export const isLocale = (value: unknown): value is Locale => {
	return LOCALES.includes(value as Locale)
}

/** Language of a URL path, from its prefix. */
export const localeFromPath = (pathname: string): Locale => {
	const prefix = pathname.split("/")[1]
	return isLocale(prefix) && prefix !== DEFAULT_LOCALE ? prefix : DEFAULT_LOCALE
}

/**
 * Path without its language prefix, e.g. `/en/projects` -> `/projects`.
 *
 * @returns `/` for a home page.
 */
export const stripLocale = (pathname: string): string => {
	const locale = localeFromPath(pathname)
	if (locale === DEFAULT_LOCALE) return pathname || "/"
	return pathname.slice(locale.length + 1) || "/"
}

/**
 * Path in a language, e.g. `/projects` in English -> `/en/projects`.
 *
 * @param path - Without language prefix, starts with `/`.
 */
export const localizePath = (path: string, locale: Locale): string => {
	if (locale === DEFAULT_LOCALE) return path
	return path === "/" ? `/${locale}` : `/${locale}${path}`
}

/** Value of the optional `{-$lang}` route param: none for the default language. */
export const localeParam = (locale: Locale): Locale | undefined => {
	return locale === DEFAULT_LOCALE ? undefined : locale
}

/** Language explicitly chosen by the visitor (switch or banner), if any. */
export const savedLocale = (): Locale | undefined => {
	const saved = storage.get(STORAGE_KEYS.lang)
	return isLocale(saved) ? saved : undefined
}

/** Saves the visitor's language choice. */
export const persistLocale = (locale: Locale): void => {
	storage.set(STORAGE_KEYS.lang, locale)
}

/** Browser language: French browsers get French, others English. */
export const browserLocale = (): Locale => {
	const languages = navigator.languages.length ? navigator.languages : [ navigator.language ]
	return languages.some(language => language.toLowerCase().startsWith("fr")) ? "fr" : "en"
}

/** Replaces `{name}` placeholders. Unknown ones are kept as is. */
export const interpolate = (template: string, values: Record<string, string | number> = {}): string => {
	return template.replace(/\{(\w+)\}/g, (match, name: string) => name in values ? String(values[name]) : match)
}
