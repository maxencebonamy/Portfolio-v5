import { Link } from "@tanstack/react-router"
import { AnimatePresence, motion } from "motion/react"
import { useRef } from "react"

import { Container } from "#/components/atoms/container"
import { Logo } from "#/components/atoms/logo"
import { ContactButton } from "#/components/molecules/contact-button"
import { LangSwitch } from "#/components/molecules/lang-switch"
import { MenuToggle } from "#/components/molecules/menu-toggle"
import { SectionTabs } from "#/components/molecules/section-tabs"
import { ThemeToggle } from "#/components/molecules/theme-toggle"
import { MobileMenu } from "#/components/organisms/mobile-menu"
import { useHeaderVisibility } from "#/hooks/use-header-visibility"
import { useLockScroll } from "#/hooks/use-lock-scroll"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"

type NavProps = {
	/** Full-screen menu of small screens. */
	menuOpen: boolean
	onMenuOpenChange: (open: boolean) => void
}

/** Top bar, hidden while scrolling down; full-screen menu on small screens. */
export const Nav = ({ menuOpen, onMenuOpenChange }: NavProps) => {
	const { t, langParam } = useI18n()
	const headerRef = useRef<HTMLElement>(null)
	const { hidden, scrolled } = useHeaderVisibility(headerRef)
	useLockScroll(menuOpen)

	const closeMenu = (): void => onMenuOpenChange(false)

	const headerClassName = cn(
		"fixed inset-x-0 top-0 z-50",
		"px-4 pt-4 md:px-8 md:pt-5"
	)

	const logoClassName = cn(
		"h-9 w-auto md:h-10",
		"text-fg",
		"transition-transform duration-500 ease-out-expo group-hover:-rotate-6"
	)

	// Frosted band once scrolled, for readability. Lower edge fades out, no hard line.
	const backdropClassName = cn(
		"pointer-events-none absolute inset-x-0 top-0 -z-10 h-[calc(100%_+_3.5rem)]",
		"bg-bg/85 backdrop-blur-xl",
		"[mask-image:linear-gradient(to_bottom,black_calc(100%_-_2.5rem),transparent)]",
		"transition-opacity duration-500",
		scrolled && !menuOpen ? "opacity-100" : "opacity-0"
	)

	return (
		<>
			{/* `layoutRoot`: header is fixed, so measure the pill without page scroll. */}
			<motion.header
				ref={headerRef}
				layoutRoot
				className={headerClassName}
				initial={{ y: -100, opacity: 0 }}
				animate={{ y: hidden && !menuOpen ? -110 : 0, opacity: 1 }}
				transition={{ duration: 0.6, ease: EASE }}
			>
				<div aria-hidden className={backdropClassName} />
				<Container as="nav" aria-label={t("nav.main")} className="flex items-center justify-between gap-4">
					<Link
						to="/{-$lang}"
						params={{ lang: langParam }}
						className="group relative z-10 flex items-center gap-3"
						aria-label={t("nav.home")}
						onClick={closeMenu}
					>
						<Logo className={logoClassName} />
					</Link>

					<SectionTabs elevated={scrolled} className="hidden xl:flex" />

					<div className="relative z-10 flex items-center gap-2">
						<LangSwitch className="hidden sm:flex" />
						<ThemeToggle />
						<div className="hidden md:block">
							<ContactButton />
						</div>
						<MenuToggle open={menuOpen} onToggle={() => onMenuOpenChange(!menuOpen)} className="xl:hidden" />
					</div>
				</Container>
			</motion.header>

			<AnimatePresence>
				{menuOpen && <MobileMenu onClose={closeMenu} />}
			</AnimatePresence>
		</>
	)
}
