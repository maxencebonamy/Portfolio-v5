import { AnimatePresence, motion, useMotionValue } from "motion/react"
import { useEffect, useState } from "react"

import { useFinePointer } from "#/hooks/use-fine-pointer"
import { cn } from "#/lib/cn"

/** Native cursor everywhere, replaced by a label bubble over `[data-cursor="Label"]` elements. */
export const Cursor = () => {
	const fine = useFinePointer()
	const x = useMotionValue(-200)
	const y = useMotionValue(-200)
	const [ label, setLabel ] = useState<string | null>(null)

	useEffect(() => {
		if (!fine) return
		let inside = false
		const updateLabel = (element: Element | null): void => {
			setLabel(element?.closest<HTMLElement>("[data-cursor]")?.dataset.cursor ?? null)
		}
		const onPointerMove = (event: PointerEvent): void => {
			inside = true
			x.set(event.clientX)
			y.set(event.clientY)
			updateLabel(event.target instanceof Element ? event.target : null)
		}
		// Scrolling moves the page under a still pointer, without any pointer event.
		const onScroll = (): void => {
			if (inside) updateLabel(document.elementFromPoint(x.get(), y.get()))
		}
		const onPointerLeave = (): void => {
			inside = false
			setLabel(null)
		}
		window.addEventListener("pointermove", onPointerMove, { passive: true })
		window.addEventListener("scroll", onScroll, { passive: true })
		document.addEventListener("pointerleave", onPointerLeave)
		return () => {
			window.removeEventListener("pointermove", onPointerMove)
			window.removeEventListener("scroll", onScroll)
			document.removeEventListener("pointerleave", onPointerLeave)
		}
	}, [ fine, x, y ])

	if (!fine) return null

	const bubbleClassName = cn(
		"grid size-20 place-items-center",
		"-translate-x-1/2 -translate-y-1/2",
		"rounded-full bg-coral shadow-lg",
		"text-xs font-semibold tracking-wide text-[#1a1a1a] uppercase"
	)

	return (
		<motion.div aria-hidden className="pointer-events-none fixed top-0 left-0 z-90" style={{ x, y }}>
			<AnimatePresence>
				{label && (
					<motion.div
						key="bubble"
						className={bubbleClassName}
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						exit={{ scale: 0 }}
						transition={{ type: "spring", stiffness: 500, damping: 30 }}
					>
						<AnimatePresence mode="wait" initial={false}>
							<motion.span
								key={label}
								initial={{ opacity: 0, y: 6 }}
								animate={{ opacity: 1, y: 0 }}
								exit={{ opacity: 0, y: -6 }}
								transition={{ duration: 0.15 }}
							>
								{label}
							</motion.span>
						</AnimatePresence>
					</motion.div>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
