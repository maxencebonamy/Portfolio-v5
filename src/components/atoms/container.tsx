import type { ComponentProps, ElementType } from "react"

import { cn } from "#/lib/cn"

type ContainerProps = ComponentProps<"div"> & {
	/** Defaults to `div`. */
	as?: ElementType
}

/** Centered, width-capped wrapper. */
export const Container = ({ as: Tag = "div", className, ...props }: ContainerProps) => {
	return <Tag className={cn("mx-auto w-full max-w-[1400px]", className)} {...props} />
}
