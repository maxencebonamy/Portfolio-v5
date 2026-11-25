import { createFileRoute } from "@tanstack/react-router"

import { NotFoundPage } from "#/components/pages/not-found-page"

/**
 * `/404`: real route so the SPA shell prerenders as `404.html` (see `vite.config.ts`).
 * Vercel serves it for unknown URLs, then the router shows the 404 page.
 */
export const Route = createFileRoute("/404")({
	component: NotFoundPage
})
