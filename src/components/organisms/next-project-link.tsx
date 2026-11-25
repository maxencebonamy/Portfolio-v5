import { Link } from "@tanstack/react-router"

import { ArrowIcon } from "#/components/atoms/icons/arrow-icon"
import { MonoLabel } from "#/components/atoms/mono-label"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"

type NextProjectLinkProps = {
	project: Project
}

/** "Next project" band, filled with the project color on hover. */
export const NextProjectLink = ({ project }: NextProjectLinkProps) => {
	const { t, pick, langParam } = useI18n()

	const linkClassName = cn(
		"group relative block overflow-hidden",
		"px-4 py-20 md:px-8 md:py-28",
		"border-t border-line"
	)

	const fillClassName = cn(
		"absolute inset-0 origin-bottom scale-y-0",
		"transition-transform duration-700 ease-out-expo group-hover:scale-y-100"
	)

	const contentClassName = cn(
		"relative mx-auto max-w-[1400px]",
		"transition-colors duration-500 group-hover:text-[#1a1a1a]"
	)

	const titleClassName = cn(
		"pr-[0.1em]",
		"text-[clamp(2.5rem,8vw,7rem)] leading-none font-bold tracking-tight uppercase italic"
	)

	const arrowClassName = cn(
		"size-12 md:size-20",
		"transition-transform duration-700 ease-out-expo group-hover:rotate-45"
	)

	return (
		<Link
			to="/{-$lang}/projects/$slug"
			params={{ lang: langParam, slug: project.slug }}
			viewTransition
			data-cursor={t("cursor.next")}
			className={linkClassName}
		>
			<div aria-hidden className={fillClassName} style={{ background: project.accent }} />
			<div className={contentClassName}>
				<MonoLabel className="transition-colors group-hover:text-[#1a1a1a]/70">{t("project.next")}</MonoLabel>
				<div className="mt-3 flex items-center justify-between gap-6">
					<span className={titleClassName}>{pick(project.title)}</span>
					<ArrowIcon className={arrowClassName} />
				</div>
			</div>
		</Link>
	)
}
