import { AnimatePresence, motion } from "motion/react"
import { useEffect } from "react"

import { IconButton } from "#/components/atoms/icon-button"
import { MoonIcon } from "#/components/atoms/icons/moon-icon"
import { SunIcon } from "#/components/atoms/icons/sun-icon"
import { useTheme } from "#/hooks/use-theme"
import { syncThemeColor, toggleTheme } from "#/lib/theme"
import { useI18n } from "#/providers/i18n-provider"

/** Light / dark switch with a spinning icon. */
export const ThemeToggle = () => {
	const theme = useTheme()
	const { t } = useI18n()

	// The prerendered meta holds the dark color; a saved light theme is only known in the browser.
	useEffect(() => {
		syncThemeColor(theme)
	}, [ theme ])

	return (
		<IconButton
			onClick={event => toggleTheme({ x: event.clientX, y: event.clientY })}
			aria-label={theme === "dark" ? t("theme.toLight") : t("theme.toDark")}
		>
			<AnimatePresence mode="wait" initial={false}>
				<motion.span
					key={theme}
					className="grid"
					initial={{ rotate: -90, scale: 0, opacity: 0 }}
					animate={{ rotate: 0, scale: 1, opacity: 1 }}
					exit={{ rotate: 90, scale: 0, opacity: 0 }}
					transition={{ duration: 0.3 }}
				>
					{theme === "dark" ? <MoonIcon /> : <SunIcon />}
				</motion.span>
			</AnimatePresence>
		</IconButton>
	)
}
