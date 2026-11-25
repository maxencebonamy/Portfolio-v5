import { useCallback, useEffect, useRef, useState } from "react"

/**
 * Copies through a hidden textarea. Fallback when the Clipboard API is missing,
 * i.e. outside secure contexts (e.g. a LAN address).
 *
 * @returns `true` if the browser accepted the copy.
 */
const legacyCopy = (text: string): boolean => {
	const field = document.createElement("textarea")
	field.value = text
	field.setAttribute("readonly", "")
	field.style.position = "fixed"
	field.style.opacity = "0"
	document.body.append(field)
	field.select()
	field.setSelectionRange(0, text.length)
	try {
		// Deprecated, but still the only option outside secure contexts.
		return document.execCommand("copy")
	} catch {
		return false
	} finally {
		field.remove()
	}
}

/** Clipboard API first, then {@link legacyCopy}. */
const writeToClipboard = async (text: string): Promise<boolean> => {
	try {
		await navigator.clipboard.writeText(text)
		return true
	} catch {
		return legacyCopy(text)
	}
}

/** Result of {@link useCopyToClipboard}. */
export type CopyToClipboard = {
	copied: boolean
	/** Resolves to `false` when the clipboard is unavailable. */
	copy: (text: string) => Promise<boolean>
}

/**
 * Copies to the clipboard and keeps `copied` set for a while, for feedback.
 *
 * @param resetAfter - How long `copied` stays `true`, in ms.
 */
export const useCopyToClipboard = (resetAfter = 2000): CopyToClipboard => {
	const [ copied, setCopied ] = useState(false)
	const timeout = useRef<ReturnType<typeof setTimeout>>(undefined)

	useEffect(() => () => clearTimeout(timeout.current), [])

	const copy = useCallback(async (text: string) => {
		if (!await writeToClipboard(text)) return false
		clearTimeout(timeout.current)
		setCopied(true)
		timeout.current = setTimeout(() => setCopied(false), resetAfter)
		return true
	}, [ resetAfter ])

	return { copied, copy }
}
