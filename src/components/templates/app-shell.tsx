import { Outlet } from "@tanstack/react-router"
import { useState } from "react"

import { Cursor } from "#/components/organisms/cursor"
import { Footer } from "#/components/organisms/footer"
import { LanguageBanner } from "#/components/organisms/language-banner"
import { Nav } from "#/components/organisms/nav"
import { ScrollManager } from "#/components/organisms/scroll-manager"
import { useShellRender } from "#/hooks/use-shell-render"
import { cn } from "#/lib/cn"
import { useI18n } from "#/providers/i18n-provider"

/** Shared layout: skip link, nav, content, curtain footer, language suggestion. */
export const AppShell = () => {
	const { t } = useI18n()
	const [ menuOpen, setMenuOpen ] = useState(false)
	const shellRender = useShellRender()

	const skipLinkClassName = cn(
		"sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100",
		"focus:px-5 focus:py-3",
		"focus:rounded-full focus:bg-fg",
		"focus:text-sm focus:font-semibold focus:text-bg"
	)

	const mainClassName = cn(
		"relative z-10",
		"bg-bg outline-none",
		"transition-colors duration-500"
	)

	return (
		<>
			<a href="#main" className={skipLinkClassName}>{t("nav.skipToContent")}</a>
			<ScrollManager />
			<Cursor />
			<Nav menuOpen={menuOpen} onMenuOpenChange={setMenuOpen} />
			{/* Out of reach of keyboard and screen readers while the mobile menu covers the page. */}
			<div inert={menuOpen} className="contents">
				<main id="main" tabIndex={-1} className={mainClassName}>
					{/* The prerendered SPA shell has no page content: the page waits for hydration. */}
					{!shellRender && <Outlet />}
				</main>
				<Footer />
				<LanguageBanner />
			</div>
			<div aria-hidden className="grain" />
		</>
	)
}
