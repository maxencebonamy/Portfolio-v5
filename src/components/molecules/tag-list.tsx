import { Tag } from "#/components/atoms/tag"
import { cn } from "#/lib/cn"

type TagListProps = {
	items: string[]
	size?: "sm" | "md"
	className?: string
}

/** List of technology tags. */
export const TagList = ({ items, size, className }: TagListProps) => {
	return (
		<ul className={cn("flex flex-wrap gap-2", className)}>
			{items.map(item => <Tag key={item} size={size}>{item}</Tag>)}
		</ul>
	)
}
