import { mkdirSync, readFileSync, writeFileSync } from "node:fs"
import { join } from "node:path"
import * as z from "zod"

import { DATA_SCHEMAS } from "#/schemas/registry"

/**
 * Generates `src/data/schemas` JSON Schemas from the Zod schemas in `src/schemas`, and validates every data file.
 *
 * Usage: `pnpm run schemas` (writes) or `pnpm run schemas --check` (fails if a schema is outdated).
 */

const DATA_DIR = join(import.meta.dirname, "..", "src", "data")

const SCHEMAS_DIR = join(DATA_DIR, "schemas")

/** Compare instead of writing. */
const CHECK = process.argv.includes("--check")

/**
 * Converts a Zod schema to a pretty-printed JSON Schema file.
 *
 * @param name - Data file name, used as title.
 */
const toJsonSchema = (name: string, schema: z.ZodType): string => {
	const jsonSchema = z.toJSONSchema(schema, { target: "draft-2020-12", io: "input" })
	const { $schema, ...rest } = jsonSchema
	return `${JSON.stringify({ $schema, title: `${name}.json`, ...rest }, null, "\t")}\n`
}

/**
 * Generates (or checks) every JSON Schema and validates every data file.
 *
 * @returns Number of problems.
 */
const run = (): number => {
	mkdirSync(SCHEMAS_DIR, { recursive: true })
	let problems = 0

	for (const [ name, schema ] of Object.entries(DATA_SCHEMAS)) {
		const schemaPath = join(SCHEMAS_DIR, `${name}.schema.json`)
		const content = toJsonSchema(name, schema)

		if (CHECK) {
			let current = ""
			try {
				current = readFileSync(schemaPath, "utf8")
			} catch {
				// Missing: reported below as outdated.
			}
			if (current !== content) {
				process.stderr.write(`✗ ${schemaPath} is outdated, run \`pnpm run schemas\`\n`)
				problems++
			}
		} else {
			writeFileSync(schemaPath, content)
		}

		const data: unknown = JSON.parse(readFileSync(join(DATA_DIR, `${name}.json`), "utf8"))
		const result = schema.safeParse(data)
		if (!result.success) {
			process.stderr.write(`✗ src/data/${name}.json is invalid:\n${z.prettifyError(result.error)}\n`)
			problems++
		}
	}

	process.stdout.write(problems ? `${problems} problem(s) found\n` : "✓ Data files and JSON Schemas are valid\n")
	return problems
}

process.exitCode = run() ? 1 : 0
