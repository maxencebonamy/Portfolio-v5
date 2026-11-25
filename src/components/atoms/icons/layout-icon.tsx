import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Page layout with a header and a sidebar. */
export const LayoutIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<rect x="3" y="3" width="18" height="18" rx="2" />
			<path d="M3 9h18M9 21V9" />
		</Icon>
	)
}
