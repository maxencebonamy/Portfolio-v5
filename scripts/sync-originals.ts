import { execFileSync } from "node:child_process"
import { createHash } from "node:crypto"
import { existsSync, mkdirSync, readdirSync, readFileSync } from "node:fs"
import { join } from "node:path"

/**
 * Syncs the source videos of `media/originals` with the assets of the `media` GitHub release,
 * so they stay out of the git history. Only new or changed files are transferred.
 *
 * Usage: `pnpm run media:pull` or `pnpm run media:push`. Requires the GitHub CLI (`gh`), logged in.
 */

const ROOT = join(import.meta.dirname, "..")

const SOURCES_DIR = join(ROOT, "media", "originals")

const RELEASE_TAG = "media"

type Asset = {
	name: string
	digest: string | null
}

/** Runs gh and returns its output. */
const gh = (args: string[]): string => execFileSync("gh", args, { cwd: ROOT, encoding: "utf8", stdio: [ "ignore", "pipe", "inherit" ] })

/** Assets of the release by name, or null if the release does not exist yet. */
const getAssets = (): Map<string, Asset> | null => {
	try {
		const output = execFileSync("gh", [ "release", "view", RELEASE_TAG, "--json", "assets" ], { cwd: ROOT, encoding: "utf8", stdio: "pipe" })
		const { assets } = JSON.parse(output) as { assets: Asset[] }
		return new Map(assets.map(asset => [ asset.name, asset ]))
	} catch {
		return null
	}
}

/** Digest of a local file, in the format GitHub uses. */
const getDigest = (path: string): string => {
	return `sha256:${createHash("sha256").update(readFileSync(path)).digest("hex")}`
}

/** Whether the local file differs from its release asset. */
const isChanged = (name: string, assets: Map<string, Asset>): boolean => {
	const asset = assets.get(name)
	const path = join(SOURCES_DIR, name)
	if (!asset || !existsSync(path)) return true
	return asset.digest !== getDigest(path)
}

/** Downloads the release assets missing or different locally. */
const pull = (): void => {
	const assets = getAssets()
	if (!assets) throw new Error(`No "${RELEASE_TAG}" release: run "pnpm run media:push" first.`)
	mkdirSync(SOURCES_DIR, { recursive: true })

	const names = [ ...assets.keys() ].filter(name => isChanged(name, assets))
	for (const name of names) {
		gh([ "release", "download", RELEASE_TAG, "--pattern", name, "--dir", SOURCES_DIR, "--clobber" ])
		process.stdout.write(`✓ ${name}\n`)
	}
	process.stdout.write(names.length ? `${names.length} file(s) downloaded.\n` : "Already up to date.\n")
}

/** Uploads the local videos missing or different in the release, creating it if needed. */
const push = (): void => {
	let assets = getAssets()
	if (!assets) {
		const notes = "Source videos of the projects. See the README."
		gh([ "release", "create", RELEASE_TAG, "--title", "Source media", "--notes", notes, "--latest=false" ])
		assets = new Map()
	}

	const names = readdirSync(SOURCES_DIR).filter(name => name.endsWith(".mp4")).sort()
	const changed = names.filter(name => isChanged(name, assets))
	for (const name of changed) {
		gh([ "release", "upload", RELEASE_TAG, join(SOURCES_DIR, name), "--clobber" ])
		process.stdout.write(`✓ ${name}\n`)
	}
	process.stdout.write(changed.length ? `${changed.length} file(s) uploaded.\n` : "Already up to date.\n")
}

const command = process.argv[2]
if (command === "pull") pull()
else if (command === "push") push()
else throw new Error("Usage: sync-originals.ts <pull|push>")
