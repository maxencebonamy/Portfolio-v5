import { LOCALES } from "#/config/locales"
import { site } from "#/content/site"
import { DEFAULT_LOCALE } from "#/lib/i18n"
import type { PageMeta } from "#/seo/page-meta"
import { absoluteUrl, OG_LOCALES, pageUrl } from "#/seo/page-meta"

/** `<meta>` or `<link>` tag. */
export type HeadTag
	= | { tag: "meta", key: "name" | "property", name: string, content: string }
		| { tag: "link", rel: string, href: string, hrefLang?: string }

/** `hreflang` links to every language of a page, plus `x-default` (the default language). */
const alternateTags = (meta: PageMeta): HeadTag[] => {
	if (meta.noindex) return []
	return [
		...LOCALES.map(locale => ({ tag: "link", rel: "alternate", hrefLang: locale, href: pageUrl(meta.path, locale) }) as const),
		{ tag: "link", rel: "alternate", hrefLang: "x-default", href: pageUrl(meta.path, DEFAULT_LOCALE) }
	]
}

/** `<meta>` and `<link>` tags of a page. */
export const getHeadTags = (meta: PageMeta): HeadTag[] => {
	const url = pageUrl(meta.path, meta.locale)
	const image = absoluteUrl(meta.image)
	return [
		{ tag: "meta", key: "name", name: "description", content: meta.description },
		{ tag: "meta", key: "name", name: "keywords", content: site.keywords.join(", ") },
		{ tag: "meta", key: "name", name: "author", content: site.name },
		{ tag: "meta", key: "name", name: "robots", content: meta.noindex ? "noindex, follow" : "index, follow, max-image-preview:large" },
		{ tag: "link", rel: "canonical", href: url },
		...alternateTags(meta),
		{ tag: "meta", key: "property", name: "og:type", content: meta.type },
		{ tag: "meta", key: "property", name: "og:site_name", content: site.name },
		{ tag: "meta", key: "property", name: "og:title", content: meta.title },
		{ tag: "meta", key: "property", name: "og:description", content: meta.description },
		{ tag: "meta", key: "property", name: "og:url", content: url },
		{ tag: "meta", key: "property", name: "og:image", content: image },
		{ tag: "meta", key: "property", name: "og:image:alt", content: meta.title },
		{ tag: "meta", key: "property", name: "og:locale", content: OG_LOCALES[meta.locale] },
		...LOCALES
			.filter(locale => locale !== meta.locale)
			.map(locale => ({ tag: "meta", key: "property", name: "og:locale:alternate", content: OG_LOCALES[locale] }) as const),
		{ tag: "meta", key: "name", name: "twitter:card", content: "summary_large_image" },
		{ tag: "meta", key: "name", name: "twitter:title", content: meta.title },
		{ tag: "meta", key: "name", name: "twitter:description", content: meta.description },
		{ tag: "meta", key: "name", name: "twitter:image", content: image }
	]
}

/**
 * Page structured data as a JSON-LD graph.
 *
 * @returns JSON for a `<script type="application/ld+json">`.
 */
export const getJsonLd = (meta: PageMeta): string => {
	return JSON.stringify({ "@context": "https://schema.org", "@graph": meta.structuredData })
}
