import { motion } from "motion/react"

import { IconButton } from "#/components/atoms/icon-button"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

const BAR_CLASS_NAME = "absolute left-0 h-0.5 w-4 rounded bg-current"

type MenuToggleProps = {
	open: boolean
	onToggle: () => void
	className?: string
}

/** Burger button turning into a cross. */
export const MenuToggle = ({ open, onToggle, className }: MenuToggleProps) => {
	const { t } = useI18n()

	return (
		<IconButton
			onClick={onToggle}
			aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
			aria-expanded={open}
			aria-controls="mobile-menu"
			className={cn("hover:border-line", className)}
		>
			<span className="relative h-3 w-4">
				<motion.span className={BAR_CLASS_NAME} animate={open ? { top: 5, rotate: 45 } : { top: 0, rotate: 0 }} />
				<motion.span className={BAR_CLASS_NAME} animate={open ? { top: 5, rotate: -45 } : { top: 10, rotate: 0 }} />
			</span>
		</IconButton>
	)
}
