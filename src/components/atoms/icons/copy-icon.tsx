import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Two overlapping sheets. */
export const CopyIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<rect x="9" y="9" width="11" height="11" rx="2" />
			<path d="M5 15V6a2 2 0 0 1 2-2h9" />
		</Icon>
	)
}
