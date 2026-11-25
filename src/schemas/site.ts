import * as z from "zod"

import { localizedText, schemaKey } from "#/schemas/localized"

/** `src/data/site.json`. */
export const siteSchema = z.strictObject({
	...schemaKey,
	url: z.url().describe("Public URL of the site, without trailing slash. Used for canonical URLs, the sitemap and social cards."),
	name: z.string().min(1).describe("Site name, shown in social cards."),
	title: localizedText.describe("Default page title."),
	description: localizedText.describe("Default meta description (around 150 characters)."),
	keywords: z.array(z.string()).describe("Meta keywords."),
	ogImage: z.string().startsWith("/").describe("Social card image, relative to `public/` (1200x630 recommended)."),
	themeColor: z.strictObject({
		dark: z.string().regex(/^#[0-9a-f]{6}$/i),
		light: z.string().regex(/^#[0-9a-f]{6}$/i)
	}).describe("Browser UI color for each theme.")
})

/** Global SEO settings. */
export type Site = z.infer<typeof siteSchema>
