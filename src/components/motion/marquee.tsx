import type { CSSProperties } from "react"

import { StarIcon } from "#/components/atoms/icons/star-icon"
import { cn } from "#/lib/cn"

type MarqueeProps = {
	items: string[]
	/** Full loop, in s. */
	duration?: number
	reverse?: boolean
	className?: string
	itemClassName?: string
}

/** Endless scrolling band, paused on hover. */
export const Marquee = ({ items, duration = 40, reverse = false, className, itemClassName }: MarqueeProps) => {
	const row = [ ...items, ...items ]

	const rootClassName = cn(
		"marquee-pause relative flex overflow-hidden",
		"[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]",
		className
	)

	const itemClass = cn(
		"flex items-center gap-8 px-4",
		"text-sm font-medium tracking-wide text-muted uppercase md:text-base",
		itemClassName
	)

	const trackStyle = {
		"--duration": `${duration}s`,
		"animationDirection": reverse ? "reverse" : "normal"
	} as CSSProperties

	return (
		<div className={rootClassName}>
			<div className="animate-marquee flex w-max shrink-0 items-center" style={trackStyle}>
				{row.map((item, index) => (
					<span key={`${item}-${index}`} className={itemClass} aria-hidden={index >= items.length}>
						{item}
						<StarIcon className="size-3 text-coral" />
					</span>
				))}
			</div>
		</div>
	)
}
