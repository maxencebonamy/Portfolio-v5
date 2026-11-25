import * as z from "zod"

import type { Locale } from "#/config/locales"
import { LOCALES } from "#/config/locales"

export type { Locale }

/** Supported language code. */
export const localeSchema = z.enum(LOCALES)

/**
 * Schema of a value translated in every supported language.
 *
 * @param schema - Schema for a single language.
 */
export const localized = <T extends z.ZodType>(schema: T): z.ZodObject<Record<Locale, T>> => {
	return z.strictObject({ fr: schema, en: schema }) as z.ZodObject<Record<Locale, T>>
}

/** Text in every supported language. */
export const localizedText = localized(z.string().min(1))

/** Value in every supported language. */
export type Localized<T = string> = Record<Locale, T>

/** Lets JSON files point to their JSON Schema, for editor validation. */
export const schemaKey = { $schema: z.string().optional() }
