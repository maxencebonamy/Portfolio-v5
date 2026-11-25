import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Angle brackets around a slash. */
export const CodeIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="m8 7-5 5 5 5M16 7l5 5-5 5M14 4l-4 16" />
		</Icon>
	)
}
