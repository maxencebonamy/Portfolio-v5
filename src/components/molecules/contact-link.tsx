import { ArrowIcon } from "#/components/atoms/icons/arrow-icon"
import { DownloadIcon } from "#/components/atoms/icons/download-icon"
import { cn } from "#/lib/cn"

type ContactLinkProps = {
	label: string
	/** Handle or file details. */
	details: string
	href: string
	/** Download icon instead of external arrow. */
	download: boolean
}

/** Contact grid link (socials, resume). */
export const ContactLink = ({ label, details, href, download }: ContactLinkProps) => {
	const iconClassName = cn(
		"size-5 text-muted",
		"transition-all duration-500 ease-out-expo group-hover:text-coral",
		download ? "group-hover:translate-y-0.5" : "group-hover:rotate-45"
	)

	return (
		<a
			href={href}
			target="_blank"
			rel="noreferrer"
			download={download ? "" : undefined}
			className="group flex items-center justify-between px-1 py-6 sm:px-6"
		>
			<span>
				<span className="block text-xl font-semibold transition-colors group-hover:text-coral">{label}</span>
				<span className="block font-mono text-xs text-muted">{details}</span>
			</span>
			{download ? <DownloadIcon className={iconClassName} /> : <ArrowIcon className={iconClassName} />}
		</a>
	)
}
