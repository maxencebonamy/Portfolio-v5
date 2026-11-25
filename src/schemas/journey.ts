import * as z from "zod"

import { localizedText, schemaKey } from "#/schemas/localized"

/** Journey timeline step. */
export const journeyStepSchema = z.strictObject({
	year: z.string().min(1).optional().describe("Omit on the current step: \"Today\" is shown instead."),
	age: z.int().positive().optional(),
	title: localizedText,
	place: localizedText,
	text: localizedText,
	current: z.boolean().optional().describe("Highlights the step as the current one.")
})

/** `src/data/journey.json`. */
export const journeySchema = z.strictObject({
	...schemaKey,
	steps: z.array(journeyStepSchema).min(1)
})

/** Journey timeline step. */
export type JourneyStep = z.infer<typeof journeyStepSchema>
