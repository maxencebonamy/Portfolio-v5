import { AnimatePresence, motion, useMotionValue } from "motion/react"
import { useEffect, useRef, useState } from "react"

import { Container } from "#/components/atoms/container"
import { Eyebrow } from "#/components/molecules/eyebrow"
import type { FilterOption } from "#/components/molecules/filter-tabs"
import { FilterTabs } from "#/components/molecules/filter-tabs"
import { SectionTitle } from "#/components/molecules/section-title"
import { Reveal } from "#/components/motion/reveal"
import { ProjectHoverPreview } from "#/components/organisms/project-hover-preview"
import { ProjectRow } from "#/components/organisms/project-row"
import { projects } from "#/content/projects"
import { useFinePointer } from "#/hooks/use-fine-pointer"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"
import { PageHead } from "#/seo/page-head"
import { projectsMeta } from "#/seo/page-meta"

const ALL = "*"

/** Technologies shown before the "+N" toggle: those used by at least 2 projects. */
const MIN_SHOWN_USAGE = 2

/** Number of projects per technology, most used first (ties keep their order of appearance). */
const TECHNOLOGIES = [ ...projects.flatMap(project => project.stack).reduce((counts, tech) => {
	return counts.set(tech, (counts.get(tech) ?? 0) + 1)
}, new Map<string, number>()) ].sort(([ , a ], [ , b ]) => b - a)

/** All option included. */
const SHOWN_FILTERS = 1 + TECHNOLOGIES.filter(([ , count ]) => count >= MIN_SHOWN_USAGE).length

/** Project archive, filterable by tech, with a cursor-following video preview. */
export const ProjectsPage = () => {
	const { t, lang } = useI18n()
	const [ filter, setFilter ] = useState(ALL)
	const [ hovered, setHovered ] = useState<Project | null>(null)
	const fine = useFinePointer()
	const pointerX = useMotionValue(0)
	const pointerY = useMotionValue(0)
	const pointerSeen = useRef(false)

	// Scrolling moves rows under a still pointer, without any pointer event.
	useEffect(() => {
		const onScroll = (): void => {
			if (!pointerSeen.current) return
			const row = document.elementFromPoint(pointerX.get(), pointerY.get())?.closest<HTMLElement>("[data-project]")
			setHovered(projects.find(project => project.slug === row?.dataset.project) ?? null)
		}
		window.addEventListener("scroll", onScroll, { passive: true })
		return () => window.removeEventListener("scroll", onScroll)
	}, [ pointerX, pointerY ])

	const visible = projects.filter(project => filter === ALL || project.stack.includes(filter))
	const options: FilterOption[] = [
		{ value: ALL, label: t("projectsPage.filterAll"), count: projects.length },
		...TECHNOLOGIES.map(([ value, count ]) => ({ value, label: value, count }))
	]

	const sectionClassName = cn(
		"relative min-h-svh",
		"px-4 pt-36 pb-32 md:px-8 md:pt-44"
	)

	return (
		<section
			className={sectionClassName}
			onPointerLeave={() => {
				pointerSeen.current = false
			}}
			onPointerMove={event => {
				pointerSeen.current = true
				pointerX.set(event.clientX)
				pointerY.set(event.clientY)
			}}
		>
			<PageHead meta={projectsMeta(lang)} />
			<Container>
				<Reveal>
					<Eyebrow index="↳">{t("projectsPage.label")}</Eyebrow>
				</Reveal>
				<SectionTitle
					as="h1"
					first={t("projectsPage.titleFirst")}
					second={t("projectsPage.titleSecond")}
					play
					className="mt-6 text-[clamp(3rem,11vw,10rem)] leading-[0.88]"
				/>

				<Reveal delay={0.2} className="mt-12">
					<FilterTabs
						options={options}
						value={filter}
						onChange={setFilter}
						limit={SHOWN_FILTERS}
						lessLabel={t("projectsPage.filterLess")}
					/>
				</Reveal>

				<motion.ul layout className="mt-14 border-t border-line">
					<AnimatePresence mode="popLayout">
						{visible.map((project, order) => (
							<ProjectRow
								key={project.slug}
								project={project}
								number={projects.indexOf(project) + 1}
								order={order}
								hovered={hovered === project}
								onHoverChange={isHovered => setHovered(isHovered ? project : null)}
							/>
						))}
					</AnimatePresence>
				</motion.ul>
			</Container>

			{fine && <ProjectHoverPreview project={hovered} x={pointerX} y={pointerY} />}
		</section>
	)
}
