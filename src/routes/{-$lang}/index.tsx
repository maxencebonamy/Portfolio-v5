import { createFileRoute } from "@tanstack/react-router"

import { HomePage } from "#/components/pages/home-page"

/** `/` and `/en`: home page. */
export const Route = createFileRoute("/{-$lang}/")({
	component: HomePage
})
