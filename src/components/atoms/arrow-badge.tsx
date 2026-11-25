import type { CSSProperties } from "react"

import { ArrowIcon } from "#/components/atoms/icons/arrow-icon"
import { cn } from "#/lib/cn"

type ArrowBadgeProps = {
	className?: string
	iconClassName?: string
	style?: CSSProperties
}

/** Round arrow badge, rotates on `.group` hover. */
export const ArrowBadge = ({ className, iconClassName, style }: ArrowBadgeProps) => {
	const badgeClassName = cn(
		"grid size-8 shrink-0 place-items-center",
		"rounded-full",
		"transition-transform duration-500 ease-out-expo group-hover:rotate-45",
		className
	)

	return (
		<span className={badgeClassName} style={style}>
			<ArrowIcon className={iconClassName} />
		</span>
	)
}
