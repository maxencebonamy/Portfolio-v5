import type { ComponentProps } from "react"

import { cn } from "#/lib/cn"

/** Round frosted-glass button holding an icon. */
export const IconButton = ({ className, type = "button", ...props }: ComponentProps<"button">) => {
	const buttonClassName = cn(
		"grid size-10 place-items-center",
		"rounded-full border border-line",
		"bg-elev/60 backdrop-blur-xl",
		"transition-colors hover:border-coral",
		className
	)

	return <button type={type} className={buttonClassName} {...props} />
}
