import { motion } from "motion/react"
import { useRef } from "react"

import { useTicker } from "#/hooks/use-ticker"
import { cn } from "#/lib/cn"

/** In ms. */
const SHUFFLE_INTERVAL = 2200

/** Per layout, grid placement of each block. */
const LAYOUTS = [
	[ "col-span-2 row-span-2", "col-span-1", "col-span-1", "col-span-2" ],
	[ "col-span-1", "col-span-2 row-span-2", "col-span-1", "col-span-2" ],
	[ "col-span-3", "col-span-1", "col-span-2", "col-span-1" ]
]

type WireframeShuffleProps = {
	/** Block colors. */
	swatches: string[]
}

/** Mock UI whose blocks keep rearranging, like a layout in progress. */
export const WireframeShuffle = ({ swatches }: WireframeShuffleProps) => {
	const ref = useRef<HTMLDivElement>(null)
	const tick = useTicker(SHUFFLE_INTERVAL, ref)
	const layout = LAYOUTS[tick % LAYOUTS.length]

	const frameClassName = cn(
		"grid w-full grid-cols-3 auto-rows-[1.6rem] gap-1.5 p-2",
		"rounded-xl border border-line",
		"bg-bg/60"
	)

	return (
		<div ref={ref} className={frameClassName}>
			{layout.map((placement, index) => {
				const color = swatches[index % swatches.length]
				return (
					<motion.span
						key={color + index}
						layout
						transition={{ type: "spring", stiffness: 260, damping: 26 }}
						className={cn("rounded-md border", placement)}
						style={{ background: `${color}33`, borderColor: `${color}66` }}
					/>
				)
			})}
		</div>
	)
}
