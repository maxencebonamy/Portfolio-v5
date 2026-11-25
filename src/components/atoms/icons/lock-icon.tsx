import type { IconProps } from "#/components/atoms/icons/icon"
import { Icon } from "#/components/atoms/icons/icon"

/** Padlock (secure address bar). */
export const LockIcon = (props: IconProps) => {
	return (
		<Icon strokeWidth={2.5} {...props}>
			<rect x="5" y="11" width="14" height="10" rx="2" />
			<path d="M8 11V7a4 4 0 0 1 8 0v4" />
		</Icon>
	)
}
