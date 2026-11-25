import { motion, useInView, useReducedMotion } from "motion/react"
import type { CSSProperties } from "react"
import { useEffect, useRef, useState } from "react"

import { PlayIcon } from "#/components/atoms/icons/play-icon"
import { WindowBar } from "#/components/molecules/window-bar"
import { getVideoSources } from "#/content/projects"
import { useVideoAspectRatio } from "#/hooks/use-video-aspect-ratio"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"
import type { Project } from "#/schemas/projects"

/** In px: title bar and borders. */
const WINDOW_CHROME_HEIGHT = 34

/** In px: borders. */
const WINDOW_CHROME_WIDTH = 2

/** Starts a video, ignoring autoplay rejections (poster stays). */
const play = (video: HTMLVideoElement): void => {
	// React doesn't render `muted` as an attribute in prerendered HTML: an unmuted video is refused autoplay.
	video.muted = true
	video.play().catch(() => undefined)
}

type ProjectVideoProps = {
	project: Project
	/** `preview`: muted loop, plays only while visible. `full`: whole video with controls. */
	mode?: "preview" | "full"
	/**
	 * Fits inside the parent's box instead of filling its width. Parent must be a size container
	 * (`[container-type:size]`). Width is a `w-*` class, so `className` can override it per breakpoint.
	 */
	fit?: boolean
	className?: string
	style?: CSSProperties
}

/** Project video in a browser or app window, at the video's aspect ratio (never cropped). */
export const ProjectVideo = ({ project, mode = "preview", fit = false, className, style }: ProjectVideoProps) => {
	const { t, pick } = useI18n()
	const videoRef = useRef<HTMLVideoElement>(null)
	const wrapperRef = useRef<HTMLDivElement>(null)
	const inView = useInView(wrapperRef, { margin: "200px" })
	const reduceMotion = useReducedMotion()
	const [ playing, setPlaying ] = useState(false)
	const [ progress, setProgress ] = useState(0)
	const [ userPaused, setUserPaused ] = useState(false)
	const sources = getVideoSources(project.slug)
	const title = pick(project.title)
	const isFull = mode === "full"
	const src = isFull ? sources.full : sources.preview
	const { ratio, onLoadedMetadata } = useVideoAspectRatio(src)
	const fitWidth = `min(100cqw, calc((100cqh - ${WINDOW_CHROME_HEIGHT}px) * ${ratio} + ${WINDOW_CHROME_WIDTH}px))`

	useEffect(() => {
		const video = videoRef.current
		if (!video) return
		if (inView && !userPaused && !reduceMotion) play(video)
		else video.pause()
	}, [ inView, userPaused, reduceMotion, src ])

	const togglePlayback = (): void => {
		const video = videoRef.current
		if (!video) return
		setUserPaused(!video.paused)
		if (video.paused) play(video)
		else video.pause()
	}

	const windowClassName = cn(
		"flex flex-col overflow-hidden",
		fit ? "w-(--fit-width)" : "w-full",
		"rounded-xl border border-white/10",
		"bg-[#111] shadow-2xl",
		className
	)

	const playButtonClassName = cn(
		"grid size-16 place-items-center",
		"rounded-full bg-white/90 shadow-xl backdrop-blur",
		"text-[#1a1a1a]"
	)

	const progressTrackClassName = cn(
		"absolute inset-x-0 bottom-0 z-20 h-1",
		"bg-white/15"
	)

	return (
		<div ref={wrapperRef} className={windowClassName} style={{ ...style, "--fit-width": fitWidth } as CSSProperties}>
			<WindowBar frame={project.frame} title={title} url={project.url} />

			<div className="relative bg-black" style={{ aspectRatio: ratio }}>
				<video
					ref={videoRef}
					className="absolute inset-0 size-full object-cover"
					src={src}
					poster={sources.poster}
					muted
					loop
					playsInline
					preload={isFull ? "auto" : "metadata"}
					onLoadedMetadata={onLoadedMetadata}
					onPlay={() => setPlaying(true)}
					onPause={() => setPlaying(false)}
					onTimeUpdate={event => {
						const video = event.currentTarget
						if (video.duration) setProgress(video.currentTime / video.duration)
					}}
					aria-label={t("project.videoLabel", { title })}
				/>

				{isFull && (
					<>
						<button
							type="button"
							onClick={togglePlayback}
							className="absolute inset-0 z-10"
							aria-label={playing ? t("project.pause") : t("project.play")}
						/>
						<motion.div
							className="pointer-events-none absolute inset-0 z-10 grid place-items-center"
							initial={false}
							animate={{ opacity: playing ? 0 : 1 }}
						>
							<span className={playButtonClassName}>
								<PlayIcon className="ml-1 size-6" />
							</span>
						</motion.div>
						<div className={progressTrackClassName}>
							<div className="h-full origin-left" style={{ transform: `scaleX(${progress})`, background: project.accent }} />
						</div>
					</>
				)}
			</div>
		</div>
	)
}
