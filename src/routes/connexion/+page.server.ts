import { fail, redirect } from '@sveltejs/kit';
import { base } from '$app/paths';
import type { Actions } from '@sveltejs/kit';

export const actions: Actions = {
  default: async (event) => {
    const { request, locals } = event;
    const formData = await request.formData();
    
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    // Tentative de connexion via Supabase
    const { error } = await locals.supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error) {
      // Si les identifiants sont faux, on renvoie l'erreur à la page Svelte
      return fail(400, { error: "Identifiants incorrects, Messire." });
    }

    // Si tout est bon, direction la Cour avec le préfixe dynamique !
    throw redirect(303, `${base}/cour`);
  }
};