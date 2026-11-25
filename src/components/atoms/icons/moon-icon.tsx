import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Crescent moon (dark theme). */
export const MoonIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
		</Icon>
	)
}
