import { ActivePill } from "#/components/atoms/active-pill"
import { SECTIONS } from "#/config/sections"
import { useActiveSection } from "#/hooks/use-active-section"
import { useGoToSection } from "#/hooks/use-go-to-section"
import { cn } from "#/lib/cn"
import { localizePath } from "#/lib/i18n"
import { useI18n } from "#/providers/i18n-provider"

type SectionTabsProps = {
	/** Frosted background, once scrolled a bit. */
	elevated: boolean
	className?: string
}

/** Nav bar center pill: one tab per section, active one highlighted. */
export const SectionTabs = ({ elevated, className }: SectionTabsProps) => {
	const active = useActiveSection()
	const goTo = useGoToSection()
	const { t, lang } = useI18n()

	const tabsClassName = cn(
		"items-center gap-1 p-1.5",
		"rounded-full border",
		"backdrop-blur-xl",
		"transition-colors duration-500",
		elevated ? "border-line bg-elev/70" : "border-transparent bg-transparent",
		className
	)

	return (
		<div className={tabsClassName}>
			{SECTIONS.map(section => {
				const isActive = active === section.id
				const tabClassName = cn(
					"relative px-4 py-2",
					"rounded-full",
					"text-sm font-medium whitespace-nowrap",
					"transition-colors",
					isActive ? "text-[#1a1a1a]" : "text-muted hover:text-fg"
				)

				return (
					<a
						key={section.id}
						href={`${localizePath("/", lang)}#${section.id}`}
						onClick={event => {
							event.preventDefault()
							goTo(section.id)
						}}
						aria-current={isActive ? "location" : undefined}
						className={tabClassName}
					>
						{isActive && <ActivePill layoutId="nav-pill" />}
						<span className="relative">{t(section.label)}</span>
					</a>
				)
			})}
		</div>
	)
}
