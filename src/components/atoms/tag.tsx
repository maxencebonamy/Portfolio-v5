import type { ComponentProps } from "react"

import { cn } from "#/lib/cn"

type TagProps = ComponentProps<"li"> & {
	size?: "sm" | "md"
}

/** Rounded label listing a technology. */
export const Tag = ({ size = "md", className, ...props }: TagProps) => {
	const tagClassName = cn(
		"rounded-full border border-line px-3 py-1",
		size === "sm" ? "text-xs font-medium" : "text-sm",
		className
	)

	return <li className={tagClassName} {...props} />
}
