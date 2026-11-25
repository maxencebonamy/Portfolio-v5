import { Link, useParams } from "@tanstack/react-router"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { Container } from "#/components/atoms/container"
import { ArrowIcon } from "#/components/atoms/icons/arrow-icon"
import { MonoLabel } from "#/components/atoms/mono-label"
import { ProjectHighlights } from "#/components/molecules/project-highlights"
import { TagList } from "#/components/molecules/tag-list"
import { Magnetic } from "#/components/motion/magnetic"
import { Reveal } from "#/components/motion/reveal"
import { NextProjectLink } from "#/components/organisms/next-project-link"
import { ProjectVideo } from "#/components/organisms/project-video"
import { projects } from "#/content/projects"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"
import { PageHead } from "#/seo/page-head"
import { projectMeta } from "#/seo/page-meta"

/** Project case study. Slug already validated by the route `beforeLoad`. */
export const ProjectPage = () => {
	const { t, pick, lang, langParam } = useI18n()
	const visualRef = useRef<HTMLDivElement>(null)
	const { scrollYProgress } = useScroll({ target: visualRef, offset: [ "start end", "end start" ] })
	const visualScale = useTransform(scrollYProgress, [ 0, 0.5 ], [ 0.92, 1 ])

	const { slug } = useParams({ from: "/{-$lang}/projects/$slug" })
	const index = projects.findIndex(project => project.slug === slug)
	const project = projects[index]
	const next = projects[(index + 1) % projects.length]

	const visualBackground = `radial-gradient(120% 90% at 50% 100%, ${project.accent}45, transparent 65%)`

	const backLinkClassName = cn(
		"group inline-flex items-center gap-2",
		"text-sm text-muted hover:text-fg"
	)

	const titleClassName = cn(
		"mt-3 pr-[0.1em]",
		"text-[clamp(3rem,9vw,8.5rem)] leading-[0.9] font-bold tracking-tight uppercase italic"
	)

	const visualFrameClassName = cn(
		"p-3 md:p-8 lg:p-12",
		"rounded-[28px] border border-line"
	)

	const externalLinkClassName = cn(
		"group flex items-center gap-3 py-3 pr-3 pl-6",
		"rounded-full",
		"font-semibold"
	)

	const primaryLinkClassName = cn(externalLinkClassName, "text-[#1a1a1a]")

	const secondaryLinkClassName = cn(
		externalLinkClassName,
		"border border-line text-fg",
		"transition-colors hover:border-fg"
	)

	return (
		<article className="pt-32 md:pt-40">
			<PageHead meta={projectMeta(project, lang)} />
			{/* Padding on content only: the "next project" band spans full width. */}
			<div className="px-4 md:px-8">
				<Container>
					<motion.nav initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
						<Link to="/{-$lang}/projects" params={{ lang: langParam }} viewTransition className={backLinkClassName}>
							<ArrowIcon className="-rotate-135 transition-transform group-hover:-translate-x-1" />
							{t("project.backToProjects")}
						</Link>
					</motion.nav>

					<header className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-end">
						<div className="lg:col-span-8">
							<motion.p
								className="font-mono text-xs tracking-widest uppercase"
								style={{ color: project.accent }}
								initial={{ opacity: 0, y: 10 }}
								animate={{ opacity: 1, y: 0 }}
								transition={{ delay: 0.2 }}
							>
								{`${pick(project.kind)} · ${project.ongoing ? t("project.ongoing") : project.year}`}
							</motion.p>
							<h1 className={titleClassName} style={{ viewTransitionName: `title-${project.slug}` }}>{pick(project.title)}</h1>
						</div>
						<motion.p
							className="text-lg text-muted lg:col-span-4"
							initial={{ opacity: 0, y: 20 }}
							animate={{ opacity: 1, y: 0 }}
							transition={{ duration: 0.8, ease: EASE, delay: 0.35 }}
						>
							{pick(project.summary)}
						</motion.p>
					</header>

					<motion.div ref={visualRef} style={{ scale: visualScale }} className="mt-14">
						<div className={visualFrameClassName} style={{ background: visualBackground }}>
							<div className="mx-auto w-full max-w-[1200px]" style={{ viewTransitionName: `visual-${project.slug}` }}>
								{/* Keyed: the next project starts fresh (playback, progress), not paused like the previous one. */}
								<ProjectVideo key={project.slug} project={project} mode="full" />
							</div>
						</div>
					</motion.div>

					<div className="mt-20 grid gap-14 pb-28 md:mt-28 lg:grid-cols-12">
						<aside className="lg:col-span-4">
							<div className="space-y-8 lg:sticky lg:top-32">
								<ProjectHighlights highlights={project.highlights} />
								{project.stack.length > 0 && (
									<div>
										<MonoLabel size="2xs" className="mb-3">{t("project.stack")}</MonoLabel>
										<TagList items={project.stack} />
									</div>
								)}
								{project.links && project.links.length > 0 && (
									<div className="flex flex-wrap gap-3">
										{project.links.map((link, position) => (
											<Magnetic key={link.href}>
												<a
													href={link.href}
													target="_blank"
													rel="noreferrer"
													className={position === 0 ? primaryLinkClassName : secondaryLinkClassName}
													style={position === 0 ? { background: project.accent } : undefined}
												>
													<span>{pick(link.label)}</span>
													<ArrowBadge className={position === 0 ? "bg-[#1a1a1a] text-white" : "bg-fg text-bg"} />
												</a>
											</Magnetic>
										))}
									</div>
								)}
							</div>
						</aside>

						<div className="space-y-8 lg:col-span-7 lg:col-start-6">
							<Reveal>
								<h2 className="text-3xl font-semibold tracking-tight md:text-4xl">{t("project.about")}</h2>
							</Reveal>
							{/* Index keys: a language switch swaps the text without replaying the reveal. */}
							{pick(project.description).map((paragraph, position) => (
								<Reveal key={position} delay={position * 0.08}>
									<p className="text-lg leading-relaxed text-muted md:text-xl">{paragraph}</p>
								</Reveal>
							))}
						</div>
					</div>
				</Container>
			</div>

			<NextProjectLink project={next} />
		</article>
	)
}
