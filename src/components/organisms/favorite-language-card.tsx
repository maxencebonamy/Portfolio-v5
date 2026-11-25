import { MonoLabel } from "#/components/atoms/mono-label"
import { ChipList } from "#/components/molecules/chip-list"
import { SpotlightCard } from "#/components/molecules/spotlight-card"
import { Reveal } from "#/components/motion/reveal"
import { skills } from "#/content/skills"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

type FavoriteLanguageCardProps = {
	className?: string
}

/** Large bento card for the favorite language. */
export const FavoriteLanguageCard = ({ className }: FavoriteLanguageCardProps) => {
	const { pick } = useI18n()
	const { favorite } = skills

	const glowClassName = cn(
		"absolute -top-40 -right-40 size-[30rem]",
		"rounded-full opacity-50"
	)

	const badgeClassName = cn(
		"grid size-11 place-items-center",
		"rounded-lg",
		"font-bold text-white"
	)

	const titleClassName = cn(
		"text-outline pr-[0.1em]",
		"text-[clamp(3rem,7.5vw,7rem)] leading-none font-black tracking-tight italic"
	)

	const descriptionClassName = cn(
		"mt-6 max-w-xl",
		"text-sm leading-relaxed text-muted md:text-base"
	)

	return (
		<Reveal className={className}>
			<SpotlightCard className="relative flex flex-col overflow-hidden p-6 md:p-8">
				<div aria-hidden className={glowClassName} style={{ background: `radial-gradient(${favorite.color}, transparent 68%)` }} />
				<div className="relative flex items-center justify-between">
					<MonoLabel>{pick(favorite.label)}</MonoLabel>
					<span aria-hidden className={badgeClassName} style={{ background: favorite.color }}>{favorite.badge}</span>
				</div>
				<div className="relative mt-10 flex flex-1 flex-col justify-end gap-8">
					<div>
						<h3 className={titleClassName}>{favorite.name}</h3>
						<p className={descriptionClassName}>{pick(favorite.description)}</p>
					</div>
					<ChipList items={favorite.items} delay={0.2} />
				</div>
			</SpotlightCard>
		</Reveal>
	)
}
