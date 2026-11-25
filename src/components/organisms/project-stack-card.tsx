import { Link } from "@tanstack/react-router"
import type { MotionValue } from "motion/react"
import { motion, useTransform } from "motion/react"
import type { CSSProperties } from "react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { MonoLabel } from "#/components/atoms/mono-label"
import { TagList } from "#/components/molecules/tag-list"
import { ProjectVideo } from "#/components/organisms/project-video"
import { cn } from "#/lib/cn"
import { padNumber } from "#/lib/format"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"

type ProjectStackCardProps = {
	project: Project
	index: number
	total: number
	/** Scroll progress over the whole stack. */
	progress: MotionValue<number>
}

/** Sticky card, shrinks and darkens as the next one covers it. */
export const ProjectStackCard = ({ project, index, total, progress }: ProjectStackCardProps) => {
	const { t, pick, langParam } = useI18n()
	const linkProps = { to: "/{-$lang}/projects/$slug", params: { lang: langParam, slug: project.slug }, viewTransition: true } as const

	// Card i is in front at i / n, covered by the next at (i + 1) / n.
	const steps = Math.max(total - 1, 1)
	const last = index === total - 1
	const targetScale = 1 - (total - index - 1) * 0.04
	const scale = useTransform(progress, last ? [ 0, 1 ] : [ index / steps, 1 ], [ 1, targetScale ])
	const dim = useTransform(progress, last ? [ 0, 1 ] : [ index / steps, (index + 1) / steps ], [ 0, last ? 0 : 0.4 ])

	// Phones: every card takes the height left under the stack offsets, so the last one fits.
	const cardClassName = cn(
		"relative flex w-full flex-col overflow-hidden",
		"h-[calc(94svh_-_(var(--stack-count)_-_1)_*_var(--stack-step)_-_1rem)] max-h-[720px] md:h-[78svh]",
		"md:grid md:grid-cols-[1fr_1.35fr]",
		"rounded-[20px] border border-line md:rounded-[28px]",
		"bg-elev"
	)

	const titleClassName = cn(
		"pr-[0.1em]",
		"text-[clamp(2rem,4vw,3.6rem)] leading-[0.95] font-bold tracking-tight uppercase italic"
	)

	// Summary fades out when space runs out, so tags and link are never cut.
	const summaryBoxClassName = cn(
		"mt-4 min-h-0 flex-1 overflow-hidden md:mt-5",
		"[mask-image:linear-gradient(to_bottom,black_calc(100%_-_1.5rem),transparent)]"
	)

	const summaryClassName = cn(
		"line-clamp-4 max-w-md",
		"text-sm leading-relaxed text-muted md:text-base"
	)

	// From md: tags wrap on the full column width, link always under them.
	const footerClassName = cn(
		"flex shrink-0 items-center justify-between gap-3",
		"md:flex-col md:items-start md:gap-5"
	)

	// Phones: one row of tags, faded at the right, so the footer stays one line.
	const tagsClassName = cn(
		"min-w-0 flex-1 flex-nowrap overflow-hidden",
		"[mask-image:linear-gradient(to_right,black_calc(100%_-_1.5rem),transparent)]",
		"md:w-full md:flex-none md:flex-wrap md:overflow-visible md:[mask-image:none]"
	)

	const caseStudyClassName = cn(
		"group flex shrink-0 items-center gap-2",
		"text-sm font-semibold"
	)

	// Phones: full card width, thin margin (concentric radii). From md: floats in its column.
	const visualClassName = cn(
		"relative order-first flex shrink-0 items-center justify-center overflow-hidden p-2",
		"md:order-none md:p-10",
		"border-b border-line md:border-b-0 md:border-l"
	)

	// Top-aligned on phones: centering left a gap under the section header.
	const stickyClassName = cn(
		"sticky top-0 flex h-svh justify-center",
		"items-start md:items-center",
		"[--stack-step:10px] md:[--stack-step:22px]"
	)

	// Each card one step lower than the previous; count sizes the cards on phones.
	const stickyStyle = { "paddingTop": `calc(6vh + ${index} * var(--stack-step))`, "--stack-count": total } as CSSProperties

	// Phones: full width at natural height, even margin all around.
	// From md: fitted inside its column (size container).
	const videoBoxClassName = cn(
		"w-full",
		"md:flex md:size-full md:max-w-[760px] md:items-center md:justify-center md:[container-type:size]"
	)

	const videoClassName = cn(
		"max-md:w-full max-md:shadow-none",
		"transition-transform duration-700 ease-out-expo hover:scale-[1.02]"
	)

	return (
		<div className={stickyClassName} style={stickyStyle}>
			<motion.article style={{ scale, transformOrigin: "top center" }} className={cardClassName}>
				<div className="relative z-10 flex min-h-0 flex-1 flex-col p-5 md:p-10">
					<div className="shrink-0">
						<MonoLabel className="flex items-center justify-between">
							<span>
								<span style={{ color: project.accent }}>{padNumber(index + 1)}</span>
								{` / ${padNumber(total)}`}
							</span>
							<span>{project.ongoing ? t("project.ongoing") : project.year}</span>
						</MonoLabel>
						<MonoLabel className="mt-6" style={{ color: project.accent }}>{pick(project.kind)}</MonoLabel>
						<Link {...linkProps} className="mt-2 block" data-cursor={t("cursor.view")}>
							<h3 className={titleClassName} style={{ viewTransitionName: `title-${project.slug}` }}>{pick(project.title)}</h3>
						</Link>
					</div>

					<div className={summaryBoxClassName}>
						<p className={summaryClassName}>{pick(project.summary)}</p>
					</div>

					<div className={footerClassName}>
						<TagList items={project.stack} size="sm" className={tagsClassName} />
						<Link {...linkProps} className={caseStudyClassName}>
							<span>{t("project.caseStudy")}</span>
							<ArrowBadge className="size-9 text-[#1a1a1a]" style={{ background: project.accent }} />
						</Link>
					</div>
				</div>

				<Link
					{...linkProps}
					data-cursor={t("cursor.view")}
					className={visualClassName}
					style={{ background: `radial-gradient(120% 90% at 70% 100%, ${project.accent}40, transparent 60%)` }}
					tabIndex={-1}
					aria-hidden
				>
					<div className={videoBoxClassName}>
						<ProjectVideo
							project={project}
							fit
							className={videoClassName}
							style={{ viewTransitionName: `visual-${project.slug}` }}
						/>
					</div>
				</Link>

				<motion.div aria-hidden className="pointer-events-none absolute inset-0 z-20 bg-black" style={{ opacity: dim }} />
			</motion.article>
		</div>
	)
}
