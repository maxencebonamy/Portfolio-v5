import { Container } from "#/components/atoms/container"
import { CodeIcon } from "#/components/atoms/icons/code-icon"
import { LayoutIcon } from "#/components/atoms/icons/layout-icon"
import { ServerIcon } from "#/components/atoms/icons/server-icon"
import { ShipIcon } from "#/components/atoms/icons/ship-icon"
import { SparkIcon } from "#/components/atoms/icons/spark-icon"
import { Section } from "#/components/atoms/section"
import { ChipList } from "#/components/molecules/chip-list"
import { CodeTypewriter } from "#/components/molecules/code-typewriter"
import { Eyebrow } from "#/components/molecules/eyebrow"
import { PipelineRun } from "#/components/molecules/pipeline-run"
import { RequestLog } from "#/components/molecules/request-log"
import { SectionTitle } from "#/components/molecules/section-title"
import { SkillCard } from "#/components/molecules/skill-card"
import { WireframeShuffle } from "#/components/molecules/wireframe-shuffle"
import { Reveal } from "#/components/motion/reveal"
import { FavoriteLanguageCard } from "#/components/organisms/favorite-language-card"
import { LearningBanner } from "#/components/organisms/learning-banner"
import { home } from "#/content/home"
import { skills } from "#/content/skills"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

/** Thinner than the default 2. */
const ICON_STROKE = 1.75

/** Toolbox bento grid, one animation per card. */
export const SkillsSection = () => {
	const { pick } = useI18n()
	const { languages, backend, frontend, devops, workStyle } = skills

	const gridClassName = cn(
		"grid gap-4",
		"grid-cols-[minmax(0,1fr)] md:grid-cols-6 lg:grid-cols-12",
		"lg:grid-rows-[repeat(3,minmax(240px,auto))]"
	)

	const bulletClassName = cn(
		"mt-2 size-1.5 shrink-0",
		"rounded-full bg-coral"
	)

	return (
		<Section id="skills">
			<Container>
				<div className="mb-16">
					<Reveal>
						<Eyebrow index="03">{pick(home.skills.label)}</Eyebrow>
					</Reveal>
					<SectionTitle first={pick(home.skills.title.first)} second={pick(home.skills.title.second)} className="mt-6" />
				</div>

				<div className={gridClassName}>
					<FavoriteLanguageCard className="md:col-span-6 lg:col-span-7 lg:row-span-2" />

					<SkillCard
						icon={<CodeIcon strokeWidth={ICON_STROKE} />}
						title={pick(languages.title)}
						count={languages.items.length}
						showcase={<CodeTypewriter snippets={languages.snippets} />}
						delay={0.05}
						className="md:col-span-3 lg:col-span-5"
					>
						<ChipList items={languages.items} delay={0.2} />
					</SkillCard>

					<SkillCard
						icon={<ServerIcon strokeWidth={ICON_STROKE} />}
						title={pick(backend.title)}
						count={backend.items.length}
						showcase={<RequestLog requests={backend.requests} />}
						delay={0.1}
						className="md:col-span-3 lg:col-span-5"
					>
						<ChipList items={backend.items} delay={0.2} />
					</SkillCard>

					<SkillCard
						icon={<LayoutIcon strokeWidth={ICON_STROKE} />}
						title={pick(frontend.title)}
						count={frontend.items.length}
						showcase={<WireframeShuffle swatches={frontend.swatches} />}
						className="md:col-span-2 lg:col-span-4"
					>
						<ChipList items={frontend.items} delay={0.2} />
					</SkillCard>

					<SkillCard
						icon={<ShipIcon strokeWidth={ICON_STROKE} />}
						title={pick(devops.title)}
						count={devops.items.length}
						showcase={<PipelineRun steps={devops.pipeline} />}
						delay={0.05}
						className="md:col-span-2 lg:col-span-4"
					>
						<ChipList items={devops.items} delay={0.2} />
					</SkillCard>

					<SkillCard
						icon={<SparkIcon strokeWidth={ICON_STROKE} />}
						title={pick(workStyle.title)}
						delay={0.1}
						className="md:col-span-2 lg:col-span-4"
					>
						<ul className="space-y-3">
							{/* Index keys: the text changes with the language, not the item (no remount on switch). */}
							{workStyle.traits.map((trait, index) => (
								<li key={index} className="flex gap-3">
									<span className={bulletClassName} />
									<p className="text-sm text-muted">
										<strong className="font-semibold text-fg">{`${pick(trait.title)}.`}</strong>
										{` ${pick(trait.text)}`}
									</p>
								</li>
							))}
						</ul>
					</SkillCard>

					<LearningBanner className="md:col-span-6 lg:col-span-12" />
				</div>
			</Container>
		</Section>
	)
}
