import { Chip } from "#/components/atoms/chip"

type ChipListProps = {
	items: string[]
	/** Before the first chip, in s. */
	delay?: number
}

/** Chips appearing one after another. */
export const ChipList = ({ items, delay = 0 }: ChipListProps) => {
	return (
		<ul className="flex flex-wrap gap-2">
			{items.map((item, index) => <Chip key={item} delay={delay + index * 0.04}>{item}</Chip>)}
		</ul>
	)
}
