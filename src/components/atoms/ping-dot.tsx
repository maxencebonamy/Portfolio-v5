import { cn } from "#/lib/cn"

type PingDotProps = {
	/** Color class, e.g. `bg-coral`. */
	color?: string
	className?: string
}

/** Status dot with a pulsing ring. */
export const PingDot = ({ color = "bg-emerald-400", className }: PingDotProps) => {
	const pingClassName = cn(
		"absolute inline-flex size-full rounded-full",
		"animate-ping opacity-75",
		color
	)

	return (
		<span className={cn("relative flex size-2 shrink-0", className)}>
			<span className={pingClassName} />
			<span className={cn("relative inline-flex size-full rounded-full", color)} />
		</span>
	)
}
