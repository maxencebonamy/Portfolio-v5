import { MotionConfig } from "motion/react"
import type { ReactNode } from "react"

import { I18nProvider } from "#/providers/i18n-provider"
import { SmoothScrollProvider } from "#/providers/smooth-scroll-provider"

type AppProvidersProps = {
	children: ReactNode
}

/** Global contexts, in dependency order. Motion skips movement (keeps fades) with reduced motion. */
export const AppProviders = ({ children }: AppProvidersProps) => {
	return (
		<MotionConfig reducedMotion="user">
			<I18nProvider>
				<SmoothScrollProvider>
					{children}
				</SmoothScrollProvider>
			</I18nProvider>
		</MotionConfig>
	)
}
