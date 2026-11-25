import { readFileSync } from "node:fs"
import { join } from "node:path"
import type { Sharp } from "sharp"
import sharp from "sharp"

import { fullName, profile } from "#/content/profile"
import { site } from "#/content/site"
import { DEFAULT_LOCALE } from "#/lib/i18n"

/**
 * Generates `public/` images from `media/originals/photo.png` (cut-out portrait with transparency):
 * - portrait with a white "sticker" outline, PNG and WebP;
 * - social card (`og-image.jpg`, 1200x630): portrait, name, job title;
 * - Apple touch icon, from `public/favicon.svg`.
 *
 * Usage: `pnpm run media:images`, after changing the photo or profile.
 */

const ROOT = join(import.meta.dirname, "..")

const PUBLIC_DIR = join(ROOT, "public")

const SOURCE_PHOTO = join(ROOT, "media", "originals", "photo.png")

/** In source image px. */
const OUTLINE_WIDTH = 22

/** In px. Higher gives rounder contours around the hair. */
const OUTLINE_SMOOTHING = 8

/** Open Graph recommended size. */
const OG_SIZE = { width: 1200, height: 630 }

/** Escapes text for SVG. */
const escapeXml = (value: string): string => {
	return value.replaceAll("&", "&amp;").replaceAll("<", "&lt;").replaceAll(">", "&gt;")
}

/** Social card background and text, as SVG markup. */
const ogBackground = (): string => {
	const { width, height } = OG_SIZE
	const domain = site.url.replace(/^https?:\/\//, "")
	return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
		<defs>
			<radialGradient id="glow" cx="78%" cy="100%" r="70%">
				<stop offset="0" stop-color="#ff6a69" stop-opacity="0.55" />
				<stop offset="1" stop-color="#ff6a69" stop-opacity="0" />
			</radialGradient>
		</defs>
		<rect width="100%" height="100%" fill="${site.themeColor.dark}" />
		<rect width="100%" height="100%" fill="url(#glow)" />
		<g font-family="Poppins, Helvetica, Arial, sans-serif">
			<text x="72" y="270" font-size="84" font-weight="800" fill="#ebebeb">${escapeXml(fullName)}</text>
			<text x="72" y="345" font-size="40" fill="#ff6a69">${escapeXml(profile.jobTitle[DEFAULT_LOCALE])}</text>
		</g>
		<text x="72" y="540" font-family="JetBrains Mono, Menlo, monospace" font-size="24" fill="#8f8f8f">${escapeXml(domain)}</text>
	</svg>`
}

/**
 * Runs one operation on a single-channel raw mask.
 * Sharp applies pipeline operations in a fixed order, so each step needs its own pipeline.
 *
 * @param mask - Raw 8-bit mask.
 */
const maskStep = async (mask: Buffer, size: { width: number, height: number }, operation: (image: Sharp) => Sharp): Promise<Buffer> => {
	return operation(sharp(mask, { raw: { ...size, channels: 1 } })).extractChannel(0).raw().toBuffer()
}

/**
 * Adds a smooth white outline around a cut-out image, hiding irregular edges (hair).
 *
 * @param image - Cut-out PNG with transparency.
 * @returns Outlined PNG, same size.
 */
const addOutline = async (image: Buffer): Promise<Buffer> => {
	const { width = 0, height = 0 } = await sharp(image).metadata()
	const size = { width, height }

	const alpha = await sharp(image).extractChannel("alpha").raw().toBuffer()
	// Grow the silhouette: after a blur, any partly covered pixel joins it.
	const grown = await maskStep(await maskStep(alpha, size, mask => mask.blur(OUTLINE_WIDTH / 1.9)), size, mask => mask.threshold(10))
	// Smooth (blur, cut at half coverage), then anti-alias.
	const smoothed = await maskStep(await maskStep(grown, size, mask => mask.blur(OUTLINE_SMOOTHING)), size, mask => mask.threshold(128))
	const silhouette = await maskStep(smoothed, size, mask => mask.blur(0.8))

	const outline = await sharp({ create: { width, height, channels: 3, background: "#ffffff" } })
		.joinChannel(silhouette, { raw: { ...size, channels: 1 } })
		.png()
		.toBuffer()

	return sharp(outline).composite([ { input: image } ]).png().toBuffer()
}

/** Generates every derived image. */
const run = async (): Promise<void> => {
	const photo = await addOutline(readFileSync(SOURCE_PHOTO))

	await sharp(photo).png({ compressionLevel: 9 }).toFile(join(PUBLIC_DIR, profile.photo.src))
	await sharp(photo).webp({ quality: 85 }).toFile(join(PUBLIC_DIR, profile.photo.srcWebp))
	await sharp(join(PUBLIC_DIR, "favicon.svg"), { density: 300 }).resize(180, 180).png().toFile(join(PUBLIC_DIR, "apple-touch-icon.png"))

	const portrait = await sharp(photo).resize({ height: OG_SIZE.height - 40 }).toBuffer()
	const { width: portraitWidth = 0 } = await sharp(portrait).metadata()
	await sharp(Buffer.from(ogBackground()))
		.composite([ { input: portrait, left: OG_SIZE.width - portraitWidth + 60, top: 40 } ])
		.jpeg({ quality: 88, mozjpeg: true })
		.toFile(join(PUBLIC_DIR, site.ogImage))

	process.stdout.write(`✓ ${profile.photo.src}, ${profile.photo.srcWebp}, ${site.ogImage} and /apple-touch-icon.png\n`)
}

await run()
