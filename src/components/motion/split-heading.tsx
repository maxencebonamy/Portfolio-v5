import { useInView } from "motion/react"
import { Fragment, useRef, useState } from "react"

import { MaskedReveal } from "#/components/motion/masked-reveal"
import { EASE } from "#/lib/motion"

type SplitHeadingProps = {
	text: string
	className?: string
	as?: "h1" | "h2" | "h3" | "p" | "span"
	/** Before the first word, in s. */
	delay?: number
	/** Starts the animation; defaults to in-view. */
	play?: boolean
}

/** Words rise one by one out of a mask. After reveal, new text (language switch) shows at once. */
export const SplitHeading = ({ text, className, as: Tag = "h2", delay = 0, play }: SplitHeadingProps) => {
	const ref = useRef<HTMLElement>(null)
	const inView = useInView(ref, { once: true, margin: "0px 0px -10% 0px" })
	const [ revealed, setRevealed ] = useState(false)
	const words = text.split(" ")

	return (
		<Tag ref={ref as never} className={className}>
			{words.map((word, index) => (
				<Fragment key={`${word}-${index}`}>
					{index > 0 && " "}
					<MaskedReveal
						play={play ?? inView}
						initial={{ y: "130%", rotate: 4 }}
						animate={{ y: "0%", rotate: 0 }}
						transition={{ duration: 1, ease: EASE, delay: delay + index * 0.06 }}
						onRevealed={index === words.length - 1 ? () => setRevealed(true) : undefined}
						skip={revealed}
					>
						{word}
					</MaskedReveal>
				</Fragment>
			))}
		</Tag>
	)
}
