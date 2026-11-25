import type { SyntheticEvent } from "react"
import { useState } from "react"

/** Until metadata loads. Every encoded video is 16:9. */
export const DEFAULT_VIDEO_ASPECT_RATIO = 16 / 9

/** By video URL, so a video shown again doesn't jump. */
const knownRatios = new Map<string, number>()

type VideoAspectRatio = {
	/** Width / height. */
	ratio: number
	/** For the `<video>` `onLoadedMetadata` prop. */
	onLoadedMetadata: (event: SyntheticEvent<HTMLVideoElement>) => void
}

/** Real aspect ratio of a video, so its frame fits exactly (no crop, no black bars). */
export const useVideoAspectRatio = (src: string): VideoAspectRatio => {
	const [ ratios, setRatios ] = useState<Record<string, number>>({})
	const ratio = ratios[src] ?? knownRatios.get(src) ?? DEFAULT_VIDEO_ASPECT_RATIO

	const onLoadedMetadata = (event: SyntheticEvent<HTMLVideoElement>): void => {
		const video = event.currentTarget
		if (!video.videoWidth || !video.videoHeight) return
		// Element's own source, not `src`: a video leaving may still load another file.
		const key = video.getAttribute("src") ?? src
		const loadedRatio = video.videoWidth / video.videoHeight
		knownRatios.set(key, loadedRatio)
		setRatios(current => ({ ...current, [key]: loadedRatio }))
	}

	return { ratio, onLoadedMetadata }
}
