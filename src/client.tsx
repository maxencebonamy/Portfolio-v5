import { StartClient } from "@tanstack/react-start/client"
import { startTransition, StrictMode } from "react"
import { hydrateRoot } from "react-dom/client"

// Validates data files while editing. Dev only.
if (import.meta.env.DEV) {
	void import("#/schemas/validate-data").then(({ validateData }) => validateData())
}

startTransition(() => {
	hydrateRoot(
		document,
		<StrictMode>
			<StartClient />
		</StrictMode>
	)
})
