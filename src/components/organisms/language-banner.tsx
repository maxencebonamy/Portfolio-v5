import { AnimatePresence, motion } from "motion/react"
import { useEffect, useState } from "react"

import { CloseIcon } from "#/components/atoms/icons/close-icon"
import { messages } from "#/content/messages"
import { cn } from "#/lib/cn"
import { browserLocale, persistLocale, savedLocale } from "#/lib/i18n"
import { EASE } from "#/lib/motion"
import { useI18n } from "#/providers/i18n-provider"
import type { Locale } from "#/schemas/localized"

/** In s, lets the page entrance play first. */
const APPEAR_DELAY = 1.5

/**
 * Offers the visitor's browser language when the page is in the other one. Never redirects:
 * shared links and search engines keep the URL's language. Gone once a language is chosen or it is dismissed.
 */
export const LanguageBanner = () => {
	const { lang, setLang, pathIn } = useI18n()
	const [ suggested, setSuggested ] = useState<Locale | null>(null)

	// Browser language and saved choice are only known on the client. Checked again on each
	// language change: the switch saves the choice, which retires the banner.
	useEffect(() => {
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setSuggested(savedLocale() ? null : browserLocale())
	}, [ lang ])

	const visible = suggested !== null && suggested !== lang

	const dismiss = (): void => {
		persistLocale(lang)
		setSuggested(null)
	}

	const accept = (locale: Locale): void => {
		setLang(locale)
		setSuggested(null)
	}

	const bannerClassName = cn(
		"fixed inset-x-4 bottom-4 z-30 sm:right-auto sm:left-1/2 sm:-translate-x-1/2",
		"flex items-center gap-3 py-2 pr-2 pl-5",
		"rounded-full border border-line",
		"bg-elev/85 shadow-2xl backdrop-blur-xl",
		"text-sm"
	)

	const switchClassName = cn(
		"shrink-0 px-4 py-2",
		"rounded-full bg-fg",
		"font-semibold whitespace-nowrap text-bg",
		"transition-colors hover:bg-coral hover:text-[#1a1a1a]"
	)

	const dismissClassName = cn(
		"grid size-9 shrink-0 place-items-center",
		"rounded-full",
		"text-muted",
		"transition-colors hover:text-fg"
	)

	return (
		<AnimatePresence>
			{visible && (
				<motion.aside
					lang={suggested}
					aria-label={messages["langBanner.text"][suggested]}
					className={bannerClassName}
					initial={{ opacity: 0, y: 24 }}
					animate={{ opacity: 1, y: 0, transition: { duration: 0.6, ease: EASE, delay: APPEAR_DELAY } }}
					exit={{ opacity: 0, y: 24, transition: { duration: 0.3 } }}
				>
					<p className="min-w-0 flex-1 text-fg sm:flex-none">{messages["langBanner.text"][suggested]}</p>
					<a
						href={pathIn(suggested)}
						hrefLang={suggested}
						onClick={event => {
							event.preventDefault()
							accept(suggested)
						}}
						className={switchClassName}
					>
						{messages["langBanner.switch"][suggested]}
					</a>
					<button type="button" onClick={dismiss} aria-label={messages["langBanner.dismiss"][suggested]} className={dismissClassName}>
						<CloseIcon />
					</button>
				</motion.aside>
			)}
		</AnimatePresence>
	)
}
