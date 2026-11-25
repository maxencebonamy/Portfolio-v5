import * as z from "zod"

import { localizedText, schemaKey } from "#/schemas/localized"

/** Shared by every skill category. */
const categoryFields = {
	title: localizedText,
	items: z.array(z.string().min(1)).min(1)
}

/** `src/data/skills.json`. */
export const skillsSchema = z.strictObject({
	...schemaKey,
	marquee: z.array(z.string().min(1)).describe("Scrolling band under the hero."),
	favorite: z.strictObject({
		name: z.string().min(1),
		badge: z.string().min(1).describe("Short logo text, e.g. TS."),
		color: z.string().regex(/^#[0-9a-f]{6}$/i),
		label: localizedText,
		description: localizedText,
		items: z.array(z.string().min(1))
	}).describe("Large card: language of choice."),
	languages: z.strictObject({
		...categoryFields,
		snippets: z.array(z.string().min(1)).min(1).describe("\"Hello world\" lines typed in turn on the card.")
	}),
	backend: z.strictObject({
		...categoryFields,
		requests: z.array(z.strictObject({
			method: z.enum([ "GET", "POST", "PUT", "PATCH", "DELETE" ]),
			path: z.string().startsWith("/"),
			status: z.int().min(100).max(599)
		})).min(1).describe("Fake API log scrolling on the card.")
	}),
	frontend: z.strictObject({
		...categoryFields,
		swatches: z.array(z.string().regex(/^#[0-9a-f]{6}$/i)).min(1).describe("Colors of the wireframe blocks.")
	}),
	devops: z.strictObject({
		...categoryFields,
		pipeline: z.array(z.string().min(1)).min(2).describe("CI/CD steps run in a loop on the card.")
	}),
	workStyle: z.strictObject({
		title: localizedText,
		traits: z.array(z.strictObject({ title: localizedText, text: localizedText }))
	}),
	learning: z.strictObject({
		label: localizedText,
		items: z.array(z.string().min(1)).min(1)
	})
})

/** The toolbox. */
export type Skills = z.infer<typeof skillsSchema>
