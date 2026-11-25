import journeyJson from "#/data/journey.json"
import type { JourneyStep } from "#/schemas/journey"

/** From `src/data/journey.json`. */
export const journey = (journeyJson as { steps: JourneyStep[] }).steps
