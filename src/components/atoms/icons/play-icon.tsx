import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Play triangle. */
export const PlayIcon = (props: IconProps) => {
	return (
		<Icon fill="currentColor" stroke="none" {...props}>
			<path d="M7 4.5v15l13-7.5z" />
		</Icon>
	)
}
