import type { SVGProps } from "react"

import { cn } from "#/lib/cn"

export type IconProps = SVGProps<SVGSVGElement>

/** Base icon: 24x24 grid, `currentColor` stroke, aria-hidden. */
export const Icon = ({ className, children, ...props }: IconProps) => {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2}
			strokeLinecap="round"
			strokeLinejoin="round"
			aria-hidden
			className={cn("size-4 shrink-0", className)}
			{...props}
		>
			{children}
		</svg>
	)
}
