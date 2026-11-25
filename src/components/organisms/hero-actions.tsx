import { motion } from "motion/react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { HighlightedText } from "#/components/atoms/highlighted-text"
import { Magnetic } from "#/components/motion/magnetic"
import { home } from "#/content/home"
import { useGoToSection } from "#/hooks/use-go-to-section"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"

type HeroActionsProps = {
	play: boolean
}

/** Hero bottom: tagline and CTA buttons. */
export const HeroActions = ({ play }: HeroActionsProps) => {
	const goTo = useGoToSection()
	const { pick } = useI18n()

	const introClassName = cn(
		"max-w-md",
		"text-base leading-relaxed text-muted md:text-lg"
	)

	const primaryClassName = cn(
		"group flex items-center gap-3 py-3.5 pr-3.5 pl-6",
		"rounded-full bg-coral",
		"font-semibold text-[#1a1a1a]"
	)

	const secondaryClassName = cn(
		"group px-6 py-3.5",
		"rounded-full border border-line",
		"font-semibold",
		"transition-colors hover:border-fg"
	)

	return (
		<motion.div
			className="relative z-20 flex flex-col gap-8 md:flex-row md:items-end md:justify-between"
			initial={{ opacity: 0, y: 30 }}
			animate={play ? { opacity: 1, y: 0 } : undefined}
			transition={{ duration: 1, ease: EASE, delay: 0.7 }}
		>
			<p className={introClassName}>
				<HighlightedText text={pick(home.hero.intro)} />
			</p>
			<div className="flex flex-wrap items-center gap-3">
				<Magnetic>
					<button type="button" onClick={() => goTo("projects")} className={primaryClassName}>
						<span>{pick(home.hero.primaryCta)}</span>
						<ArrowBadge className="bg-[#1a1a1a] text-coral" />
					</button>
				</Magnetic>
				<Magnetic>
					<button type="button" onClick={() => goTo("contact")} className={secondaryClassName}>
						<span>{pick(home.hero.secondaryCta)}</span>
					</button>
				</Magnetic>
			</div>
		</motion.div>
	)
}
