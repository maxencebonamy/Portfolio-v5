import * as z from "zod"

import { localized, localizedText, schemaKey } from "#/schemas/localized"

/** Social network link. */
export const socialSchema = z.strictObject({
	label: z.string().min(1).describe("Network name, e.g. GitHub."),
	href: z.url(),
	handle: z.string().min(1).describe("Short handle shown next to the label.")
})

/** `src/data/profile.json`. */
export const profileSchema = z.strictObject({
	...schemaKey,
	firstName: z.string().min(1),
	lastName: z.string().min(1),
	jobTitle: localizedText,
	company: z.string().min(1),
	location: z.string().min(1).describe("City shown in the hero and the footer."),
	timeZone: z.string().min(1).describe("IANA time zone of the local clock, e.g. Europe/Paris."),
	email: z.email(),
	codingSince: z.int().describe("Year I started programming."),
	proSince: z.int().describe("Year my professional experience started."),
	openToWork: z.boolean().describe("Shows the \"open to freelance work\" badges."),
	resume: localized(z.string().startsWith("/")).describe("Resume PDF in each language, relative to `public/`."),
	photo: z.strictObject({
		src: z.string().startsWith("/"),
		srcWebp: z.string().startsWith("/"),
		width: z.int().positive(),
		height: z.int().positive()
	}).describe("Cut-out portrait, relative to `public/`."),
	socials: z.array(socialSchema)
})

/** Identity and contact details. */
export type Profile = z.infer<typeof profileSchema>

/** Social network link. */
export type Social = z.infer<typeof socialSchema>
