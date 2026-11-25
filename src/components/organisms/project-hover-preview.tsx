import type { MotionValue } from "motion/react"
import { AnimatePresence, motion, useSpring } from "motion/react"

import { getVideoSources } from "#/content/projects"
import { useVideoAspectRatio } from "#/hooks/use-video-aspect-ratio"
import { cn } from "#/lib/cn"
import { EASE } from "#/lib/motion"
import type { Project } from "#/schemas/projects"

const SPRING = { stiffness: 250, damping: 28 }

type ProjectHoverPreviewProps = {
	/** `null` hides the preview. */
	project: Project | null
	x: MotionValue<number>
	y: MotionValue<number>
}

/** Video preview following the cursor over the projects list. */
export const ProjectHoverPreview = ({ project, x, y }: ProjectHoverPreviewProps) => {
	const springX = useSpring(x, SPRING)
	const springY = useSpring(y, SPRING)
	const visible = project !== null
	const { ratio, onLoadedMetadata } = useVideoAspectRatio(project ? getVideoSources(project.slug).preview : "")

	const previewClassName = cn(
		"pointer-events-none fixed top-0 left-0 z-30",
		"w-[400px] overflow-hidden",
		"rounded-2xl border border-line",
		"bg-black shadow-2xl"
	)

	return (
		<motion.div
			aria-hidden
			className={previewClassName}
			style={{ x: springX, y: springY, translateX: "15%", translateY: "-110%", aspectRatio: ratio }}
			animate={{ scale: visible ? 1 : 0, opacity: visible ? 1 : 0 }}
			transition={{ type: "spring", stiffness: 300, damping: 25 }}
		>
			<AnimatePresence mode="popLayout" initial={false}>
				{project && (
					<motion.video
						key={project.slug}
						className="absolute inset-0 size-full object-cover"
						src={getVideoSources(project.slug).preview}
						poster={getVideoSources(project.slug).poster}
						onLoadedMetadata={onLoadedMetadata}
						autoPlay
						muted
						loop
						playsInline
						initial={{ y: "100%" }}
						animate={{ y: 0 }}
						exit={{ y: "-100%" }}
						transition={{ duration: 0.5, ease: EASE }}
					/>
				)}
			</AnimatePresence>
		</motion.div>
	)
}
