/**
 * Pads with leading zeros, e.g. 3 -> "03".
 *
 * @param length - Minimum length.
 */
export const padNumber = (value: number, length = 2): string => {
	return String(value).padStart(length, "0")
}
