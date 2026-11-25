import type { MotionValue } from "motion/react"
import { motion } from "motion/react"
import { Fragment, useState } from "react"

import { MaskLine } from "#/components/motion/mask-line"
import { home } from "#/content/home"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { HeroLine } from "#/schemas/home"

/** Classes for the line styles of `home.json`. */
const LINE_STYLES: Record<HeroLine["style"], string> = {
	light: "font-light",
	outline: "pr-[0.1em] italic",
	bold: "font-black"
}

type HeroTitleProps = {
	play: boolean
	y: MotionValue<string>
	opacity: MotionValue<number>
}

/**
 * Hero title, one masked line per `home.json` entry. `text-knockout` keeps it readable over the portrait.
 * After reveal, a language switch swaps lines without replaying the entrance.
 */
export const HeroTitle = ({ play, y, opacity }: HeroTitleProps) => {
	const { pick } = useI18n()
	const lines = pick(home.hero.title)
	const [ revealed, setRevealed ] = useState(false)

	// Lets the pointer through so the portrait under it keeps hover and tilt.
	const titleClassName = cn(
		"text-knockout pointer-events-none relative z-20",
		"text-[clamp(3.2rem,12.5vw,11.5rem)] leading-[0.94] font-bold tracking-[-0.03em] uppercase"
	)

	return (
		<motion.h1 className={titleClassName} style={{ y, opacity }}>
			{lines.map((line, index) => (
				<Fragment key={line.text}>
					{/* Not rendered between blocks, but keeps the lines apart in the heading's text. */}
					{index > 0 && " "}
					<MaskLine
						play={play}
						delay={0.15 + index * 0.1}
						onRevealed={index === lines.length - 1 ? () => setRevealed(true) : undefined}
						skip={revealed}
						className={LINE_STYLES[line.style]}
					>
						<span className={cn(line.style === "outline" && "text-outline font-extrabold")}>{line.text}</span>
						{line.dot && <span aria-hidden className="text-coral">.</span>}
					</MaskLine>
				</Fragment>
			))}
		</motion.h1>
	)
}
