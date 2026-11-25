import { createFileRoute, notFound } from "@tanstack/react-router"

import { ProjectPage } from "#/components/pages/project-page"
import { findProject } from "#/content/projects"

/** `/projects/$slug` and `/en/projects/$slug`: case study, 404 on unknown slug. */
export const Route = createFileRoute("/{-$lang}/projects/$slug")({
	beforeLoad: ({ params }) => {
		if (!findProject(params.slug)) throw notFound()
	},
	component: ProjectPage
})
