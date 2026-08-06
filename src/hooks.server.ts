import { createServerClient } from '@supabase/ssr'
import { type Handle } from '@sveltejs/kit'
import { PUBLIC_SUPABASE_URL, PUBLIC_SUPABASE_ANON_KEY } from '$env/static/public'

export const handle: Handle = async ({ event, resolve }) => {
  event.locals.supabase = createServerClient(
    PUBLIC_SUPABASE_URL,
    PUBLIC_SUPABASE_ANON_KEY,
    {
      cookies: {
        getAll: () => event.cookies.getAll(),
        setAll: (cookiesToSet) => {
          // On ajoute un try/catch pour empêcher le crash du serveur
          try {
            cookiesToSet.forEach(({ name, value, options }) => {
              event.cookies.set(name, value, { ...options, path: '/' })
            })
          } catch (error) {
            // On ignore l'erreur de cookie pour laisser la page s'afficher
            console.warn("Petit souci de cookie sans gravité");
          }
        },
      },
    }
  )

  event.locals.safeGetSession = async () => {
    const { data: { session } } = await event.locals.supabase.auth.getSession()
    return { session, user: session?.user ?? null }
  }

  return resolve(event, {
        filterSerializedResponseHeaders(name) {
            // Autorise par défaut tous les headers standards de Supabase et de SvelteKit
            return name.startsWith('content-') || name.startsWith('x-supabase-');
        }
    })
}