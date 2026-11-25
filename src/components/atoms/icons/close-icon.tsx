import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Cross. */
export const CloseIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M18 6 6 18M6 6l12 12" />
		</Icon>
	)
}
