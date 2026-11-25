import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Outlined four-pointed star. */
export const SparkIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M12 3c.5 4.5 4.5 8.5 9 9-4.5.5-8.5 4.5-9 9-.5-4.5-4.5-8.5-9-9 4.5-.5 8.5-4.5 9-9Z" />
		</Icon>
	)
}
