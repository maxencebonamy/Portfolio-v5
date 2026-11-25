import { motion } from "motion/react"
import { useEffect, useId, useRef, useState } from "react"

import { StarIcon } from "#/components/atoms/icons/star-icon"
import { cn } from "#/lib/cn"

/** Text circle radius, in SVG units. */
const TEXT_RADIUS = 37

const CIRCLE_LENGTH = 2 * Math.PI * TEXT_RADIUS

/** In SVG units. */
const FONT_SIZE = 8.5

/** Monospace char advance, in em. Estimates text width until measured. */
const MONO_ADVANCE = 0.6

/**
 * `textLength` spreading the text evenly around the circle. Browsers add spacing between chars only,
 * so one gap is left free at the end and the text meets its start evenly.
 *
 * @param count - Number of characters.
 * @param naturalLength - Text width without extra spacing.
 */
const spreadTextLength = (count: number, naturalLength: number): number => {
	return (CIRCLE_LENGTH * (count - 1) + naturalLength) / count
}

/** Circle centered in the 100x100 view box, starting on the left. */
const CIRCLE_PATH = [
	`M50,50 m-${TEXT_RADIUS},0`,
	`a${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 ${TEXT_RADIUS * 2},0`,
	`a${TEXT_RADIUS},${TEXT_RADIUS} 0 1,1 -${TEXT_RADIUS * 2},0`
].join(" ")

type RotatingBadgeProps = {
	play: boolean
	text: string
	className?: string
}

/** Badge with text spinning around a star. */
export const RotatingBadge = ({ play, text, className }: RotatingBadgeProps) => {
	const pathId = useId()
	const textRef = useRef<SVGTextPathElement>(null)
	const [ naturalLength, setNaturalLength ] = useState(text.length * FONT_SIZE * MONO_ADVANCE)

	useEffect(() => {
		let active = true
		void document.fonts.ready.then(() => {
			if (active && textRef.current) setNaturalLength(textRef.current.getComputedTextLength())
		})
		return () => {
			active = false
		}
	}, [ text ])

	const badgeClassName = cn(
		"relative grid size-full place-items-center",
		"rounded-full bg-fg shadow-xl",
		"text-bg"
	)

	return (
		<motion.div
			aria-hidden
			className={cn("size-28 md:size-32", className)}
			initial={{ scale: 0, rotate: -90 }}
			animate={play ? { scale: 1, rotate: 0 } : undefined}
			transition={{ type: "spring", stiffness: 120, damping: 14, delay: 1 }}
		>
			<div className={badgeClassName}>
				<svg viewBox="0 0 100 100" className="absolute inset-0 size-full animate-[spin_14s_linear_infinite]">
					<defs>
						<path id={pathId} d={CIRCLE_PATH} />
					</defs>
					{/* `white-space: pre` keeps the trailing space between end and start. */}
					<text className="fill-current font-mono text-[8.5px] font-medium whitespace-pre uppercase">
						<textPath ref={textRef} href={`#${pathId}`} textLength={spreadTextLength(text.length, naturalLength)} lengthAdjust="spacing">
							{text}
						</textPath>
					</text>
				</svg>
				<StarIcon className="size-7 text-coral" />
			</div>
		</motion.div>
	)
}
