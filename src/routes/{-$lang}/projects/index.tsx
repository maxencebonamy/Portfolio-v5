import { createFileRoute } from "@tanstack/react-router"

import { ProjectsPage } from "#/components/pages/projects-page"

/** `/projects` and `/en/projects`: projects archive. */
export const Route = createFileRoute("/{-$lang}/projects/")({
	component: ProjectsPage
})
