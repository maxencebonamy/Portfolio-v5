import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Check mark. */
export const CheckIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="m5 12.5 4.5 4.5L19 7.5" />
		</Icon>
	)
}
