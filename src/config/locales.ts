/** First one is the default. No Zod here, to keep it out of the app bundle. */
export const LOCALES = [ "fr", "en" ] as const

export type Locale = (typeof LOCALES)[number]
