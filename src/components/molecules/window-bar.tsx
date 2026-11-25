import { LockIcon } from "#/components/atoms/icons/lock-icon"
import { cn } from "#/lib/cn"

const TRAFFIC_LIGHTS = [ "bg-[#ff5f57]", "bg-[#febc2e]", "bg-[#28c840]" ]

type WindowBarProps = {
	/** Browser shows the address bar, app shows the title. */
	frame: "browser" | "app"
	title: string
	/** Browser frame only; empty address bar when missing. */
	url?: string
}

/** Title bar mimicking macOS, above a project video. */
export const WindowBar = ({ frame, title, url }: WindowBarProps) => {
	const barClassName = cn(
		"flex h-8 shrink-0 items-center gap-3 px-3",
		"border-b border-white/10",
		"bg-[#1c1c1c]"
	)

	const addressClassName = cn(
		"mx-auto flex h-5 max-w-[60%] flex-1 items-center justify-center gap-1.5 truncate px-3",
		"rounded-md bg-white/5",
		"font-mono text-[10px] text-white/50"
	)

	return (
		<div className={barClassName} aria-hidden>
			<div className="flex gap-1.5">
				{TRAFFIC_LIGHTS.map(color => <span key={color} className={cn("size-2.5 rounded-full", color)} />)}
			</div>
			{frame === "browser"
				? (
					<div className={addressClassName}>
						{url && (
							<>
								<LockIcon className="size-2.5" />
								<span className="truncate">{url}</span>
							</>
						)}
					</div>
				)
				: <div className="mx-auto font-mono text-[10px] text-white/50">{title}</div>}
			<div className="w-[42px]" />
		</div>
	)
}
