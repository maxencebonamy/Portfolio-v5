import type { MessageKey } from "#/content/messages"

/** Home page section reachable from the nav. */
export type SectionLink = {
	id: string
	/** Key in `messages.json`. */
	label: MessageKey
}

/** In display order. Ids double as URL anchors. */
export const SECTIONS: SectionLink[] = [
	{ id: "about", label: "nav.about" },
	{ id: "projects", label: "nav.projects" },
	{ id: "skills", label: "nav.skills" },
	{ id: "journey", label: "nav.journey" },
	{ id: "contact", label: "nav.contact" }
]
