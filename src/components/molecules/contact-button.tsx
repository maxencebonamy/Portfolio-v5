import { PingDot } from "#/components/atoms/ping-dot"
import { Magnetic } from "#/components/motion/magnetic"
import { profile } from "#/content/profile"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

/** Nav bar "Get in touch" button. */
export const ContactButton = () => {
	const { t } = useI18n()

	const linkClassName = cn(
		"flex h-10 items-center gap-2 px-5",
		"rounded-full bg-fg",
		"text-sm font-semibold whitespace-nowrap text-bg",
		"transition-colors hover:bg-coral hover:text-[#1a1a1a]"
	)

	return (
		<Magnetic>
			<a href={`mailto:${profile.email}`} className={linkClassName}>
				<PingDot color="bg-coral" />
				{t("nav.contactCta")}
			</a>
		</Magnetic>
	)
}
