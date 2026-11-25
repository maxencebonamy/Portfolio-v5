import { Container } from "#/components/atoms/container"
import { Section } from "#/components/atoms/section"
import { Eyebrow } from "#/components/molecules/eyebrow"
import { StatCard } from "#/components/molecules/stat-card"
import { Marquee } from "#/components/motion/marquee"
import { Reveal } from "#/components/motion/reveal"
import { ScrollText } from "#/components/motion/scroll-text"
import { home } from "#/content/home"
import { profile } from "#/content/profile"
import { skills, technologyCount } from "#/content/skills"
import { cn } from "#/lib/cn"
import { interpolate } from "#/lib/i18n"
import { useI18n } from "#/providers/i18n-provider"
import type { Stat } from "#/schemas/home"

/** Number shown for a key figure. */
const statValue = (value: Stat["value"]): number => {
	if (typeof value === "number") {
		return value
	}
	const year = new Date().getFullYear()
	switch (value) {
		case "yearsCoding":
			return year - profile.codingSince
		case "yearsPro":
			return year - profile.proSince
		case "technologies":
			return technologyCount
	}
}

/** Tech band + "about": intro lit up on scroll, key figures. */
export const AboutSection = () => {
	const { pick } = useI18n()
	const { about } = home

	const introClassName = cn(
		"text-[clamp(1.6rem,3.6vw,3.2rem)] leading-[1.15] font-medium tracking-tight"
	)

	return (
		<>
			<div className="border-y border-line py-5">
				<Marquee items={skills.marquee} />
			</div>

			<Section id="about">
				<Container className="grid gap-12 lg:grid-cols-12">
					<div className="lg:col-span-3">
						<Reveal>
							<Eyebrow as="h2" index="01">{pick(about.label)}</Eyebrow>
						</Reveal>
					</div>
					<div className="lg:col-span-9">
						<ScrollText className={introClassName} text={pick(about.intro)} />
						<div className="mt-20 grid gap-4 sm:grid-cols-3">
							{about.stats.map((stat, index) => (
								<Reveal key={index} delay={index * 0.1}>
									<StatCard
										value={statValue(stat.value)}
										suffix={pick(stat.suffix)}
										label={interpolate(pick(stat.label), { company: profile.company })}
									/>
								</Reveal>
							))}
						</div>
					</div>
				</Container>
			</Section>
		</>
	)
}
