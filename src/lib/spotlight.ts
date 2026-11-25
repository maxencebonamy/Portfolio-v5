import type { PointerEvent } from "react"

/** For `.spotlight` elements: exposes the cursor position as `--mx` / `--my`. */
export const spotlightHandler = (event: PointerEvent<HTMLElement>): void => {
	const rect = event.currentTarget.getBoundingClientRect()
	event.currentTarget.style.setProperty("--mx", `${event.clientX - rect.left}px`)
	event.currentTarget.style.setProperty("--my", `${event.clientY - rect.top}px`)
}
