import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Diagonal arrow pointing to the top right. */
export const ArrowIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M7 17 17 7M8 7h9v9" />
		</Icon>
	)
}
