import { useId } from "react"

import { ActivePill } from "#/components/atoms/active-pill"
import { LOCALES } from "#/config/locales"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

type LangSwitchProps = {
	className?: string
}

/** FR / EN switch with a sliding pill. Real links to the page in each language (crawlers follow them). */
export const LangSwitch = ({ className }: LangSwitchProps) => {
	const { lang, setLang, pathIn, t } = useI18n()
	// Unique per instance: the nav and the mobile menu both render a switch.
	const pillId = `lang-pill-${useId()}`

	const groupClassName = cn(
		"relative flex h-10 items-center p-1",
		"rounded-full border border-line",
		"bg-elev/60 backdrop-blur-xl",
		"font-mono text-[11px] font-medium",
		className
	)

	return (
		<div role="group" aria-label={t("nav.language")} className={groupClassName}>
			{LOCALES.map(code => {
				const active = lang === code
				const buttonClassName = cn(
					"relative flex h-full items-center px-2.5",
					"rounded-full",
					"uppercase",
					"transition-colors",
					active ? "text-bg" : "text-muted hover:text-fg"
				)

				return (
					<a
						key={code}
						href={pathIn(code)}
						hrefLang={code}
						lang={code}
						onClick={event => {
							event.preventDefault()
							setLang(code)
						}}
						aria-current={active ? "page" : undefined}
						className={buttonClassName}
					>
						{active && <ActivePill layoutId={pillId} className="bg-fg" />}
						<span className="relative">{code}</span>
					</a>
				)
			})}
		</div>
	)
}
