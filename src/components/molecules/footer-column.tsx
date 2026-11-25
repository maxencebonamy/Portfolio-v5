import type { ReactNode } from "react"

import { cn } from "#/lib/cn"

/** Footer link style, dark in both themes. */
export const FOOTER_LINK_CLASS_NAME = cn(
	"text-[#ebebeb]/75",
	"transition-colors hover:text-[#ff6a69]"
)

type FooterColumnProps = {
	title: string
	/** List items (`<li>`). */
	children: ReactNode
}

/** Footer link column. */
export const FooterColumn = ({ title, children }: FooterColumnProps) => {
	const titleClassName = cn(
		"mb-4",
		"font-mono text-[11px] tracking-widest text-[#8f8f8f] uppercase"
	)

	return (
		<nav aria-label={title}>
			<h2 className={titleClassName}>{title}</h2>
			<ul className="space-y-2">{children}</ul>
		</nav>
	)
}
