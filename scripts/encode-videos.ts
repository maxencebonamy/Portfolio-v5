import { execFileSync } from "node:child_process"
import { existsSync, mkdirSync } from "node:fs"
import { join } from "node:path"

import { projects } from "#/content/projects"

/**
 * Encodes `media/originals` into `public/videos`: 1080p video, 8 s looping preview and poster per project.
 * Sources and timestamps: `video` field of `src/data/projects.json`.
 *
 * Usage: `pnpm run media:videos [<slug>]`. Requires ffmpeg.
 */

const ROOT = join(import.meta.dirname, "..")

const SOURCES_DIR = join(ROOT, "media", "originals")

const OUTPUT_DIR = join(ROOT, "public", "videos")

/** In s. */
const PREVIEW_DURATION = 8

/** Runs ffmpeg quietly, overwriting outputs. */
const ffmpeg = (args: string[]): void => {
	execFileSync("ffmpeg", [ "-nostdin", "-v", "error", "-y", ...args ], { stdio: "inherit" })
}

/** Encodes the requested projects (all by default). */
const run = (): void => {
	const slugs = process.argv.slice(2)
	const selected = slugs.length ? projects.filter(project => slugs.includes(project.slug)) : projects
	mkdirSync(OUTPUT_DIR, { recursive: true })

	for (const { slug, video } of selected) {
		const input = join(SOURCES_DIR, video.source)
		if (!existsSync(input)) throw new Error(`Missing source video: ${input}`)

		// Project page: 1080p, no audio, streamable.
		ffmpeg([ "-i",
			input,
			"-an",
			"-c:v",
			"libx264",
			"-preset",
			"slow",
			"-crf",
			String(video.crf ?? 27),
			// Bitrate cap: noisy footage (fractals, cellular grids) ignores the CRF and gets huge.
			"-maxrate",
			`${video.maxrate ?? 5}M`,
			"-bufsize",
			`${(video.maxrate ?? 5) * 2}M`,
			"-pix_fmt",
			"yuv420p",
			"-vf",
			"scale=1920:-2",
			"-movflags",
			"+faststart",
			join(OUTPUT_DIR, `${slug}.mp4`) ])

		// Card preview: short and light.
		ffmpeg([ "-ss",
			String(video.previewStart),
			"-t",
			String(PREVIEW_DURATION),
			"-i",
			input,
			"-an",
			"-c:v",
			"libx264",
			"-preset",
			"slow",
			"-crf",
			"29",
			"-maxrate",
			"2M",
			"-bufsize",
			"4M",
			"-pix_fmt",
			"yuv420p",
			"-vf",
			"scale=960:-2",
			"-movflags",
			"+faststart",
			join(OUTPUT_DIR, `${slug}-preview.mp4`) ])

		// Poster, also the project page's social card.
		ffmpeg([ "-ss",
			String(video.posterAt),
			"-i",
			input,
			"-frames:v",
			"1",
			"-vf",
			"scale=1600:-2",
			"-q:v",
			"3",
			join(OUTPUT_DIR, `${slug}.jpg`) ])

		process.stdout.write(`✓ ${slug}\n`)
	}
}

run()
