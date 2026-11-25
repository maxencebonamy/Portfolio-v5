import * as z from "zod"

import { localized, localizedText, schemaKey } from "#/schemas/localized"

/** Single project. */
export const projectSchema = z.strictObject({
	slug: z.string().regex(/^[a-z0-9]+(-[a-z0-9]+)*$/).describe("URL identifier (/projects/<slug>) and video file name."),
	featured: z.boolean().describe("Shown in the stacked cards of the home page."),
	title: localizedText,
	year: z.string().min(1),
	ongoing: z.boolean().optional().describe("Still in development: shown instead of the year."),
	kind: localizedText.describe("Short category, e.g. Physics simulation."),
	summary: localizedText.describe("One or two sentences, shown on cards and as meta description."),
	description: localized(z.array(z.string().min(1)).min(1)).describe("Paragraphs of the project page."),
	stack: z.array(z.string()).describe("Technologies, also used as filters on the projects page."),
	links: z.array(z.strictObject({
		href: z.url(),
		label: localizedText
	})).optional().describe("External links (website, repository), shown as buttons in this order."),
	accent: z.string().regex(/^#[0-9a-f]{6}$/i).describe("Project color (hex)."),
	frame: z.enum([ "browser", "app" ]).describe("Window drawn around the video."),
	url: z.string().optional().describe("Address shown in the browser frame, only for a site still online."),
	highlights: z.array(z.strictObject({ label: localizedText, value: localizedText })).describe("Key facts of the project page."),
	video: z.strictObject({
		source: z.string().min(1).describe("File name in media/originals."),
		previewStart: z.number().nonnegative().describe("Start of the 8 s looping preview, in seconds."),
		posterAt: z.number().nonnegative().describe("Timestamp of the poster image, in seconds."),
		crf: z.int().min(0).max(51).optional().describe("x264 quality of the full video, lower is better (default 27)."),
		maxrate: z.number().positive().optional().describe("Bitrate cap of the full video, in Mbit/s (default 5).")
	}).describe("Used by `pnpm run media` to encode the web videos.")
})

/** `src/data/projects.json`. */
export const projectsSchema = z.strictObject({
	...schemaKey,
	projects: z.array(projectSchema).min(1)
})

/** A project. */
export type Project = z.infer<typeof projectSchema>
