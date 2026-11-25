import { createRouter } from "@tanstack/react-router"

import { NotFoundPage } from "#/components/pages/not-found-page"
import { routeTree } from "#/routeTree.gen"

/**
 * Called by TanStack Start for each prerendered page and in the browser.
 * `routeTree.gen.ts` is generated from `src/routes` by the Vite plugin.
 */
export const getRouter = () => {
	return createRouter({
		routeTree,
		defaultPreload: "intent",
		defaultNotFoundComponent: NotFoundPage
	})
}

declare module "@tanstack/react-router" {
	// Module augmentation needs an interface to merge.
	// eslint-disable-next-line @typescript-eslint/consistent-type-definitions
	interface Register {
		router: ReturnType<typeof getRouter>
	}
}
