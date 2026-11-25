import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Arrow dropping into a box (deployment). */
export const ShipIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M12 3v12m0 0-4-4m4 4 4-4M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-2" />
		</Icon>
	)
}
