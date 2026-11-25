import { cn } from "#/lib/cn"

type HighlightedTextProps = {
	/** Passages in [brackets] get highlighted, e.g. "Hello [world]". */
	text: string
	highlightClassName?: string
}

/** Text with [bracketed] passages highlighted. */
export const HighlightedText = ({ text, highlightClassName }: HighlightedTextProps) => {
	return text.split(/\[([^\]]+)\]/).map((part, index) => {
		return index % 2 === 1
			? <span key={index} className={cn("text-fg", highlightClassName)}>{part}</span>
			: part
	})
}
