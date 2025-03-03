import type { AvailableLanguageTag } from "../../lib/paraglide/runtime"
import type { ParaglideLocals } from "@inlang/paraglide-sveltekit"
// See https://svelte.dev/docs/kit/types#app.d.ts
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
    paraglide: ParaglideLocals<AvailableLanguageTag>,

			user: import('$lib/db/auth').SessionValidationResult['user'];
			session: import('$lib/db/auth').SessionValidationResult['session'];
		}
	}
}

export {};
