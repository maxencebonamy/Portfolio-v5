import { LOGO_PATHS, LOGO_VIEWBOX } from "#/config/logo"
import { fullName } from "#/content/profile"

type LogoProps = {
	className?: string
}

/** M/B logo filled with the current text color. */
export const Logo = ({ className }: LogoProps) => {
	return (
		<svg viewBox={LOGO_VIEWBOX} className={className} fill="currentColor" role="img" aria-label={fullName}>
			{LOGO_PATHS.map(path => <path key={path} d={path} fillRule="evenodd" clipRule="evenodd" />)}
		</svg>
	)
}
