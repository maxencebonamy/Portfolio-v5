import skillsJson from "#/data/skills.json"
import type { Skills } from "#/schemas/skills"

/** From `src/data/skills.json`. */
export const skills = skillsJson as Skills

/** Practices, not technologies: excluded from the count. */
const NON_TECHNOLOGIES = new Set([ "UI/UX" ])

/** Distinct technologies in the toolbox. */
export const technologyCount = new Set([
	skills.favorite.name,
	...skills.favorite.items,
	...skills.languages.items,
	...skills.backend.items,
	...skills.frontend.items,
	...skills.devops.items
].filter(item => !NON_TECHNOLOGIES.has(item))).size
