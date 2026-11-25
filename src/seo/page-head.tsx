import { getHeadTags, getJsonLd } from "#/seo/head-tags"
import type { PageMeta } from "#/seo/page-meta"

type PageHeadProps = {
	meta: PageMeta
}

/**
 * Title, meta tags and JSON-LD of a page. React hoists `<title>`, `<meta>` and `<link>` into `<head>`,
 * at prerender and in the browser (follows navigation and language). JSON-LD stays in the body; crawlers read it there too.
 */
export const PageHead = ({ meta }: PageHeadProps) => {
	return (
		<>
			<title>{meta.title}</title>
			{meta.preloadImage && <link rel="preload" as="image" type="image/webp" href={meta.preloadImage} fetchPriority="high" />}
			{getHeadTags(meta).map(tag => {
				if (tag.tag === "link") return <link key={`${tag.rel}:${tag.hrefLang}`} rel={tag.rel} href={tag.href} hrefLang={tag.hrefLang} />
				const key = `${tag.name}:${tag.content}`
				return tag.key === "name"
					? <meta key={key} name={tag.name} content={tag.content} />
					: <meta key={key} property={tag.name} content={tag.content} />
			})}
			<script type="application/ld+json" dangerouslySetInnerHTML={{ __html: getJsonLd(meta).replaceAll("<", "\\u003c") }} />
		</>
	)
}
