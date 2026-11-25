import tailwindcss from "@tailwindcss/vite"
import { tanstackStart } from "@tanstack/react-start/plugin/vite"
import react from "@vitejs/plugin-react"
import { fileURLToPath, URL } from "url"
import { defineConfig } from "vite"

/** Links to public files (CV, images...), not pages: skipped by the prerender crawler. */
const FILE_PATH = /\.\w+$/

/**
 * `#/` points to `src/`, like `paths` in `tsconfig.app.json`.
 *
 * Prerender: the crawler starts from param-less routes and follows links, so project pages are found from the archive.
 * The SPA shell becomes `404.html`, served by Vercel for unknown URLs.
 * Libraries get their own chunks to stay cached across deploys.
 */
export default defineConfig({
	plugins: [
		tanstackStart({
			prerender: {
				enabled: true,
				crawlLinks: true,
				filter: page => !page.path.includes("#") && !FILE_PATH.test(page.path)
			},
			spa: {
				enabled: true,
				// At `/404`: rendering it at `/` would replace the home page.
				maskPath: "/404",
				prerender: { outputPath: "/404" }
			},
			sitemap: { enabled: false }
		}),
		react(),
		tailwindcss()
	],
	environments: {
		client: {
			build: {
				rolldownOptions: {
					output: {
						codeSplitting: {
							groups: [
								{ name: "react", test: /node_modules[\\/](react|react-dom|scheduler)[\\/]/ },
								{ name: "motion", test: /node_modules[\\/](motion|framer-motion|motion-dom|motion-utils)[\\/]/ },
								{ name: "router", test: /node_modules[\\/]@tanstack[\\/]/ },
								{ name: "vendor", test: /node_modules/ }
							]
						}
					}
				}
			}
		}
	},
	resolve: {
		alias: {
			"#": fileURLToPath(new URL("./src", import.meta.url))
		}
	}
})
