import { messages } from "#/content/messages"
import { fullName, profile } from "#/content/profile"
import { projects } from "#/content/projects"
import { site } from "#/content/site"
import { localizePath } from "#/lib/i18n"
import type { Locale } from "#/schemas/localized"
import type { Project } from "#/schemas/projects"

/** Schema.org JSON-LD object. */
export type StructuredData = Record<string, unknown>

/** What search engines and social networks need about a page. */
export type PageMeta = {
	title: string
	description: string
	/** Without language prefix (`/projects`), see {@link pageUrl}. */
	path: string
	locale: Locale
	/** Social card, relative to `public/`. */
	image: string
	type: "website" | "profile" | "article"
	/** E.g. the 404 page. */
	noindex?: boolean
	structuredData: StructuredData[]
	/** Top-of-page WebP, preloaded so it loads in parallel with the scripts. */
	preloadImage?: string
}

/** Open Graph locale per language. */
export const OG_LOCALES: Record<Locale, string> = { fr: "fr_FR", en: "en_US" }

/**
 * Absolute URL on the site.
 *
 * @param path - Starts with `/`.
 */
export const absoluteUrl = (path: string): string => {
	return `${site.url}${path === "/" ? "" : path}`
}

/** Absolute URL of a page in a language, e.g. `/projects` in English -> `https://.../en/projects`. */
export const pageUrl = (path: string, locale: Locale): string => {
	return absoluteUrl(localizePath(path, locale))
}

/** Schema.org `Person` for me. */
const personData = (locale: Locale): StructuredData => {
	return {
		"@type": "Person",
		"@id": `${site.url}/#person`,
		"name": fullName,
		"givenName": profile.firstName,
		"familyName": profile.lastName,
		"jobTitle": profile.jobTitle[locale],
		"worksFor": { "@type": "Organization", "name": profile.company },
		"address": { "@type": "PostalAddress", "addressLocality": profile.location },
		"email": `mailto:${profile.email}`,
		"url": site.url,
		"image": absoluteUrl(profile.photo.src),
		"sameAs": profile.socials.map(social => social.href)
	}
}

/** Schema.org `BreadcrumbList`, one item per level. */
const breadcrumbData = (items: { name: string, path: string }[], locale: Locale): StructuredData => {
	return {
		"@type": "BreadcrumbList",
		"itemListElement": items.map((item, index) => ({
			"@type": "ListItem",
			"position": index + 1,
			"name": item.name,
			"item": pageUrl(item.path, locale)
		}))
	}
}

/** Home page meta. */
export const homeMeta = (locale: Locale): PageMeta => {
	return {
		title: site.title[locale],
		description: site.description[locale],
		path: "/",
		locale,
		image: site.ogImage,
		type: "profile",
		preloadImage: profile.photo.srcWebp,
		structuredData: [
			personData(locale),
			{
				"@type": "WebSite",
				"@id": `${site.url}/#website`,
				"name": site.name,
				"url": site.url,
				"inLanguage": [ "fr", "en" ],
				"author": { "@id": `${site.url}/#person` }
			},
			{
				"@type": "ProfilePage",
				"url": pageUrl("/", locale),
				"inLanguage": locale,
				"mainEntity": { "@id": `${site.url}/#person` }
			}
		]
	}
}

/** Projects archive meta. */
export const projectsMeta = (locale: Locale): PageMeta => {
	const title = `${messages["nav.allProjects"][locale]} | ${site.name}`
	return {
		title,
		description: messages["projectsPage.description"][locale],
		path: "/projects",
		locale,
		image: site.ogImage,
		type: "website",
		structuredData: [
			{
				"@type": "CollectionPage",
				"name": title,
				"url": pageUrl("/projects", locale),
				"inLanguage": locale,
				"hasPart": projects.map(project => ({
					"@type": "CreativeWork",
					"name": project.title[locale],
					"url": pageUrl(`/projects/${project.slug}`, locale)
				}))
			},
			breadcrumbData([
				{ name: messages["nav.home"][locale], path: "/" },
				{ name: messages["nav.allProjects"][locale], path: "/projects" }
			], locale)
		]
	}
}

/** Project page meta. */
export const projectMeta = (project: Project, locale: Locale): PageMeta => {
	const path = `/projects/${project.slug}`
	return {
		title: `${project.title[locale]} | ${site.name}`,
		description: project.summary[locale],
		path,
		locale,
		image: `/videos/${project.slug}.jpg`,
		type: "article",
		structuredData: [
			{
				"@type": "CreativeWork",
				"name": project.title[locale],
				"description": project.summary[locale],
				"url": pageUrl(path, locale),
				"inLanguage": locale,
				"image": absoluteUrl(`/videos/${project.slug}.jpg`),
				"dateCreated": project.year,
				"genre": project.kind[locale],
				"keywords": project.stack.join(", "),
				"author": { "@id": `${site.url}/#person` },
				...project.links && { sameAs: project.links.map(link => link.href) }
			},
			breadcrumbData([
				{ name: messages["nav.home"][locale], path: "/" },
				{ name: messages["nav.allProjects"][locale], path: "/projects" },
				{ name: project.title[locale], path }
			], locale)
		]
	}
}

/** 404 page meta, noindex. */
export const notFoundMeta = (locale: Locale): PageMeta => {
	return {
		title: `${messages["notFound.title"][locale]} | ${site.name}`,
		description: messages["notFound.message"][locale],
		path: "/404",
		locale,
		image: site.ogImage,
		type: "website",
		noindex: true,
		structuredData: []
	}
}

/** Every indexable page, for prerendering and the sitemap. */
export const allPagesMeta = (locale: Locale): PageMeta[] => {
	return [
		homeMeta(locale),
		projectsMeta(locale),
		...projects.map(project => projectMeta(project, locale))
	]
}
