import type { MotionValue, TargetAndTransition } from "motion/react"
import { motion } from "motion/react"
import { useState } from "react"

import { Tilt } from "#/components/motion/tilt"
import { Portrait } from "#/components/organisms/portrait"
import { RotatingBadge } from "#/components/organisms/rotating-badge"
import { home } from "#/content/home"
import { fullName, profile } from "#/content/profile"
import { cn } from "#/lib/cn"
import { EASE_IN_OUT } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"

const HIDDEN: TargetAndTransition = { clipPath: "inset(100% 0% 0% 0% round 28px)", scale: 1.08, rotate: 0 }

const REVEALED: TargetAndTransition = { clipPath: "inset(0% 0% 0% 0% round 28px)", scale: 1, rotate: -3 }

/** Same as `REVEALED`, fully unclipped so tilt and hover shadow aren't cut. */
const UNCLIPPED: TargetAndTransition = { ...REVEALED, clipPath: "inset(-100% -100% -100% -100% round 28px)" }

type HeroPortraitProps = {
	play: boolean
	y: MotionValue<string>
}

/** Hero photo: curtain reveal, tilt, rotating badge. */
export const HeroPortrait = ({ play, y }: HeroPortraitProps) => {
	const { pick } = useI18n()
	const [ revealed, setRevealed ] = useState(false)
	const revealTarget = revealed ? UNCLIPPED : REVEALED

	const wrapperClassName = cn(
		"relative z-10 mx-auto mb-10 aspect-4/5",
		"w-[62vw] max-w-[300px] sm:w-[44vw]",
		"lg:absolute lg:top-1/2 lg:right-[3%] lg:mb-0 lg:w-[min(28vw,400px)] lg:max-w-none lg:-translate-y-1/2"
	)

	return (
		<motion.div className={wrapperClassName} style={{ y }}>
			<motion.div
				className="size-full"
				initial={HIDDEN}
				animate={play ? revealTarget : undefined}
				transition={revealed ? { duration: 0 } : { duration: 1.2, ease: EASE_IN_OUT, delay: 0.25 }}
				onAnimationComplete={() => {
					if (play) setRevealed(true)
				}}
			>
				<Tilt className="size-full rounded-[28px]" max={6}>
					<Portrait name={fullName} title={`${pick(profile.jobTitle)} @ ${profile.company}`} />
				</Tilt>
			</motion.div>
			<RotatingBadge play={play} text={pick(home.hero.badge)} className="absolute -top-8 -left-8 z-10" />
		</motion.div>
	)
}
