import * as z from "zod"

import { localizedText, schemaKey } from "#/schemas/localized"

/** `src/data/messages.json`: short UI texts. Free-form keys; `{name}` placeholders filled at runtime. */
export const messagesSchema = z.object(schemaKey).catchall(localizedText)
