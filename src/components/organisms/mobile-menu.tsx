import { motion } from "motion/react"
import { useEffect } from "react"

import { LangSwitch } from "#/components/molecules/lang-switch"
import { SECTIONS } from "#/config/sections"
import { profile } from "#/content/profile"
import { useGoToSection } from "#/hooks/use-go-to-section"
import { cn } from "#/lib/cn"
import { padNumber } from "#/lib/format"
import { localizePath } from "#/lib/i18n"
import { EASE, EASE_IN_OUT } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"

/** In ms, lets the menu close before scrolling. */
const CLOSE_DELAY = 350

/** A dot under the burger button. */
const CLIP_CLOSED = "circle(0% at calc(100% - 40px) 40px)"

const CLIP_OPEN = "circle(150% at calc(100% - 40px) 40px)"

type MobileMenuProps = {
	onClose: () => void
}

/** Small-screen full-screen menu, revealed in a circle from the burger. */
export const MobileMenu = ({ onClose }: MobileMenuProps) => {
	const goTo = useGoToSection()
	const { t, pick, lang } = useI18n()

	// Escape closes, focus goes back to the burger button (the menu content unmounts).
	useEffect(() => {
		const onKeyDown = (event: KeyboardEvent): void => {
			if (event.key !== "Escape") return
			onClose()
			document.querySelector<HTMLElement>("[aria-controls=\"mobile-menu\"]")?.focus()
		}
		window.addEventListener("keydown", onKeyDown)
		return () => window.removeEventListener("keydown", onKeyDown)
	}, [ onClose ])

	const goToSection = (id: string): void => {
		onClose()
		setTimeout(() => goTo(id), CLOSE_DELAY)
	}

	const menuClassName = cn(
		"fixed inset-0 z-40 xl:hidden",
		"flex flex-col justify-between overflow-y-auto px-6 pt-28 pb-10",
		"bg-bg"
	)

	const sectionClassName = cn(
		"flex items-baseline gap-4",
		"text-[clamp(2rem,10vw,3rem)] leading-tight font-bold tracking-tight uppercase italic"
	)

	const linksClassName = cn(
		"flex flex-wrap gap-x-6 gap-y-2",
		"text-sm text-muted"
	)

	const links = [
		...profile.socials.map(social => ({ label: social.label, href: social.href, external: true })),
		{ label: t("common.resume"), href: pick(profile.resume), external: true },
		{ label: profile.email, href: `mailto:${profile.email}`, external: false }
	]

	return (
		<motion.div
			id="mobile-menu"
			className={menuClassName}
			initial={{ clipPath: CLIP_CLOSED }}
			animate={{ clipPath: CLIP_OPEN }}
			exit={{ clipPath: CLIP_CLOSED }}
			transition={{ duration: 0.7, ease: EASE_IN_OUT }}
		>
			<ul className="flex flex-col gap-2">
				{SECTIONS.map((section, index) => (
					<li key={section.id} className="overflow-hidden py-[0.1em]">
						<motion.a
							href={`${localizePath("/", lang)}#${section.id}`}
							className={sectionClassName}
							initial={{ y: "120%" }}
							animate={{ y: 0 }}
							exit={{ y: "120%" }}
							transition={{ duration: 0.6, ease: EASE, delay: 0.15 + index * 0.05 }}
							onClick={event => {
								event.preventDefault()
								goToSection(section.id)
							}}
						>
							<span className="font-mono text-sm text-coral not-italic">{padNumber(index + 1)}</span>
							<span className="pr-[0.1em]">{t(section.label)}</span>
						</motion.a>
					</li>
				))}
			</ul>

			<motion.div className="flex flex-col gap-6" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4 }}>
				<LangSwitch className="self-start sm:hidden" />
				<div className={linksClassName}>
					{links.map(link => (
						<a
							key={link.href}
							href={link.href}
							className="hover:text-coral"
							{...link.external && { target: "_blank", rel: "noreferrer" }}
						>
							{link.label}
						</a>
					))}
				</div>
			</motion.div>
		</motion.div>
	)
}
