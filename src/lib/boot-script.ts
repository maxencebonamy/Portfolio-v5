import { LOCALES } from "#/config/locales"
import { STORAGE_KEYS } from "#/config/storage-keys"
import { DEFAULT_LOCALE } from "#/lib/i18n"

/** In ms. Shows a page still waiting for its language anyway (e.g. scripts failed). */
const PENDING_LANG_TIMEOUT = 4000

/**
 * Inline `<head>` script, run before first paint of the prerendered HTML. Sets on `<html>`:
 *
 * - `data-theme`: saved theme, avoids a flash of the default one;
 * - on the SPA shell only (`404.html`, prerendered in the default language), `lang` and
 *   `data-pending-lang` for a URL in another language: the page stays hidden until React
 *   switches it (see `I18nProvider`).
 *
 * Duplicates `getTheme` and `localeFromPath` in plain JS since it runs before the app: keep in sync.
 */
export const BOOT_SCRIPT = `(() => {
	const root = document.documentElement
	let theme = null
	try {
		theme = localStorage.getItem(${JSON.stringify(STORAGE_KEYS.theme)})
	} catch {}
	if (theme === "light" || theme === "dark") root.dataset.theme = theme
	if (!root.hasAttribute("data-shell")) return
	const prefix = location.pathname.split("/")[1]
	if (prefix !== ${JSON.stringify(DEFAULT_LOCALE)} && ${JSON.stringify(LOCALES)}.includes(prefix)) {
		root.lang = prefix
		root.dataset.pendingLang = ""
		setTimeout(() => delete root.dataset.pendingLang, ${PENDING_LANG_TIMEOUT})
	}
})()`
