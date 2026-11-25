import { motion } from "motion/react"

import { Reveal } from "#/components/motion/reveal"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { JourneyStep } from "#/schemas/journey"

type TimelineItemProps = {
	step: JourneyStep
	/** Staggers the animations. */
	index: number
}

/** Journey timeline step. */
export const TimelineItem = ({ step, index }: TimelineItemProps) => {
	const { t, pick } = useI18n()

	const dotClassName = cn(
		"absolute top-1.5 left-0 size-[15px]",
		"rounded-full border-2 border-coral",
		"bg-bg",
		step.current && "ring-4 ring-coral/25"
	)

	const metaClassName = cn(
		"flex items-center gap-3",
		"font-mono text-xs tracking-widest uppercase"
	)

	const titleClassName = cn(
		"mt-2",
		"text-2xl font-semibold tracking-tight md:text-3xl"
	)

	return (
		<li className="relative pb-14 pl-12 last:pb-0">
			<motion.span
				className={dotClassName}
				initial={{ scale: 0 }}
				whileInView={{ scale: 1, backgroundColor: "var(--coral)" }}
				viewport={{ once: true, margin: "0px 0px -40% 0px" }}
				transition={{ type: "spring", stiffness: 300, damping: 18 }}
			/>
			<Reveal delay={0.05 * (index % 2)}>
				<p className={metaClassName}>
					<span className="font-medium text-fg">{step.year ?? t("journey.today")}</span>
					{step.age && <span className="text-muted">{`· ${t("journey.age", { age: step.age })}`}</span>}
				</p>
				<h3 className={titleClassName}>{pick(step.title)}</h3>
				<p className="mt-1 text-sm text-muted">{pick(step.place)}</p>
				<p className="mt-3 max-w-lg text-muted">{pick(step.text)}</p>
			</Reveal>
		</li>
	)
}
