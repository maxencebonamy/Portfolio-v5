import type * as z from "zod"

import { homeSchema } from "#/schemas/home"
import { journeySchema } from "#/schemas/journey"
import { messagesSchema } from "#/schemas/messages"
import { profileSchema } from "#/schemas/profile"
import { projectsSchema } from "#/schemas/projects"
import { siteSchema } from "#/schemas/site"
import { skillsSchema } from "#/schemas/skills"

/** Schema of each `src/data/<name>.json`. */
export const DATA_SCHEMAS: Record<string, z.ZodType> = {
	site: siteSchema,
	profile: profileSchema,
	messages: messagesSchema,
	home: homeSchema,
	projects: projectsSchema,
	skills: skillsSchema,
	journey: journeySchema
}
