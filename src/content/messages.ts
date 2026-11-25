import messagesJson from "#/data/messages.json"
import type { Localized } from "#/schemas/localized"

/** Key of `src/data/messages.json`. */
export type MessageKey = Exclude<keyof typeof messagesJson, "$schema">

/** UI texts, validated at build time (`pnpm run schemas`). */
export const messages = messagesJson as Record<MessageKey, Localized>
