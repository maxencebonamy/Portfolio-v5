import { PingDot } from "#/components/atoms/ping-dot"
import { profile } from "#/content/profile"
import { cn } from "#/lib/cn"

type PortraitProps = {
	name: string
	/** Job title, under the name. */
	title: string
}

/**
 * Cut-out portrait on near-black under film grain (also hides photo compression), with a name tag.
 * Hover: zoom, coral glow, light sweep. Image from `pnpm run media:images`.
 */
export const Portrait = ({ name, title }: PortraitProps) => {
	const frameClassName = cn(
		"group/portrait relative size-full",
		"rounded-[28px] border border-line",
		"shadow-[0_40px_120px_-40px_rgba(255,106,105,.55)]",
		"transition-shadow duration-700 ease-out-expo hover:shadow-[0_50px_140px_-30px_rgba(255,106,105,.8)]"
	)

	// Needs clip-path, not just overflow: browsers drop rounded overflow clipping on 3D-animated children.
	const clipClassName = cn(
		"absolute inset-0 overflow-hidden",
		"rounded-[inherit] [clip-path:inset(0_round_27px)]",
		"bg-[radial-gradient(120%_90%_at_50%_40%,#151515_0%,#0b0b0b_100%)]"
	)

	const glowClassName = cn(
		"absolute inset-0",
		"bg-[radial-gradient(90%_70%_at_50%_100%,rgba(255,106,105,.45),transparent_70%)]",
		"opacity-0 transition-opacity duration-700 ease-out-expo group-hover/portrait:opacity-100"
	)

	const photoClassName = cn(
		"absolute bottom-0 left-1/2 w-[138%] max-w-none -translate-x-1/2 origin-bottom",
		"select-none",
		"contrast-[0.96] saturate-[1.08]",
		"transition-[scale] duration-700 ease-out-expo group-hover/portrait:scale-[1.08]"
	)

	const sheenClassName = cn(
		"pointer-events-none absolute inset-y-0 -left-full z-20 w-full -skew-x-12",
		"bg-[linear-gradient(90deg,transparent,rgba(255,255,255,.45),transparent)]",
		"transition-transform duration-1000 ease-out-expo group-hover/portrait:translate-x-[250%]"
	)

	const captionClassName = cn(
		"absolute right-3 bottom-3 z-10",
		"flex items-center gap-3 px-4 py-2.5 sm:gap-4",
		"rounded-2xl border border-white/10",
		"bg-black/45 backdrop-blur-md",
		"text-white",
		"transition-transform duration-700 ease-out-expo group-hover/portrait:-translate-y-1.5"
	)

	const titleClassName = cn(
		"font-mono text-[9px] tracking-wider whitespace-nowrap text-white/60 uppercase",
		"sm:text-[10px] sm:tracking-widest"
	)

	return (
		<figure className={frameClassName}>
			<div className={clipClassName}>
				<div aria-hidden className={glowClassName} />
				<picture>
					<source srcSet={profile.photo.srcWebp} type="image/webp" />
					<img
						src={profile.photo.src}
						alt={name}
						width={profile.photo.width}
						height={profile.photo.height}
						fetchPriority="high"
						draggable={false}
						className={photoClassName}
					/>
				</picture>
				<div aria-hidden className="photo-grain absolute inset-0" />
				<div aria-hidden className={sheenClassName} />
				<figcaption className={captionClassName}>
					<span>
						<span className="block text-sm font-semibold">{name}</span>
						<span className={cn("block", titleClassName)}>{title}</span>
					</span>
					{profile.openToWork && <PingDot color="bg-emerald-500" className="size-2.5" />}
				</figcaption>
			</div>
		</figure>
	)
}
