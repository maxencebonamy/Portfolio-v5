import { MonoLabel } from "#/components/atoms/mono-label"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"

type ProjectHighlightsProps = {
	highlights: Project["highlights"]
}

/** Project key facts (language, type...). Wraps rather than squeezing long values. */
export const ProjectHighlights = ({ highlights }: ProjectHighlightsProps) => {
	const { pick } = useI18n()

	const listClassName = cn(
		"flex flex-wrap gap-x-10 gap-y-5 py-6",
		"border-y border-line"
	)

	return (
		<dl className={listClassName}>
			{/* Index keys: the text changes with the language, not the item (no remount on switch). */}
			{highlights.map((highlight, index) => (
				<div key={index}>
					<dt>
						<MonoLabel size="2xs">{pick(highlight.label)}</MonoLabel>
					</dt>
					<dd className="mt-1 text-base leading-snug font-semibold md:text-lg">{pick(highlight.value)}</dd>
				</div>
			))}
		</dl>
	)
}
