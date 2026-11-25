import { AnimatePresence, motion } from "motion/react"
import { useRef } from "react"

import { useTicker } from "#/hooks/use-ticker"
import { cn } from "#/lib/cn"
import type { Skills } from "#/schemas/skills"

/** Fake API request. */
type Request = Skills["backend"]["requests"][number]

/** In ms. */
const REQUEST_INTERVAL = 1400

const VISIBLE_REQUESTS = 3

const METHOD_COLORS: Record<Request["method"], string> = {
	GET: "text-emerald-600 dark:text-emerald-400",
	POST: "text-sky-600 dark:text-sky-400",
	PUT: "text-amber-600 dark:text-amber-400",
	PATCH: "text-amber-600 dark:text-amber-400",
	DELETE: "text-coral"
}

/** 2xx, then anything else. */
const STATUS_COLORS = {
	success: "text-emerald-600 dark:text-emerald-400",
	other: "text-amber-600 dark:text-amber-400"
}

/**
 * Stable fake response time for a request.
 *
 * @param tick - Log position, so the same request varies over time.
 * @returns Duration in ms.
 */
const responseTime = (request: Request, tick: number): number => {
	const seed = [ ...`${request.method}${request.path}` ].reduce((sum, char) => sum + char.charCodeAt(0), tick * 7)
	return 4 + (seed % 37)
}

type RequestLogProps = {
	requests: Request[]
}

/** Server log with a steady stream of API requests. */
export const RequestLog = ({ requests }: RequestLogProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const tick = useTicker(REQUEST_INTERVAL, ref)
	const visible = Array.from({ length: VISIBLE_REQUESTS }, (_, offset) => tick + offset)

	const logClassName = cn(
		"w-full px-4 py-3",
		"rounded-xl border border-line",
		"bg-bg/60",
		"font-mono text-[11px] sm:text-xs"
	)

	const rowClassName = cn(
		"absolute inset-x-0 top-0 flex h-6 items-center gap-3",
		"whitespace-nowrap"
	)

	return (
		<div ref={ref} className={logClassName}>
			<div className="relative h-18 overflow-hidden">
				<AnimatePresence initial={false}>
					{visible.map((position, slot) => {
						const request = requests[position % requests.length]
						return (
							<motion.div
								key={position}
								className={rowClassName}
								initial={{ opacity: 0, y: `${VISIBLE_REQUESTS * 100}%` }}
								animate={{ opacity: 1, y: `${slot * 100}%` }}
								exit={{ opacity: 0, y: "-100%" }}
								transition={{ duration: 0.5, ease: "easeOut" }}
							>
								<span className={cn("w-12 shrink-0 font-semibold", METHOD_COLORS[request.method])}>{request.method}</span>
								<span className="min-w-0 flex-1 truncate text-fg/80">{request.path}</span>
								<span className={request.status < 300 ? STATUS_COLORS.success : STATUS_COLORS.other}>{request.status}</span>
								<span className="w-10 text-right text-muted">{`${responseTime(request, position)}ms`}</span>
							</motion.div>
						)
					})}
				</AnimatePresence>
			</div>
		</div>
	)
}
