import { motion, useScroll, useSpring } from "motion/react"
import { useRef } from "react"

import { Container } from "#/components/atoms/container"
import { Section } from "#/components/atoms/section"
import { Eyebrow } from "#/components/molecules/eyebrow"
import { SectionTitle } from "#/components/molecules/section-title"
import { TimelineItem } from "#/components/molecules/timeline-item"
import { Reveal } from "#/components/motion/reveal"
import { home } from "#/content/home"
import { journey } from "#/content/journey"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

const LINE_CLASS_NAME = "absolute top-2 bottom-2 left-[7px] w-px"

/** Journey timeline; the line fills on scroll. */
export const JourneySection = () => {
	const { pick } = useI18n()
	const listRef = useRef<HTMLOListElement>(null)
	const { scrollYProgress } = useScroll({ target: listRef, offset: [ "start 0.7", "end 0.6" ] })
	const scaleY = useSpring(scrollYProgress, { stiffness: 120, damping: 30 })
	const { label, title, intro } = home.journey

	return (
		<Section id="journey">
			<Container className="grid gap-16 lg:grid-cols-12">
				<div className="lg:col-span-5">
					<div className="lg:sticky lg:top-32">
						<Reveal>
							<Eyebrow index="04">{pick(label)}</Eyebrow>
						</Reveal>
						<SectionTitle
							first={pick(title.first)}
							second={pick(title.second)}
							className="mt-6 text-[clamp(2.8rem,7vw,6rem)] leading-[0.9]"
						/>
						<Reveal delay={0.2}>
							<p className="mt-6 max-w-sm text-muted">{pick(intro)}</p>
						</Reveal>
					</div>
				</div>

				<ol ref={listRef} className="relative lg:col-span-7">
					<div aria-hidden className={cn(LINE_CLASS_NAME, "bg-line")} />
					<motion.div aria-hidden className={cn(LINE_CLASS_NAME, "origin-top bg-coral")} style={{ scaleY }} />
					{journey.map((step, index) => <TimelineItem key={step.year ?? "today"} step={step} index={index} />)}
				</ol>
			</Container>
		</Section>
	)
}
