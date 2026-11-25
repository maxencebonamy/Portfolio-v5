import { useSyncExternalStore } from "react"

import type { Theme } from "#/lib/theme"
import { getTheme, subscribeTheme } from "#/lib/theme"

/** Tracks the color theme. */
export const useTheme = (): Theme => {
	return useSyncExternalStore(subscribeTheme, getTheme, () => "dark")
}
