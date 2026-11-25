import { Link } from "@tanstack/react-router"
import { useInView } from "motion/react"
import { useLayoutEffect, useRef, useState } from "react"

import { Container } from "#/components/atoms/container"
import { HighlightedText } from "#/components/atoms/highlighted-text"
import { ArrowIcon } from "#/components/atoms/icons/arrow-icon"
import { FOOTER_LINK_CLASS_NAME, FooterColumn } from "#/components/molecules/footer-column"
import { Magnetic } from "#/components/motion/magnetic"
import { FooterLogo } from "#/components/organisms/footer-logo"
import { SECTIONS } from "#/config/sections"
import { fullName, profile } from "#/content/profile"
import { useGoToSection } from "#/hooks/use-go-to-section"
import { useLocalTime } from "#/hooks/use-local-time"
import { cn } from "#/lib/cn"
import { localizePath } from "#/lib/i18n"
import { scrollToTarget } from "#/lib/scroll"
import { useI18n } from "#/providers/i18n-provider"
import { useLenis } from "#/providers/smooth-scroll-provider"

/** In px, used until measured. */
const INITIAL_HEIGHT = 640

/** Curtain footer, fixed under the page and uncovered on scroll. Measured to reserve its space. */
export const Footer = () => {
	const time = useLocalTime(profile.timeZone)
	const lenis = useLenis()
	const goTo = useGoToSection()
	const { t, pick, lang, langParam } = useI18n()
	const footerRef = useRef<HTMLElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const [ height, setHeight ] = useState(INITIAL_HEIGHT)
	const inView = useInView(wrapperRef, { once: true, margin: "0px 0px -20% 0px" })

	useLayoutEffect(() => {
		const footer = footerRef.current
		if (!footer) return
		const observer = new ResizeObserver(() => setHeight(footer.offsetHeight))
		observer.observe(footer)
		return () => observer.disconnect()
	}, [])

	const footerClassName = cn(
		"fixed bottom-0 w-full",
		"px-4 pt-16 pb-10 md:px-8 md:pt-20 md:pb-12",
		"bg-[#121212] text-[#ebebeb]"
	)

	const taglineClassName = cn(
		"max-w-sm lg:col-span-2",
		"text-2xl leading-snug font-medium md:text-3xl"
	)

	const metaClassName = cn(
		"font-mono text-[11px] tracking-widest text-[#8f8f8f] uppercase"
	)

	const backToTopClassName = cn(
		"flex items-center gap-2 px-4 py-2",
		"rounded-full border border-white/15",
		"font-mono text-[11px] tracking-widest uppercase",
		"transition-colors hover:border-[#ff6a69] hover:text-[#ff6a69]"
	)

	const bottomBarClassName = cn(
		"mt-10 flex flex-wrap items-center justify-between gap-4 pt-6",
		"border-t border-white/10",
		metaClassName
	)

	return (
		<div ref={wrapperRef} className="relative" style={{ height, clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)" }}>
			<footer ref={footerRef} className={footerClassName}>
				<Container>
					<div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
						<p className={taglineClassName}>
							<HighlightedText text={t("footer.tagline")} highlightClassName="text-[#ff6a69] italic" />
						</p>

						<FooterColumn title={t("footer.sections")}>
							{SECTIONS.map(section => (
								<li key={section.id}>
									<a
										href={`${localizePath("/", lang)}#${section.id}`}
										onClick={event => {
											event.preventDefault()
											goTo(section.id)
										}}
										className={FOOTER_LINK_CLASS_NAME}
									>
										{t(section.label)}
									</a>
								</li>
							))}
							<li>
								<Link
									to="/{-$lang}/projects"
									params={{ lang: langParam }}
									className={FOOTER_LINK_CLASS_NAME}
								>
									{t("nav.allProjects")}
								</Link>
							</li>
						</FooterColumn>

						<FooterColumn title={t("footer.links")}>
							{profile.socials.map(social => (
								<li key={social.label}>
									<a href={social.href} target="_blank" rel="noreferrer me" className={FOOTER_LINK_CLASS_NAME}>{social.label}</a>
								</li>
							))}
							<li>
								<a href={pick(profile.resume)} target="_blank" rel="noreferrer" className={FOOTER_LINK_CLASS_NAME}>
									{t("common.resume")}
								</a>
							</li>
							<li>
								<a href={`mailto:${profile.email}`} className={FOOTER_LINK_CLASS_NAME}>{t("common.email")}</a>
							</li>
						</FooterColumn>
					</div>

					<div className="mt-20 flex flex-col gap-8 md:mt-28 md:flex-row md:items-end md:justify-between">
						<FooterLogo play={inView} />
						<div className="flex flex-col items-start gap-4 md:items-end md:text-right">
							{profile.openToWork && (
								<span className={cn("flex items-center gap-2", metaClassName)}>
									<span className="size-2 rounded-full bg-emerald-400" />
									{t("common.openToWork")}
								</span>
							)}
							<Magnetic>
								<button type="button" onClick={() => scrollToTarget(lenis, 0)} className={backToTopClassName}>
									{t("footer.backToTop")}
									<ArrowIcon className="size-3.5 -rotate-45" />
								</button>
							</Magnetic>
						</div>
					</div>

					<div className={bottomBarClassName}>
						{/* Prerendered year may be stale; client wins. */}
						<span suppressHydrationWarning>{`© ${new Date().getFullYear()} ${fullName}`}</span>
						<span>{`${profile.location} · ${time}`}</span>
						<span className="hidden md:inline">{t("footer.stack")}</span>
					</div>
				</Container>
			</footer>
		</div>
	)
}
