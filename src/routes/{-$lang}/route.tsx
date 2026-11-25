import { createFileRoute, notFound } from "@tanstack/react-router"

import { DEFAULT_LOCALE, isLocale } from "#/lib/i18n"

/**
 * Optional language prefix: none for French (`/projects`), `/en` for English (`/en/projects`).
 * Any other prefix, the default one included (`/fr`), is a 404.
 */
export const Route = createFileRoute("/{-$lang}")({
	beforeLoad: ({ params }) => {
		if (params.lang !== undefined && (!isLocale(params.lang) || params.lang === DEFAULT_LOCALE)) throw notFound()
	}
})
