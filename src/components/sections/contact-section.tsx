import { motion, useScroll, useTransform } from "motion/react"
import { useRef } from "react"

import { ArrowBadge } from "#/components/atoms/arrow-badge"
import { Container } from "#/components/atoms/container"
import { Section } from "#/components/atoms/section"
import { ContactLink } from "#/components/molecules/contact-link"
import { CopyButton } from "#/components/molecules/copy-button"
import { Eyebrow } from "#/components/molecules/eyebrow"
import { SectionTitle } from "#/components/molecules/section-title"
import { Magnetic } from "#/components/motion/magnetic"
import { Reveal } from "#/components/motion/reveal"
import { home } from "#/content/home"
import { profile } from "#/content/profile"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

/** Contact CTA, email and links. */
export const ContactSection = () => {
	const { t, pick } = useI18n()
	const ref = useRef<HTMLElement>(null)
	const { scrollYProgress } = useScroll({ target: ref, offset: [ "start end", "end end" ] })
	const scale = useTransform(scrollYProgress, [ 0, 1 ], [ 0.6, 1.1 ])
	const rotate = useTransform(scrollYProgress, [ 0, 1 ], [ -25, 0 ])
	const { contact } = home

	const openMailClient = (): void => {
		window.location.href = `mailto:${profile.email}`
	}

	const links = [
		...profile.socials.map(social => ({ id: social.label, label: social.label, details: social.handle, href: social.href, download: false })),
		{ id: "resume", label: pick(contact.resume), details: pick(contact.resumeDetails), href: pick(profile.resume), download: true }
	]

	// Glow taller than the section: fade its top instead of a hard cut.
	const glowLayerClassName = cn(
		"pointer-events-none absolute inset-0 overflow-hidden",
		"[mask-image:linear-gradient(to_bottom,transparent,black_45%)]"
	)

	const glowClassName = cn(
		"absolute bottom-[-30%] left-1/2 size-[70vmax] -translate-x-1/2",
		"rounded-full opacity-25 blur-[100px]",
		"bg-[conic-gradient(from_90deg,var(--coral),transparent_30%,var(--coral)_60%,transparent_80%,var(--coral))]"
	)

	const emailClassName = cn(
		"group flex items-center gap-3 py-3 pr-3 pl-6",
		"sm:gap-4 sm:py-4 sm:pr-4 sm:pl-8",
		"rounded-full bg-fg",
		"text-base font-semibold text-bg sm:text-lg md:text-xl",
		"transition-colors duration-300 hover:bg-coral hover:text-[#1a1a1a]"
	)

	const emailBadgeClassName = cn(
		"size-11",
		"bg-coral text-[#1a1a1a]",
		"transition-all group-hover:bg-[#1a1a1a] group-hover:text-coral"
	)

	const linksClassName = cn(
		"mt-24 grid sm:grid-cols-3",
		"border-t border-line"
	)

	return (
		<Section ref={ref} id="contact" className="overflow-hidden pb-16 md:pb-16">
			<div aria-hidden className={glowLayerClassName}>
				<motion.div className={glowClassName} style={{ scale, rotate }} />
			</div>
			<Container className="relative">
				<Reveal>
					<Eyebrow index="05">{pick(contact.label)}</Eyebrow>
				</Reveal>

				<SectionTitle
					first={pick(contact.title.first)}
					second={pick(contact.title.second)}
					className="mt-8 text-[clamp(3rem,11vw,10rem)] leading-[0.88]"
				/>

				<div className="mt-14 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
					<Reveal delay={0.2}>
						<p className="max-w-md text-lg text-muted">{pick(contact.intro)}</p>
					</Reveal>

					<Reveal delay={0.3}>
						<div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
							<Magnetic strength={0.25}>
								<a href={`mailto:${profile.email}`} className={emailClassName}>
									<span>{profile.email}</span>
									<ArrowBadge className={emailBadgeClassName} iconClassName="size-5" />
								</a>
							</Magnetic>
							<CopyButton text={profile.email} label={pick(contact.copy)} copiedLabel={t("common.copied")} onError={openMailClient} />
						</div>
					</Reveal>
				</div>

				<ul className={linksClassName}>
					{links.map((link, index) => (
						<li key={link.id} className="border-b border-line sm:border-r sm:last:border-r-0">
							<Reveal delay={index * 0.08} y={20}>
								<ContactLink label={link.label} details={link.details} href={link.href} download={link.download} />
							</Reveal>
						</li>
					))}
				</ul>
			</Container>
		</Section>
	)
}
