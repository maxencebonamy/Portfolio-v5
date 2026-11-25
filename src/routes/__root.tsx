import { createRootRoute, HeadContent, Scripts, useRouter, useRouterState } from "@tanstack/react-router"
import type { ReactNode } from "react"

import { NotFoundPage } from "#/components/pages/not-found-page"
import { AppShell } from "#/components/templates/app-shell"
import { site } from "#/content/site"
import { BOOT_SCRIPT } from "#/lib/boot-script"
import { DEFAULT_LOCALE, localeFromPath } from "#/lib/i18n"
import { AppProviders } from "#/providers/app-providers"
import { notFoundMeta } from "#/seo/page-meta"
import stylesUrl from "#/styles.css?url"

/** Poppins and JetBrains Mono. */
const FONTS_URL = "https://fonts.googleapis.com/css2?"
	+ "family=JetBrains+Mono:wght@400;500"
	+ "&family=Poppins:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,700;1,800;1,900"
	+ "&display=swap"

type RootDocumentProps = {
	children: ReactNode
}

/**
 * HTML document, in the language of the URL. The boot script sets `data-theme` (and `lang` on the shell)
 * before hydration, hence `suppressHydrationWarning`.
 *
 * SPA shell (`404.html`): 404 title, noindex, `data-shell` (read by the boot script and `useShellRender`).
 * Its own head tags are marked `data-shell-only`, removed once hydrated (the pages render theirs).
 * Only tags React hoists go in its head, since the client does not know it hydrates the shell and any
 * other element would mismatch.
 */
const RootDocument = ({ children }: RootDocumentProps) => {
	const pathname = useRouterState({ select: state => state.location.pathname })
	// The dev server flags every page as the shell: only the prerendered one, at `/404`, is.
	const isShell = useRouter().isShell() && pathname === "/404"

	return (
		<html lang={localeFromPath(pathname)} data-theme="dark" data-shell={isShell ? "" : undefined} suppressHydrationWarning>
			<head>
				<HeadContent />
				<script dangerouslySetInnerHTML={{ __html: BOOT_SCRIPT }} />
				{isShell && (
					<>
						<title data-shell-only="">{notFoundMeta(DEFAULT_LOCALE).title}</title>
						<meta name="robots" content="noindex, follow" data-shell-only="" />
					</>
				)}
			</head>
			<body>
				{children}
				<Scripts />
			</body>
		</html>
	)
}

/** Global providers around the shared shell. */
const RootLayout = () => {
	return (
		<AppProviders>
			<AppShell />
		</AppProviders>
	)
}

/** Root route. Page-specific tags come from each page's `PageHead`. */
export const Route = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{ name: "viewport", content: "width=device-width, initial-scale=1.0" },
			{ name: "theme-color", content: site.themeColor.dark }
		],
		links: [
			{ rel: "stylesheet", href: stylesUrl },
			{ rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
			{ rel: "apple-touch-icon", href: "/apple-touch-icon.png" },
			{ rel: "manifest", href: "/site.webmanifest" },
			{ rel: "preconnect", href: "https://fonts.googleapis.com" },
			{ rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
			{ rel: "stylesheet", href: FONTS_URL }
		]
	}),
	shellComponent: RootDocument,
	component: RootLayout,
	notFoundComponent: NotFoundPage
})
