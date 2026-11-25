import * as z from "zod"

import homeJson from "#/data/home.json"
import journeyJson from "#/data/journey.json"
import messagesJson from "#/data/messages.json"
import profileJson from "#/data/profile.json"
import projectsJson from "#/data/projects.json"
import siteJson from "#/data/site.json"
import skillsJson from "#/data/skills.json"
import { DATA_SCHEMAS } from "#/schemas/registry"

/** Same keys as {@link DATA_SCHEMAS}. */
const DATA_FILES: Record<string, unknown> = {
	site: siteJson,
	profile: profileJson,
	messages: messagesJson,
	home: homeJson,
	projects: projectsJson,
	skills: skillsJson,
	journey: journeyJson
}

/**
 * Dev only: validates every data file and logs errors right after an edit.
 * Skipped in production (the build runs `pnpm run schemas --check`), so Zod isn't shipped.
 */
export const validateData = (): void => {
	for (const [ name, schema ] of Object.entries(DATA_SCHEMAS)) {
		const result = schema.safeParse(DATA_FILES[name])
		// eslint-disable-next-line no-console -- development report, removed from production builds
		if (!result.success) console.error(`src/data/${name}.json is invalid:\n${z.prettifyError(result.error)}`)
	}
}
