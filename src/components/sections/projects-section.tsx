import { Link } from "@tanstack/react-router"
import { useScroll } from "motion/react"
import { useRef } from "react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { Container } from "#/components/atoms/container"
import { Section } from "#/components/atoms/section"
import { Eyebrow } from "#/components/molecules/eyebrow"
import { SectionTitle } from "#/components/molecules/section-title"
import { Magnetic } from "#/components/motion/magnetic"
import { Reveal } from "#/components/motion/reveal"
import { ProjectStackCard } from "#/components/organisms/project-stack-card"
import { home } from "#/content/home"
import { featuredProjects, projects as allProjects } from "#/content/projects"
import { cn } from "#/lib/cn"
import { interpolate } from "#/lib/i18n"
import { useI18n } from "#/providers/i18n-provider"

/** Featured projects as stacked sticky cards. */
export const ProjectsSection = () => {
	const { pick, langParam } = useI18n()
	const stackRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: stackRef, offset: [ "start start", "end end" ] })
	const { projects } = home

	// No bottom margin from `md`: sticky cards leave room above (see `ProjectStackCard`).
	const headerClassName = cn(
		"mb-4 flex flex-col gap-8",
		"md:mb-0 md:flex-row md:items-end md:justify-between"
	)

	const allProjectsClassName = cn(
		"group flex items-center gap-3 py-3 pr-3 pl-6",
		"rounded-full border border-line",
		"font-semibold",
		"transition-colors hover:border-coral"
	)

	const moreProjectsClassName = cn(
		"group flex items-center gap-4 py-3 pr-3 pl-7",
		"rounded-full bg-coral",
		"text-lg font-semibold text-[#1a1a1a]"
	)

	return (
		<Section id="projects" className="pt-10 md:pt-10">
			<Container>
				<div className={headerClassName}>
					<div>
						<Reveal>
							<Eyebrow index="02">{pick(projects.label)}</Eyebrow>
						</Reveal>
						<SectionTitle first={pick(projects.title.first)} second={pick(projects.title.second)} className="mt-6" />
					</div>
					<Reveal delay={0.2}>
						<Magnetic>
							<Link to="/{-$lang}/projects" params={{ lang: langParam }} className={allProjectsClassName}>
								<span>{pick(projects.allProjects)}</span>
								<ArrowBadge className="bg-fg text-bg" />
							</Link>
						</Magnetic>
					</Reveal>
				</div>

				<div ref={stackRef} className="relative">
					{featuredProjects.map((project, index) => (
						<ProjectStackCard
							key={project.slug}
							project={project}
							index={index}
							total={featuredProjects.length}
							progress={scrollYProgress}
						/>
					))}
				</div>

				<Reveal className="mt-16 flex justify-center md:mt-24">
					<Magnetic>
						<Link to="/{-$lang}/projects" params={{ lang: langParam }} className={moreProjectsClassName}>
							<span>{interpolate(pick(projects.moreProjects), { count: allProjects.length - featuredProjects.length })}</span>
							<ArrowBadge className="size-10 bg-[#1a1a1a] text-white" />
						</Link>
					</Magnetic>
				</Reveal>
			</Container>
		</Section>
	)
}
