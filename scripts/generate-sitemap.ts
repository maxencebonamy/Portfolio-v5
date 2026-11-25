import { writeFileSync } from "node:fs"
import { join } from "node:path"

import { LOCALES } from "#/config/locales"
import { site } from "#/content/site"
import { DEFAULT_LOCALE } from "#/lib/i18n"
import type { PageMeta } from "#/seo/page-meta"
import { allPagesMeta, pageUrl } from "#/seo/page-meta"

/**
 * Writes `sitemap.xml` and `robots.txt` to `dist/client`.
 * Runs after `vite build`, which prerenders the pages.
 */

const DIST_DIR = join(import.meta.dirname, "..", "dist", "client")

/** `hreflang` links of a page to all its languages, plus `x-default`. */
const renderAlternates = (path: string): string[] => {
	return [
		...LOCALES.map(locale => `\t\t<xhtml:link rel="alternate" hreflang="${locale}" href="${pageUrl(path, locale)}"/>`),
		`\t\t<xhtml:link rel="alternate" hreflang="x-default" href="${pageUrl(path, DEFAULT_LOCALE)}"/>`
	]
}

/** Sitemap XML of the indexable pages, one entry per language. */
const renderSitemap = (pages: PageMeta[]): string => {
	const today = new Date().toISOString().slice(0, 10)
	const urls = pages.map(page => [
		"\t<url>",
		`\t\t<loc>${pageUrl(page.path, page.locale)}</loc>`,
		...renderAlternates(page.path),
		`\t\t<lastmod>${today}</lastmod>`,
		`\t\t<priority>${page.path === "/" ? "1.0" : "0.8"}</priority>`,
		"\t</url>"
	].join("\n"))
	return [
		"<?xml version=\"1.0\" encoding=\"UTF-8\"?>",
		"<urlset xmlns=\"http://www.sitemaps.org/schemas/sitemap/0.9\" xmlns:xhtml=\"http://www.w3.org/1999/xhtml\">",
		...urls,
		"</urlset>",
		""
	].join("\n")
}

/** Writes the sitemap and `robots.txt`. */
const run = (): void => {
	const pages = LOCALES.flatMap(locale => allPagesMeta(locale))
	writeFileSync(join(DIST_DIR, "sitemap.xml"), renderSitemap(pages))
	writeFileSync(join(DIST_DIR, "robots.txt"), `User-agent: *\nAllow: /\n\nSitemap: ${site.url}/sitemap.xml\n`)

	process.stdout.write(`✓ Wrote sitemap.xml (${pages.length} pages) and robots.txt\n`)
}

run()
