import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Four-pointed star, the site's motif. */
export const StarIcon = (props: IconProps) => {
	return (
		<Icon fill="currentColor" stroke="none" {...props}>
			<path d="M12 0c.6 6.4 5.6 11.4 12 12-6.4.6-11.4 5.6-12 12-.6-6.4-5.6-11.4-12-12C6.4 11.4 11.4 6.4 12 0Z" />
		</Icon>
	)
}
