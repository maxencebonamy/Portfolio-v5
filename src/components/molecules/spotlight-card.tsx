import type { ComponentProps } from "react"

import { cn } from "#/lib/cn"
import { spotlightHandler } from "#/lib/spotlight"

/** Card lighting up under the cursor. */
export const SpotlightCard = ({ className, ...props }: ComponentProps<"div">) => {
	const cardClassName = cn(
		"spotlight h-full",
		"rounded-3xl border border-line",
		"bg-elev/50",
		className
	)

	return <div onPointerMove={spotlightHandler} className={cardClassName} {...props} />
}
