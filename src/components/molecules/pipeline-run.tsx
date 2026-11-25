import { motion } from "motion/react"
import { Fragment, useRef } from "react"

import { CheckIcon } from "#/components/atoms/icons/check-icon"
import { useTicker } from "#/hooks/use-ticker"
import { cn } from "#/lib/cn"

/** Per step, in ms. */
const STEP_DURATION = 900

/** Extra ticks the finished pipeline stays green before restarting. */
const DONE_TICKS = 3

type PipelineRunProps = {
	/** E.g. lint, test, build. */
	steps: string[]
}

/** CI/CD pipeline looping through its steps. */
export const PipelineRun = ({ steps }: PipelineRunProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const tick = useTicker(STEP_DURATION, ref)
	const current = tick === 0 ? steps.length : tick % (steps.length + DONE_TICKS)

	return (
		<div ref={ref} className="flex w-full flex-wrap items-center gap-x-1.5 gap-y-2 font-mono text-[11px]">
			{steps.map((step, index) => {
				const done = index < current
				const running = index === current

				const stepClassName = cn(
					"flex items-center gap-1.5 px-2.5 py-1",
					"rounded-full border",
					"transition-colors duration-300",
					done && "border-emerald-400/40 bg-emerald-400/10 text-emerald-600 dark:text-emerald-400",
					running && "border-coral/50 bg-coral/10 text-coral",
					!done && !running && "border-line text-muted"
				)

				return (
					<Fragment key={step}>
						{index > 0 && <span className={cn("h-px w-2 transition-colors", done ? "bg-emerald-400/50" : "bg-line")} />}
						<span className={stepClassName}>
							{/* Same slot in every state: steps keep their width and wrap the same. */}
							<span className="grid size-3 shrink-0 place-items-center">
								{done && <CheckIcon className="size-3" />}
								{running && (
									<motion.span
										className="size-2 rounded-full bg-coral"
										animate={{ scale: [ 1, 0.6, 1 ] }}
										transition={{ duration: 0.8, repeat: Infinity }}
									/>
								)}
								{!done && !running && <span className="size-1.5 rounded-full bg-current opacity-50" />}
							</span>
							{step}
						</span>
					</Fragment>
				)
			})}
		</div>
	)
}
