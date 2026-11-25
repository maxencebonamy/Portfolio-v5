/** `localStorage` that never throws when unavailable (private browsing, blocked cookies...). */
export const storage = {
	/** `null` if missing or unavailable. */
	get: (key: string): string | null => {
		try {
			return localStorage.getItem(key)
		} catch {
			return null
		}
	},

	/** Silently ignores failures. */
	set: (key: string, value: string): void => {
		try {
			localStorage.setItem(key, value)
		} catch {
			// Unavailable: preference is just not saved.
		}
	}
}
