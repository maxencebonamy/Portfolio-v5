import { SECTIONS } from "#/config/sections"
import type { MessageKey } from "#/content/messages"
import { fullName, profile } from "#/content/profile"
import { findProject, projects } from "#/content/projects"
import type { Locale } from "#/schemas/localized"

/** Side effect of a command: clear the screen or go to a page. */
export type TerminalEffect
	= | { type: "clear" }
		| { type: "page", to: "/" | "/projects" }
		| { type: "project", slug: string }
		| { type: "section", id: string }

/** Lines to print and an optional effect. */
export type TerminalResult = {
	output: string[]
	effect?: TerminalEffect
}

type TerminalContext = {
	t: (key: MessageKey, values?: Record<string, string | number>) => string
	lang: Locale
}

const PROJECTS_FOLDER = "projects"

/** Listed by `ls`: home sections, with the projects archive replacing the section of the same name. */
const FOLDERS = [ ...SECTIONS.map(section => section.id).filter(id => id !== PROJECTS_FOLDER), PROJECTS_FOLDER ]

/** `cd` targets leading home. */
const HOME_TARGETS = new Set([ "", "~", "/", "..", "home" ])

/**
 * Resolves a `cd` target, e.g. `projects/blindify`.
 *
 * @returns `undefined` when nothing matches.
 */
const resolveFolder = (target: string): TerminalEffect | undefined => {
	const path = target.replace(/^~?\//, "").replace(/\/$/, "")
	if (HOME_TARGETS.has(path)) return { type: "page", to: "/" }
	if (path === PROJECTS_FOLDER) return { type: "page", to: "/projects" }

	const slug = path.startsWith(`${PROJECTS_FOLDER}/`) ? path.slice(PROJECTS_FOLDER.length + 1) : path
	if (findProject(slug)) return { type: "project", slug }
	if (SECTIONS.some(section => section.id === path)) return { type: "section", id: path }
	return undefined
}

/** Runs a command of the 404 terminal, a tiny fake shell to browse the site. */
export const runTerminalCommand = (input: string, { t, lang }: TerminalContext): TerminalResult => {
	const [ command = "", ...args ] = input.trim().split(/\s+/)
	const argument = args.join(" ")

	switch (command) {
		case "":
			return { output: [] }
		case "help":
			return { output: [ t("terminal.help") ] }
		case "ls":
			if (argument.replace(/\/$/, "") === PROJECTS_FOLDER) return { output: [ projects.map(project => project.slug).join("  ") ] }
			return { output: [ FOLDERS.map(name => `${name}/`).join("  ") ] }
		case "cd": {
			const effect = resolveFolder(argument)
			return effect ? { output: [], effect } : { output: [ t("terminal.noSuchFolder", { target: argument }) ] }
		}
		case "whoami":
			return { output: [ `${fullName}, ${profile.jobTitle[lang]}` ] }
		case "clear":
			return { output: [], effect: { type: "clear" } }
		case "exit":
			return { output: [], effect: { type: "page", to: "/" } }
		case "sudo":
			return { output: [ t("terminal.sudo") ] }
		case "rm":
			return { output: [ t("terminal.rm") ] }
		default:
			return { output: [ t("terminal.commandNotFound", { command }) ] }
	}
}
