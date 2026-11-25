import type { ReactNode } from "react"

import { cn } from "#/lib/cn"

type EyebrowProps = {
	/** E.g. "01". */
	index: string
	children: ReactNode
	/** `h2` when it is the section's only heading. */
	as?: "p" | "h2"
}

/** Section label: number, line, title. */
export const Eyebrow = ({ index, children, as: Tag = "p" }: EyebrowProps) => {
	const eyebrowClassName = cn(
		"flex items-center gap-3",
		"font-mono text-xs tracking-widest text-muted uppercase"
	)

	return (
		<Tag className={eyebrowClassName}>
			{/* Decorative: headings read as the label alone. */}
			<span aria-hidden className="text-coral">{index}</span>
			{" "}
			<span aria-hidden className="h-px w-8 bg-line" />
			{" "}
			<span>{children}</span>
		</Tag>
	)
}
