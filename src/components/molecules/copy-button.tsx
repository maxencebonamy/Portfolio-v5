import { AnimatePresence, motion } from "motion/react"

import { CheckIcon } from "#/components/atoms/icons/check-icon"
import { CopyIcon } from "#/components/atoms/icons/copy-icon"
import { useCopyToClipboard } from "#/hooks/use-copy-to-clipboard"
import { cn } from "#/lib/cn"

type CopyButtonProps = {
	/** Copied to the clipboard. */
	text: string
	label: string
	/** Shown briefly after copying. */
	copiedLabel: string
	/** Clipboard unavailable. */
	onError?: () => void
	className?: string
}

/** Copy button; icon and label flip to a confirmation once copied. */
export const CopyButton = ({ text, label, copiedLabel, onError, className }: CopyButtonProps) => {
	const { copied, copy } = useCopyToClipboard()

	const onClick = async (): Promise<void> => {
		if (!await copy(text)) onError?.()
	}

	const buttonClassName = cn(
		"flex items-center gap-2 overflow-hidden px-5 py-3",
		"rounded-full border",
		"text-sm font-medium whitespace-nowrap",
		"transition-colors duration-300",
		copied
			? "border-emerald-400/60 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400"
			: "border-line text-muted hover:border-fg hover:text-fg",
		className
	)

	return (
		<>
			<button type="button" onClick={() => void onClick()} className={buttonClassName}>
				<AnimatePresence mode="wait" initial={false}>
					<motion.span
						key={copied ? "copied" : "idle"}
						className="flex items-center gap-2"
						initial={{ y: 12, opacity: 0 }}
						animate={{ y: 0, opacity: 1 }}
						exit={{ y: -12, opacity: 0 }}
						transition={{ duration: 0.2 }}
					>
						{copied ? <CheckIcon /> : <CopyIcon />}
						<span>{copied ? copiedLabel : label}</span>
					</motion.span>
				</AnimatePresence>
			</button>
			{/* Kept out of the animated label, which remounts: a live region must already exist to be announced. */}
			<span role="status" className="sr-only">{copied ? copiedLabel : ""}</span>
		</>
	)
}
