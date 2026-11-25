import type { MotionValue } from "motion/react"
import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

type ScrollWordProps = {
	children: string
	progress: MotionValue<number>
	/** Progress range over which the word lights up. */
	range: [ number, number ]
}

/** Word lit by scroll. In "*word" or "d'*word", the part after `*` is highlighted. */
const ScrollWord = ({ children, progress, range }: ScrollWordProps) => {
	const opacity = useTransform(progress, range, [ 0.15, 1 ])
	const star = children.indexOf("*")

	return (
		<motion.span style={{ opacity }}>
			{star === -1 ? children : children.slice(0, star)}
			{star !== -1 && <span className="text-coral">{children.slice(star + 1)}</span>}
			{" "}
		</motion.span>
	)
}

type ScrollTextProps = {
	/** Words prefixed with `*` are highlighted. */
	text: string
	className?: string
}

/** Paragraph whose words light up one by one on scroll. */
export const ScrollText = ({ text, className }: ScrollTextProps) => {
	const ref = useRef<HTMLParagraphElement>(null)
	const { scrollYProgress } = useScroll({ target: ref, offset: [ "start 0.85", "end 0.45" ] })
	const words = text.split(" ")

	return (
		<p ref={ref} className={className}>
			{words.map((word, index) => (
				<ScrollWord key={`${word}-${index}`} progress={scrollYProgress} range={[ index / words.length, (index + 1) / words.length ]}>
					{word}
				</ScrollWord>
			))}
		</p>
	)
}
