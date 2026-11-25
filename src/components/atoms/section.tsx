import type { ComponentProps } from "react"

import { cn } from "#/lib/cn"

/** Page section with standard spacing. */
export const Section = ({ className, ...props }: ComponentProps<"section">) => {
	const sectionClassName = cn(
		"relative scroll-mt-24",
		"px-4 py-28 md:px-8 md:py-40",
		className
	)

	return <section className={sectionClassName} {...props} />
}
