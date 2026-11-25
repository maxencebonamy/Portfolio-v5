import * as z from "zod"

import { localized, localizedText, schemaKey } from "#/schemas/localized"

/** Hero title line. */
export const heroLineSchema = z.strictObject({
	text: z.string().min(1),
	style: z.enum([ "light", "outline", "bold" ]).describe("light: thin weight, outline: hollow italic, bold: black weight."),
	dot: z.boolean().optional().describe("Adds a coral dot after the line.")
})

/** Section heading: a plain line, then a hollow italic one. */
export const sectionTitleSchema = z.strictObject({
	first: localizedText.describe("First line, plain."),
	second: localizedText.describe("Second line, hollow italic.")
})

/** About section key figure. */
export const statSchema = z.strictObject({
	value: z.union([ z.enum([ "yearsCoding", "technologies", "yearsPro" ]), z.int().nonnegative() ])
		.describe("Computed value to display, or a fixed number."),
	suffix: localizedText,
	label: localizedText.describe("Supports the {company} placeholder.")
})

/** `src/data/home.json`. */
export const homeSchema = z.strictObject({
	...schemaKey,
	hero: z.strictObject({
		title: localized(z.array(heroLineSchema).min(1)),
		intro: localizedText.describe("Text under the title. Words between [brackets] are highlighted."),
		badge: localizedText.describe("Text running around the rotating badge."),
		primaryCta: localizedText,
		secondaryCta: localizedText
	}),
	about: z.strictObject({
		label: localizedText,
		intro: localizedText.describe("Lights up word by word on scroll. Prefix a word with * to highlight it (e.g. *curious)."),
		stats: z.array(statSchema)
	}),
	projects: z.strictObject({
		label: localizedText,
		title: sectionTitleSchema,
		allProjects: localizedText,
		moreProjects: localizedText.describe("Link under the featured projects. {count}: number of projects not featured.")
	}),
	skills: z.strictObject({
		label: localizedText,
		title: sectionTitleSchema
	}),
	journey: z.strictObject({
		label: localizedText,
		title: sectionTitleSchema,
		intro: localizedText
	}),
	contact: z.strictObject({
		label: localizedText,
		title: sectionTitleSchema,
		intro: localizedText,
		copy: localizedText,
		resume: localizedText,
		resumeDetails: localizedText
	})
})

/** Home page section texts. */
export type Home = z.infer<typeof homeSchema>

/** Hero title line. */
export type HeroLine = z.infer<typeof heroLineSchema>

/** Two-line section heading. */
export type SectionTitleContent = z.infer<typeof sectionTitleSchema>

/** About section key figure. */
export type Stat = z.infer<typeof statSchema>
