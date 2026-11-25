import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react"
import { useEffect, useRef } from "react"

import { Container } from "#/components/atoms/container"
import { PingDot } from "#/components/atoms/ping-dot"
import { HeroActions } from "#/components/organisms/hero-actions"
import { HeroPortrait } from "#/components/organisms/hero-portrait"
import { HeroTitle } from "#/components/organisms/hero-title"
import { profile } from "#/content/profile"
import { useLocalTime } from "#/hooks/use-local-time"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"

const GLOW_SPRING = { stiffness: 40, damping: 20 }

/** First screen: availability, title, portrait, CTAs. */
export const HeroSection = () => {
	const time = useLocalTime(profile.timeZone)
	const { t } = useI18n()
	const ref = useRef<HTMLElement>(null)

	const mouseX = useMotionValue(0)
	const mouseY = useMotionValue(0)
	const glowX = useSpring(mouseX, GLOW_SPRING)
	const glowY = useSpring(mouseY, GLOW_SPRING)

	useEffect(() => {
		const onPointerMove = (event: PointerEvent): void => {
			mouseX.set((event.clientX / window.innerWidth - 0.5) * 160)
			mouseY.set((event.clientY / window.innerHeight - 0.5) * 120)
		}
		window.addEventListener("pointermove", onPointerMove)
		return () => window.removeEventListener("pointermove", onPointerMove)
	}, [ mouseX, mouseY ])

	const { scrollYProgress } = useScroll({ target: ref, offset: [ "start start", "end start" ] })
	const titleY = useTransform(scrollYProgress, [ 0, 1 ], [ "0%", "35%" ])
	const photoY = useTransform(scrollYProgress, [ 0, 1 ], [ "0%", "-18%" ])
	const fade = useTransform(scrollYProgress, [ 0, 0.7 ], [ 1, 0 ])

	const sectionClassName = cn(
		"relative flex min-h-svh flex-col overflow-hidden",
		"px-4 pt-28 pb-8 md:px-8 md:pt-32"
	)

	const glowClassName = cn(
		"absolute top-[30%] left-[18%] size-[42vmax] md:size-[34vmax]",
		"rounded-full blur-[120px]",
		"bg-[radial-gradient(circle,rgba(255,106,105,.55),rgba(255,106,105,0)_65%)]"
	)

	const metaClassName = cn(
		"flex flex-wrap items-center justify-between gap-2",
		"font-mono text-[11px] tracking-widest text-muted uppercase"
	)

	return (
		<section ref={ref} id="top" className={sectionClassName}>
			<div aria-hidden className="bg-grid absolute inset-0 opacity-60" />
			<motion.div
				aria-hidden
				className={glowClassName}
				style={{ x: glowX, y: glowY }}
				initial={{ scale: 0.4, opacity: 0 }}
				animate={{ scale: 1, opacity: 1 }}
				transition={{ duration: 2, ease: EASE }}
			/>

			<Container className="relative flex flex-1 flex-col">
				<motion.div
					className={metaClassName}
					initial={{ opacity: 0 }}
					animate={{ opacity: 1 }}
					transition={{ delay: 0.5, duration: 1 }}
				>
					{profile.openToWork
						? (
							<span className="flex items-center gap-2">
								<PingDot />
								{t("common.openToWork")}
							</span>
						)
						: <span />}
					<span className="hidden sm:inline">{`${profile.location} · ${time}`}</span>
				</motion.div>

				<div className="relative flex flex-1 flex-col justify-center py-10 lg:py-0">
					<HeroPortrait play y={photoY} />
					<HeroTitle play y={titleY} opacity={fade} />
				</div>

				<HeroActions play />
			</Container>
		</section>
	)
}
