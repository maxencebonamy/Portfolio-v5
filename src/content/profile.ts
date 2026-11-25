import profileJson from "#/data/profile.json"
import type { Profile } from "#/schemas/profile"

/** From `src/data/profile.json`. */
export const profile = profileJson as Profile

export const fullName = `${profile.firstName} ${profile.lastName}`
