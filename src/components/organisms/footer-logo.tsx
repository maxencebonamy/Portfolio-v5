import { motion } from "motion/react"

import { LOGO_ACCENT_INDEX, LOGO_PATHS, LOGO_VIEWBOX } from "#/config/logo"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"

type FooterLogoProps = {
	play: boolean
}

/** Giant footer logo, paths rising one by one. */
export const FooterLogo = ({ play }: FooterLogoProps) => {
	const logoClassName = cn(
		"w-full max-w-[760px] md:w-[58%]",
		"overflow-visible"
	)

	return (
		<svg viewBox={LOGO_VIEWBOX} className={logoClassName} aria-hidden>
			{LOGO_PATHS.map((path, index) => (
				<motion.path
					key={path}
					d={path}
					fillRule="evenodd"
					clipRule="evenodd"
					fill={index === LOGO_ACCENT_INDEX ? "#ff6a69" : "#ebebeb"}
					initial={{ opacity: 0, y: 40 }}
					animate={play ? { opacity: 1, y: 0 } : undefined}
					transition={{ duration: 1, ease: EASE, delay: 0.1 + index * 0.08 }}
				/>
			))}
		</svg>
	)
}
