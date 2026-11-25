import type { ComponentProps } from "react"

import { cn } from "#/lib/cn"

const SIZES = {
	"2xs": "text-[10px]",
	"xs": "text-[11px]",
	"sm": "text-xs"
}

type MonoLabelProps = ComponentProps<"span"> & {
	size?: keyof typeof SIZES
}

/** Small uppercase mono label (metadata, column headings...). */
export const MonoLabel = ({ size = "sm", className, ...props }: MonoLabelProps) => {
	const labelClassName = cn(
		"block",
		"font-mono tracking-widest text-muted uppercase",
		SIZES[size],
		className
	)

	return <span className={labelClassName} {...props} />
}
