import { Marquee } from "#/components/motion/marquee"
import { Reveal } from "#/components/motion/reveal"
import { skills } from "#/content/skills"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

type LearningBannerProps = {
	className?: string
}

/** Coral band of what I'm currently learning. */
export const LearningBanner = ({ className }: LearningBannerProps) => {
	const { pick } = useI18n()

	const bannerClassName = cn(
		"flex flex-col gap-4 overflow-hidden py-6 md:flex-row md:items-center",
		"rounded-3xl bg-coral",
		"text-[#1a1a1a]"
	)

	const labelClassName = cn(
		"shrink-0 px-6 md:pr-0",
		"font-mono text-xs font-medium tracking-widest uppercase"
	)

	return (
		<Reveal className={className}>
			<div className={bannerClassName}>
				<span className={labelClassName}>{pick(skills.learning.label)}</span>
				<Marquee
					items={[ ...skills.learning.items, ...skills.learning.items ]}
					duration={28}
					reverse
					className="min-w-0 flex-1 [&_svg]:text-[#1a1a1a]"
					itemClassName="text-[#1a1a1a]"
				/>
			</div>
		</Reveal>
	)
}
