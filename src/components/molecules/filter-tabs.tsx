import { useState } from "react"

import { ActivePill } from "#/components/atoms/active-pill"
import { cn } from "#/lib/cn"

/** Option of {@link FilterTabs}. */
export type FilterOption = {
	value: string
	label: string
	/** Shown as a small badge. */
	count?: number
}

type FilterTabsProps = {
	options: FilterOption[]
	value: string
	onChange: (value: string) => void
	/** Options shown before the "+N" toggle (all by default). */
	limit?: number
	/** Label of the toggle once expanded. */
	lessLabel?: string
}

/** Pill filters with a sliding selection, optionally collapsed after `limit` options. */
export const FilterTabs = ({ options, value, onChange, limit = options.length, lessLabel = "-" }: FilterTabsProps) => {
	const [ expanded, setExpanded ] = useState(false)
	// The selected option stays visible, even past the limit.
	const shown = expanded ? options : options.filter((option, index) => index < limit || option.value === value)

	const pillClassName = cn(
		"relative flex items-center gap-2 px-4 py-2",
		"rounded-full border",
		"text-sm font-medium",
		"transition-colors"
	)

	return (
		<div className="flex flex-wrap gap-2">
			{shown.map(option => {
				const active = option.value === value
				const buttonClassName = cn(
					pillClassName,
					active ? "border-coral text-[#1a1a1a]" : "border-line text-muted hover:text-fg"
				)

				return (
					<button key={option.value} type="button" onClick={() => onChange(option.value)} aria-pressed={active} className={buttonClassName}>
						{active && <ActivePill layoutId="filter" />}
						<span className="relative">{option.label}</span>
						{option.count !== undefined && (
							<span className="relative font-mono text-[0.65rem] opacity-60">{option.count}</span>
						)}
					</button>
				)
			})}
			{options.length > limit && (expanded || shown.length < options.length) && (
				<button
					type="button"
					onClick={() => setExpanded(!expanded)}
					aria-expanded={expanded}
					className={cn(pillClassName, "border-dashed border-line text-muted hover:text-fg")}
				>
					{expanded ? lessLabel : `+${options.length - shown.length}`}
				</button>
			)}
		</div>
	)
}
