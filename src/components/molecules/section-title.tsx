import { SplitHeading } from "#/components/motion/split-heading"
import { cn } from "#/lib/cn"

type SectionTitleProps = {
	/** Plain line. */
	first: string
	/** Hollow italic line. */
	second: string
	as?: "h1" | "h2"
	/** Starts the animation; defaults to on scroll into view. */
	play?: boolean
	className?: string
}

/** Large two-line section heading: plain, then hollow italic. */
export const SectionTitle = ({ first, second, as: Tag = "h2", play, className }: SectionTitleProps) => {
	const titleClassName = cn(
		"text-[clamp(2.8rem,8vw,7rem)] leading-[0.9] font-bold tracking-tight uppercase",
		className
	)

	return (
		<Tag className={titleClassName}>
			<SplitHeading as="span" text={first} className="block" play={play} />
			{/* Not rendered between blocks, but keeps the two lines apart in the heading's text. */}
			{" "}
			<SplitHeading as="span" text={second} delay={0.1} className="text-outline block italic" play={play} />
		</Tag>
	)
}
