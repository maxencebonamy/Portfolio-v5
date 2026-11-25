import { useMediaQuery } from "#/hooks/use-media-query"

/** `true` with a precise pointer (mouse). Gates hover-only effects. */
export const useFinePointer = (): boolean => {
	return useMediaQuery("(pointer: fine)")
}
