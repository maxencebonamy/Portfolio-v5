import { Link } from "@tanstack/react-router"
import { motion } from "motion/react"

import { cn } from "#/lib/cn"
import { padNumber } from "#/lib/format"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"

type ProjectRowProps = {
	project: Project
	/** Position in the full list. */
	number: number
	/** Rank in the filtered list, staggers the entrance. */
	order: number
	/** Shows the project color. */
	hovered: boolean
	onHoverChange: (hovered: boolean) => void
}

/** Row of the projects archive. */
export const ProjectRow = ({ project, number, order, hovered, onHoverChange }: ProjectRowProps) => {
	const { t, pick, langParam } = useI18n()

	const linkClassName = cn(
		"group grid items-center gap-4 py-7",
		"grid-cols-[auto_1fr_auto] md:grid-cols-[80px_1fr_240px_80px] md:gap-8 md:py-10"
	)

	const titleClassName = cn(
		"pr-[0.1em]",
		"text-[clamp(1.8rem,5vw,4.5rem)] leading-none font-bold tracking-tight uppercase italic",
		"transition-[color,translate] duration-500 ease-out-expo group-hover:translate-x-4"
	)

	return (
		<motion.li
			layout
			className="border-b border-line"
			data-project={project.slug}
			initial={{ opacity: 0, y: 30 }}
			animate={{ opacity: 1, y: 0 }}
			exit={{ opacity: 0, y: -20 }}
			transition={{ duration: 0.6, ease: EASE, delay: order * 0.05 }}
			onPointerEnter={() => onHoverChange(true)}
			onPointerLeave={() => onHoverChange(false)}
		>
			<Link
				to="/{-$lang}/projects/$slug"
				params={{ lang: langParam, slug: project.slug }}
				viewTransition
				data-cursor={t("cursor.view")}
				className={linkClassName}
			>
				<span className="font-mono text-xs text-muted">{padNumber(number)}</span>
				<h2 className={titleClassName} style={{ color: hovered ? project.accent : undefined }}>
					<span style={{ viewTransitionName: `title-${project.slug}` }}>{pick(project.title)}</span>
				</h2>
				<span className="hidden text-sm text-muted md:block">{pick(project.kind)}</span>
				<span className="text-right font-mono text-xs text-muted">{project.ongoing ? t("project.ongoing") : project.year}</span>
			</Link>
		</motion.li>
	)
}
