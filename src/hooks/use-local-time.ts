import { useCallback, useMemo, useSyncExternalStore } from "react"

/** In ms. */
const REFRESH_INTERVAL = 10_000

const PLACEHOLDER = "--:--"

/**
 * Current time (HH:MM) in a time zone. Prerendered HTML gets a placeholder,
 * as the build time would be wrong for the visitor.
 *
 * @param timeZone - IANA name, e.g. `Europe/Paris`.
 */
export const useLocalTime = (timeZone: string): string => {
	const formatter = useMemo(() => new Intl.DateTimeFormat("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone }), [ timeZone ])

	const subscribe = useCallback((onChange: () => void) => {
		const id = setInterval(onChange, REFRESH_INTERVAL)
		return () => clearInterval(id)
	}, [])

	return useSyncExternalStore(
		subscribe,
		() => formatter.format(new Date()),
		() => PLACEHOLDER
	)
}
