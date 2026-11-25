import { SpotlightCard } from "#/components/molecules/spotlight-card"
import { Counter } from "#/components/motion/counter"
import { cn } from "#/lib/cn"

type StatCardProps = {
	value: number
	/** E.g. "+ years". */
	suffix: string
	label: string
}

/** Animated key figure. */
export const StatCard = ({ value, suffix, label }: StatCardProps) => {
	// Sized on the card width (24cqi), so "12 years" never overflows a narrow column.
	const valueClassName = cn(
		"font-bold tracking-tight whitespace-nowrap",
		"text-[min(3.75rem,24cqi)] md:text-[min(4.5rem,24cqi)]"
	)

	return (
		<SpotlightCard className="p-7 [container-type:inline-size]">
			<p className={valueClassName}>
				<Counter to={value} />
				<span className="text-coral">{suffix}</span>
			</p>
			<p className="mt-4 text-sm text-muted">{label}</p>
		</SpotlightCard>
	)
}
