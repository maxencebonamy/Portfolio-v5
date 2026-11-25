import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Downward arrow on a tray. */
export const DownloadIcon = (props: IconProps) => {
	return (
		<Icon {...props}>
			<path d="M12 4v12m0 0-5-5m5 5 5-5M5 20h14" />
		</Icon>
	)
}
