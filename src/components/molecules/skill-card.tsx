import type { ReactNode } from "react"

import { SpotlightCard } from "#/components/molecules/spotlight-card"
import { Reveal } from "#/components/motion/reveal"
import { cn } from "#/lib/cn"
import { padNumber } from "#/lib/format"

type SkillCardProps = {
	icon: ReactNode
	title: string
	/** Item count, shown in the corner. */
	count?: number
	/** Decorative animation in the middle. */
	showcase?: ReactNode
	children: ReactNode
	/** In s. */
	delay?: number
	className?: string
}

/** Bento card: header, optional showcase, content pinned to the bottom so cards align. */
export const SkillCard = ({ icon, title, count, showcase, children, delay = 0, className }: SkillCardProps) => {
	const iconClassName = cn(
		"grid size-9 place-items-center",
		"rounded-xl border border-line",
		"bg-bg/60 text-coral"
	)

	return (
		<Reveal className={className} delay={delay}>
			<SpotlightCard className="group/card flex flex-col gap-6 overflow-hidden p-6 md:p-7">
				<div className="relative flex items-center gap-3">
					<span className={iconClassName}>{icon}</span>
					<h3 className="text-lg font-semibold">{title}</h3>
					{count !== undefined && <span className="ml-auto font-mono text-xs text-muted">{padNumber(count)}</span>}
				</div>
				{showcase && <div aria-hidden className="relative flex flex-1 items-center">{showcase}</div>}
				<div className="relative mt-auto">{children}</div>
			</SpotlightCard>
		</Reveal>
	)
}
