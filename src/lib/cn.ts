import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/** Knows the custom utilities of `styles.css`, so they aren't dropped as conflicts. */
const twMerge = extendTailwindMerge<"text-stroke" | "bg-pattern">({
	extend: {
		theme: {
			ease: [ "out-expo" ]
		},
		classGroups: {
			"text-stroke": [ "text-outline" ],
			"bg-pattern": [ "bg-grid" ]
		}
	}
})

/** Joins conditional class names and resolves Tailwind conflicts (last wins). */
export const cn = (...inputs: ClassValue[]): string => {
	return twMerge(clsx(inputs))
}
